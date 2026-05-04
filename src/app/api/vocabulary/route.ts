import { NextRequest, NextResponse } from "next/server";
import { MODULES } from "@/lib/modules";
import { PT_CHAPTERS } from "@/data/phuutThaiData";
import { AKT_LESSONS } from "@/data/aanKhianThaiData";

export const dynamic = "force-dynamic";

const MODULE_TITLE_BY_ID = new Map(
  MODULES.map((module) => [module.id, module.title])
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const moduleId = searchParams.get("moduleId")?.trim() || null;
    const chapterOrderRaw = searchParams.get("chapterOrder");
    const chapterOrderFilter = chapterOrderRaw ? Number(chapterOrderRaw) : null;

    let allWords: any[] = [];

    // Extract vocab from Phuut Thai chapters
    for (const chapter of PT_CHAPTERS) {
      if (moduleId && chapter.courseId !== moduleId) continue;
      if (chapterOrderFilter !== null && chapter.order !== chapterOrderFilter) continue;

      for (let i = 0; i < chapter.vocabulary.length; i++) {
        const v = chapter.vocabulary[i];
        allWords.push({
          id: `${chapter.id}-v${i}`,
          moduleId: chapter.courseId,
          chapterId: chapter.id,
          chapterOrder: chapter.order,
          thaiWord: v.thai,
          phonetic: v.phonetic,
          meaning: v.meaning,
          level: MODULE_TITLE_BY_ID.get(chapter.courseId) || chapter.courseId,
          chapter: chapter.title,
        });
      }
    }

    // Sort words
    allWords.sort((a, b) => {
      if (a.moduleId !== b.moduleId) return a.moduleId.localeCompare(b.moduleId);
      if (a.chapterOrder !== b.chapterOrder) return a.chapterOrder - b.chapterOrder;
      return 0;
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