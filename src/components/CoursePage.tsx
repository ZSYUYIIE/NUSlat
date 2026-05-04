"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import BackToPreviousButton from "@/components/BackToPreviousButton";
import { useMilestones } from "@/hooks/useMilestones";
import { type Module, isChapterUnlocked } from "@/lib/modules";

type TabType = "aan-khian-thai" | "phuut-thai";

interface CoursePageProps {
  module: Module;
}

export default function CoursePage({ module }: CoursePageProps) {
  const router = useRouter();
  const { completedMilestones, loading } = useMilestones();
  const [activeTab, setActiveTab] = useState<TabType>("aan-khian-thai");

  const activeComponent = useMemo(
    () => module.components.find((c) => c.type === activeTab),
    [module, activeTab]
  );

  const completedCount = module.chapters.filter((ch) =>
    completedMilestones.includes(ch.id)
  ).length;
  const totalCount = module.chapters.length;
  const progressPct = Math.round(
    (completedCount / Math.max(totalCount, 1)) * 100
  );

  const openSection = (sectionId: string) => {
    if (!isChapterUnlocked(sectionId, completedMilestones)) return;
    router.push(`/learn/${module.id}/chapter/${sectionId}`);
  };

  return (
    <div className="duo-shell duo-page-offset min-h-screen">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <BackToPreviousButton fallbackHref="/learn" className="mb-4" />

        {/* Course header */}
        <div className="mb-6">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#87a66f]">
            {module.id.toUpperCase()}
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#2c5015] sm:text-4xl">
            {module.title}
          </h1>
          <p className="mt-1 text-sm text-[#4d6b3a]">{module.titleThai}</p>
          <p className="mt-2 text-sm text-[#4d6b3a]">{module.description}</p>
        </div>

        {/* Progress bar */}
        <div className="duo-card mb-6 p-5 sm:p-6">
          <div className="mb-3 flex items-center justify-between text-sm font-bold text-[#2c5015]">
            <span>Course Progress</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-[#e8f9db]">
            <div
              className="h-full rounded-full bg-[#58cc02] transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-bold text-[#6f8f58]">
            {completedCount}/{totalCount} sections completed
          </p>
        </div>

        {/* Tab switcher */}
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl border border-[#d7f4c9] bg-[#f8ffef] p-2">
          <button
            onClick={() => setActiveTab("aan-khian-thai")}
            className={`rounded-xl px-3 py-3 text-sm font-extrabold transition-colors ${
              activeTab === "aan-khian-thai"
                ? "bg-[#58cc02] text-white"
                : "bg-white text-[#4d6b3a] hover:text-[#2c5015]"
            }`}
          >
            📖 อ่านเขียนไทย
            <span className="block text-[10px] font-bold opacity-80">
              Aan Khian Thai
            </span>
          </button>
          <button
            onClick={() => setActiveTab("phuut-thai")}
            className={`rounded-xl px-3 py-3 text-sm font-extrabold transition-colors ${
              activeTab === "phuut-thai"
                ? "bg-[#58cc02] text-white"
                : "bg-white text-[#4d6b3a] hover:text-[#2c5015]"
            }`}
          >
            🗣️ พูดไทย
            <span className="block text-[10px] font-bold opacity-80">
              Phuut Thai
            </span>
          </button>
        </div>

        {/* Section list */}
        {loading ? (
          <div className="duo-card animate-pulse p-6">
            <div className="mb-4 h-3 w-40 rounded-full bg-neutral-100" />
            <div className="h-2 w-full rounded-full bg-neutral-100" />
          </div>
        ) : (
          <div className="space-y-3">
            {activeComponent?.sections.map((section) => {
              const unlocked = isChapterUnlocked(
                section.id,
                completedMilestones
              );
              const completed = completedMilestones.includes(section.id);

              return (
                <div
                  key={section.id}
                  className={`duo-card p-5 transition-all duration-200 ${
                    unlocked && !completed
                      ? "cursor-pointer hover:-translate-y-0.5"
                      : !unlocked
                      ? "opacity-50"
                      : ""
                  }`}
                  onClick={() => openSection(section.id)}
                  role="button"
                  tabIndex={unlocked ? 0 : -1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && unlocked) openSection(section.id);
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                          completed
                            ? "bg-[#58cc02] text-white"
                            : unlocked
                            ? "border-2 border-[#cae6bf] bg-[#f8ffef] text-[#2c5015]"
                            : "bg-neutral-100 text-neutral-400"
                        }`}
                      >
                        {completed ? "✓" : section.order}
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-[#2c5015]">
                          {section.title}
                        </h3>
                        <p className="text-xs text-[#6f8f58]">
                          {completed
                            ? "Completed — tap to review"
                            : unlocked
                            ? "Ready to learn"
                            : "Complete previous section first"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-1 text-[11px] font-extrabold ${
                          completed
                            ? "bg-[#e9fdd6] text-[#2d6d13]"
                            : unlocked
                            ? "bg-[#eef7ff] text-[#245d8a]"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        {completed
                          ? "Done"
                          : unlocked
                          ? "Unlocked"
                          : "Locked"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
