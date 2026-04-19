import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

async function getAuthedUserEmail() {
  const session = await auth();
  return session?.user?.email?.trim().toLowerCase() || null;
}

export async function GET() {
  try {
    const email = await getAuthedUserEmail();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email }).select(
      "dailyNotificationOptIn dailyNotificationOptInUpdatedAt lastDailyReminderSentAt"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      dailyNotificationOptIn: Boolean(user.dailyNotificationOptIn),
      dailyNotificationOptInUpdatedAt: user.dailyNotificationOptInUpdatedAt ?? null,
      lastDailyReminderSentAt: user.lastDailyReminderSentAt ?? null,
    });
  } catch (error) {
    console.error("Get notification preferences error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const email = await getAuthedUserEmail();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (typeof body?.dailyNotificationOptIn !== "boolean") {
      return NextResponse.json(
        { error: "dailyNotificationOptIn must be a boolean" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          dailyNotificationOptIn: body.dailyNotificationOptIn,
          dailyNotificationOptInUpdatedAt: new Date(),
        },
      },
      { new: true }
    ).select("dailyNotificationOptIn dailyNotificationOptInUpdatedAt");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: body.dailyNotificationOptIn
        ? "Daily reminders enabled"
        : "Daily reminders disabled",
      dailyNotificationOptIn: Boolean(user.dailyNotificationOptIn),
      dailyNotificationOptInUpdatedAt: user.dailyNotificationOptInUpdatedAt ?? null,
    });
  } catch (error) {
    console.error("Update notification preferences error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
