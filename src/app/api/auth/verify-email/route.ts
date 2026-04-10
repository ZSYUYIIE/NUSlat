import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import {
  hashEmailVerificationToken,
} from "@/lib/email-verification";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");
    const token = request.nextUrl.searchParams.get("token");

    if (!email || !token) {
      return NextResponse.json(
        { error: "Email and token are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const tokenHash = hashEmailVerificationToken(token);

    await connectDB();

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+emailVerificationToken +emailVerificationExpires"
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid verification link" },
        { status: 400 }
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json({ verified: true, message: "Email already verified" });
    }

    if (
      !user.emailVerificationToken ||
      !user.emailVerificationExpires ||
      user.emailVerificationToken !== tokenHash ||
      user.emailVerificationExpires.getTime() < Date.now()
    ) {
      return NextResponse.json(
        { error: "Verification link is invalid or expired" },
        { status: 400 }
      );
    }

    user.isEmailVerified = true;
    user.emailVerifiedAt = new Date();
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return NextResponse.json({ verified: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
