import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Dashboard from "@/components/Dashboard";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  await connectDB();
  const user = await User.findOne({ email: session.user.email });

  const completedMilestones = user?.completedMilestones ?? [];

  return (
    <Dashboard
      userName={session.user.name ?? "Learner"}
      initialCompletedMilestones={completedMilestones}
    />
  );
}
