"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import BackToPreviousButton from "@/components/BackToPreviousButton";
import { MODULES } from "@/lib/modules";
import { playThaiAudio } from "@/lib/audio";
import WriteModal from "@/components/WriteModal";

interface VocabularyWord {
  id: string;
  thaiWord: string;
  phonetic: string;
  meaning: string;
  level: string;
  chapter: string;
}

function inferLevelFromChapterId(chapterId: string | null): string {
  if (!chapterId) {
    return "all";
  }

  const [moduleId] = chapterId.split("-");
  return moduleId || "all";
}

function inferChapterOrderFromChapterId(chapterId: string | null): string {
  if (!chapterId) {
    return "all";
  }

  const match = chapterId.match(/-ch(\d+)$/i);
  return match?.[1] ?? "all";
}

function toVocabularyWord(value: unknown): VocabularyWord | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const item = value as Record<string, unknown>;
  const id = typeof item.id === "string" ? item.id : "";
  const thaiWord = typeof item.thaiWord === "string" ? item.thaiWord : "";
  const phonetic = typeof item.phonetic === "string" ? item.phonetic : "";
  const meaning = typeof item.meaning === "string" ? item.meaning : "";
  const level = typeof item.level === "string" ? item.level : "";
  const chapter = typeof item.chapter === "string" ? item.chapter : "";

  if (!id || !thaiWord || !meaning) {
    return null;
  }

  return {
    id,
    thaiWord,
    phonetic,
    meaning,
    level,
    chapter,
  };
}

export default function VocabularyClient() {
  const searchParams = useSearchParams();

  const queryChapterId = searchParams.get("chapter");
  const queryLevel =
    searchParams.get("level") ?? inferLevelFromChapterId(queryChapterId);
  const queryChapterOrder =
    searchParams.get("chapterOrder") ??
    inferChapterOrderFromChapterId(queryChapterId);

  const [levelFilter, setLevelFilter] = useState<string>(queryLevel);
  const [chapterFilter, setChapterFilter] = useState<string>(queryChapterOrder);
  const [isSpeakingWord, setIsSpeakingWord] = useState<string | null>(null);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [writingWord, setWritingWord] = useState<{ thaiWord: string; phonetic: string; meaning: string } | null>(null);
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [isLoadingWords, setIsLoadingWords] = useState<boolean>(true);
  const [loadWordsError, setLoadWordsError] = useState<string | null>(null);

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

  useEffect(() => {
    const controller = new AbortController();

    const loadWords = async () => {
      setIsLoadingWords(true);
      setLoadWordsError(null);

      try {
        const params = new URLSearchParams();

        if (levelFilter !== "all") {
          params.set("moduleId", levelFilter);
        }

        if (chapterFilter !== "all") {
          params.set("chapterOrder", chapterFilter);
        }

        const query = params.toString();
        const response = await fetch(`/api/vocabulary${query ? `?${query}` : ""}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        const payload = (await response.json()) as {
          error?: string;
          words?: unknown[];
        };

        if (!response.ok) {
          throw new Error(payload.error ?? "Failed to load vocabulary words.");
        }

        const normalizedWords = Array.isArray(payload.words)
          ? payload.words
              .map((item) => toVocabularyWord(item))
              .filter((item): item is VocabularyWord => item !== null)
          : [];

        setWords(normalizedWords);
        setFlippedCards({});
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        setWords([]);
        setLoadWordsError(
          error instanceof Error
            ? error.message
            : "Failed to load vocabulary words."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingWords(false);
        }
      }
    };

    loadWords();

    return () => controller.abort();
  }, [chapterFilter, levelFilter]);

  const speakThai = (text: string) => {
    setIsSpeakingWord(text);
    playThaiAudio(text)
      .catch(() => undefined)
      .finally(() => setIsSpeakingWord(null));
  };

  return (
    <>
    {writingWord && (
      <WriteModal
        key={writingWord.thaiWord}
        thaiWord={writingWord.thaiWord}
        phonetic={writingWord.phonetic}
        meaning={writingWord.meaning}
        onClose={() => setWritingWord(null)}
      />
    )}
    <div className="duo-shell duo-page-offset min-h-screen">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <BackToPreviousButton fallbackHref="/" className="mb-4" />

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

        {isLoadingWords ? (
          <div className="duo-card p-6 text-sm font-bold text-[#4d6b3a]">
            Loading vocabulary...
          </div>
        ) : loadWordsError ? (
          <div className="duo-card border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {loadWordsError}
          </div>
        ) : words.length === 0 ? (
          <div className="duo-card p-6 text-sm text-[#4d6b3a]">
            No vocabulary found for the selected filters yet. Once chapter words are
            uploaded to MongoDB, they will appear here automatically.
          </div>
        ) : (
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

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => speakThai(word.thaiWord)}
                    className="duo-btn-secondary px-3 py-1.5 text-xs"
                  >
                    {isSpeakingWord === word.thaiWord ? "Playing..." : "Listen"}
                  </button>
                  <button
                    onClick={() =>
                      setWritingWord({
                        thaiWord: word.thaiWord,
                        phonetic: word.phonetic,
                        meaning: word.meaning,
                      })
                    }
                    className="duo-btn-secondary px-3 py-1.5 text-xs"
                  >
                    Write
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
    </>
  );
}
