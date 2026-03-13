"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MODULES } from "@/lib/modules";
import ModuleCard from "@/components/ModuleCard";

interface DashboardProps {
  userName: string;
  initialCompletedMilestones: string[];
}

export default function Dashboard({
  userName,
  initialCompletedMilestones,
}: DashboardProps) {
  const [completedMilestones, setCompletedMilestones] = useState<string[]>(
    initialCompletedMilestones
  );
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const totalXP = MODULES.filter((m) =>
    completedMilestones.includes(m.id)
  ).reduce((sum, m) => sum + m.xp, 0);

  const completedCount = completedMilestones.length;
  const progressPct = Math.round((completedCount / MODULES.length) * 100);

  const handleComplete = async (moduleId: string) => {
    setError(null);
    try {
      const res = await fetch("/api/milestones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ milestone: moduleId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to complete milestone");
        return;
      }

      setCompletedMilestones(data.completedMilestones);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    }
  };

  const getModuleStatus = (moduleId: string, index: number) => {
    const isCompleted = completedMilestones.includes(moduleId);
    const isLocked =
      index > 0 && !completedMilestones.includes(MODULES[index - 1].id);
    const isActive = !isCompleted && !isLocked;
    return { isCompleted, isLocked, isActive };
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Glassmorphism header */}
      <div className="sticky top-0 z-20 border-b border-white/20 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦜</span>
            <span className="text-lg font-semibold tracking-tight text-[#1D1D1F]">
              NUSlat
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600">
              <span>🎯</span>
              <span>{completedCount}/{MODULES.length} modules</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600">
              <span>⚡</span>
              <span>{totalXP} XP</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        {/* Welcome */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F] sm:text-4xl">
            Welcome back, {userName.split(" ")[0]}
          </h1>
          <p className="mt-2 text-neutral-500">
            Continue your vocabulary journey
          </p>
        </div>

        {/* Progress card */}
        <div className="mb-8 rounded-3xl border border-neutral-200/60 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium tracking-tight text-[#1D1D1F]">
              Overall Progress
            </span>
            <span className="text-sm font-semibold text-[#1D1D1F]">
              {progressPct}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
            <div
              className="h-full rounded-full bg-[#1D1D1F] transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="mt-3 flex justify-between text-xs text-neutral-400">
            <span>Beginner</span>
            <span>Advanced</span>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Learning path */}
        <div className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-neutral-400">
            Learning Path
          </h2>

          <div>
            {MODULES.map((module, index) => {
              const { isCompleted, isLocked, isActive } = getModuleStatus(
                module.id,
                index
              );
              return (
                <div key={module.id}>
                  <ModuleCard
                    module={module}
                    isCompleted={isCompleted}
                    isLocked={isLocked}
                    isActive={isActive}
                    onComplete={handleComplete}
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
        {completedMilestones.length === MODULES.length && (
          <div className="mt-8 rounded-3xl border border-neutral-200/60 bg-white p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="mb-3 text-4xl">🏆</div>
            <h3 className="text-xl font-semibold tracking-tight text-[#1D1D1F]">
              Course Complete
            </h3>
            <p className="mt-2 text-sm text-neutral-500">
              You&apos;ve mastered all 3,000 words. Amazing work!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
