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
      className={`relative rounded-2xl border-2 transition-all duration-300 ${
        isLocked
          ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
          : isCompleted
          ? `${module.borderColor} bg-white shadow-md`
          : `${module.borderColor} bg-white shadow-lg hover:shadow-xl hover:-translate-y-1 cursor-pointer`
      }`}
    >
      {/* Completed badge */}
      {isCompleted && (
        <div className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
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
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-gray-100/80">
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
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
            <span className="text-sm font-semibold">Locked</span>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="mb-4 flex items-center gap-4">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl ${module.iconBg}`}
          >
            {module.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{module.title}</h3>
            <p className="text-sm text-gray-500">{module.lessons} lessons</p>
          </div>
        </div>

        {/* Description */}
        <p className="mb-5 text-sm leading-relaxed text-gray-600">
          {module.description}
        </p>

        {/* XP badge and button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
            <span>⚡</span>
            <span>{module.xp} XP</span>
          </div>

          {isCompleted ? (
            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
              ✓ Completed
            </span>
          ) : isActive ? (
            <button
              onClick={handleComplete}
              disabled={loading}
              className={`rounded-full bg-gradient-to-r ${module.gradient} px-5 py-2 text-sm font-bold text-white shadow transition-all hover:opacity-90 active:scale-95 disabled:opacity-70`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
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
                  Saving...
                </span>
              ) : (
                "Start →"
              )}
            </button>
          ) : null}
        </div>

        {/* Active indicator */}
        {isActive && !isCompleted && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            <span>Ready to start!</span>
          </div>
        )}
      </div>
    </div>
  );
}
