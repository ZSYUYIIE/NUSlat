"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useMilestones } from "@/hooks/useMilestones";
import AppHeader from "@/components/AppHeader";
import { getChapterById } from "@/data/chapters";
import { MODULES, getNextChapterId, getModuleByChapterId } from "@/lib/modules";
import { getCharacterStrokeGuide } from "@/lib/strokes";
import { playThaiAudio } from "@/lib/audio";

type PracticeMode = "quiz" | "writing";
type WritingSection = "learn" | "quiz";
type QuizTrack = "reading" | "listening" | "writing";

function normalizeQuizTrack(value: string | null): QuizTrack {
  if (value === "listening" || value === "writing") {
    return value;
  }
  return "reading";
}

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

  const [practiceMode, setPracticeMode] = useState<PracticeMode>("quiz");
  const [writingSection, setWritingSection] = useState<WritingSection>("learn");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [strokeStepIndex, setStrokeStepIndex] = useState(0);
  const [completedCharIndexes, setCompletedCharIndexes] = useState<number[]>([]);
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
  const characters = useMemo(
    () => (currentLesson?.thaiWord ? currentLesson.thaiWord.split("") : []),
    [currentLesson?.thaiWord]
  );
  const selectedCharacter = characters[currentCharIndex] ?? characters[0] ?? "";
  const strokeSteps = getCharacterStrokeGuide(selectedCharacter);
  const selectedTrackLabel =
    isListeningQuiz ? "LISTENING QUIZ" : isWritingTrack ? "WRITING QUIZ" : "READING QUIZ";
  const quizPrompt = isListeningQuiz
    ? "Listen and choose the meaning"
    : "What does this word mean?";
  const hideWordUntilAnswered = isListeningQuiz && !isAnswered;
  const firstIncompleteCharIndex = useMemo(() => {
    if (characters.length === 0) {
      return 0;
    }

    const completed = new Set(completedCharIndexes);
    for (let i = 0; i < characters.length; i += 1) {
      if (!completed.has(i)) {
        return i;
      }
    }

    return characters.length - 1;
  }, [characters, completedCharIndexes]);
  const isLearningWordComplete =
    characters.length > 0 &&
    characters.every((_, index) => completedCharIndexes.includes(index));

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
    setPracticeMode(isWritingTrack ? "writing" : "quiz");
    setWritingSection(isWritingTrack ? "quiz" : "learn");
    setCompletedCharIndexes([]);
    setHasInk(false);
    setCurrentCharIndex(0);
    setStrokeStepIndex(0);
  }, [chapter, isWritingTrack, moduleId, quizTrack, router]);

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setWritingResult(null);
    setPracticeMode(isWritingTrack ? "writing" : "quiz");
    setWritingSection(isWritingTrack ? "quiz" : "learn");
    setCompletedCharIndexes([]);
    setHasInk(false);
    setCurrentCharIndex(0);
    setStrokeStepIndex(0);
  }, [chapterId, isWritingTrack, lessons.length]);

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
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#1a1a1a";
    ctx.clearRect(0, 0, width, height);
    setHasInk(false);
    setWritingResult(null);
  }, [practiceMode, currentIndex, writingSection]);

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
    setCompletedCharIndexes([]);
  }, [currentIndex]);

  useEffect(() => {
    setStrokeStepIndex(0);
  }, [currentCharIndex]);

  useEffect(() => {
    if (!isListeningQuiz) return;
    if (practiceMode !== "quiz") return;
    if (!currentLesson?.thaiWord) return;

    setIsSpeakingWord(currentLesson.thaiWord);
    playThaiAudio(currentLesson.thaiWord)
      .catch(() => undefined)
      .finally(() => setIsSpeakingWord(null));
  }, [currentIndex, currentLesson?.thaiWord, isListeningQuiz, practiceMode]);

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

  const goToCharacterInOrder = (index: number) => {
    if (index > firstIncompleteCharIndex) {
      return;
    }

    setCurrentCharIndex(index);
    setStrokeStepIndex(0);
    clearCanvas();
  };

  const completeLearnStroke = () => {
    if (!hasInk) {
      return;
    }

    const isLastStroke = strokeStepIndex >= strokeSteps.length - 1;

    if (!isLastStroke) {
      setStrokeStepIndex((prev) => prev + 1);
      clearCanvas();
      return;
    }

    setCompletedCharIndexes((prev) =>
      prev.includes(currentCharIndex) ? prev : [...prev, currentCharIndex]
    );

    if (currentCharIndex < characters.length - 1) {
      setCurrentCharIndex((prev) => prev + 1);
      setStrokeStepIndex(0);
    }

    clearCanvas();
  };

  const checkWriting = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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
        <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl border border-[#d7f4c9] bg-[#f8ffef] p-2 sm:max-w-xs">
          <button
            onClick={() => setPracticeMode("quiz")}
            className={`rounded-xl px-3 py-2 text-xs font-extrabold transition-colors sm:text-sm ${
              practiceMode === "quiz" ? "bg-[#58cc02] text-white" : "bg-white text-[#4d6b3a]"
            }`}
          >
            {isListeningQuiz ? "Listening" : "Reading"}
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

        {practiceMode === "quiz" ? (
          <>
            <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr]">
              <div className="duo-card p-6 sm:p-8">
                <p className="mb-4 text-center text-xs font-extrabold uppercase tracking-wide text-[#7f9f69] sm:text-sm">
                  {quizPrompt}
                </p>
                <h2 className="mb-3 text-center text-4xl font-extrabold tracking-tight text-[#2c5015] sm:text-5xl">
                  {hideWordUntilAnswered ? "•••" : currentLesson.thaiWord}
                </h2>
                <p className="mb-4 text-center text-base font-bold text-[#5a7c45] sm:text-lg">
                  {hideWordUntilAnswered ? "Listen carefully" : currentLesson.phonetic}
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => speakThai(currentLesson.thaiWord)}
                    className="rounded-full border border-[#bfe89f] bg-white px-3 py-1 text-xs font-extrabold text-[#3e7422]"
                  >
                    {isSpeakingWord === currentLesson.thaiWord
                      ? "Playing..."
                      : isListeningQuiz
                      ? "Play Again"
                      : "Listen"}
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
          <div className="mx-auto max-w-4xl space-y-4">
            <div className="grid grid-cols-2 gap-2 rounded-2xl border border-[#d7f4c9] bg-[#f8ffef] p-2 sm:max-w-xs">
              <button
                onClick={() => {
                  setWritingSection("learn");
                  setCompletedCharIndexes([]);
                  setCurrentCharIndex(0);
                  setStrokeStepIndex(0);
                  clearCanvas();
                }}
                className={`rounded-xl px-3 py-2 text-xs font-extrabold transition-colors sm:text-sm ${
                  writingSection === "learn"
                    ? "bg-[#58cc02] text-white"
                    : "bg-white text-[#4d6b3a]"
                }`}
              >
                Learn Strokes
              </button>
              <button
                onClick={() => {
                  setWritingSection("quiz");
                  clearCanvas();
                }}
                className={`rounded-xl px-3 py-2 text-xs font-extrabold transition-colors sm:text-sm ${
                  writingSection === "quiz"
                    ? "bg-[#58cc02] text-white"
                    : "bg-white text-[#4d6b3a]"
                }`}
              >
                Writing Quiz
              </button>
            </div>

            {/* Word info bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#d7f4c9] bg-white px-5 py-4">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-[#2c5015]">{currentLesson.thaiWord}</span>
                <span className="text-base font-bold text-[#5a7c45]">{currentLesson.phonetic}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {characters.length > 1 && characters.map((char, index) => (
                  <button
                    key={`${char}-${index}`}
                    onClick={() =>
                      writingSection === "learn"
                        ? goToCharacterInOrder(index)
                        : setCurrentCharIndex(index)
                    }
                    disabled={writingSection === "learn" && index > firstIncompleteCharIndex}
                    className={`h-9 w-9 rounded-xl text-lg font-extrabold transition-colors ${
                      index === currentCharIndex
                        ? "bg-[#58cc02] text-white"
                        : writingSection === "learn" && completedCharIndexes.includes(index)
                        ? "bg-[#e9fdd6] text-[#2c5015]"
                        : "bg-[#f0fae6] text-[#2c5015] hover:bg-[#d7f4c9]"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {char}
                  </button>
                ))}
                <button
                  onClick={() => speakThai(currentLesson.thaiWord)}
                  className="rounded-full border border-[#bfe89f] bg-[#f6ffef] px-4 py-1.5 text-xs font-extrabold text-[#3e7422] hover:bg-[#e5f9d0]"
                >
                  {isSpeakingWord === currentLesson.thaiWord ? "Playing..." : "▶ Listen"}
                </button>
              </div>
            </div>

            {/* Canvas + stroke guide */}
            <div
              className={`grid gap-4 ${
                writingSection === "learn" ? "lg:grid-cols-[1fr_280px]" : ""
              }`}
            >
              {/* Drawing canvas card */}
              <div className="overflow-hidden rounded-3xl border-2 border-[#d7f4c9] bg-white">
                <div className="relative aspect-square w-full">
                  {/* Guideline grid */}
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-x-0 top-1/2 h-px bg-[#d7f4c9]" />
                    <div className="absolute inset-y-0 left-1/2 w-px bg-[#d7f4c9]" />
                    <div className="absolute inset-x-0 top-1/4 h-px bg-[#edfbe1]" />
                    <div className="absolute inset-x-0 top-3/4 h-px bg-[#edfbe1]" />
                    <div className="absolute inset-y-0 left-1/4 w-px bg-[#edfbe1]" />
                    <div className="absolute inset-y-0 left-3/4 w-px bg-[#edfbe1]" />
                  </div>
                  {/* Ghost character */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span
                      className="select-none font-extrabold leading-none text-[#2c5015]/10"
                      style={{ fontSize: "clamp(80px, 18vmin, 180px)" }}
                    >
                      {writingSection === "learn" ? selectedCharacter : currentLesson.thaiWord}
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

                {/* Result / hint bar below canvas */}
                {writingSection === "learn" ? (
                  <div className="flex items-center justify-between gap-3 border-t border-[#e8f9db] bg-[#fbfffa] px-5 py-3">
                    <div>
                      <p className="text-sm font-extrabold text-[#2c5015]">
                        Stroke {Math.min(strokeStepIndex + 1, strokeSteps.length)} of {strokeSteps.length}
                      </p>
                      <p className="text-xs text-[#6f8f58]">
                        {strokeSteps[Math.min(strokeStepIndex, strokeSteps.length - 1)]}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={clearCanvas}
                        className="rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-bold text-neutral-600 hover:bg-neutral-50"
                      >
                        Clear
                      </button>
                      <button
                        onClick={completeLearnStroke}
                        disabled={!hasInk || isLearningWordComplete}
                        className="duo-btn-primary px-4 py-1.5 text-xs disabled:opacity-50"
                      >
                        {strokeStepIndex >= strokeSteps.length - 1
                          ? "Finish Character"
                          : "Next Stroke"}
                      </button>
                    </div>
                  </div>
                ) : writingResult ? (
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
                      {isDrawing
                        ? "Drawing…"
                        : "Write the full word naturally, then check pixel recognition."}
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

              {writingSection === "learn" ? (
                <div className="rounded-3xl border border-[#d7f4c9] bg-[#f8fff4] p-4">
                  <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-[#7f9f69]">
                    Stroke Order Learning
                  </p>
                  <div className="mb-4 flex items-center justify-center rounded-2xl bg-white py-5 shadow-sm">
                    <span className="text-7xl font-extrabold text-[#2c5015]">{selectedCharacter}</span>
                  </div>
                  <div className="space-y-2">
                    {strokeSteps.map((step, index) => (
                      <div
                        key={`${selectedCharacter}-${index}`}
                        className={`flex w-full items-start gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs ${
                          index === strokeStepIndex
                            ? "bg-[#58cc02] text-white"
                            : index < strokeStepIndex
                            ? "bg-[#e9fdd6] text-[#2c5015]"
                            : "border border-neutral-100 bg-white text-neutral-400"
                        }`}
                      >
                        <span className="shrink-0 font-extrabold">{index + 1}.</span>
                        <span className={index === strokeStepIndex ? "font-bold" : ""}>{step}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-[#8aad73]">
                    Follow each stroke in order. Complete one stroke before moving to the next.
                  </p>
                  <p className="mt-1 text-xs font-bold text-[#5c8046]">
                    Character progress: {completedCharIndexes.length}/{characters.length}
                  </p>
                </div>
              ) : null}
            </div>

            {writingSection === "learn" && isLearningWordComplete ? (
              <div className="rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3">
                <p className="text-sm font-extrabold text-[#166534]">
                  Stroke-order learning complete for this word.
                </p>
                <p className="text-xs text-[#26724f]">
                  Continue to the next word, or switch to Writing Quiz to check pixel-level recognition.
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {practiceMode === "writing" ? (
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
              disabled={
                currentIndex + 1 >= lessons.length ||
                (writingSection === "learn" && !isLearningWordComplete)
              }
              className="duo-btn-primary px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              {writingSection === "learn" && !isLearningWordComplete
                ? "Finish Strokes First"
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
