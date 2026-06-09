"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import BackToPreviousButton from "@/components/BackToPreviousButton";
import LessonViewer from "@/components/LessonViewer";
import SectionQuiz from "@/components/SectionQuiz";
import { useMilestones } from "@/hooks/useMilestones";
import { MODULES } from "@/lib/modules";
import { getAktLessonById } from "@/data/aanKhianThaiData";
import { getPtSectionById } from "@/data/phuutThaiData";

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

  const moduleData = MODULES.find((module) => module.id === moduleId);
  const aktLesson = useMemo(() => getAktLessonById(chapterId), [chapterId]);
  const ptSection = useMemo(() => getPtSectionById(chapterId), [chapterId]);
  const componentSections = useMemo(
    () =>
      moduleData?.components.find((component) =>
        component.sections.some((section) => section.id === chapterId)
      )?.sections ?? [],
    [chapterId, moduleData]
  );
  const nextSectionId = useMemo(() => {
    const currentIndex = componentSections.findIndex(
      (section) => section.id === chapterId
    );
    return currentIndex >= 0
      ? componentSections[currentIndex + 1]?.id ?? null
      : null;
  }, [chapterId, componentSections]);

  const quizQuestions = useMemo(() => {
    if (aktLesson) return aktLesson.quizQuestions;
    if (ptSection) return ptSection.quizQuestions;
    return [];
  }, [aktLesson, ptSection]);

  const sectionTitle =
    aktLesson?.title ??
    (ptSection
      ? `Chapter ${ptSection.chapterNumber}${ptSection.letter}: ${ptSection.title}`
      : chapterId);

  if (!moduleData) {
    return (
      <div className="duo-shell duo-page-offset flex min-h-screen flex-col">
        <AppHeader />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-4xl font-black text-[#58cc02]">?</p>
          <h1 className="text-xl font-extrabold text-[#2c5015]">Not found</h1>
          <Link href="/learn" className="duo-btn-primary px-6 py-2.5 text-sm">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const handleQuizComplete = () => {
    void completeModule(chapterId);
  };

  const handleNextSection = () => {
    setMode("learn");
    if (nextSectionId) {
      const testerQuery = isTester ? "?tester=true" : "";
      router.push(`/learn/${moduleId}/chapter/${nextSectionId}${testerQuery}`);
      return;
    }
    router.push(isTester ? `/learn/${moduleId}?tester=true` : `/learn/${moduleId}`);
  };

  return (
    <div className="duo-shell duo-page-offset min-h-screen">
      <AppHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <BackToPreviousButton fallbackHref={`/learn/${moduleId}`} className="mb-4" />

        <div className="mb-6 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setMode("learn")}
            className={`rounded-xl px-4 py-2 text-xs font-extrabold transition-colors ${
              mode === "learn"
                ? "bg-[#58cc02] text-white"
                : "border border-[#d8ecd3] bg-white text-[#4d6b3a]"
            }`}
          >
            1. Learn
          </button>
          <button
            onClick={() => setMode("quiz")}
            className={`rounded-xl px-4 py-2 text-xs font-extrabold transition-colors ${
              mode === "quiz"
                ? "bg-[#58cc02] text-white"
                : "border border-[#d8ecd3] bg-white text-[#4d6b3a]"
            }`}
          >
            2. Quiz
          </button>
          {ptSection ? (
            <span className="ml-auto text-xs font-bold text-[#6f8f58]">
              Learn → exercise → next section
            </span>
          ) : null}
        </div>

        {mode === "learn" ? (
          <LessonViewer
            aktLesson={aktLesson}
            ptSection={ptSection}
            onStartQuiz={() => setMode("quiz")}
          />
        ) : (
          <SectionQuiz
            questions={quizQuestions}
            sectionTitle={sectionTitle}
            onComplete={handleQuizComplete}
            onBackToLearn={() => setMode("learn")}
            onContinue={handleNextSection}
            continueLabel={
              nextSectionId ? "Continue to Next Section" : "Back to Course"
            }
          />
        )}
      </main>
    </div>
  );
}
