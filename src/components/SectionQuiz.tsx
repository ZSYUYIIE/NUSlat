"use client";

import { useCallback, useState } from "react";
import type { QuizQuestion as AktQuestion } from "@/data/aanKhianThaiData";
import type { QuizQuestion as PtQuestion } from "@/data/phuutThaiData";

type QuizQuestion = AktQuestion | PtQuestion;

interface SectionQuizProps {
  questions: QuizQuestion[];
  sectionTitle: string;
  onComplete: () => void;
  onBackToLearn: () => void;
  onContinue?: () => void;
  continueLabel?: string;
}

const normalizeAnswer = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLocaleLowerCase()
    .replace(/[.,!?]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export default function SectionQuiz({
  questions,
  sectionTitle,
  onComplete,
  onBackToLearn,
  onContinue,
  continueLabel = "Continue",
}: SectionQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = questions[currentIndex];
  const progress = questions.length
    ? Math.round(((currentIndex + 1) / questions.length) * 100)
    : 0;

  const recordAnswer = useCallback(
    (answer: string) => {
      if (isAnswered || !current) return;

      const isCorrect =
        current.type === "free-response" ||
        normalizeAnswer(answer) === normalizeAnswer(current.correctAnswer);

      setSelectedAnswer(answer);
      setIsAnswered(true);
      if (isCorrect) setCorrectCount((count) => count + 1);
    },
    [current, isAnswered]
  );

  const handleTextSubmit = useCallback(() => {
    const answer = textAnswer.trim();
    if (answer) recordAnswer(answer);
  }, [recordAnswer, textAnswer]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((index) => index + 1);
      setSelectedAnswer(null);
      setTextAnswer("");
      setIsAnswered(false);
      return;
    }

    setFinished(true);
    if (correctCount / questions.length >= 0.6) onComplete();
  }, [correctCount, currentIndex, onComplete, questions.length]);

  const resetQuiz = useCallback(() => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setTextAnswer("");
    setIsAnswered(false);
    setCorrectCount(0);
    setFinished(false);
  }, []);

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
        <div className="mb-4 text-4xl font-black text-[#58cc02]">
          {passed ? "✓" : "↺"}
        </div>
        <h2 className="text-2xl font-extrabold text-[#2c5015]">
          {passed ? "Section Complete" : "Keep Practicing"}
        </h2>
        <p className="mt-2 text-sm text-[#4d6b3a]">
          You scored {correctCount}/{questions.length} ({score}%)
        </p>
        <p className="mt-1 text-xs text-[#6f8f58]">
          {passed
            ? "The next section is now available."
            : "Score at least 60% to complete this section."}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button onClick={onBackToLearn} className="duo-btn-secondary px-6 py-2.5 text-sm">
            Review Lesson
          </button>
          {!passed ? (
            <button onClick={resetQuiz} className="duo-btn-primary px-6 py-2.5 text-sm">
              Retry Quiz
            </button>
          ) : null}
          {passed && onContinue ? (
            <button onClick={onContinue} className="duo-btn-primary px-6 py-2.5 text-sm">
              {continueLabel}
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  const isWrittenQuestion =
    current.type === "fill-blank" || current.type === "free-response";
  const writtenAnswerCorrect =
    current.type === "free-response" ||
    normalizeAnswer(selectedAnswer ?? "") === normalizeAnswer(current.correctAnswer);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-widest text-[#87a66f]">
          Exercise · {sectionTitle}
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
            ? "True or false"
            : current.type === "free-response"
            ? "Practice response"
            : "Fill in the blank"}
        </p>
        <h3 className="mb-6 text-lg font-extrabold text-[#2c5015]">
          {current.question}
        </h3>
        {current.questionThai ? (
          <p className="thai-char mb-4 text-base text-[#4d6b3a]">
            {current.questionThai}
          </p>
        ) : null}

        {isWrittenQuestion ? (
          <div className="space-y-3">
            {current.type === "free-response" ? (
              <textarea
                value={textAnswer}
                onChange={(event) => setTextAnswer(event.target.value)}
                disabled={isAnswered}
                rows={5}
                placeholder="Write your Thai practice response..."
                className="w-full rounded-xl border-2 border-[#e8f2e3] bg-white px-4 py-3 text-sm text-[#2c5015] outline-none transition focus:border-[#58cc02]"
              />
            ) : (
              <input
                value={textAnswer}
                onChange={(event) => setTextAnswer(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleTextSubmit();
                }}
                disabled={isAnswered}
                placeholder="Type your answer"
                className="w-full rounded-xl border-2 border-[#e8f2e3] bg-white px-4 py-3 text-sm font-bold text-[#2c5015] outline-none transition focus:border-[#58cc02]"
              />
            )}

            {!isAnswered ? (
              <button
                onClick={handleTextSubmit}
                disabled={!textAnswer.trim()}
                className="duo-btn-primary px-6 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Check Answer
              </button>
            ) : (
              <div
                className={`rounded-xl border p-3 text-sm font-bold ${
                  writtenAnswerCorrect
                    ? "border-[#bce8a4] bg-[#e9fdd6] text-[#2d6d13]"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {current.type === "free-response"
                  ? "Practice response saved."
                  : writtenAnswerCorrect
                  ? "Correct."
                  : `Correct answer: ${current.correctAnswer}`}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {(current.options ?? []).map((option) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === current.correctAnswer;
              let buttonClass =
                "w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-bold transition-all";

              if (!isAnswered) {
                buttonClass +=
                  " border-[#e8f2e3] bg-white text-[#2c5015] hover:border-[#cae6bf]";
              } else if (isCorrect) {
                buttonClass += " border-[#58cc02] bg-[#e9fdd6] text-[#2d6d13]";
              } else if (isSelected) {
                buttonClass += " border-red-300 bg-red-50 text-red-600";
              } else {
                buttonClass += " border-[#e8f2e3] bg-white text-[#4d6b3a] opacity-60";
              }

              return (
                <button
                  key={option}
                  onClick={() => recordAnswer(option)}
                  disabled={isAnswered}
                  className={buttonClass}
                >
                  {option}
                  {isAnswered && isCorrect ? " ✓" : ""}
                  {isAnswered && isSelected && !isCorrect ? " ✕" : ""}
                </button>
              );
            })}
          </div>
        )}

        {isAnswered ? (
          <div className="mt-4 flex justify-end">
            <button onClick={handleNext} className="duo-btn-primary px-6 py-2.5 text-sm">
              {currentIndex < questions.length - 1 ? "Next →" : "See Results"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
