"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import BackToPreviousButton from "@/components/BackToPreviousButton";
import LessonViewer from "@/components/LessonViewer";
import SectionQuiz from "@/components/SectionQuiz";
import { useMilestones } from "@/hooks/useMilestones";
import { MODULES, getNextChapterId } from "@/lib/modules";
import { getAktLessonById } from "@/data/aanKhianThaiData";
import { getPtChapterById } from "@/data/phuutThaiData";

type Mode = "learn" | "quiz";

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isTester = searchParams?.get("tester") === "true";
  const moduleId = params?.moduleId as string;
  const chapterId = params?.chapterId as string;
  const { completeModule } = useMilestones();

  const [mode, setMode] = useState<Mode>("learn");

  const moduleData = MODULES.find((m) => m.id === moduleId);

  const aktLesson = useMemo(() => getAktLessonById(chapterId), [chapterId]);
  const ptChapter = useMemo(() => getPtChapterById(chapterId), [chapterId]);

  const quizQuestions = useMemo(() => {
    if (aktLesson) return aktLesson.quizQuestions;
    if (ptChapter) return ptChapter.quizQuestions;
    return [];
  }, [aktLesson, ptChapter]);

  const sectionTitle = aktLesson?.title ?? ptChapter?.title ?? chapterId;

  if (!moduleData) {
    return (
      <div className="duo-shell duo-page-offset flex min-h-screen flex-col">
        <AppHeader />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-4xl">🔍</p>
          <h1 className="text-xl font-extrabold text-[#2c5015]">Not found</h1>
          <a href="/learn" className="duo-btn-primary px-6 py-2.5 text-sm">
            Back to Courses
          </a>
        </div>
      </div>
    );
  }

  const handleQuizComplete = async () => {
    await completeModule(chapterId);
  };

  const handleNextSection = () => {
    const nextId = getNextChapterId(chapterId);
    if (nextId) {
      router.push(isTester ? `/learn/${moduleId}/chapter/${nextId}?tester=true` : `/learn/${moduleId}/chapter/${nextId}`);
    } else {
      router.push(isTester ? `/learn/${moduleId}?tester=true` : `/learn/${moduleId}`);
    }
  };

  return (
    <div className="duo-shell duo-page-offset min-h-screen">
      <AppHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <BackToPreviousButton
          fallbackHref={`/learn/${moduleId}`}
          className="mb-4"
        />

        {/* Mode toggle */}
        <div className="mb-6 flex items-center gap-2">
          <button
            onClick={() => setMode("learn")}
            className={`rounded-xl px-4 py-2 text-xs font-extrabold transition-colors ${
              mode === "learn"
                ? "bg-[#58cc02] text-white"
                : "border border-[#d8ecd3] bg-white text-[#4d6b3a]"
            }`}
          >
            📖 Learn
          </button>
          <button
            onClick={() => setMode("quiz")}
            className={`rounded-xl px-4 py-2 text-xs font-extrabold transition-colors ${
              mode === "quiz"
                ? "bg-[#58cc02] text-white"
                : "border border-[#d8ecd3] bg-white text-[#4d6b3a]"
            }`}
          >
            ✍️ Quiz
          </button>
          <button
            onClick={handleNextSection}
            className="ml-auto text-xs font-bold text-[#6f8f58] hover:text-[#2c5015]"
          >
            Next Section →
          </button>
        </div>

        {mode === "learn" ? (
          <LessonViewer
            aktLesson={aktLesson}
            ptChapter={ptChapter}
            onStartQuiz={() => setMode("quiz")}
          />
        ) : (
          <SectionQuiz
            questions={quizQuestions}
            sectionTitle={sectionTitle}
            onComplete={handleQuizComplete}
            onBackToLearn={() => setMode("learn")}
          />
        )}
      </main>
    </div>
  );
}
