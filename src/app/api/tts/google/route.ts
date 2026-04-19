import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_TEXT_LENGTH = 200;

interface GoogleTtsResponse {
  audioContent?: string;
  error?: {
    message?: string;
  };
}

async function synthesizeWithGoogleCloud(
  text: string,
  languageCode: string
): Promise<Buffer | null> {
  const apiKey = process.env.GOOGLE_TTS_API_KEY;
  if (!apiKey) {
    return null;
  }

  const response = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode },
        audioConfig: {
          audioEncoding: "MP3",
          speakingRate: 0.9,
        },
      }),
    }
  );

  const payload = (await response.json()) as GoogleTtsResponse;

  if (!response.ok) {
    const reason = payload.error?.message ?? "Google Cloud TTS request failed";
    throw new Error(reason);
  }

  if (!payload.audioContent) {
    throw new Error("Google Cloud TTS returned an empty audio payload");
  }

  return Buffer.from(payload.audioContent, "base64");
}

async function synthesizeWithTranslateFallback(
  text: string,
  languageCode: string
): Promise<Buffer> {
  const language = languageCode.toLowerCase().startsWith("th") ? "th" : "en";
  const src = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
    text
  )}&tl=${language}&client=tw-ob`;

  const response = await fetch(src, {
    headers: {
      // Some upstreams gate anonymous server fetches unless a browser-like UA is present.
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    },
  });

  if (!response.ok) {
    throw new Error(`Google Translate TTS failed with status ${response.status}`);
  }

  const audioBuffer = await response.arrayBuffer();
  return Buffer.from(audioBuffer);
}

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = checkRateLimit({
    key: `tts:${ip}`,
    limit: 120,
    windowMs: 60 * 1000,
  });

  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many listen requests. Please try again shortly." },
      { status: 429 }
    );
  }

  const text = (request.nextUrl.searchParams.get("text") ?? "").trim();
  const lang = (request.nextUrl.searchParams.get("lang") ?? "th-TH").trim();
  const languageCode = lang.toLowerCase().startsWith("th") ? "th-TH" : "en-US";

  if (!text) {
    return NextResponse.json({ error: "text is required." }, { status: 400 });
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json(
      {
        error: `text must be at most ${MAX_TEXT_LENGTH} characters.`,
      },
      { status: 400 }
    );
  }

  try {
    let audio: Buffer | null = null;

    try {
      audio = await synthesizeWithGoogleCloud(text, languageCode);
    } catch (error) {
      console.warn("Google Cloud TTS failed, falling back to Translate TTS:", error);
    }

    if (!audio) {
      audio = await synthesizeWithTranslateFallback(text, languageCode);
    }

    return new NextResponse(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("TTS synthesize error:", error);
    return NextResponse.json(
      { error: "Unable to synthesize audio right now." },
      { status: 502 }
    );
  }
}