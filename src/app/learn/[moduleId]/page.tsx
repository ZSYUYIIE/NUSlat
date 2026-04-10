"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useMilestones } from "@/hooks/useMilestones";
import { getLessonsByModule, type LessonItem } from "@/data/lessons";

export default function LearnPage() {
  const params = useParams();
  const moduleId = params?.moduleId as string;
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const { completeModule } = useMilestones();

  const lessons: LessonItem[] = useMemo(() => {
    if (!moduleId) {
      return [];
    }
    return getLessonsByModule(moduleId);
  }, [moduleId]);

  useEffect(() => {
    if (!moduleId) {
      router.push("/dashboard");
      return;
    }

    const lessonData = getLessonsByModule(moduleId);
    if (lessonData.length === 0) {
      router.push("/dashboard");
      return;
    }
  }, [moduleId, router]);

  if (!moduleId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7]">
        <div className="text-neutral-500">Loading lesson...</div>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7]">
        <div className="text-neutral-500">No lessons found</div>
      </div>
    );
  }

  const currentLesson = lessons[currentIndex];
  const progress = ((currentIndex + 1) / lessons.length) * 100;

  const handleExit = () => {
    if (confirm("Are you sure you want to exit this lesson?")) {
      router.push("/dashboard");
    }
  };

  const handleCheckAnswer = () => {
    if (!selectedOption) return;

    const correct =
      selectedOption === currentLesson.englishTranslation;
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
      // Lesson complete
      setIsComplete(true);
      try {
        await completeModule(moduleId);
      } catch (error) {
        console.error("Error completing module:", error);
      }
    }
  };

  if (isComplete) {
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
              Module Complete!
            </h1>

            <p className="mb-8 text-center text-sm text-neutral-500">
              Great job! You&apos;ve completed all {lessons.length} lessons. Your
              progress has been saved.
            </p>

            <button
              onClick={() => router.push("/dashboard")}
              className="w-full rounded-2xl bg-[#1D1D1F] px-4 py-3 text-sm font-medium text-white shadow-[0_4px_14px_rgb(0,0,0,0.12)] transition-transform duration-300 hover:scale-[1.01] hover:opacity-90 active:scale-95"
            >
              Back to Dashboard
            </button>
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
              {currentIndex + 1} of {lessons.length}
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

          {/* Options Grid */}
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {currentLesson.options.map((option) => {
              const isSelected = selectedOption === option;
              let buttonClasses =
                "rounded-2xl border-2 px-4 py-4 text-sm font-extrabold transition-all duration-200 min-h-12 border-b-[6px]";

              if (isAnswered) {
                const isOptionCorrect =
                  option === currentLesson.englishTranslation;
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
                  <strong>{currentLesson.englishTranslation}</strong>
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
            className="duo-btn-primary w-full px-8 py-3.5 text-sm sm:w-auto"
          >
            {currentIndex + 1 === lessons.length ? "Complete Module" : "Next"}
          </button>
          </div>
        </div>
      )}
    </div>
  );
}
