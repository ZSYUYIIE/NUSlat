"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import {
  MODULES,
  getChapterSequence,
  getCompletedChapterCountByModule,
} from "@/lib/modules";
import { getCharacterStrokeGuide } from "@/lib/strokes";
import { evaluateWritingCanvas, type WritingResult } from "@/lib/writing-evaluator";
import ModuleCard from "@/components/ModuleCard";
import { useMilestones } from "@/hooks/useMilestones";

const SPOTLIGHT_CHARACTER = "ส";

export default function Dashboard() {
  const { data: session } = useSession();
  const { completedMilestones, error, clearError, loading, resetProgress } =
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

  // ── Writing spotlight state ────────────────────────────────────────────────
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasInk, setHasInk] = useState(false);
  const [writingResult, setWritingResult] = useState<WritingResult | null>(null);
  const [strokeStepIndex, setStrokeStepIndex] = useState(0);
  const spotlightGuide = getCharacterStrokeGuide(SPOTLIGHT_CHARACTER);

  // Set up the canvas (DPR-aware) whenever the component mounts.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * ratio);
    canvas.height = Math.floor(rect.height * ratio);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(ratio, ratio);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#eef8d8";
  }, []);

  const getCanvasPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const beginDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const p = getCanvasPoint(event);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    setIsDrawing(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const p = getCanvasPoint(event);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    setHasInk(true);
  };

  const stopDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);
    setWritingResult(null);
  }, []);

  const checkWriting = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setWritingResult(
      evaluateWritingCanvas({
        canvas,
        hasInk,
        targetText: SPOTLIGHT_CHARACTER,
        getFontSizePx: (logicalWidth, logicalHeight) =>
          Math.min(logicalWidth / 2.4, logicalHeight * 0.52),
      })
    );
  }, [hasInk]);

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
            {completedCount > 0 && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    if (confirm("Reset all progress? This cannot be undone.")) {
                      resetProgress();
                    }
                  }}
                  className="text-xs font-semibold text-red-400 hover:text-red-600"
                >
                  Reset progress
                </button>
              </div>
            )}
          </div>
        )}

        {/* Character Writing Spotlight */}
        <div className="duo-card mb-8 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-[#d7f4c9] px-5 py-4">
            <h2 className="text-sm font-extrabold tracking-tight text-[#2c5015]">
              Character Writing Spotlight
            </h2>
            <span className="rounded-full bg-[#e9fdd6] px-2.5 py-1 text-xs font-extrabold text-[#2d6d13]">
              {SPOTLIGHT_CHARACTER}
            </span>
          </div>

          <div className="grid gap-0 sm:grid-cols-[1fr_1.2fr]">
            {/* Stroke guide panel */}
            <div className="rounded-bl-3xl bg-[#184f2b] p-5 text-[#ecf9db]">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-wide text-[#b9e8c0]">
                Stroke Guide
              </p>
              <ol className="mb-4 space-y-1.5 text-xs">
                {spotlightGuide.map((step, index) => (
                  <li
                    key={step}
                    className={`rounded-lg px-2.5 py-1.5 ${
                      index === strokeStepIndex
                        ? "bg-[#9ee8a9] font-extrabold text-[#144223]"
                        : "bg-[#0f3f22] text-[#d7f8cd]"
                    }`}
                  >
                    Step {index + 1}: {step}
                  </li>
                ))}
              </ol>
              <div className="flex gap-2">
                <button
                  onClick={() => setStrokeStepIndex((i) => Math.max(0, i - 1))}
                  disabled={strokeStepIndex === 0}
                  className="rounded-full border border-[#3f9155] bg-[#0f3f22] px-3 py-1.5 text-xs font-bold text-[#d7f8cd] disabled:opacity-40"
                >
                  Prev
                </button>
                <button
                  onClick={() =>
                    setStrokeStepIndex((i) =>
                      Math.min(spotlightGuide.length - 1, i + 1)
                    )
                  }
                  disabled={strokeStepIndex >= spotlightGuide.length - 1}
                  className="rounded-full border border-[#97de9f] bg-[#c6f7b8] px-3 py-1.5 text-xs font-extrabold text-[#1a582d] disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Canvas panel */}
            <div className="bg-[#184f2b] p-5 sm:rounded-br-3xl">
              {/* Drawing area */}
              <div className="relative mb-3 h-52 w-full overflow-hidden rounded-2xl border-2 border-[#3c8d52] bg-[#0f3f22]">
                {/* Watermark */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="select-none text-8xl font-extrabold text-[#2c7c40]/60">
                    {SPOTLIGHT_CHARACTER}
                  </span>
                </div>
                <canvas
                  ref={canvasRef}
                  onPointerDown={beginDrawing}
                  onPointerMove={draw}
                  onPointerUp={stopDrawing}
                  onPointerLeave={stopDrawing}
                  className="absolute inset-0 h-full w-full touch-none"
                />
              </div>

              {/* Controls */}
              <div className="mb-3 flex gap-2">
                <button
                  onClick={clearCanvas}
                  className="rounded-full border border-[#3f9155] bg-[#0f3f22] px-3 py-1.5 text-xs font-bold text-[#d7f8cd]"
                >
                  Clear
                </button>
                <button
                  onClick={checkWriting}
                  disabled={!hasInk}
                  className="rounded-full border border-[#97de9f] bg-[#c6f7b8] px-3 py-1.5 text-xs font-extrabold text-[#1a582d] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Check Accuracy
                </button>
              </div>

              {/* Result */}
              {writingResult ? (
                <div
                  className={`rounded-xl border px-3 py-2 text-xs ${
                    writingResult.passed
                      ? "border-[#8fe1a0] bg-[#0f5b2d] text-[#ddffe7]"
                      : "border-[#f1c37d] bg-[#6d4a1f] text-[#fff4db]"
                  }`}
                >
                  <p className="font-extrabold">
                    {writingResult.passed
                      ? "Readable — great job!"
                      : "Keep practising — follow the stroke order."}
                  </p>
                  <p className="mt-1 text-[11px] opacity-80">
                    Score {Math.round(writingResult.score * 100)}% &bull;{" "}
                    Coverage {Math.round(writingResult.coverage * 100)}% &bull;{" "}
                    Precision {Math.round(writingResult.precision * 100)}%
                  </p>
                </div>
              ) : (
                <p className="text-xs text-[#b9e8c0]">
                  Trace the character above, then tap Check Accuracy.
                </p>
              )}
            </div>
          </div>
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
