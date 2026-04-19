"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import ModuleCard from "@/components/ModuleCard";
import AppHeader from "@/components/AppHeader";
import { MODULES, getChapterSequence } from "@/lib/modules";
import { useMilestones } from "@/hooks/useMilestones";

export default function LearnHub() {
  const { data: session } = useSession();
  const { completedMilestones, error, clearError, loading } = useMilestones();

  const isGuest = !session?.user;
  const userName = session?.user?.name?.split(" ")[0] ?? "Guest";
  const allChapterIds = getChapterSequence();

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

      {isGuest && (
        <div className="border-b border-amber-100 bg-amber-50 px-4 py-2.5 text-center text-xs text-amber-700">
          You&apos;re in guest mode — progress is saved locally. {" "}
          <Link
            href="/auth/signin"
            className="font-semibold underline underline-offset-2 hover:text-amber-900"
          >
            Sign in to sync across devices
          </Link>
        </div>
      )}

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8 text-center sm:mb-10">
          <h1 className="text-2xl font-extrabold tracking-tight text-[#2c5015] sm:text-4xl">
            {isGuest ? "Learn as Guest" : `Welcome to Learn, ${userName}`}
          </h1>
          <p className="mt-2 text-sm text-[#4d6b3a] sm:text-base">
            Follow each chapter in order with guided practice before taking quizzes.
          </p>
          <p className="mt-2 text-xs font-bold text-[#7f9f69]">
            Learning modules are being prepared and are not fully implemented yet.
          </p>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          <div className="duo-card p-4">
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#7f9f69]">
              Guided Step 1
            </p>
            <h3 className="mt-1 text-sm font-extrabold text-[#2c5015]">Listen and Repeat</h3>
            <p className="mt-1 text-xs text-[#4d6b3a]">
              Hear Thai words and repeat pronunciation before answering.
            </p>
          </div>
          <div className="duo-card p-4">
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#7f9f69]">
              Guided Step 2
            </p>
            <h3 className="mt-1 text-sm font-extrabold text-[#2c5015]">Stroke Follow</h3>
            <p className="mt-1 text-xs text-[#4d6b3a]">
              Practice writing in stroke order before moving to free write checks.
            </p>
          </div>
          <div className="duo-card p-4">
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#7f9f69]">
              Guided Step 3
            </p>
            <h3 className="mt-1 text-sm font-extrabold text-[#2c5015]">Checkpoint Quiz</h3>
            <p className="mt-1 text-xs text-[#4d6b3a]">
              End each chapter with a quiz checkpoint to lock in retention.
            </p>
          </div>
        </div>

        {loading && (
          <div className="duo-card mb-8 animate-pulse p-6">
            <div className="mb-4 h-3 w-40 rounded-full bg-neutral-100" />
            <div className="h-2 w-full rounded-full bg-neutral-100" />
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            <div className="flex items-center gap-2">
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

        <div className="space-y-3">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#87a66f]">
            Learning Levels
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
                    mode="learn"
                    disableAction
                    disabledActionLabel="Learning coming soon"
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

        {completedMilestones.length === allChapterIds.length && (
          <div className="duo-card mt-8 p-8 text-center">
            <div className="mb-3 text-4xl">🎓</div>
            <h3 className="text-xl font-extrabold tracking-tight text-[#2c5015]">
              Learning Journey Complete
            </h3>
            <p className="mt-2 text-sm text-[#4d6b3a]">
              You&apos;ve finished guided learning for every chapter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
