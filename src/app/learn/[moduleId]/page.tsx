"use client";

import { useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useMilestones } from "@/hooks/useMilestones";
import AppHeader from "@/components/AppHeader";
import { getChaptersByModule } from "@/data/chapters";
import {
  MODULES,
  getNextIncompleteChapterInModule,
  isChapterUnlocked,
} from "@/lib/modules";

export default function LearnPage() {
  const params = useParams();
  const moduleId = params?.moduleId as string;
  const router = useRouter();
  const { completedMilestones, loading } = useMilestones();

  const chapters = useMemo(() => {
    if (!moduleId) {
      return [];
    }
    return getChaptersByModule(moduleId);
  }, [moduleId]);

  const moduleData = MODULES.find((moduleItem) => moduleItem.id === moduleId);

  if (!moduleData) {
    return (
      <div className="duo-shell flex min-h-screen flex-col">
        <AppHeader />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-4xl">🔍</p>
          <h1 className="text-xl font-extrabold text-[#2c5015]">Level not found</h1>
          <p className="text-sm text-[#4d6b3a]">
            The level <strong>{moduleId}</strong> does not exist.
          </p>
          <a href="/dashboard" className="duo-btn-primary px-6 py-2.5 text-sm">
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  const completedChapterCount = chapters.filter((chapter) =>
    completedMilestones.includes(chapter.id)
  ).length;
  const chapterProgressPct = Math.round(
    (completedChapterCount / Math.max(chapters.length, 1)) * 100
  );

  const startRecommended = () => {
    const chapterId =
      getNextIncompleteChapterInModule(moduleId, completedMilestones) ??
      chapters[0]?.id;
    if (!chapterId) return;
    router.push(`/learn/${moduleId}/chapter/${chapterId}`);
  };

  const openChapter = (chapterId: string) => {
    if (!isChapterUnlocked(chapterId, completedMilestones)) return;
    router.push(`/learn/${moduleId}/chapter/${chapterId}`);
  };

  return (
    <div className="duo-shell min-h-screen">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#87a66f]">
              Thai Level Hub
            </p>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#2c5015] sm:text-4xl">
              {moduleData.title}
            </h1>
            <p className="mt-2 text-sm text-[#4d6b3a]">{moduleData.description}</p>
          </div>
          <div className="duo-chip px-3 py-1 text-xs font-bold text-[#3f6f25]">Level Hub</div>
        </div>

        <div className="duo-card mb-6 p-5 sm:p-6">
          <div className="mb-3 flex items-center justify-between text-sm font-bold text-[#2c5015]">
            <span>Level Progress</span>
            <span>{chapterProgressPct}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-[#e8f9db]">
            <div
              className="h-full rounded-full bg-[#58cc02] transition-all duration-700"
              style={{ width: `${chapterProgressPct}%` }}
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-bold text-[#6f8f58]">
              {completedChapterCount}/{chapters.length} chapters completed
            </p>
            <button
              onClick={startRecommended}
              disabled={loading}
              className="duo-btn-primary px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Loading..." : "Start Recommended Chapter"}
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {chapters.map((chapter) => {
            const unlocked = isChapterUnlocked(chapter.id, completedMilestones);
            const completed = completedMilestones.includes(chapter.id);

            return (
              <div
                key={chapter.id}
                className={`duo-card p-5 ${
                  unlocked ? "" : "opacity-60"
                }`}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wide text-[#7f9f69]">
                      {moduleData.title}
                    </p>
                    <h2 className="text-lg font-extrabold text-[#2c5015]">
                      {chapter.title}
                    </h2>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-[11px] font-extrabold ${
                      completed
                        ? "bg-[#e9fdd6] text-[#2d6d13]"
                        : unlocked
                        ? "bg-[#eef7ff] text-[#245d8a]"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {completed ? "Completed" : unlocked ? "Unlocked" : "Locked"}
                  </span>
                </div>

                <p className="mb-4 text-sm text-[#4d6b3a]">
                  {chapter.lessons.length} words • quiz, vocabulary, and writing practice
                </p>

                <button
                  onClick={() => openChapter(chapter.id)}
                  disabled={!unlocked}
                  className="duo-btn-primary w-full px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {completed ? "Review Chapter" : "Open Chapter"}
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
