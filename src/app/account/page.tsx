"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import {
  MODULES,
  getChapterSequence,
  getCompletedChapterCountByModule,
} from "@/lib/modules";
import { useMilestones } from "@/hooks/useMilestones";
import BackToPreviousButton from "@/components/BackToPreviousButton";

interface QuestMetric {
  id: string;
  icon: string;
  title: string;
  current: number;
  target: number;
}

function QuestChest({ claimed }: { claimed: boolean }) {
  return (
    <div
      className={`relative h-8 w-10 rounded-md border-2 border-b-4 ${
        claimed
          ? "border-[#dcb06a] bg-[#ffdd98]"
          : "border-[#a8bfcc] bg-[#d4e7f0]"
      }`}
      aria-hidden="true"
    >
      <div className="absolute inset-x-0 top-0 h-2 border-b border-black/10 bg-black/10" />
      <div className="absolute left-1/2 top-[0.55rem] h-3 w-1 -translate-x-1/2 rounded-sm bg-black/20" />
    </div>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { completedMilestones, loading, error, clearError, resetProgress } =
    useMilestones();

  const allChapterIds = getChapterSequence();
  const completedCount = completedMilestones.length;
  const progressPct = Math.round(
    (completedCount / Math.max(allChapterIds.length, 1)) * 100
  );
  const totalXP = MODULES.reduce((sum, module) => {
    const completedInModule = getCompletedChapterCountByModule(
      module.id,
      completedMilestones
    );
    const chapterXP = Math.floor(module.xp / module.chapters.length);
    return sum + completedInModule * chapterXP;
  }, 0);
  const monthLabel = new Date().toLocaleString("en-US", { month: "long" }).toUpperCase();
  const monthlyTarget = 30;
  const monthlyProgress = Math.min(
    monthlyTarget,
    completedCount * 2 + Math.floor(totalXP / 40)
  );

  const dailyQuests: QuestMetric[] = [
    {
      id: "xp",
      icon: "XP",
      title: "Earn 50 XP",
      current: Math.min(totalXP, 50),
      target: 50,
    },
    {
      id: "lessons",
      icon: "80",
      title: "Score 80% or higher in 2 lessons",
      current: Math.min(completedCount, 2),
      target: 2,
    },
    {
      id: "time",
      icon: "10",
      title: "Spend 10 minutes learning",
      current: Math.min(completedCount * 4, 10),
      target: 10,
    },
  ];

  return (
    <div className="duo-shell duo-page-offset min-h-screen">
      <AppHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <BackToPreviousButton fallbackHref="/" className="mb-4" />

        <h1 className="text-2xl font-extrabold tracking-tight text-[#2c5015] sm:text-4xl">
          Account
        </h1>
        <p className="mt-2 text-sm text-[#4d6b3a]">
          Manage your identity and session for daily learning.
        </p>

        <section className="duo-card mt-6 overflow-hidden p-0">
          <div className="bg-[#1daff6] px-6 pb-7 pt-6 text-white">
            <p className="inline-flex rounded-lg bg-white px-2.5 py-1 text-xs font-black tracking-wide text-[#1daff6]">
              {monthLabel}
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight">{monthLabel} Quest</h2>
            <p className="mt-1 text-sm font-extrabold text-[#caefff]">10 DAYS LEFT</p>

            <div className="mt-7 rounded-2xl bg-[#0a2a3c] p-4 shadow-[0_8px_0_rgba(0,0,0,0.2)]">
              <p className="text-lg font-extrabold text-white">Complete {monthlyTarget} quests</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-5 flex-1 overflow-hidden rounded-full bg-[#385061]">
                  <div
                    className="h-full rounded-full bg-[#58cc02] transition-all duration-700"
                    style={{ width: `${(monthlyProgress / monthlyTarget) * 100}%` }}
                  />
                </div>
                <QuestChest claimed={monthlyProgress >= monthlyTarget} />
              </div>
              <p className="mt-1 text-center text-sm font-black text-[#d8e8f2]">
                {monthlyProgress} / {monthlyTarget}
              </p>
            </div>
          </div>

          <div className="bg-[#091f2f] px-6 pb-6 pt-5 text-white">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-3xl font-black tracking-tight">Daily Quests</h3>
              <p className="text-base font-black text-[#ffb73f]">10 HOURS</p>
            </div>

            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-20 rounded-xl bg-white/10" />
                <div className="h-20 rounded-xl bg-white/10" />
                <div className="h-20 rounded-xl bg-white/10" />
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-[#2d4a5d] bg-[#0c2738]">
                {dailyQuests.map((quest, index) => {
                  const ratio = quest.current / Math.max(quest.target, 1);
                  const claimed = ratio >= 1;

                  return (
                    <div
                      key={quest.id}
                      className={`px-4 py-4 ${
                        index < dailyQuests.length - 1 ? "border-b border-[#2d4a5d]" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#4b6880] bg-[#12344a] text-xs font-black text-[#8ed7ff]">
                          {quest.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-base font-extrabold text-white">{quest.title}</p>
                          <div className="mt-2 flex items-center gap-3">
                            <div className="h-4 flex-1 overflow-hidden rounded-full bg-[#3d5566]">
                              <div
                                className="h-full rounded-full bg-[#58cc02] transition-all duration-700"
                                style={{ width: `${Math.min(100, ratio * 100)}%` }}
                              />
                            </div>
                            <QuestChest claimed={claimed} />
                          </div>
                          <p className="mt-1 text-center text-sm font-black text-[#c8d9e5]">
                            {quest.current} / {quest.target}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <div className="rounded-xl border border-[#355367] bg-[#0f2d40] px-3 py-2 text-center text-xs font-black text-[#d9ecf8]">
                CHAPTERS {completedCount}/{allChapterIds.length}
              </div>
              <div className="rounded-xl border border-[#355367] bg-[#0f2d40] px-3 py-2 text-center text-xs font-black text-[#d9ecf8]">
                PROGRESS {progressPct}%
              </div>
              <div className="rounded-xl border border-[#355367] bg-[#0f2d40] px-3 py-2 text-center text-xs font-black text-[#d9ecf8]">
                XP {totalXP}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {MODULES.map((module) => {
                const completedInModule = getCompletedChapterCountByModule(
                  module.id,
                  completedMilestones
                );
                const chapterXP = Math.floor(module.xp / module.chapters.length);
                const moduleEarnedXP = completedInModule * chapterXP;
                const moduleProgress =
                  (completedInModule / Math.max(module.chapters.length, 1)) * 100;

                return (
                  <div
                    key={module.id}
                    className="rounded-xl border border-[#2d4a5d] bg-[#0f2d40] px-3 py-2"
                  >
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <p className="text-sm font-extrabold text-white">{module.title}</p>
                      <p className="text-xs font-black text-[#c0d8e5]">
                        {completedInModule}/{module.chapters.length} chapters - {moduleEarnedXP} XP
                      </p>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#354e5f]">
                      <div
                        className="h-full rounded-full bg-[#58cc02]"
                        style={{ width: `${moduleProgress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {completedCount > 0 ? (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    if (confirm("Reset all progress? This cannot be undone.")) {
                      resetProgress();
                    }
                  }}
                  className="text-xs font-bold text-[#ff9a9a] hover:text-[#ffbcbc]"
                >
                  Reset quiz progress
                </button>
              </div>
            ) : null}
          </div>
        </section>

        {error ? (
          <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="text-xs text-red-400 hover:text-red-600"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        ) : null}

        <section className="duo-card mt-5 p-6">
          <h2 className="text-lg font-extrabold text-[#2c5015]">Profile</h2>
          <div className="mt-4 space-y-2 text-sm text-[#4d6b3a]">
            <p>
              <strong>Name:</strong> {session?.user?.name ?? "Guest User"}
            </p>
            <p>
              <strong>Email:</strong> {session?.user?.email ?? "Not signed in"}
            </p>
          </div>
        </section>

        <section className="duo-card mt-5 p-6">
          <h2 className="text-lg font-extrabold text-[#2c5015]">Session Actions</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {session?.user ? (
              <>
                <button
                  onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                  className="duo-btn-secondary px-4 py-2 text-sm"
                >
                  Sign Out
                </button>
                <button
                  onClick={() =>
                    signOut({
                      callbackUrl: `/auth/signin?email=${encodeURIComponent(session?.user?.email ?? "")}`,
                    })
                  }
                  className="duo-btn-primary px-4 py-2 text-sm"
                >
                  Switch Account
                </button>
              </>
            ) : (
              <button
                onClick={() => router.push("/auth/signin")}
                className="duo-btn-primary px-4 py-2 text-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
