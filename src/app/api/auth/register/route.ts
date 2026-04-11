import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import {
  createEmailVerificationToken,
  isEmailVerificationConfigured,
  sendVerificationEmail,
} from "@/lib/email-verification";
import { normalizeProgressIds } from "@/lib/modules";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = checkRateLimit({ key: `register:${ip}`, limit: 5, windowMs: 60 * 60 * 1000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many registration attempts. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const { name, email, password, guestMilestones } = await request.json();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedName = String(name || "").trim();

    if (!normalizedName || !normalizedEmail || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Accept guest progress from either module-era or chapter-era IDs.
    let completedMilestones: string[] = [];
    if (guestMilestones && Array.isArray(guestMilestones)) {
      const asStrings = guestMilestones.filter(
        (value: unknown): value is string => typeof value === "string"
      );
      completedMilestones = normalizeProgressIds(asStrings);
    }

    const verificationRequired = isEmailVerificationConfigured();

    let tokenHash: string | undefined;
    let expiresAt: Date | undefined;
    let plainToken: string | undefined;

    if (verificationRequired) {
      const tokenData = createEmailVerificationToken();
      plainToken = tokenData.plainToken;
      tokenHash = tokenData.tokenHash;
      expiresAt = tokenData.expiresAt;
    }

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      completedChapters: completedMilestones,
      isEmailVerified: !verificationRequired,
      emailVerifiedAt: verificationRequired ? undefined : new Date(),
      emailVerificationToken: tokenHash,
      emailVerificationExpires: expiresAt,
    });

    const emailResult = verificationRequired
      ? await sendVerificationEmail({
          to: normalizedEmail,
          name: normalizedName,
          plainToken: plainToken!,
        })
      : { sent: false };

    return NextResponse.json(
      {
        message: verificationRequired
          ? "Account created. Please verify your email before signing in."
          : "Account created successfully.",
        emailVerificationRequired: verificationRequired,
        verificationEmailSent: emailResult.sent,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    const message =
      error instanceof Error ? error.message.toLowerCase() : "unknown";
    const isDbUnavailable =
      message.includes("econnrefused") ||
      message.includes("querysrv") ||
      message.includes("timed out") ||
      message.includes("mongodb");

    if (isDbUnavailable) {
      return NextResponse.json(
        {
          error:
            "Service temporarily unavailable. Database connection failed. Please try again shortly.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
