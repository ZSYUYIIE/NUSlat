export interface Module {
  id: string;
  title: string;
  description: string;
  xp: number;
  icon: string;
  lessons: number;
  chapters: Chapter[];
  gradient: string;
  borderColor: string;
  iconBg: string;
}

export interface Chapter {
  id: string;
  title: string;
  order: number;
}

export const MODULES: Module[] = [
  {
    id: "1k",
    title: "1,000 Words",
    description:
      "Master your first 1,000 essential vocabulary words and build a solid foundation.",
    xp: 500,
    icon: "🌱",
    lessons: 20,
    chapters: [
      { id: "1k-ch1", title: "Greetings", order: 1 },
      { id: "1k-ch2", title: "Daily Essentials", order: 2 },
      { id: "1k-ch3", title: "People & Places", order: 3 },
    ],
    gradient: "from-emerald-500 to-teal-500",
    borderColor: "border-emerald-200",
    iconBg: "bg-emerald-50",
  },
  {
    id: "2k",
    title: "2,000 Words",
    description:
      "Expand your vocabulary to 2,000 words and tackle intermediate topics.",
    xp: 1000,
    icon: "🌿",
    lessons: 25,
    chapters: [
      { id: "2k-ch1", title: "Food & Shopping", order: 1 },
      { id: "2k-ch2", title: "Travel & Directions", order: 2 },
      { id: "2k-ch3", title: "School & Work", order: 3 },
    ],
    gradient: "from-blue-500 to-indigo-500",
    borderColor: "border-blue-200",
    iconBg: "bg-blue-50",
  },
  {
    id: "3k",
    title: "3,000 Words",
    description:
      "Achieve advanced vocabulary mastery with 3,000 words and complex structures.",
    xp: 1500,
    icon: "🌳",
    lessons: 30,
    chapters: [
      { id: "3k-ch1", title: "Health & Emotions", order: 1 },
      { id: "3k-ch2", title: "Culture & Media", order: 2 },
      { id: "3k-ch3", title: "Debate & Opinions", order: 3 },
    ],
    gradient: "from-violet-500 to-purple-500",
    borderColor: "border-violet-200",
    iconBg: "bg-violet-50",
  },
];

export const ALL_CHAPTER_IDS = MODULES.flatMap((module) =>
  module.chapters.map((chapter) => chapter.id)
);

export function getChapterSequence() {
  return MODULES.flatMap((module) => module.chapters.map((chapter) => chapter.id));
}

export function getModuleByChapterId(chapterId: string) {
  return MODULES.find((module) =>
    module.chapters.some((chapter) => chapter.id === chapterId)
  );
}

export function getNextChapterId(chapterId: string) {
  const sequence = getChapterSequence();
  const idx = sequence.indexOf(chapterId);
  if (idx === -1 || idx === sequence.length - 1) {
    return null;
  }
  return sequence[idx + 1];
}

export function isChapterUnlocked(chapterId: string, completedIds: string[]) {
  const sequence = getChapterSequence();
  const idx = sequence.indexOf(chapterId);
  if (idx === -1) {
    return false;
  }
  if (idx === 0) {
    return true;
  }
  return completedIds.includes(chapterId) || completedIds.includes(sequence[idx - 1]);
}

export function getNextIncompleteChapterInModule(
  moduleId: string,
  completedIds: string[]
) {
  const moduleData = MODULES.find((m) => m.id === moduleId);
  if (!moduleData) {
    return null;
  }

  return (
    moduleData.chapters.find((chapter) => !completedIds.includes(chapter.id))?.id ??
    moduleData.chapters[0]?.id ??
    null
  );
}

export function getCompletedChapterCountByModule(
  moduleId: string,
  completedIds: string[]
) {
  const moduleData = MODULES.find((m) => m.id === moduleId);
  if (!moduleData) {
    return 0;
  }
  return moduleData.chapters.filter((chapter) => completedIds.includes(chapter.id)).length;
}

export function normalizeProgressIds(ids: string[]) {
  const normalized = new Set<string>();

  for (const id of ids) {
    if (ALL_CHAPTER_IDS.includes(id)) {
      normalized.add(id);
      continue;
    }

    // Backward compatibility: old module-level IDs convert to all its chapters.
    const moduleData = MODULES.find((m) => m.id === id);
    if (moduleData) {
      moduleData.chapters.forEach((chapter) => normalized.add(chapter.id));
    }
  }

  return getChapterSequence().filter((id) => normalized.has(id));
}
