"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import AppHeader from "@/components/AppHeader";
import BackToPreviousButton from "@/components/BackToPreviousButton";
import { MODULES } from "@/lib/modules";
import { useMilestones } from "@/hooks/useMilestones";

export default function LearnHub() {
  const { data: session } = useSession();
  const { completedMilestones, error, clearError, loading } = useMilestones();

  const isGuest = !session?.user;
  const userName = session?.user?.name?.split(" ")[0] ?? "Guest";

  return (
    <div className="duo-shell duo-page-offset min-h-screen">
      <AppHeader />

      {isGuest && (
        <div className="border-b border-amber-100 bg-amber-50 px-4 py-2.5 text-center text-xs text-amber-700">
          You&apos;re in guest mode — progress is saved locally.{" "}
          <Link
            href="/auth/signin"
            className="font-semibold underline underline-offset-2 hover:text-amber-900"
          >
            Sign in to sync across devices
          </Link>
        </div>
      )}

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <BackToPreviousButton fallbackHref="/" className="mb-4" />

        <div className="mb-8 text-center sm:mb-10">
          <h1 className="text-2xl font-extrabold tracking-tight text-[#2c5015] sm:text-4xl">
            {isGuest ? "Learn as Guest" : `Welcome, ${userName}`}
          </h1>
          <p className="mt-2 text-sm text-[#4d6b3a] sm:text-base">
            Choose your NUS Thai Language course to begin learning.
          </p>
        </div>

        {/* Course overview cards */}
        <div className="mb-8 grid gap-3 sm:grid-cols-2">
          <div className="duo-card p-4">
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#7f9f69]">
              Learn → Quiz Flow
            </p>
            <h3 className="mt-1 text-sm font-extrabold text-[#2c5015]">
              📖 Read, then ✍️ Quiz
            </h3>
            <p className="mt-1 text-xs text-[#4d6b3a]">
              Study each lesson&apos;s content, then take a quiz based on textbook exercises.
            </p>
          </div>
          <div className="duo-card p-4">
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#7f9f69]">
              Two Components per Course
            </p>
            <h3 className="mt-1 text-sm font-extrabold text-[#2c5015]">
              อ่านเขียนไทย + พูดไทย
            </h3>
            <p className="mt-1 text-xs text-[#4d6b3a]">
              Each course has Reading/Writing (Aan Khian Thai) and Speaking (Phuut Thai) sections.
            </p>
          </div>
        </div>

        {loading && (
          <div className="duo-card mb-8 animate-pulse p-6">
            <div className="mb-4 h-3 w-40 rounded-full bg-neutral-100" />
            <div className="h-2 w-full rounded-full bg-neutral-100" />
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            <div className="flex items-center gap-2">
              <span>{error}</span>
            </div>
            <button
              onClick={clearError}
              className="shrink-0 text-xs text-red-400 hover:text-red-600"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        <div className="space-y-3">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#87a66f]">
            NUS Thai Courses
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {MODULES.map((mod, index) => {
              const completedCount = mod.chapters.filter((ch) =>
                completedMilestones.includes(ch.id)
              ).length;
              const totalCount = mod.chapters.length;
              const progress = Math.round(
                (completedCount / Math.max(totalCount, 1)) * 100
              );

              const prevModule = index > 0 ? MODULES[index - 1] : null;
              const isLocked =
                !!prevModule &&
                !prevModule.chapters.every((ch) =>
                  completedMilestones.includes(ch.id)
                );

              const aktComponent = mod.components.find(
                (c) => c.type === "aan-khian-thai"
              );
              const ptComponent = mod.components.find(
                (c) => c.type === "phuut-thai"
              );

              return (
                <div
                  key={mod.id}
                  className={`duo-card relative overflow-hidden p-6 transition-all duration-300 ${
                    isLocked
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:-translate-y-1"
                  }`}
                >
                  {isLocked && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-white/60 backdrop-blur-[2px]">
                      <div className="flex flex-col items-center gap-2 text-neutral-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                        <span className="text-xs font-medium tracking-wide">
                          Complete LAT1201 first
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Course header */}
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-b-4 border-[#cae6bf] text-2xl ${mod.iconBg}`}
                    >
                      {mod.icon}
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#7e9f6c]">
                        {mod.id.toUpperCase()}
                      </p>
                      <h3 className="text-lg font-black tracking-tight text-[#2c5015]">
                        {mod.title}
                      </h3>
                    </div>
                  </div>

                  <p className="mb-3 text-sm leading-relaxed text-[#4d6b3a]">
                    {mod.titleThai}
                  </p>
                  <p className="mb-4 text-xs text-[#4d6b3a]">
                    {mod.description}
                  </p>

                  {/* Component badges */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {aktComponent && (
                      <span className="duo-chip px-3 py-1 text-xs font-bold text-[#3f6f25]">
                        📖 {aktComponent.titleThai} · {aktComponent.sections.length} lessons
                      </span>
                    )}
                    {ptComponent && (
                      <span className="duo-chip px-3 py-1 text-xs font-bold text-[#3f6f25]">
                        🗣️ {ptComponent.titleThai} · {ptComponent.sections.length} chapters
                      </span>
                    )}
                  </div>

                  {/* Progress */}
                  <div className="mb-5">
                    <div className="mb-2 flex items-center justify-between text-xs font-extrabold text-[#6a8a55]">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-[#e8f2e3]">
                      <div
                        className="h-full rounded-full bg-[#58cc02] transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs font-bold text-[#5b7a46]">
                      {completedCount}/{totalCount} sections completed
                    </p>
                  </div>

                  {/* CTA */}
                  {!isLocked && (
                    <Link
                      href={`/learn/${mod.id}`}
                      className="duo-btn-primary block w-full px-5 py-2.5 text-center text-sm"
                    >
                      {completedCount === 0
                        ? "Start Course"
                        : completedCount === totalCount
                        ? "Review Course"
                        : "Continue Learning"}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
