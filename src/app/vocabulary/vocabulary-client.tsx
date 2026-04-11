"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import { MODULES } from "@/lib/modules";
import { getChaptersByModule } from "@/data/chapters";
import { playThaiAudio } from "@/lib/audio";

export default function VocabularyClient() {
  const searchParams = useSearchParams();
  const queryLevel = searchParams.get("level") ?? "all";
  const queryChapterOrder = searchParams.get("chapterOrder") ?? "all";

  const [levelFilter, setLevelFilter] = useState<string>(queryLevel);
  const [chapterFilter, setChapterFilter] = useState<string>(queryChapterOrder);
  const [isSpeakingWord, setIsSpeakingWord] = useState<string | null>(null);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const chapterOptions = useMemo(() => {
    const scopedLevels =
      levelFilter === "all"
        ? MODULES
        : MODULES.filter((module) => module.id === levelFilter);

    const maxChapter = Math.max(
      ...scopedLevels.map((module) => module.chapters.length),
      0
    );

    return Array.from({ length: maxChapter }, (_, idx) => idx + 1);
  }, [levelFilter]);

  const words = useMemo(() => {
    const scopedModules =
      levelFilter === "all"
        ? MODULES
        : MODULES.filter((module) => module.id === levelFilter);

    return scopedModules.flatMap((module) => {
      const chapters = getChaptersByModule(module.id).filter((chapter) =>
        chapterFilter === "all" ? true : chapter.order === Number(chapterFilter)
      );

      return chapters.flatMap((chapter) =>
        chapter.lessons.map((lesson) => ({
          id: lesson.id,
          thaiWord: lesson.thaiWord,
          phonetic: lesson.phonetic,
          meaning: lesson.englishTranslation,
          level: module.title,
          chapter: chapter.title,
        }))
      );
    });
  }, [levelFilter, chapterFilter]);

  const speakThai = (text: string) => {
    setIsSpeakingWord(text);
    playThaiAudio(text)
      .catch(() => undefined)
      .finally(() => setIsSpeakingWord(null));
  };

  return (
    <div className="duo-shell min-h-screen">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-[#2c5015] sm:text-4xl">
            Vocabulary Library
          </h1>
          <p className="mt-2 text-sm text-[#4d6b3a]">
            Browse all words outside quiz mode and practice pronunciation freely.
          </p>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <label className="duo-card p-4 text-sm">
            <span className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-[#7f9f69]">
              Thai Level
            </span>
            <select
              value={levelFilter}
              onChange={(event) => {
                setLevelFilter(event.target.value);
                setChapterFilter("all");
              }}
              className="w-full rounded-xl border border-[#d7f4c9] bg-white px-3 py-2 font-bold text-[#2c5015]"
            >
              <option value="all">All Levels</option>
              {MODULES.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.title}
                </option>
              ))}
            </select>
          </label>

          <label className="duo-card p-4 text-sm">
            <span className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-[#7f9f69]">
              Chapter
            </span>
            <select
              value={chapterFilter}
              onChange={(event) => setChapterFilter(event.target.value)}
              className="w-full rounded-xl border border-[#d7f4c9] bg-white px-3 py-2 font-bold text-[#2c5015]"
            >
              <option value="all">All Chapters</option>
              {chapterOptions.map((chapterOrder) => (
                <option key={chapterOrder} value={chapterOrder}>
                  Chapter {chapterOrder}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {words.map((word) => (
            <div key={word.id} className="duo-card p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-[11px] font-extrabold uppercase tracking-wide text-[#7f9f69]">
                  {word.level} • {word.chapter}
                </p>
                <button
                  onClick={() =>
                    setFlippedCards((prev) => ({
                      ...prev,
                      [word.id]: !prev[word.id],
                    }))
                  }
                  className="duo-btn-secondary px-2.5 py-1 text-[11px]"
                >
                  {flippedCards[word.id] ? "Front" : "Flip"}
                </button>
              </div>

              {flippedCards[word.id] ? (
                <div className="rounded-xl border border-[#d7f4c9] bg-[#f6ffef] p-4">
                  <p className="text-xs font-extrabold uppercase tracking-wide text-[#7f9f69]">Meaning</p>
                  <p className="mt-2 text-xl font-extrabold text-[#2c5015]">{word.meaning}</p>
                  <p className="mt-1 text-sm text-[#4d6b3a]">Thai: {word.thaiWord}</p>
                </div>
              ) : (
                <div className="rounded-xl border border-[#d7f4c9] bg-white p-4">
                  <p className="text-3xl font-extrabold text-[#2c5015]">{word.thaiWord}</p>
                  <p className="text-xs font-bold text-[#6a8a55]">{word.phonetic}</p>
                </div>
              )}

              <button
                onClick={() => speakThai(word.thaiWord)}
                className="duo-btn-secondary mt-3 px-3 py-1.5 text-xs"
              >
                {isSpeakingWord === word.thaiWord ? "Playing..." : "Listen"}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
