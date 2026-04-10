import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { getChapterSequence, normalizeProgressIds } from "@/lib/modules";
import User from "@/models/User";

const VALID_MILESTONES = getChapterSequence();

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const completedChapters = normalizeProgressIds(
      user.completedChapters ?? user.completedMilestones ?? []
    );

    return NextResponse.json({
      completedChapters,
      completedMilestones: completedChapters,
    });
  } catch (error) {
    console.error("Get milestones error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { milestone, chapter } = await request.json();
    const progressId = chapter ?? milestone;

    if (!progressId || !VALID_MILESTONES.includes(progressId)) {
      return NextResponse.json(
        { error: "Invalid chapter ID." },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check prerequisite milestone is already completed
    const existing = normalizeProgressIds(
      user.completedChapters ?? user.completedMilestones ?? []
    );

    const milestoneIndex = VALID_MILESTONES.indexOf(progressId);
    if (milestoneIndex > 0) {
      const prerequisite = VALID_MILESTONES[milestoneIndex - 1];
      if (!existing.includes(prerequisite)) {
        return NextResponse.json(
          {
            error: `You must complete the previous chapter first`,
          },
          { status: 403 }
        );
      }
    }

    if (!existing.includes(progressId)) {
      existing.push(progressId);
    }

    const normalized = normalizeProgressIds(existing);
    user.completedChapters = normalized;
    user.completedMilestones = normalized;
    await user.save();

    return NextResponse.json({
      message: "Chapter completed!",
      completedChapters: normalized,
      completedMilestones: normalized,
    });
  } catch (error) {
    console.error("Update milestone error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
