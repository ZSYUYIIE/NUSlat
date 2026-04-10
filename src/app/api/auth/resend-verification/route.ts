import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import {
  createEmailVerificationToken,
  sendVerificationEmail,
} from "@/lib/email-verification";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+emailVerificationToken +emailVerificationExpires"
    );

    // Keep response generic to avoid email enumeration.
    if (!user) {
      return NextResponse.json({
        message: "If this email exists, a new verification link has been sent.",
      });
    }

    if (user.isEmailVerified) {
      return NextResponse.json({ message: "Email is already verified." });
    }

    const { plainToken, tokenHash, expiresAt } = createEmailVerificationToken();
    user.emailVerificationToken = tokenHash;
    user.emailVerificationExpires = expiresAt;
    await user.save();

    await sendVerificationEmail({
      to: normalizedEmail,
      name: user.name,
      plainToken,
    });

    return NextResponse.json({
      message: "If this email exists, a new verification link has been sent.",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
