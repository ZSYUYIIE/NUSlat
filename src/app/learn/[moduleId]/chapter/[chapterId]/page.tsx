"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useMilestones } from "@/hooks/useMilestones";
import AppHeader from "@/components/AppHeader";
import BackToPreviousButton from "@/components/BackToPreviousButton";
import { getChapterById } from "@/data/chapters";
import { MODULES, getNextChapterId, getModuleByChapterId } from "@/lib/modules";
import {
  evaluateWritingCanvas,
  type WritingResult,
} from "@/lib/writing-evaluator";
import { playThaiAudio } from "@/lib/audio";

type QuizTrack = "reading" | "listening" | "writing";

function normalizeQuizTrack(value: string | null): QuizTrack {
  if (value === "listening" || value === "writing") {
    return value;
  }
  return "reading";
}

interface ChapterLesson {
  id: string;
  thaiWord: string;
  phonetic: string;
  englishTranslation: string;
  options: string[];
  correctOption: string;
}

function normalizeOptions(options: string[], correctOption: string): string[] {
  const unique = Array.from(new Set([...options.filter(Boolean), correctOption]));
  return unique.length > 0 ? unique : [correctOption];
}

function toChapterLesson(value: unknown): ChapterLesson | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const item = value as Record<string, unknown>;
  const id = typeof item.id === "string" ? item.id.trim() : "";
  const thaiWord = typeof item.thaiWord === "string" ? item.thaiWord.trim() : "";
  const phonetic = typeof item.phonetic === "string" ? item.phonetic.trim() : "";
  const englishTranslation =
    typeof item.meaning === "string" ? item.meaning.trim() : "";

  if (!id || !thaiWord || !phonetic || !englishTranslation) {
    return null;
  }

  const options = Array.isArray(item.options)
    ? item.options.filter((option): option is string => typeof option === "string")
    : [];
  const correctOption =
    typeof item.correctOption === "string" && item.correctOption.trim()
      ? item.correctOption.trim()
      : englishTranslation;

  return {
    id,
    thaiWord,
    phonetic,
    englishTranslation,
    options: normalizeOptions(options, correctOption),
    correctOption,
  };
}

function toFallbackLessons(chapterId: string): ChapterLesson[] {
  const chapter = getChapterById(chapterId);
  if (!chapter) {
    return [];
  }

  return chapter.lessons.map((lesson) => ({
    id: lesson.id,
    thaiWord: lesson.thaiWord,
    phonetic: lesson.phonetic,
    englishTranslation: lesson.englishTranslation,
    options: normalizeOptions(lesson.options, lesson.correctOption),
    correctOption: lesson.correctOption,
  }));
}

