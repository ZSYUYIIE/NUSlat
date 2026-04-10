"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useMilestones } from "@/hooks/useMilestones";
import { getChaptersByModule } from "@/data/chapters";
import {
  getNextChapterId,
  getNextIncompleteChapterInModule,
  isChapterUnlocked,
} from "@/lib/modules";

export default function LearnPage() {
  const params = useParams();
  const moduleId = params?.moduleId as string;
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isChapterComplete, setIsChapterComplete] = useState(false);
  const [savingCompletion, setSavingCompletion] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasInk, setHasInk] = useState(false);

  const { completeModule, completedMilestones } = useMilestones();

  const chapters = useMemo(() => {
    if (!moduleId) {
      return [];
    }
    return getChaptersByModule(moduleId);
  }, [moduleId]);

  const activeChapter = useMemo(
    () => chapters.find((chapter) => chapter.id === activeChapterId) ?? null,
    [chapters, activeChapterId]
  );

  const lessons = activeChapter?.lessons ?? [];

  useEffect(() => {
    if (!moduleId) {
      router.push("/dashboard");
      return;
    }

    if (chapters.length === 0) {
      router.push("/dashboard");
      return;
    }

    if (!activeChapterId) {
      const chapterFromQuery =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("chapter")
          : null;

      const preferred =
        (chapterFromQuery && chapters.some((ch) => ch.id === chapterFromQuery)
          ? chapterFromQuery
          : null) ??
        getNextIncompleteChapterInModule(moduleId, completedMilestones) ??
        chapters[0].id;

      setActiveChapterId(preferred);
    }
  }, [moduleId, router, chapters, activeChapterId, completedMilestones]);

  useEffect(() => {
    if (!activeChapter) return;

    // Keep query string in sync so users can revisit a specific chapter URL.
    router.replace(`/learn/${moduleId}?chapter=${activeChapter.id}`);
  }, [router, moduleId, activeChapter]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));

    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(ratio, ratio);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#2c5015";
    ctx.clearRect(0, 0, width, height);
    setHasInk(false);
  }, [activeChapterId, currentIndex]);

  if (!moduleId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7]">
        <div className="text-neutral-500">Loading chapter...</div>
      </div>
    );
  }

  if (chapters.length === 0 || !activeChapter || lessons.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7]">
        <div className="text-neutral-500">No chapter content found</div>
      </div>
    );
  }

  const currentLesson = lessons[currentIndex];
  const progress = ((currentIndex + 1) / lessons.length) * 100;

  const vocabulary = lessons.map((lesson) => ({
    thaiWord: lesson.thaiWord,
    phonetic: lesson.phonetic,
    meaning: lesson.englishTranslation,
  }));

  const getCanvasPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const beginDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const point = getCanvasPoint(event);
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    setIsDrawing(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const point = getCanvasPoint(event);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    setHasInk(true);
  };

  const stopDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);
  };

  const handleExit = () => {
    if (confirm("Are you sure you want to exit this chapter?")) {
      router.push("/dashboard");
    }
  };

  const handleCheckAnswer = () => {
    if (!selectedOption) return;

    const correct = selectedOption === currentLesson.correctOption;
    setIsCorrect(correct);
    setIsAnswered(true);
  };

  const handleNext = async () => {
    if (currentIndex + 1 < lessons.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      setSavingCompletion(true);
      try {
        if (!completedMilestones.includes(activeChapter.id)) {
          await completeModule(activeChapter.id);
        }
      } catch (error) {
        console.error("Error completing chapter:", error);
      } finally {
        setSavingCompletion(false);
      }
      setIsChapterComplete(true);
    }
  };

  const selectChapter = (chapterId: string) => {
    if (!isChapterUnlocked(chapterId, completedMilestones)) {
      return;
    }
    setActiveChapterId(chapterId);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setIsChapterComplete(false);
  };

  if (isChapterComplete) {
    const nextChapterId = getNextChapterId(activeChapter.id);
    const hasNextInModule = chapters.some((chapter) => chapter.id === nextChapterId);

    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7] px-4">
        <div className="w-full max-w-md">
          <div className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-12">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100">
                <span className="text-4xl">✨</span>
              </div>
            </div>

            <h1 className="mb-3 text-center text-2xl font-semibold text-[#1D1D1F]">
              Chapter Complete!
            </h1>

            <p className="mb-8 text-center text-sm text-neutral-500">
              Great job! You&apos;ve completed {activeChapter.title}. Your progress
              has been saved.
            </p>

            <div className="mb-6 rounded-2xl border border-[#d7f4c9] bg-[#f6ffef] p-4">
              <h2 className="mb-2 text-sm font-extrabold text-[#2c5015]">Vocabulary in this chapter</h2>
              <div className="space-y-1.5 text-xs text-[#4d6b3a]">
                {vocabulary.map((word) => (
                  <div key={`${activeChapter.id}-${word.thaiWord}`} className="flex items-center justify-between gap-2">
                    <span className="font-bold">{word.thaiWord}</span>
                    <span>{word.meaning}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {hasNextInModule && nextChapterId ? (
                <button
                  onClick={() => selectChapter(nextChapterId)}
                  className="w-full rounded-2xl bg-[#58cc02] px-4 py-3 text-sm font-extrabold text-white shadow-[0_4px_14px_rgba(88,204,2,0.35)] transition-transform duration-300 hover:scale-[1.01] active:scale-95"
                >
                  Continue to Next Chapter
                </button>
              ) : null}
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full rounded-2xl bg-[#1D1D1F] px-4 py-3 text-sm font-medium text-white shadow-[0_4px_14px_rgb(0,0,0,0.12)] transition-transform duration-300 hover:scale-[1.01] hover:opacity-90 active:scale-95"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="duo-shell flex min-h-screen flex-col">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-10 border-b-2 border-[#d7f4c9] bg-[#f6ffef]/95">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex flex-1 items-center gap-4">
            <div className="text-xs font-extrabold text-[#4f7340] sm:text-sm">
              {activeChapter.title} • {currentIndex + 1} of {lessons.length}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex-1">
            <div className="h-2.5 overflow-hidden rounded-full bg-[#e8f9db]">
              <div
                className="h-full bg-[#58cc02] transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Exit Button */}
          <button
            onClick={handleExit}
            className="duo-btn-secondary ml-2 px-3 py-2 text-xs sm:ml-4 sm:px-4 sm:text-sm"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-6 sm:py-10 lg:py-12">
        <div className="w-full max-w-2xl">
          <div className="mb-5 flex flex-wrap gap-2">
            {chapters.map((chapter) => {
              const isActiveChapter = chapter.id === activeChapter.id;
              const isDone = completedMilestones.includes(chapter.id);
              const unlocked = isChapterUnlocked(chapter.id, completedMilestones);

              return (
                <button
                  key={chapter.id}
                  onClick={() => selectChapter(chapter.id)}
                  disabled={!unlocked}
                  className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                    isActiveChapter
                      ? "border-[#8cdb4d] bg-[#f3ffe9] text-[#2c5015]"
                      : unlocked
                      ? "border-[#d7f4c9] bg-white text-[#4d6b3a] hover:border-[#8cdb4d]"
                      : "border-neutral-200 bg-neutral-100 text-neutral-400"
                  }`}
                >
                  {chapter.title} {isDone ? "✓" : ""}
                </button>
              );
            })}
          </div>

          {/* Thai Word Card */}
          <div className="duo-card mb-6 p-6 sm:mb-10 sm:p-10 lg:mb-12 lg:p-12">
            <p className="mb-4 text-center text-sm font-extrabold uppercase tracking-wide text-[#7f9f69] sm:mb-6">
              What does this word mean?
            </p>
            <h2 className="mb-3 text-center text-4xl font-extrabold tracking-tight text-[#2c5015] sm:mb-4 sm:text-5xl lg:text-6xl">
              {currentLesson.thaiWord}
            </h2>
            <p className="text-center text-base font-bold text-[#5a7c45] sm:text-lg">
              {currentLesson.phonetic}
            </p>
          </div>

          <div className="mb-6 rounded-3xl border-2 border-[#d7f4c9] bg-white p-4 sm:p-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs font-extrabold uppercase tracking-wide text-[#7f9f69]">
                Write This Thai Word
              </p>
              <button
                onClick={clearCanvas}
                className="rounded-full border border-[#d7f4c9] px-3 py-1 text-xs font-bold text-[#4d6b3a] hover:border-[#8cdb4d]"
              >
                Clear
              </button>
            </div>
            <p className="mb-3 text-sm text-[#4d6b3a]">
              Use mouse or finger to practice writing: <strong>{currentLesson.thaiWord}</strong>
            </p>
            <canvas
              ref={canvasRef}
              onPointerDown={beginDrawing}
              onPointerMove={draw}
              onPointerUp={stopDrawing}
              onPointerLeave={stopDrawing}
              className="h-44 w-full touch-none rounded-2xl border-2 border-dashed border-[#c9eeb2] bg-[#fbfff7]"
            />
            <p className="mt-2 text-xs text-[#7f9f69]">
              {hasInk
                ? "Great. Keep tracing until it feels natural."
                : "Start drawing to practice your stroke order."}
            </p>
          </div>

          <div className="mb-6 rounded-2xl border border-[#d7f4c9] bg-[#f6ffef] p-4">
            <h3 className="mb-2 text-sm font-extrabold text-[#2c5015]">Chapter Vocabulary</h3>
            <div className="grid grid-cols-1 gap-1.5 text-xs text-[#4d6b3a] sm:grid-cols-2">
              {vocabulary.map((word) => (
                <div key={`${activeChapter.id}-vocab-${word.thaiWord}`} className="flex items-center justify-between rounded-lg bg-white/80 px-2 py-1">
                  <span className="font-bold">{word.thaiWord}</span>
                  <span>{word.meaning}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Options Grid */}
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {currentLesson.options.map((option) => {
              const isSelected = selectedOption === option;
              let buttonClasses =
                "rounded-2xl border-2 px-4 py-4 text-sm font-extrabold transition-all duration-200 min-h-12 border-b-[6px]";

              if (isAnswered) {
                const isOptionCorrect = option === currentLesson.correctOption;
                if (isOptionCorrect) {
                  buttonClasses +=
                    " border-[#9be35d] bg-[#f3ffe9] text-[#356b16]";
                } else if (isSelected && !isCorrect) {
                  buttonClasses +=
                    " border-red-300 bg-red-50 text-red-800";
                } else {
                  buttonClasses +=
                    " border-neutral-200/60 bg-neutral-50 text-neutral-500 opacity-50";
                }
              } else {
                buttonClasses += isSelected
                  ? " border-[#8cdb4d] bg-[#f7ffe6] text-[#2c5015]"
                  : " border-[#d7f4c9] bg-white text-[#2c5015] hover:border-[#8cdb4d]";
                buttonClasses +=
                  " cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5";
              }

              return (
                <button
                  key={option}
                  onClick={() => {
                    if (!isAnswered) {
                      setSelectedOption(option);
                    }
                  }}
                  disabled={isAnswered}
                  className={buttonClasses}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {/* Feedback Message */}
          {isAnswered && (
            <div className={`mb-6 text-center text-sm font-medium`}>
              {isCorrect ? (
                <span className="font-extrabold text-[#4aac07]">✓ Correct!</span>
              ) : (
                <span className="text-red-600">
                  ✗ Not quite. The answer was:{" "}
                  <strong>{currentLesson.correctOption}</strong>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      {!isAnswered ? (
        <div className="sticky bottom-0 left-0 right-0 border-t-2 border-[#d7f4c9] bg-[#f6ffef]/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:border-none sm:bg-transparent sm:px-0 sm:pb-8 sm:pt-0">
          <div className="mx-auto flex max-w-2xl justify-center">
          <button
            onClick={handleCheckAnswer}
            disabled={!selectedOption}
            className="duo-btn-primary w-full px-8 py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            Check Answer
          </button>
          </div>
        </div>
      ) : (
        <div className="sticky bottom-0 left-0 right-0 border-t-2 border-[#d7f4c9] bg-[#f6ffef]/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:border-none sm:bg-transparent sm:px-0 sm:pb-8 sm:pt-0">
          <div className="mx-auto flex max-w-2xl justify-center">
          <button
            onClick={handleNext}
            disabled={savingCompletion}
            className="duo-btn-primary w-full px-8 py-3.5 text-sm sm:w-auto"
          >
            {currentIndex + 1 === lessons.length
              ? savingCompletion
                ? "Saving..."
                : "Complete Chapter"
              : "Next"}
          </button>
          </div>
        </div>
      )}
    </div>
  );
}
