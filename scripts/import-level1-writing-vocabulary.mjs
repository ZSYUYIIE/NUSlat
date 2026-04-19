import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import dns from "node:dns";
import mongoose from "mongoose";

const PUBLIC_DNS_FALLBACK = ["8.8.8.8", "1.1.1.1"];

function isSrvLookupRefused(error) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return message.includes("querysrv") && message.includes("econnrefused");
}

function parseConfiguredDnsServers() {
  const raw = process.env.MONGODB_DNS_SERVERS;
  if (!raw) {
    return [];
  }

  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function isLoopbackResolver(server) {
  return server === "127.0.0.1" || server === "::1";
}

function getRetryDnsServers() {
  const configured = parseConfiguredDnsServers();
  if (configured.length > 0) {
    return configured;
  }

  const current = dns.getServers();
  if (current.length > 0 && current.every(isLoopbackResolver)) {
    return PUBLIC_DNS_FALLBACK;
  }

  return [];
}

async function connectMongoWithDnsRetry(uri) {
  try {
    await mongoose.connect(uri, { bufferCommands: false });
    return;
  } catch (error) {
    if (!isSrvLookupRefused(error)) {
      throw error;
    }

    const retryDnsServers = getRetryDnsServers();
    if (retryDnsServers.length === 0) {
      throw error;
    }

    dns.setServers(retryDnsServers);
    await mongoose.connect(uri, { bufferCommands: false });
  }
}

function parseEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) {
    return null;
  }

  const separatorIndex = trimmed.indexOf("=");
  if (separatorIndex === -1) {
    return null;
  }

  const key = trimmed.slice(0, separatorIndex).trim();
  if (!key) {
    return null;
  }

  let value = trimmed.slice(separatorIndex + 1).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return { key, value };
}

async function loadEnvFromFile(filePath) {
  try {
    const content = await readFile(filePath, "utf8");
    const lines = content.split(/\r?\n/);

    for (const line of lines) {
      const parsed = parseEnvLine(line);
      if (!parsed) {
        continue;
      }

      if (!process.env[parsed.key]) {
        process.env[parsed.key] = parsed.value;
      }
    }
  } catch {
    // Ignore missing env file; required vars are validated later.
  }
}

const VocabularySchema = new mongoose.Schema(
  {
    lessonId: { type: String, required: true, unique: true },
    moduleId: { type: String, required: true },
    chapterId: { type: String, required: true },
    chapterTitle: { type: String, required: true },
    chapterOrder: { type: Number, required: true },
    wordOrder: { type: Number, required: true },
    thaiWord: { type: String, required: true },
    phonetic: { type: String, required: true },
    englishTranslation: { type: String, required: true },
    options: { type: [String], default: [] },
    correctOption: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    collection: "vocabularies",
    timestamps: true,
  }
);

const Vocabulary =
  mongoose.models.VocabularyImport ||
  mongoose.model("VocabularyImport", VocabularySchema, "vocabularies");

async function main() {
  await loadEnvFromFile(path.join(process.cwd(), ".env.local"));

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is required in your environment or .env.local.");
  }

  const payloadPath = path.join(
    process.cwd(),
    "src",
    "data",
    "seeds",
    "level1-writing-vocabulary.json"
  );

  const payloadText = await readFile(payloadPath, "utf8");
  const items = JSON.parse(payloadText);

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Seed payload is empty or invalid JSON array.");
  }

  await connectMongoWithDnsRetry(mongoUri);

  const chapterIds = Array.from(
    new Set(
      items
        .map((item) => item && typeof item === "object" && "chapterId" in item ? item.chapterId : null)
        .filter((chapterId) => typeof chapterId === "string" && chapterId)
    )
  );

  if (chapterIds.length > 0) {
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
          options: Array.isArray(item.options) ? item.options : [],
          correctOption: item.correctOption,
          isActive: item.isActive !== false,
        },
      },
      upsert: true,
    },
  }));

  const result = await Vocabulary.bulkWrite(operations, {
    ordered: false,
  });

  await mongoose.disconnect();

  console.log("Level 1 writing vocabulary import succeeded:");
  console.log(
    JSON.stringify(
      {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        upsertedCount: result.upsertedCount,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  mongoose.disconnect().catch(() => undefined);
  console.error("Import failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
