import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { MODULES } from "@/lib/modules";
import Vocabulary from "@/models/Vocabulary";

export const dynamic = "force-dynamic";

const MODULE_TITLE_BY_ID = new Map(
  MODULES.map((module) => [module.id, module.title])
);

interface VocabularyWriteItem {
  lessonId: string;
  moduleId: string;
  chapterId: string;
  chapterTitle: string;
  chapterOrder: number;
  wordOrder: number;
  thaiWord: string;
  phonetic: string;
  englishTranslation: string;
  options: string[];
  correctOption?: string;
  isActive: boolean;
}

function parsePositiveInt(raw: string | null): number | null {
  if (!raw) {
    return null;
  }

  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return null;
  }

  return parsed;
}

function toSafeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toSafeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parsePositiveNumber(value: unknown): number | null {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return null;
  }
  return parsed;
}

function parseWriteItem(value: unknown, index: number): VocabularyWriteItem {
  if (!value || typeof value !== "object") {
    throw new Error(`Invalid item at index ${index}: item must be an object.`);
  }

  const row = value as Record<string, unknown>;
  const lessonId = toSafeString(row.lessonId);
  const moduleId = toSafeString(row.moduleId);
  const chapterId = toSafeString(row.chapterId);
  const chapterTitle = toSafeString(row.chapterTitle);
  const chapterOrder = parsePositiveNumber(row.chapterOrder);
  const wordOrder = parsePositiveNumber(row.wordOrder);
  const thaiWord = toSafeString(row.thaiWord);
  const phonetic = toSafeString(row.phonetic);
  const englishTranslation = toSafeString(row.englishTranslation);
  const options = toSafeStringArray(row.options);
  const correctOption = toSafeString(row.correctOption);
  const isActive = row.isActive === false ? false : true;

  if (!lessonId) {
    throw new Error(`Invalid item at index ${index}: lessonId is required.`);
  }
  if (!moduleId) {
    throw new Error(`Invalid item at index ${index}: moduleId is required.`);
  }
  if (!chapterId) {
    throw new Error(`Invalid item at index ${index}: chapterId is required.`);
  }
  if (!chapterTitle) {
    throw new Error(`Invalid item at index ${index}: chapterTitle is required.`);
  }
  if (chapterOrder === null) {
    throw new Error(
      `Invalid item at index ${index}: chapterOrder must be a positive integer.`
    );
  }
  if (wordOrder === null) {
    throw new Error(
      `Invalid item at index ${index}: wordOrder must be a positive integer.`
    );
  }
  if (!thaiWord) {
    throw new Error(`Invalid item at index ${index}: thaiWord is required.`);
  }
  if (!phonetic) {
    throw new Error(`Invalid item at index ${index}: phonetic is required.`);
  }
  if (!englishTranslation) {
    throw new Error(
      `Invalid item at index ${index}: englishTranslation is required.`
    );
  }

  return {
    lessonId,
    moduleId,
    chapterId,
    chapterTitle,
    chapterOrder,
    wordOrder,
    thaiWord,
    phonetic,
    englishTranslation,
    options,
    correctOption: correctOption || undefined,
    isActive,
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const moduleId = searchParams.get("moduleId")?.trim() || null;
    const chapterId = searchParams.get("chapterId")?.trim() || null;
    const chapterOrderRaw = searchParams.get("chapterOrder");
    const chapterOrder = parsePositiveInt(chapterOrderRaw);

    if (chapterOrderRaw && chapterOrder === null) {
      return NextResponse.json(
        { error: "chapterOrder must be a positive integer." },
        { status: 400 }
      );
    }

    await connectDB();

    const filter: Record<string, string | number | boolean> = { isActive: true };
    if (moduleId) {
      filter.moduleId = moduleId;
    }
    if (chapterId) {
      filter.chapterId = chapterId;
    }
    if (chapterOrder !== null) {
      filter.chapterOrder = chapterOrder;
    }

    const records = await Vocabulary.find(filter)
      .sort({ moduleId: 1, chapterOrder: 1, wordOrder: 1 })
      .lean();

    const words = records.map((record) => ({
      id: record.lessonId,
      moduleId: record.moduleId,
      chapterId: record.chapterId,
      chapterOrder: record.chapterOrder,
      thaiWord: record.thaiWord,
      phonetic: record.phonetic,
      meaning: record.englishTranslation,
      level:
        MODULE_TITLE_BY_ID.get(record.moduleId) ??
        `Thai Level ${record.moduleId.replace(/k$/i, "")}`,
      chapter: record.chapterTitle,
      options: record.options,
      correctOption: record.correctOption,
    }));

    const availableChapterOrders = Array.from(
      new Set(records.map((record) => record.chapterOrder))
    ).sort((a, b) => a - b);

    return NextResponse.json({
      words,
      total: words.length,
      availableChapterOrders,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message.toLowerCase() : "unknown";
    const isDbUnavailable =
      message.includes("econnrefused") ||
      message.includes("querysrv") ||
      message.includes("timed out") ||
      message.includes("mongodb");

    if (isDbUnavailable) {
      return NextResponse.json(
        {
          words: [],
          total: 0,
          availableChapterOrders: [],
          databaseUnavailable: true,
          warning:
            "Vocabulary backend is currently unavailable. Returning an empty vocabulary list.",
        },
        { status: 200 }
      );
    }

    console.error("Get vocabulary error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const expectedToken = process.env.VOCAB_ADMIN_TOKEN;
  if (!expectedToken) {
    return NextResponse.json(
      {
        error:
          "Server is missing VOCAB_ADMIN_TOKEN. Configure it before importing vocabulary.",
      },
      { status: 500 }
    );
  }

  const requestToken = request.headers.get("x-vocab-admin-token");
  if (requestToken !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as {
      items?: unknown[];
      replaceChapters?: boolean;
    };

    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      return NextResponse.json(
        {
          error:
            "items is required and must be a non-empty array of vocabulary entries.",
        },
        { status: 400 }
      );
    }

    const items = payload.items.map((item, index) => parseWriteItem(item, index));
    const replaceChapters = payload.replaceChapters === true;

    await connectDB();

    if (replaceChapters) {
      const chapterIds = Array.from(new Set(items.map((item) => item.chapterId)));
      await Vocabulary.deleteMany({ chapterId: { $in: chapterIds } });
    }

    const operations = items.map((item) => ({
      updateOne: {
        filter: { lessonId: item.lessonId },
        update: {
          $set: {
            moduleId: item.moduleId,
            chapterId: item.chapterId,
            chapterTitle: item.chapterTitle,
            chapterOrder: item.chapterOrder,
            wordOrder: item.wordOrder,
            thaiWord: item.thaiWord,
            phonetic: item.phonetic,
            englishTranslation: item.englishTranslation,
            options: item.options,
            correctOption: item.correctOption,
            isActive: item.isActive,
          },
        },
        upsert: true,
      },
    }));

    const result = await Vocabulary.bulkWrite(operations, {
      ordered: false,
    });

    return NextResponse.json({
      message: "Vocabulary import completed.",
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount,
    });
  } catch (error) {
    if (error instanceof Error) {
      const validationError =
        error.message.startsWith("Invalid item") ||
        error.message.includes("items is required") ||
        error.name === "SyntaxError";

      if (!validationError) {
        console.error("Import vocabulary error:", error);
      }

      return NextResponse.json(
        { error: error.message },
        { status: validationError ? 400 : 500 }
      );
    }

    console.error("Import vocabulary error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}