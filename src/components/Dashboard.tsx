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
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-green-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦜</span>
            <span className="text-xl font-extrabold text-green-600">
              NUSlat
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1.5 text-sm font-bold text-green-700">
              <span>🎯</span>
              <span>{completedCount}/{MODULES.length} modules</span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1.5 text-sm font-bold text-yellow-600">
              <span>⚡</span>
              <span>{totalXP} XP</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        {/* Welcome section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-800 sm:text-4xl">
            Welcome back, {userName.split(" ")[0]}! 👋
          </h1>
          <p className="mt-2 text-gray-500">
            Continue your vocabulary journey
          </p>
        </div>

        {/* Progress overview */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-5 text-white shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold opacity-90">
              Overall Progress
            </span>
            <span className="text-sm font-bold">
              {completedMilestones.length}/{MODULES.length} modules
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/30">
            <div
              className="h-full rounded-full bg-white transition-all duration-700"
              style={{
                width: `${(completedMilestones.length / MODULES.length) * 100}%`,
              }}
            />
          </div>
          <div className="mt-3 flex justify-between text-xs opacity-75">
            <span>Beginner</span>
            <span>Advanced</span>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <svg
              className="h-5 w-5 shrink-0"
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
        )}

        {/* Module path */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-700">Learning Path</h2>

          {/* Connector dots between cards */}
          <div className="relative">
            {MODULES.map((module, index) => {
              const { isCompleted, isLocked, isActive } = getModuleStatus(
                module.id,
                index
              );
              return (
                <div key={module.id} className="relative">
                  <ModuleCard
                    module={module}
                    isCompleted={isCompleted}
                    isLocked={isLocked}
                    isActive={isActive}
                    onComplete={handleComplete}
                  />
                  {/* Connector between cards */}
                  {index < MODULES.length - 1 && (
                    <div className="flex justify-center py-1">
                      <div
                        className={`h-8 w-0.5 ${
                          isCompleted ? "bg-green-400" : "bg-gray-200"
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Completion celebration */}
        {completedMilestones.length === MODULES.length && (
          <div className="mt-8 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-center text-white shadow-xl">
            <div className="mb-2 text-4xl">🏆</div>
            <h3 className="text-2xl font-extrabold">Course Complete!</h3>
            <p className="mt-1 text-sm opacity-90">
              You&apos;ve mastered all 3,000 words. Amazing work!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
