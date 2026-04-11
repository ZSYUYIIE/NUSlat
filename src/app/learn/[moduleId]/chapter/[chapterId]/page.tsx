"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useMilestones } from "@/hooks/useMilestones";
import AppHeader from "@/components/AppHeader";
import { getChapterById } from "@/data/chapters";
import { getNextChapterId, getModuleByChapterId } from "@/lib/modules";
import { getCharacterStrokeGuide } from "@/lib/strokes";
import { playThaiAudio } from "@/lib/audio";

type PracticeMode = "quiz" | "writing";

// Writing evaluation thresholds — adjust these to tune difficulty.
const WRITING_THRESHOLDS = {
  /** Fraction of the template character that must be covered by user strokes. */
  coverage: 0.24,
  /** Fraction of user strokes that must fall on the template character. */
  precision: 0.20,
  /** How close the user's ink density is to the template (1 = perfect). */
  legibility: 0.45,
  /** Weighted composite score: coverage×0.64 + precision×0.26 + legibility×0.10. */
  score: 0.32,
} as const;

interface WritingResult {
  score: number;
  coverage: number;
  precision: number;
  legibility: number;
  passed: boolean;
}

export default function ChapterPracticePage() {
  const params = useParams();
  const moduleId = params?.moduleId as string;
  const chapterId = params?.chapterId as string;
  const router = useRouter();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [practiceMode, setPracticeMode] = useState<PracticeMode>("quiz");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [strokeStepIndex, setStrokeStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isChapterComplete, setIsChapterComplete] = useState(false);
  const [savingCompletion, setSavingCompletion] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasInk, setHasInk] = useState(false);
  const [writingResult, setWritingResult] = useState<WritingResult | null>(null);
  const [isSpeakingWord, setIsSpeakingWord] = useState<string | null>(null);

  const { completeModule, completedMilestones } = useMilestones();

  const chapter = useMemo(() => getChapterById(chapterId), [chapterId]);

  const lessons = chapter?.lessons ?? [];
  const currentLesson = lessons[currentIndex] ?? null;
  const progress = lessons.length > 0 ? ((currentIndex + 1) / lessons.length) * 100 : 0;
  const characters = currentLesson?.thaiWord.split("") ?? [];
  const selectedCharacter = characters[currentCharIndex] ?? characters[0] ?? "";
  const strokeSteps = getCharacterStrokeGuide(selectedCharacter);

  useEffect(() => {
    if (!chapter || chapter.moduleId !== moduleId) {
      router.push(`/learn/${moduleId}`);
      return;
    }

    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setWritingResult(null);
    setPracticeMode("quiz");
    setStrokeStepIndex(0);
  }, [chapter, moduleId, router]);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (practiceMode !== "writing") return;

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
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#eef8d8";
    ctx.clearRect(0, 0, width, height);
    setHasInk(false);
    setWritingResult(null);
  }, [practiceMode, currentIndex]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    setCurrentCharIndex(0);
    setStrokeStepIndex(0);
  }, [currentIndex]);

  useEffect(() => {
    setStrokeStepIndex(0);
  }, [currentCharIndex]);

  if (!chapter || chapter.moduleId !== moduleId || !currentLesson) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7]">
        <div className="text-neutral-500">Loading chapter...</div>
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

  const checkWriting = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasInk) {
      setWritingResult({
        score: 0,
        coverage: 0,
        precision: 0,
        legibility: 0,
        passed: false,
      });
      return;
    }

    const userCtx = canvas.getContext("2d");
    if (!userCtx) return;

    const width = canvas.width;
    const height = canvas.height;
    const userData = userCtx.getImageData(0, 0, width, height).data;

    const templateCanvas = document.createElement("canvas");
    templateCanvas.width = width;
    templateCanvas.height = height;
    const templateCtx = templateCanvas.getContext("2d");
    if (!templateCtx) return;

    const ratio = window.devicePixelRatio || 1;
    const logicalWidth = width / ratio;
    const logicalHeight = height / ratio;
    templateCtx.scale(ratio, ratio);
    templateCtx.clearRect(0, 0, logicalWidth, logicalHeight);
    templateCtx.fillStyle = "#0b2f18";
    templateCtx.textAlign = "center";
    templateCtx.textBaseline = "middle";
    const fontSize = Math.min(logicalWidth / 2.4, logicalHeight * 0.52);
    templateCtx.font = `700 ${fontSize}px \"Noto Sans Thai\", \"Sarabun\", sans-serif`;
    templateCtx.fillText(currentLesson.thaiWord, logicalWidth / 2, logicalHeight / 2);

    const templateData = templateCtx.getImageData(0, 0, width, height).data;

    let targetPixels = 0;
    let userPixels = 0;
    let overlapPixels = 0;

    for (let i = 3; i < userData.length; i += 4) {
      const userInk = userData[i] > 24;
      const targetInk = templateData[i] > 24;

      if (targetInk) targetPixels += 1;
      if (userInk) userPixels += 1;
      if (userInk && targetInk) overlapPixels += 1;
    }

    const coverage = targetPixels > 0 ? overlapPixels / targetPixels : 0;
    const precision = userPixels > 0 ? overlapPixels / userPixels : 0;
    const density = targetPixels > 0 ? userPixels / targetPixels : 0;
    const legibility = Math.max(0, 1 - Math.max(0, Math.abs(1 - density)));
    const score = coverage * 0.64 + precision * 0.26 + legibility * 0.1;
    const passed =
      coverage >= WRITING_THRESHOLDS.coverage &&
      precision >= WRITING_THRESHOLDS.precision &&
      legibility >= WRITING_THRESHOLDS.legibility &&
      score >= WRITING_THRESHOLDS.score;

    setWritingResult({ score, coverage, precision, legibility, passed });
  };

  const goToWord = (index: number) => {
    setCurrentIndex(index);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setWritingResult(null);
    setStrokeStepIndex(0);
  };

  const moveToNextStrokeStep = () => {
    if (!hasInk) return;
    if (strokeStepIndex >= strokeSteps.length - 1) return;
    setStrokeStepIndex((prev) => prev + 1);
    setHasInk(false);
  };

  const moveToPrevStrokeStep = () => {
    if (strokeStepIndex === 0) return;
    setStrokeStepIndex((prev) => prev - 1);
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
                onClick={() => router.push(`/learn/${moduleId}/chapter/${nextInModule}`)}
                className="duo-btn-primary w-full px-4 py-3 text-sm"
              >
                Continue to Next Chapter
              </button>
            ) : null}
            <button
              onClick={() => router.push(`/learn/${moduleId}`)}
              className="duo-btn-secondary w-full px-4 py-3 text-sm"
            >
              Back to Level Chapters
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="duo-shell min-h-screen">
      <AppHeader />
      <div className="border-b-2 border-[#d7f4c9] bg-[#f6ffef]/95">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#7f9f69]">
              {chapter.title}
            </p>
            <p className="text-xs font-bold text-[#4f7340] sm:text-sm">
              Word {currentIndex + 1} of {lessons.length} • {practiceMode.toUpperCase()}
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
            onClick={() => router.push(`/learn/${moduleId}`)}
            className="duo-btn-secondary px-3 py-2 text-xs sm:px-4 sm:text-sm"
          >
            Chapters
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl border border-[#d7f4c9] bg-[#f8ffef] p-2 sm:max-w-xs">
          <button
            onClick={() => setPracticeMode("quiz")}
            className={`rounded-xl px-3 py-2 text-xs font-extrabold transition-colors sm:text-sm ${
              practiceMode === "quiz" ? "bg-[#58cc02] text-white" : "bg-white text-[#4d6b3a]"
            }`}
          >
            Quiz
          </button>
          <button
            onClick={() => setPracticeMode("writing")}
            className={`rounded-xl px-3 py-2 text-xs font-extrabold transition-colors sm:text-sm ${
              practiceMode === "writing" ? "bg-[#58cc02] text-white" : "bg-white text-[#4d6b3a]"
            }`}
          >
            Writing
          </button>
        </div>

        <div className="mb-5 flex justify-end">
          <button
            onClick={() => router.push(`/vocabulary?level=${moduleId}&chapter=${chapterId}`)}
            className="duo-btn-secondary px-4 py-2 text-sm"
          >
            Open Vocabulary Page
          </button>
        </div>

        {practiceMode === "quiz" ? (
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

        {practiceMode === "writing" ? (
          <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-3xl border-2 border-[#2f7a42] bg-[#184f2b] p-4 text-[#ecf9db] sm:p-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs font-extrabold uppercase tracking-wide text-[#b9e8c0]">
                  Character Stroke Guide
                </p>
                <button
                  onClick={() => speakThai(currentLesson.thaiWord)}
                  className="rounded-full border border-[#3f9155] bg-[#0f3f22] px-3 py-1 text-xs font-bold text-[#d7f8cd]"
                >
                  {isSpeakingWord === currentLesson.thaiWord ? "Playing..." : "Listen"}
                </button>
              </div>
              <div className="mb-3 flex flex-wrap gap-2">
                {characters.map((char, index) => (
                  <button
                    key={`${char}-${index}`}
                    onClick={() => setCurrentCharIndex(index)}
                    className={`rounded-full px-3 py-1 text-sm font-extrabold ${
                      index === currentCharIndex
                        ? "bg-[#9ee8a9] text-[#144223]"
                        : "bg-[#0f3f22] text-[#d7f8cd]"
                    }`}
                  >
                    {char}
                  </button>
                ))}
              </div>
              <p className="mb-2 text-sm">
                Focus character: <strong>{selectedCharacter}</strong>
              </p>
              <div className="mb-2 rounded-lg bg-[#0f3f22] px-2.5 py-2 text-xs font-bold text-[#d7f8cd]">
                Current stroke step: {strokeStepIndex + 1} / {strokeSteps.length}
              </div>
              <ol className="space-y-1.5 text-xs">
                {strokeSteps.map((step, index) => (
                  <li key={step} className="rounded-lg bg-[#0f3f22] px-2.5 py-1.5">
                    <span className={index === strokeStepIndex ? "font-extrabold text-[#9ee8a9]" : ""}>
                      Step {index + 1}: {step}
                    </span>
                  </li>
                ))}
              </ol>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={moveToPrevStrokeStep}
                  disabled={strokeStepIndex === 0}
                  className="rounded-full border border-[#3f9155] bg-[#0f3f22] px-3 py-1.5 text-xs font-bold text-[#d7f8cd] disabled:opacity-50"
                >
                  Previous Step
                </button>
                <button
                  onClick={moveToNextStrokeStep}
                  disabled={!hasInk || strokeStepIndex >= strokeSteps.length - 1}
                  className="rounded-full border border-[#97de9f] bg-[#c6f7b8] px-3 py-1.5 text-xs font-extrabold text-[#1a582d] disabled:opacity-50"
                >
                  Next Stroke Step
                </button>
              </div>
              <p className="mt-3 text-xs text-[#b9e8c0]">
                Practice one character first, then continue to the full word.
              </p>
            </div>

            <div className="rounded-3xl border-2 border-[#2f7a42] bg-[#184f2b] p-4 text-[#ecf9db] sm:p-6">
              <div className="relative mb-3 h-[34rem] w-full overflow-hidden rounded-2xl border-2 border-[#3c8d52] bg-[#0f3f22]">
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4">
                  <span className="select-none text-7xl font-extrabold tracking-wide text-[#2c7c40]/70 sm:text-8xl">
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

              <div className="mb-2 flex flex-wrap items-center gap-2">
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
                  Check Readability
                </button>
              </div>

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
                      ? "Readable enough for another person."
                      : "Not clear yet. Follow stroke order and reduce extra lines."}
                  </p>
                  <p className="mt-1">
                    Score: {Math.round(writingResult.score * 100)}% • Coverage: {Math.round(writingResult.coverage * 100)}% • Precision: {Math.round(writingResult.precision * 100)}% • Legibility: {Math.round(writingResult.legibility * 100)}%
                  </p>
                </div>
              ) : (
                <p className="text-xs text-[#b9e8c0]">
                  We estimate comprehensibility from shape overlap and writing density.
                </p>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {practiceMode !== "quiz" ? (
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
              onClick={handleNextWord}
              disabled={currentIndex + 1 >= lessons.length}
              className="duo-btn-primary px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next Word
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
