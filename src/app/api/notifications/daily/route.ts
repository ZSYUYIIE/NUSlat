import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { sendDailyReminderEmail } from "@/lib/email-verification";
import User from "@/models/User";

export const dynamic = "force-dynamic";

type DispatchSummary = {
  eligibleUsers: number;
  sent: number;
  failed: number;
};

function isAuthorized(request: NextRequest) {
  const expected =
    process.env.DAILY_NOTIFICATION_CRON_TOKEN || process.env.CRON_SECRET;

  if (!expected) {
    return process.env.NODE_ENV !== "production";
  }

  const bearer = request.headers.get("authorization");
  if (bearer?.startsWith("Bearer ")) {
    return bearer.slice("Bearer ".length).trim() === expected;
  }

  const tokenHeader = request.headers.get("x-daily-notification-token");
  return tokenHeader === expected;
}

function getTodayUtcStart(now = new Date()) {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

async function dispatchDailyReminders(): Promise<DispatchSummary> {
  await connectDB();

  const now = new Date();
  const utcDayStart = getTodayUtcStart(now);

  const users = await User.find({
    dailyNotificationOptIn: true,
    isEmailVerified: true,
    email: { $exists: true, $ne: "" },
    $or: [
      { lastDailyReminderSentAt: { $exists: false } },
      { lastDailyReminderSentAt: { $lt: utcDayStart } },
    ],
  }).select("_id name email");

  if (users.length === 0) {
    return { eligibleUsers: 0, sent: 0, failed: 0 };
  }

  const sentUserIds: Array<string> = [];
  let failed = 0;

  for (const user of users) {
    const result = await sendDailyReminderEmail({
      to: user.email,
      name: user.name,
    });

    if (result.sent) {
      sentUserIds.push(user._id.toString());
    } else {
      failed += 1;
    }
  }

  if (sentUserIds.length > 0) {
    await User.updateMany(
      { _id: { $in: sentUserIds } },
      { $set: { lastDailyReminderSentAt: now } }
    );
  }

  return {
    eligibleUsers: users.length,
    sent: sentUserIds.length,
    failed,
  };
}

async function handleDispatch(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const summary = await dispatchDailyReminders();
    return NextResponse.json({
      message: "Daily reminder dispatch complete",
      summary,
    });
  } catch (error) {
    console.error("Daily reminder dispatch error:", error);
    return NextResponse.json(
      { error: "Failed to dispatch daily reminders" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return handleDispatch(request);
}

export async function POST(request: NextRequest) {
  return handleDispatch(request);
}
