let activeAudio: HTMLAudioElement | null = null;

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve([]);
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    const timer = window.setTimeout(() => {
      resolve(window.speechSynthesis.getVoices());
    }, 300);

    window.speechSynthesis.onvoiceschanged = () => {
      window.clearTimeout(timer);
      resolve(window.speechSynthesis.getVoices());
    };
  });
}

async function playWithSpeechSynthesis(text: string): Promise<boolean> {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return false;
  }

  const voices = await loadVoices();
  const thaiVoice = voices.find(
    (voice) =>
      voice.lang.toLowerCase().startsWith("th") ||
      voice.name.toLowerCase().includes("thai")
  );

  // If no Thai-capable voice is available, prefer URL fallback audio.
  if (!thaiVoice) {
    return false;
  }

  return new Promise((resolve) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "th-TH";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.voice = thaiVoice;
    utterance.onend = () => resolve(true);
    utterance.onerror = () => resolve(false);

    window.speechSynthesis.speak(utterance);
  });
}

function playWithAudioUrl(text: string): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (activeAudio) {
    activeAudio.pause();
    activeAudio = null;
  }

  const encoded = encodeURIComponent(text);
  const src = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=th&client=tw-ob`;

  const audio = new Audio(src);
  activeAudio = audio;

  return new Promise((resolve) => {
    audio.onended = () => {
      if (activeAudio === audio) {
        activeAudio = null;
      }
      resolve();
    };

    audio.onerror = () => {
      if (activeAudio === audio) {
        activeAudio = null;
      }
      resolve();
    };

    audio.play().catch(() => resolve());
  });
}

export async function playThaiAudio(text: string) {
  const playedWithSpeech = await playWithSpeechSynthesis(text);
  if (playedWithSpeech) {
    return;
  }
  await playWithAudioUrl(text);
}
