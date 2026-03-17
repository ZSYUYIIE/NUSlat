"use client";

import { useState } from "react";
import { Module } from "@/lib/modules";

interface ModuleCardProps {
  module: Module;
  isCompleted: boolean;
  isLocked: boolean;
  isActive: boolean;
  onComplete: (moduleId: string) => Promise<void>;
}

export default function ModuleCard({
  module,
  isCompleted,
  isLocked,
  isActive,
  onComplete,
}: ModuleCardProps) {
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (isLocked || isCompleted || loading) return;
    setLoading(true);
    try {
      await onComplete(module.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative rounded-3xl border border-neutral-200/60 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 ${
        isLocked
          ? "cursor-not-allowed opacity-50"
          : isCompleted
          ? ""
          : "cursor-pointer hover:scale-[1.02] hover:shadow-[0_12px_40px_rgb(0,0,0,0.07)]"
      }`}
    >
      {/* Completed badge */}
      {isCompleted && (
        <div className="absolute -right-2 -top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#1D1D1F] shadow-[0_4px_12px_rgb(0,0,0,0.15)]">
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
      <div className="mb-5 flex items-center gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl ${module.iconBg}`}
        >
          {module.icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-[#1D1D1F]">
            {module.title}
          </h3>
          <p className="text-sm text-neutral-500">{module.lessons} lessons</p>
        </div>
      </div>

      {/* Description */}
      <p className="mb-6 text-sm leading-relaxed text-neutral-500">
        {module.description}
      </p>

      {/* Footer: XP + action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
          <span>⚡</span>
          <span>{module.xp} XP</span>
        </div>

        {isCompleted ? (
          <span className="rounded-full bg-neutral-100 px-4 py-1.5 text-xs font-medium text-neutral-600">
            Completed
          </span>
        ) : isActive ? (
          <button
            onClick={handleComplete}
            disabled={loading}
            className={`rounded-full bg-gradient-to-r ${module.gradient} px-5 py-2 text-sm font-medium text-white shadow-[0_4px_14px_rgb(0,0,0,0.15)] transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-60`}
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
                Saving…
              </span>
            ) : (
              "Start →"
            )}
          </button>
        ) : null}
      </div>

      {/* Active pulse indicator */}
      {isActive && !isCompleted && (
        <div className="mt-5 flex items-center gap-2 text-xs text-neutral-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          <span>Ready to start</span>
        </div>
      )}
    </div>
  );
}
