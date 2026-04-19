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

  return (
    <div className="duo-shell min-h-screen">
      <AppHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <BackToPreviousButton fallbackHref="/" className="mb-4" />

        <h1 className="text-2xl font-extrabold tracking-tight text-[#2c5015] sm:text-4xl">
          Account
        </h1>
        <p className="mt-2 text-sm text-[#4d6b3a]">
          Manage your identity and session for daily learning.
        </p>

        <section className="duo-card mt-6 p-6">
          <h2 className="text-lg font-extrabold text-[#2c5015]">Quiz Stats</h2>
          {loading ? (
            <div className="mt-4 animate-pulse space-y-3">
              <div className="h-8 rounded-xl bg-neutral-100" />
              <div className="h-8 rounded-xl bg-neutral-100" />
            </div>
          ) : (
            <>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <div className="duo-chip justify-center px-3 py-2 text-xs font-extrabold text-[#3f6f25]">
                  Chapters: {completedCount}/{allChapterIds.length}
                </div>
                <div className="duo-chip justify-center px-3 py-2 text-xs font-extrabold text-[#3f6f25]">
                  Progress: {progressPct}%
                </div>
                <div className="duo-chip justify-center px-3 py-2 text-xs font-extrabold text-[#3f6f25]">
                  XP: {totalXP}
                </div>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#e8f9db]">
                <div
                  className="h-full rounded-full bg-[#58cc02] transition-all duration-700"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              <div className="mt-5 space-y-2">
                {MODULES.map((module) => {
                  const completedInModule = getCompletedChapterCountByModule(
                    module.id,
                    completedMilestones
                  );
                  const chapterXP = Math.floor(module.xp / module.chapters.length);
                  const moduleEarnedXP = completedInModule * chapterXP;
                  return (
                    <div
                      key={module.id}
                      className="rounded-xl border border-[#d7f4c9] bg-white px-3 py-2 text-sm"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-bold text-[#2c5015]">{module.title}</p>
                        <p className="text-xs font-bold text-[#6a8a55]">
                          {completedInModule}/{module.chapters.length} chapters · {moduleEarnedXP} XP
                        </p>
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
                    className="text-xs font-semibold text-red-400 hover:text-red-600"
                  >
                    Reset quiz progress
                  </button>
                </div>
              ) : null}
            </>
          )}
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
