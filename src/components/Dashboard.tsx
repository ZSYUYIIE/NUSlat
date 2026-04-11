"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import {
  MODULES,
  getChapterSequence,
  getCompletedChapterCountByModule,
} from "@/lib/modules";
import { getCharacterStrokeGuide } from "@/lib/strokes";
import ModuleCard from "@/components/ModuleCard";
import { useMilestones } from "@/hooks/useMilestones";

export default function Dashboard() {
  const { data: session } = useSession();
  const { completedMilestones, error, clearError, loading } =
    useMilestones();

  const isGuest = !session?.user;
  const userName = session?.user?.name?.split(" ")[0] ?? "Guest";
  const allChapterIds = getChapterSequence();

  const totalXP = MODULES.reduce((sum, module) => {
    const completedInModule = getCompletedChapterCountByModule(
      module.id,
      completedMilestones
    );
    const chapterXP = Math.floor(module.xp / module.chapters.length);
    return sum + completedInModule * chapterXP;
  }, 0);

  const completedCount = completedMilestones.length;
  const progressPct = Math.round((completedCount / allChapterIds.length) * 100);
  const spotlightCharacter = "ส";
  const spotlightGuide = getCharacterStrokeGuide(spotlightCharacter);

  const getModuleStatus = (moduleId: string, index: number) => {
    const moduleData = MODULES.find((item) => item.id === moduleId);
    if (!moduleData) {
      return {
        isCompleted: false,
        isLocked: true,
        isActive: false,
        completedChapters: 0,
      };
    }

    const completedChapters = moduleData.chapters.filter((chapter) =>
      completedMilestones.includes(chapter.id)
    ).length;
    const isCompleted = completedChapters === moduleData.chapters.length;

    const previousModule = index > 0 ? MODULES[index - 1] : null;
    const previousModuleComplete =
      !previousModule ||
      previousModule.chapters.every((chapter) =>
        completedMilestones.includes(chapter.id)
      );

    const isLocked = !previousModuleComplete;
    const isActive = !isLocked;
    return { isCompleted, isLocked, isActive, completedChapters };
  };

  return (
    <div className="duo-shell min-h-screen">
      <AppHeader />

      {/* Guest sign-in nudge */}
      {isGuest && (
        <div className="border-b border-amber-100 bg-amber-50 px-4 py-2.5 text-center text-xs text-amber-700">
          You&apos;re in guest mode — progress is saved locally.{" "}
          <Link
            href="/auth/signin"
            className="font-semibold underline underline-offset-2 hover:text-amber-900"
          >
            Sign in to sync across devices
          </Link>
        </div>
      )}

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-4 flex w-full items-center gap-2.5">
          <div className="duo-chip flex flex-1 items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-[#3f6f25] sm:flex-initial">
            <span>🎯</span>
            <span>
              {completedCount}/{allChapterIds.length} chapters
            </span>
          </div>
          <div className="duo-chip flex flex-1 items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-[#3f6f25] sm:flex-initial">
            <span>⚡</span>
            <span>{totalXP} XP</span>
          </div>
        </div>

        {/* Welcome */}
        <div className="mb-8 text-center sm:mb-10">
          <h1 className="text-2xl font-extrabold tracking-tight text-[#2c5015] sm:text-4xl">
            {isGuest ? "Welcome, Guest" : `Welcome back, ${userName}`}
          </h1>
          <p className="mt-2 text-sm text-[#4d6b3a] sm:text-base">
            Continue your vocabulary journey
          </p>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="duo-card mb-8 animate-pulse p-6">
            <div className="mb-4 h-3 w-32 rounded-full bg-neutral-100" />
            <div className="h-2 rounded-full bg-neutral-100" />
          </div>
        )}

        {/* Progress card */}
        {!loading && (
          <div className="duo-card mb-8 p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-bold tracking-tight text-[#2c5015]">
                Overall Progress
              </span>
              <span className="text-sm font-extrabold text-[#2c5015]">
                {progressPct}%
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[#e8f9db]">
              <div
                className="h-full rounded-full bg-[#58cc02] transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="mt-3 flex justify-between text-xs font-bold text-[#87a66f]">
              <span>Beginner</span>
              <span>Advanced</span>
            </div>
          </div>
        )}

        <div className="duo-card mb-8 p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-extrabold tracking-tight text-[#2c5015]">
              Character Writing Spotlight
            </h2>
            <Link href="/vocabulary" className="text-xs font-bold text-[#4d6b3a] hover:text-[#2c5015]">
              Open Vocabulary
            </Link>
          </div>
          <div className="mb-3 rounded-2xl border border-[#d7f4c9] bg-[#f6ffef] p-4">
            <p className="text-5xl font-extrabold text-[#2c5015]">{spotlightCharacter}</p>
          </div>
          <ol className="space-y-1.5 text-xs text-[#4d6b3a]">
            {spotlightGuide.map((step) => (
              <li key={step} className="rounded-lg bg-white px-2 py-1.5">
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4 shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
            <button
              onClick={clearError}
              className="shrink-0 text-xs text-red-400 hover:text-red-600"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {/* Learning path */}
        <div className="space-y-3">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#87a66f]">
            Learning Path
          </h2>

          <div>
            {MODULES.map((module, index) => {
              const {
                isCompleted,
                isLocked,
                isActive,
                completedChapters,
              } = getModuleStatus(module.id, index);
              return (
                <div key={module.id}>
                  <ModuleCard
                    module={module}
                    isCompleted={isCompleted}
                    isLocked={isLocked}
                    isActive={isActive}
                    completedChapters={completedChapters}
                  />
                  {index < MODULES.length - 1 && (
                    <div className="flex justify-center py-2">
                      <div
                        className={`h-6 w-px ${
                          isCompleted ? "bg-neutral-300" : "bg-neutral-200"
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Completion */}
        {completedMilestones.length === allChapterIds.length && (
          <div className="duo-card mt-8 p-8 text-center">
            <div className="mb-3 text-4xl">🏆</div>
            <h3 className="text-xl font-extrabold tracking-tight text-[#2c5015]">
              Course Complete
            </h3>
            <p className="mt-2 text-sm text-[#4d6b3a]">
              You&apos;ve mastered every chapter. Amazing work!
            </p>
            {isGuest && (
              <Link
                href="/auth/signup"
                className="duo-btn-primary mt-5 inline-block px-6 py-2.5 text-sm"
              >
                Create an account to keep your progress
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
