"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Module } from "@/lib/modules";

interface ModuleCardProps {
  module: Module;
  isCompleted: boolean;
  isLocked: boolean;
  isActive: boolean;
  completedChapters: number;
  mode?: "quiz" | "learn";
  disableAction?: boolean;
  disabledActionLabel?: string;
  buildHref?: (moduleId: string) => string;
}

function ChestIcon({ state }: { state: "locked" | "ready" | "claimed" }) {
  const palette =
    state === "claimed"
      ? "border-[#dcb06a] bg-[#ffdf9f]"
      : state === "ready"
      ? "border-[#a9c3cf] bg-[#d5eaf5]"
      : "border-[#d7d7d7] bg-[#f1f1f1]";

  return (
    <div
      className={`relative h-8 w-10 rounded-md border-2 border-b-4 ${palette}`}
      aria-hidden="true"
    >
      <div className="absolute inset-x-0 top-0 h-2 border-b border-black/10 bg-black/10" />
      <div className="absolute left-1/2 top-[0.55rem] h-3 w-1 -translate-x-1/2 rounded-sm bg-black/20" />
    </div>
  );
}

export default function ModuleCard({
  module,
  isCompleted,
  isLocked,
  isActive,
  completedChapters,
  mode = "quiz",
  disableAction = false,
  disabledActionLabel = "Coming soon",
  buildHref,
}: ModuleCardProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const levelNumber = Number.parseInt(module.id, 10);
  const safeLevelLabel = Number.isFinite(levelNumber)
    ? `LEVEL ${levelNumber}`
    : module.id.toUpperCase();
  const chapterProgress = Math.round(
    (completedChapters / Math.max(module.chapters.length, 1)) * 100
  );
  const chestState = isLocked ? "locked" : isCompleted ? "claimed" : "ready";

  const handleStart = async () => {
    if (isLocked || loading || disableAction) return;
    setLoading(true);
    try {
      const href = buildHref ? buildHref(module.id) : `/learn/${module.id}`;
      router.push(href);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`duo-card relative p-5 transition-all duration-300 sm:p-7 ${
        isLocked
          ? "cursor-not-allowed opacity-50"
          : isCompleted
          ? ""
          : "cursor-pointer hover:-translate-y-1"
      }`}
    >
      {isCompleted && (
        <div className="absolute -right-2 -top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#57b826] bg-[#58cc02] shadow-[0_4px_10px_rgba(88,204,2,0.35)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}

      {isLocked && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-white/60 backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-2 text-neutral-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-9 w-9"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
            <span className="text-xs font-medium tracking-wide">
              {mode === "learn"
                ? "Complete previous learning level"
                : "Complete previous level quiz"}
            </span>
          </div>
        </div>
      )}

      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#7e9f6c]">
            {safeLevelLabel}
          </p>
          <h3 className="mt-1 text-base font-black tracking-tight text-[#2c5015] sm:text-lg">
            {module.title}
          </h3>
          <p className="mt-1 text-xs font-bold text-[#5b7a46]">
            {mode === "learn"
              ? `${completedChapters}/${module.chapters.length} chapters learned`
              : `${completedChapters}/${module.chapters.length} quiz chapters cleared`}
          </p>
        </div>

        <div className="rounded-2xl border border-[#d8ecd3] bg-[#f8ffef] px-2 py-1">
          <ChestIcon state={chestState} />
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-b-4 border-[#cae6bf] text-2xl ${module.iconBg}`}
        >
          {module.icon}
        </div>
        <p className="text-sm leading-relaxed text-[#4d6b3a]">
          {module.description}
        </p>
      </div>

      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-xs font-extrabold text-[#6a8a55]">
          <span>Progress</span>
          <span>{chapterProgress}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-[#e8f2e3]">
          <div
            className="h-full rounded-full bg-[#58cc02] transition-all duration-500"
            style={{ width: `${chapterProgress}%` }}
          />
        </div>
      </div>

      <p className="mb-5 text-xs font-bold uppercase tracking-wide text-[#6e8f5a]">
        {isLocked
          ? "Reward chest locked"
          : isCompleted
          ? "Reward chest claimed"
          : "Reward chest ready"}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="duo-chip flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-[#3f6f25]">
          <span>{mode === "learn" ? "LEARN" : "QUIZ"}</span>
          <span>
            {mode === "learn"
              ? `${module.chapters.length} guided chapters`
              : `${module.chapters.length} quiz chapters`}
          </span>
        </div>

        {isActive ? (
          disableAction ? (
            <button
              disabled
              className="duo-btn-secondary w-full cursor-not-allowed px-5 py-2.5 text-sm opacity-60 sm:w-auto sm:py-2"
            >
              {disabledActionLabel}
            </button>
          ) : (
            <button
              onClick={handleStart}
              disabled={loading}
              className="duo-btn-primary w-full px-5 py-2.5 text-sm sm:w-auto sm:py-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-3.5 w-3.5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Loading…
                </span>
              ) : (
                mode === "learn"
                  ? isCompleted
                    ? "Review Learning"
                    : completedChapters > 0
                    ? "Continue Learning"
                    : "Start Learning"
                  : isCompleted
                  ? "Retry Quiz"
                  : completedChapters > 0
                  ? "Continue Quiz"
                  : "Start Quiz"
              )}
            </button>
          )
        ) : null}
      </div>

      {isActive && !isCompleted && (
        <div className="mt-5 flex items-center gap-2 text-xs text-neutral-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#58cc02]" />
          <span className="font-bold text-[#6f8f58]">
            {mode === "learn" ? "Learning unlocked" : "Quiz unlocked"}
          </span>
        </div>
      )}
    </div>
  );
}
