import { NextRequest, NextResponse } from "next/server";
import { MODULES } from "@/lib/modules";
import { PT_SECTIONS } from "@/data/phuutThaiData";

export const dynamic = "force-dynamic";

const MODULE_TITLE_BY_ID = new Map(
  MODULES.map((module) => [module.id, module.title])
);

interface VocabularyWord {
  id: string;
  moduleId: string;
  chapterId: string;
  chapterOrder: number;
  sectionOrder: number;
  thaiWord: string;
  phonetic: string;
  meaning: string;
  level: string;
  chapter: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const moduleId = searchParams.get("moduleId")?.trim() || null;
    const chapterOrderRaw = searchParams.get("chapterOrder");
    const chapterOrderFilter = chapterOrderRaw ? Number(chapterOrderRaw) : null;

    const allWords: VocabularyWord[] = [];

    // Extract vocabulary in textbook chapter and subsection order.
    for (const section of PT_SECTIONS) {
      if (moduleId && section.courseId !== moduleId) continue;
      if (
        chapterOrderFilter !== null &&
        section.chapterNumber !== chapterOrderFilter
      ) {
        continue;
      }

      for (let i = 0; i < section.vocabulary.length; i++) {
        const v = section.vocabulary[i];
        allWords.push({
          id: `${section.id}-v${i}`,
          moduleId: section.courseId,
          chapterId: section.id,
          chapterOrder: section.chapterNumber,
          sectionOrder: section.order,
          thaiWord: v.thai,
          phonetic: v.phonetic,
          meaning: v.meaning,
          level: MODULE_TITLE_BY_ID.get(section.courseId) || section.courseId,
          chapter: `Chapter ${section.chapterNumber}${section.letter}: ${section.title}`,
        });
      }
    }

    // Sort words
    allWords.sort((a, b) => {
      if (a.moduleId !== b.moduleId) return a.moduleId.localeCompare(b.moduleId);
      if (a.chapterOrder !== b.chapterOrder) return a.chapterOrder - b.chapterOrder;
      return a.sectionOrder - b.sectionOrder;
    });

    const availableChapterOrders = Array.from(
      new Set(allWords.map((w) => w.chapterOrder))
    ).sort((a, b) => a - b);

    return NextResponse.json({
      words: allWords,
      total: allWords.length,
      availableChapterOrders,
    });
  } catch (error) {
    console.error("Get vocabulary error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
