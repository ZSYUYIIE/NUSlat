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
}

export default function ModuleCard({
  module,
  isCompleted,
  isLocked,
  isActive,
  completedChapters,
}: ModuleCardProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStart = async () => {
    if (isLocked || loading) return;
    setLoading(true);
    try {
      router.push(`/learn/${module.id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`duo-card relative p-5 transition-all duration-300 sm:p-8 ${
        isLocked
          ? "cursor-not-allowed opacity-50"
          : isCompleted
          ? ""
          : "cursor-pointer hover:-translate-y-0.5"
      }`}
    >
      {/* Completed badge */}
      {isCompleted && (
        <div className="absolute -right-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#58cc02] shadow-[0_4px_10px_rgba(88,204,2,0.35)]">
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

      {/* Lock overlay */}
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
            <span className="text-xs font-medium tracking-wide">Complete previous module</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-5 flex items-center gap-3 sm:gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl ring-2 ring-[#d7f4c9] sm:h-14 sm:w-14 sm:text-3xl ${module.iconBg}`}
        >
          {module.icon}
        </div>
        <div>
          <h3 className="text-base font-extrabold tracking-tight text-[#2c5015] sm:text-lg">
            {module.title}
          </h3>
          <p className="text-sm text-[#5b7a46]">
            {completedChapters}/{module.chapters.length} chapters complete
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="mb-6 text-sm leading-relaxed text-[#4d6b3a]">
        {module.description}
      </p>

      {/* Footer: XP + action */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="duo-chip flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-[#3f6f25]">
          <span>⚡</span>
          <span>{module.xp} XP</span>
        </div>

        {isActive ? (
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
              isCompleted ? "Review ↺" : completedChapters > 0 ? "Continue →" : "Start →"
            )}
          </button>
        ) : null}
      </div>

      {/* Active pulse indicator */}
      {isActive && !isCompleted && (
        <div className="mt-5 flex items-center gap-2 text-xs text-neutral-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#58cc02]" />
          <span className="font-bold text-[#6f8f58]">Ready to start</span>
        </div>
      )}
    </div>
  );
}
