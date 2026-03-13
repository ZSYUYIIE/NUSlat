import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const VALID_MILESTONES = ["1k", "2k", "3k"];

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

    return NextResponse.json({
      completedMilestones: user.completedMilestones,
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

    const { milestone } = await request.json();

    if (!milestone || !VALID_MILESTONES.includes(milestone)) {
      return NextResponse.json(
        { error: "Invalid milestone. Must be one of: 1k, 2k, 3k" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check prerequisite milestone is already completed
    const milestoneIndex = VALID_MILESTONES.indexOf(milestone);
    if (milestoneIndex > 0) {
      const prerequisite = VALID_MILESTONES[milestoneIndex - 1];
      if (!user.completedMilestones.includes(prerequisite)) {
        return NextResponse.json(
          {
            error: `You must complete the ${prerequisite} milestone first`,
          },
          { status: 403 }
        );
      }
    }

    // Add milestone if not already completed
    if (!user.completedMilestones.includes(milestone)) {
      user.completedMilestones.push(milestone);
      await user.save();
    }

    return NextResponse.json({
      message: "Milestone completed!",
      completedMilestones: user.completedMilestones,
    });
  } catch (error) {
    console.error("Update milestone error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