export default function ChapterPracticePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const moduleId = params?.moduleId as string;
  const chapterId = params?.chapterId as string;
  const router = useRouter();
  const quizTrack = normalizeQuizTrack(searchParams.get("quizType"));
  const isListeningQuiz = quizTrack === "listening";
  const isWritingTrack = quizTrack === "writing";

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isChapterComplete, setIsChapterComplete] = useState(false);
  const [savingCompletion, setSavingCompletion] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasInk, setHasInk] = useState(false);
  const [writingResult, setWritingResult] = useState<WritingResult | null>(null);
  const [isSpeakingWord, setIsSpeakingWord] = useState<string | null>(null);
  const [lessons, setLessons] = useState<ChapterLesson[]>([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(true);
  const [lessonsError, setLessonsError] = useState<string | null>(null);

  const { completeModule, completedMilestones } = useMilestones();

  const chapter = useMemo(() => {
    const moduleData = MODULES.find((module) => module.id === moduleId);
    const chapterData = moduleData?.chapters.find((item) => item.id === chapterId);
    if (!moduleData || !chapterData) {
      return null;
    }

    return {
      id: chapterData.id,
      moduleId: moduleData.id,
      title: chapterData.title,
      order: chapterData.order,
    };
  }, [chapterId, moduleId]);

  const currentLesson = lessons[currentIndex] ?? null;
  const progress = lessons.length > 0 ? ((currentIndex + 1) / lessons.length) * 100 : 0;
  const selectedTrackLabel = isWritingTrack ? "WRITING QUIZ" : "READING QUIZ";

  useEffect(() => {
    if (!chapter || chapter.moduleId !== moduleId) {
      return;
    }

    const controller = new AbortController();
    const fallbackLessons = toFallbackLessons(chapterId);

    setLessons(fallbackLessons);
    setIsLoadingLessons(true);
    setLessonsError(null);

    const loadLessons = async () => {
      try {
        const params = new URLSearchParams({
          moduleId,
          chapterId,
        });

        const response = await fetch(`/api/vocabulary?${params.toString()}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        const payload = (await response.json()) as {
          words?: unknown[];
          error?: string;
          warning?: string;
          databaseUnavailable?: boolean;
        };

        if (!response.ok) {
          throw new Error(payload.error ?? "Failed to load chapter words.");
        }

        const dbLessons = Array.isArray(payload.words)
          ? payload.words
              .map((word) => toChapterLesson(word))
              .filter((word): word is ChapterLesson => word !== null)
          : [];

        if (dbLessons.length > 0) {
          setLessons(dbLessons);
          setLessonsError(null);
          return;
        }

        if (payload.databaseUnavailable) {
          setLessonsError(payload.warning ?? "Vocabulary backend is unavailable.");
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setLessonsError(
          error instanceof Error
            ? error.message
            : "Failed to load chapter words."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingLessons(false);
        }
      }
    };

    loadLessons();

    return () => {
      controller.abort();
    };
  }, [chapter, chapterId, moduleId]);

  useEffect(() => {
    if (!chapter || chapter.moduleId !== moduleId) {
      router.push(`/learn/${moduleId}?quizType=${quizTrack}`);
      return;
    }

    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setWritingResult(null);
    setHasInk(false);
  }, [chapter, isWritingTrack, moduleId, quizTrack, router]);

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setWritingResult(null);
    setHasInk(false);
  }, [chapterId, isWritingTrack, lessons.length]);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!isWritingTrack) return;

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
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#1a1a1a";
    ctx.clearRect(0, 0, width, height);
    setHasInk(false);
    setWritingResult(null);
  }, [isWritingTrack, currentIndex]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!chapter || chapter.moduleId !== moduleId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7]">
        <div className="text-neutral-500">Loading chapter...</div>
      </div>
    );
  }

  if (isLoadingLessons && lessons.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7]">
        <div className="text-neutral-500">Loading chapter words...</div>
      </div>
    );
  }

  if (!currentLesson) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7] px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-[0_8px_30px_rgb(0,0,0,0.05)] sm:p-10">
          <h1 className="text-2xl font-extrabold text-[#1D1D1F]">No words available</h1>
          <p className="mt-2 text-sm text-neutral-600">
            {lessonsError ?? "This chapter has no vocabulary in MongoDB yet."}
          </p>
          <button
            onClick={() => router.push(`/learn/${moduleId}?quizType=${quizTrack}`)}
            className="duo-btn-secondary mt-6 w-full px-4 py-3 text-sm"
          >
            Back to Level Chapters
          </button>
        </div>
      </div>
    );
  }

  if (isListeningQuiz) {
    return (
      <div className="duo-shell min-h-screen">
        <AppHeader />
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-4 px-4 py-16 text-center">
          <div className="w-full text-left">
            <BackToPreviousButton
              fallbackHref={`/learn/${moduleId}?quizType=${quizTrack}`}
            />
          </div>
          <div className="duo-card w-full max-w-xl p-8">
            <h1 className="text-2xl font-extrabold text-[#2c5015]">Listening Quiz (Dummy)</h1>
            <p className="mt-2 text-sm text-[#4d6b3a]">
              Listening quiz is not implemented yet. Please use Reading Quiz or Writing Quiz for this chapter.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => router.push(`/learn/${moduleId}?quizType=reading`)}
                className="duo-btn-primary px-4 py-2 text-sm"
              >
                Go to Reading Quiz
              </button>
              <button
                onClick={() => router.push(`/learn/${moduleId}?quizType=writing`)}
                className="duo-btn-secondary px-4 py-2 text-sm"
              >
                Go to Writing Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const speakThai = (text: string) => {
    setIsSpeakingWord(text);
    playThaiAudio(text)
      .catch(() => undefined)
      .finally(() => setIsSpeakingWord(null));
  };

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
    setWritingResult(null);
  };

  const handleCheckWriting = () => {
    if (!hasInk) return;
    checkWriting();
  };

  const checkWriting = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setWritingResult(
      evaluateWritingCanvas({
        canvas,
        hasInk,
        targetText: currentLesson.thaiWord,
      })
    );
  };

  const goToWord = (index: number) => {
    setCurrentIndex(index);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setWritingResult(null);
  };

  const handlePrevWord = () => {
    if (currentIndex === 0) return;
    goToWord(currentIndex - 1);
  };

  const handleNextWord = () => {
    if (currentIndex + 1 >= lessons.length) return;
    goToWord(currentIndex + 1);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption) return;
    const correct = selectedOption === currentLesson.correctOption;
    setIsCorrect(correct);
    setIsAnswered(true);
  };

  const handleNextQuiz = async () => {
    if (currentIndex + 1 < lessons.length) {
      handleNextWord();
      return;
    }

    setSavingCompletion(true);
    try {
      if (!completedMilestones.includes(chapter.id)) {
        await completeModule(chapter.id);
      }
      setIsChapterComplete(true);
    } catch (error) {
      console.error("Error completing chapter:", error);
    } finally {
      setSavingCompletion(false);
    }
  };

  const nextChapterId = getNextChapterId(chapter.id);
  const nextInModule =
    nextChapterId && getModuleByChapterId(nextChapterId)?.id === moduleId
      ? nextChapterId
      : null;

  if (isChapterComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7] px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.05)] sm:p-10">
          <h1 className="mb-2 text-center text-2xl font-extrabold text-[#1D1D1F]">
            Chapter Complete
          </h1>
          <p className="mb-6 text-center text-sm text-neutral-600">
            Great work on {chapter.title}. Ready for the next step?
          </p>

          <div className="space-y-3">
            {nextInModule ? (
              <button
                onClick={() =>
                  router.push(`/learn/${moduleId}/chapter/${nextInModule}?quizType=${quizTrack}`)
                }
                className="duo-btn-primary w-full px-4 py-3 text-sm"
              >
                Continue to Next Chapter
              </button>
            ) : null}
            <button
              onClick={() => router.push(`/learn/${moduleId}?quizType=${quizTrack}`)}
              className="duo-btn-secondary w-full px-4 py-3 text-sm"
            >
              Back to Level Chapters
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full px-4 py-2 text-xs font-bold text-[#5a7c45] hover:text-[#2c5015]"
            >
              ← Back to Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="duo-shell min-h-screen">
      <AppHeader />
      <div className="mx-auto w-full max-w-6xl px-4 pt-4 sm:px-6">
        <BackToPreviousButton fallbackHref={`/learn/${moduleId}?quizType=${quizTrack}`} />
      </div>
      <div className="border-b-2 border-[#d7f4c9] bg-[#f6ffef]/95">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#7f9f69]">
              {chapter.title}
            </p>
            <p className="text-xs font-bold text-[#4f7340] sm:text-sm">
              Word {currentIndex + 1} of {lessons.length} • {selectedTrackLabel}
            </p>
          </div>
          <div className="flex-1 px-2">
            <div className="h-2.5 overflow-hidden rounded-full bg-[#e8f9db]">
              <div
                className="h-full bg-[#58cc02] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <button
            onClick={() => router.push(`/learn/${moduleId}?quizType=${quizTrack}`)}
            className="duo-btn-secondary px-3 py-2 text-xs sm:px-4 sm:text-sm"
          >
            Chapters
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-5 flex justify-end">
          <button
            onClick={() =>
              router.push(
                `/vocabulary?level=${moduleId}&chapter=${chapter.id}&chapterOrder=${chapter.order}`
              )
            }
            className="duo-btn-secondary px-4 py-2 text-sm"
          >
            Open Vocabulary Page
          </button>
        </div>

        {!isWritingTrack ? (
          <>
            <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr]">
              <div className="duo-card p-6 sm:p-8">
                <p className="mb-4 text-center text-xs font-extrabold uppercase tracking-wide text-[#7f9f69] sm:text-sm">
                  What does this word mean?
                </p>
                <h2 className="mb-3 text-center text-4xl font-extrabold tracking-tight text-[#2c5015] sm:text-5xl">
                  {currentLesson.thaiWord}
                </h2>
                <p className="mb-4 text-center text-base font-bold text-[#5a7c45] sm:text-lg">
                  {currentLesson.phonetic}
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => speakThai(currentLesson.thaiWord)}
                    className="rounded-full border border-[#bfe89f] bg-white px-3 py-1 text-xs font-extrabold text-[#3e7422]"
                  >
                    {isSpeakingWord === currentLesson.thaiWord ? "Playing..." : "Listen"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {currentLesson.options.map((option) => {
                  const isSelected = selectedOption === option;
                  const optionCorrect = option === currentLesson.correctOption;
                  let classes =
                    "rounded-2xl border-2 border-b-[6px] px-4 py-4 text-sm font-extrabold transition-all";

                  if (isAnswered) {
                    if (optionCorrect) {
                      classes += " border-[#9be35d] bg-[#f3ffe9] text-[#356b16]";
                    } else if (isSelected && !isCorrect) {
                      classes += " border-red-300 bg-red-50 text-red-800";
                    } else {
                      classes += " border-neutral-200/60 bg-neutral-50 text-neutral-500 opacity-50";
                    }
                  } else {
                    classes += isSelected
                      ? " border-[#8cdb4d] bg-[#f7ffe6] text-[#2c5015]"
                      : " border-[#d7f4c9] bg-white text-[#2c5015] hover:border-[#8cdb4d]";
                  }

                  return (
                    <button
                      key={option}
                      onClick={() => !isAnswered && setSelectedOption(option)}
                      disabled={isAnswered}
                      className={classes}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            {isAnswered ? (
              <div className="mt-5 text-center text-sm font-medium">
                {isCorrect ? (
                  <span className="font-extrabold text-[#4aac07]">Correct</span>
                ) : (
                  <span className="text-red-600">
                    Not quite. Correct answer: <strong>{currentLesson.correctOption}</strong>
                  </span>
                )}
              </div>
            ) : null}
          </>
        ) : null}

        {isWritingTrack ? (
          <div className="mx-auto max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#d7f4c9] bg-white px-5 py-4">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-[#2c5015]">{currentLesson.thaiWord}</span>
                <span className="text-base font-bold text-[#5a7c45]">{currentLesson.phonetic}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {currentLesson.thaiWord.length > 1
                  ? currentLesson.thaiWord.split("").map((char, index) => (
                      <span
                        key={`${char}-${index}`}
                        className="h-9 w-9 rounded-xl bg-[#f0fae6] text-center text-lg font-extrabold leading-9 text-[#2c5015]"
                      >
                        {char}
                      </span>
                    ))
                  : null}
                <button
                  onClick={() => speakThai(currentLesson.thaiWord)}
                  className="rounded-full border border-[#bfe89f] bg-[#f6ffef] px-4 py-1.5 text-xs font-extrabold text-[#3e7422] hover:bg-[#e5f9d0]"
                >
                  {isSpeakingWord === currentLesson.thaiWord ? "Playing..." : "▶ Listen"}
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border-2 border-[#d7f4c9] bg-white">
              <div className="relative aspect-square w-full">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-x-0 top-1/2 h-px bg-[#d7f4c9]" />
                  <div className="absolute inset-y-0 left-1/2 w-px bg-[#d7f4c9]" />
                  <div className="absolute inset-x-0 top-1/4 h-px bg-[#edfbe1]" />
                  <div className="absolute inset-x-0 top-3/4 h-px bg-[#edfbe1]" />
                  <div className="absolute inset-y-0 left-1/4 w-px bg-[#edfbe1]" />
                  <div className="absolute inset-y-0 left-3/4 w-px bg-[#edfbe1]" />
                </div>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span
                    className="select-none font-extrabold leading-none text-[#2c5015]/10"
                    style={{ fontSize: "clamp(80px, 18vmin, 180px)" }}
                  >
                    {currentLesson.thaiWord}
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

              {writingResult ? (
                <div
                  className={`flex items-center justify-between gap-3 border-t px-5 py-3 ${
                    writingResult.passed
                      ? "border-[#bbf7d0] bg-[#f0fdf4]"
                      : "border-[#fed7aa] bg-[#fff7ed]"
                  }`}
                >
                  <div>
                    <p className={`text-sm font-extrabold ${writingResult.passed ? "text-[#16a34a]" : "text-[#d97706]"}`}>
                      {writingResult.passed ? "Good shape!" : "Keep practicing"}
                    </p>
                    <p className="text-xs text-neutral-400">
                      Score {Math.round(writingResult.score * 100)}% · Coverage {Math.round(writingResult.coverage * 100)}% · Precision {Math.round(writingResult.precision * 100)}%
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={clearCanvas}
                      className="rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-bold text-neutral-600 hover:bg-neutral-50"
                    >
                      Try Again
                    </button>
                    {writingResult.passed && (
                      <button
                        onClick={handleNextWord}
                        disabled={currentIndex + 1 >= lessons.length}
                        className="duo-btn-primary px-4 py-1.5 text-xs disabled:opacity-50"
                      >
                        Next Word →
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between border-t border-[#e8f9db] bg-[#fbfffa] px-5 py-3">
                  <p className="text-xs text-neutral-400">
                    {isDrawing ? "Drawing…" : "Write the full word naturally, then check accuracy."}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={clearCanvas}
                      className="rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-bold text-neutral-500 hover:bg-neutral-50"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleCheckWriting}
                      disabled={!hasInk}
                      className="duo-btn-primary px-4 py-1.5 text-xs disabled:opacity-50"
                    >
                      Check Accuracy
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {isWritingTrack ? (
        <div className="sticky bottom-0 left-0 right-0 border-t-2 border-[#d7f4c9] bg-[#f6ffef]/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:px-6">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3">
            <button
              onClick={handlePrevWord}
              disabled={currentIndex === 0}
              className="duo-btn-secondary px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous Word
            </button>
            <button
              onClick={() =>
                currentIndex + 1 >= lessons.length ? handleNextQuiz() : handleNextWord()
              }
              className="duo-btn-primary px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              {currentIndex + 1 >= lessons.length
                ? savingCompletion
                  ? "Saving..."
                  : "Complete Chapter"
                : "Next Word"}
            </button>
          </div>
        </div>
      ) : !isAnswered ? (
        <div className="sticky bottom-0 left-0 right-0 border-t-2 border-[#d7f4c9] bg-[#f6ffef]/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:px-6">
          <div className="mx-auto flex w-full max-w-6xl justify-center">
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
        <div className="sticky bottom-0 left-0 right-0 border-t-2 border-[#d7f4c9] bg-[#f6ffef]/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:px-6">
          <div className="mx-auto flex w-full max-w-6xl justify-center">
            <button
              onClick={handleNextQuiz}
              disabled={savingCompletion}
              className="duo-btn-primary w-full px-8 py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
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
