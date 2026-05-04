"use client";

import { useState, useCallback } from "react";
import type { QuizQuestion as AktQ } from "@/data/aanKhianThaiData";
import type { QuizQuestion as PtQ } from "@/data/phuutThaiData";

type QuizQuestion = AktQ | PtQ;

interface SectionQuizProps {
  questions: QuizQuestion[];
  sectionTitle: string;
  onComplete: () => void;
  onBackToLearn: () => void;
}

export default function SectionQuiz({
  questions,
  sectionTitle,
  onComplete,
  onBackToLearn,
}: SectionQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = questions[currentIndex];
  const progress = Math.round(((currentIndex + 1) / questions.length) * 100);

  const handleSelect = useCallback(
    (answer: string) => {
      if (isAnswered) return;
      setSelectedAnswer(answer);
      setIsAnswered(true);
      if (answer === current?.correctAnswer) {
        setCorrectCount((c) => c + 1);
      }
    },
    [isAnswered, current]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setFinished(true);
      const passed = correctCount / questions.length >= 0.6;
      if (passed) onComplete();
    }
  }, [currentIndex, questions.length, correctCount, onComplete]);

  if (!current || questions.length === 0) {
    return (
      <div className="duo-card p-8 text-center">
        <p className="text-sm text-[#4d6b3a]">No quiz questions for this section yet.</p>
        <button onClick={onBackToLearn} className="duo-btn-secondary mt-4 px-4 py-2 text-sm">
          Back to Lesson
        </button>
      </div>
    );
  }

  if (finished) {
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= 60;
    return (
      <div className="duo-card p-8 text-center">
        <div className="mb-4 text-5xl">{passed ? "🎉" : "📚"}</div>
        <h2 className="text-2xl font-extrabold text-[#2c5015]">
          {passed ? "Great Job!" : "Keep Practicing!"}
        </h2>
        <p className="mt-2 text-sm text-[#4d6b3a]">
          You scored {correctCount}/{questions.length} ({score}%)
        </p>
        <p className="mt-1 text-xs text-[#6f8f58]">
          {passed ? "Section completed! You can move on." : "Score at least 60% to complete this section."}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button onClick={onBackToLearn} className="duo-btn-secondary px-6 py-2.5 text-sm">
            Review Lesson
          </button>
          {!passed && (
            <button
              onClick={() => {
                setCurrentIndex(0);
                setSelectedAnswer(null);
                setIsAnswered(false);
                setCorrectCount(0);
                setFinished(false);
              }}
              className="duo-btn-primary px-6 py-2.5 text-sm"
            >
              Retry Quiz
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-widest text-[#87a66f]">
          Quiz · {sectionTitle}
        </p>
        <div className="mt-2 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#e8f2e3]">
            <div
              className="h-full rounded-full bg-[#58cc02] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-bold text-[#6a8a55]">
            {currentIndex + 1}/{questions.length}
          </span>
        </div>
      </div>

      <div className="duo-card p-6">
        <p className="mb-1 text-[10px] font-extrabold uppercase tracking-widest text-[#87a66f]">
          {current.type === "multiple-choice"
            ? "Choose the correct answer"
            : current.type === "true-false"
            ? "True or False"
            : "Fill in the blank"}
        </p>
        <h3 className="mb-6 text-lg font-extrabold text-[#2c5015]">
          {current.question}
        </h3>
        {current.questionThai && (
          <p className="thai-char mb-4 text-base text-[#4d6b3a]">
            {current.questionThai}
          </p>
        )}

        <div className="space-y-2">
          {(current.options ?? []).map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === current.correctAnswer;
            let btnClass =
              "w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-bold transition-all";

            if (!isAnswered) {
              btnClass += isSelected
                ? " border-[#58cc02] bg-[#e9fdd6] text-[#2c5015]"
                : " border-[#e8f2e3] bg-white text-[#2c5015] hover:border-[#cae6bf]";
            } else if (isCorrect) {
              btnClass += " border-[#58cc02] bg-[#e9fdd6] text-[#2d6d13]";
            } else if (isSelected && !isCorrect) {
              btnClass += " border-red-300 bg-red-50 text-red-600";
            } else {
              btnClass += " border-[#e8f2e3] bg-white text-[#4d6b3a] opacity-60";
            }

            return (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                disabled={isAnswered}
                className={btnClass}
              >
                {option}
                {isAnswered && isCorrect && " ✓"}
                {isAnswered && isSelected && !isCorrect && " ✗"}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleNext}
              className="duo-btn-primary px-6 py-2.5 text-sm"
            >
              {currentIndex < questions.length - 1 ? "Next →" : "See Results"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
