export interface Module {
  id: string;
  title: string;
  titleThai: string;
  description: string;
  xp: number;
  icon: string;
  lessons: number;
  chapters: Chapter[];
  gradient: string;
  borderColor: string;
  iconBg: string;
  components: CourseComponent[];
}

export interface CourseComponent {
  id: string;
  title: string;
  titleThai: string;
  type: "aan-khian-thai" | "phuut-thai";
  sections: Section[];
}

export interface Section {
  id: string;
  title: string;
  order: number;
  type: "learn" | "quiz";
}

export interface Chapter {
  id: string;
  title: string;
  order: number;
}

// --- Aan Khian Thai sections for LAT1201 ---
const AKT_LAT1201_SECTIONS: Section[] = [
  { id: "akt-part1", title: "Part One: Thai Characters", order: 1, type: "learn" },
  { id: "akt-l1", title: "Lesson 1: Sounds and Signs", order: 2, type: "learn" },
  { id: "akt-l2", title: "Lesson 2: Thai Syllables", order: 3, type: "learn" },
  { id: "akt-l3", title: "Lesson 3: Mid Consonants — Initials", order: 4, type: "learn" },
  { id: "akt-l4", title: "Lesson 4: Low Consonants — Sonorants", order: 5, type: "learn" },
  { id: "akt-l5", title: "Lesson 5: Initial Mid Consonants and Short Vowels", order: 6, type: "learn" },
  { id: "akt-l6", title: "Lesson 6: Final Mid Consonants", order: 7, type: "learn" },
  { id: "akt-l7", title: "Lesson 7: Tones in Standard Thai — Default Tones", order: 8, type: "learn" },
  { id: "akt-l8", title: "Lesson 8: More on Low Consonants", order: 9, type: "learn" },
  { id: "akt-l9", title: "Lesson 9: High Consonants", order: 10, type: "learn" },
  { id: "akt-l10", title: "Lesson 10: Initial High Consonants in Dead Syllables", order: 11, type: "learn" },
  { id: "akt-l11", title: "Lesson 11: Special High Consonants", order: 12, type: "learn" },
];

// --- Aan Khian Thai sections for LAT2201 ---
const AKT_LAT2201_SECTIONS: Section[] = [
  { id: "akt-l12", title: "Lesson 12: Tones and Tone Marks in Standard Thai", order: 1, type: "learn" },
  { id: "akt-l13", title: "Lesson 13: Initial Mid Consonants and Tone Marks", order: 2, type: "learn" },
  { id: "akt-l14", title: "Lesson 14: Initial High Consonants and Tone Marks", order: 3, type: "learn" },
  { id: "akt-l15", title: "Lesson 15: Initial Low Consonants and Tone Marks", order: 4, type: "learn" },
  { id: "akt-l16", title: "Lesson 16: Consonant Clusters", order: 5, type: "learn" },
  { id: "akt-l17", title: "Lesson 17: Diphthongs", order: 6, type: "learn" },
  { id: "akt-l18", title: "Lesson 18: Special Vowel Forms", order: 7, type: "learn" },
  { id: "akt-l19", title: "Lesson 19: The Regular Irregulars", order: 8, type: "learn" },
  { id: "akt-l20", title: "Lesson 20: Pseudo-clusters", order: 9, type: "learn" },
  { id: "akt-l21", title: "Lesson 21: Miscellaneous", order: 10, type: "learn" },
];

// --- Phuut Thai sections for LAT1201 ---
const PT_LAT1201_SECTIONS: Section[] = [
  { id: "pt-ch1", title: "Chapter 1: At First Sight", order: 1, type: "learn" },
  { id: "pt-ch2", title: "Chapter 2: Snooping", order: 2, type: "learn" },
  { id: "pt-ch3", title: "Chapter 3: Identifying", order: 3, type: "learn" },
  { id: "pt-ch4", title: "Chapter 4: To Possess or Not to Possess", order: 4, type: "learn" },
  { id: "pt-ch5", title: "Chapter 5: Comparing", order: 5, type: "learn" },
];

// --- Phuut Thai sections for LAT2201 ---
const PT_LAT2201_SECTIONS: Section[] = [
  { id: "pt-ch6", title: "Chapter 6: True Thai", order: 1, type: "learn" },
  { id: "pt-ch7", title: "Chapter 7: When It Comes to Numbers", order: 2, type: "learn" },
  { id: "pt-ch8", title: "Chapter 8: Space and Time", order: 3, type: "learn" },
  { id: "pt-ch9", title: "Chapter 9: Give and Take", order: 4, type: "learn" },
  { id: "pt-ch10", title: "Chapter 10: The Story of Takeshi", order: 5, type: "learn" },
];

export const MODULES: Module[] = [
  {
    id: "lat1201",
    title: "LAT1201",
    titleThai: "ภาษาไทยระดับ ๑",
    description: "Thai Language Level 1 — Build foundations in reading, writing, and conversational Thai.",
    xp: 1000,
    icon: "🌱",
    lessons: 17,
    chapters: [
      // Aan Khian Thai chapters
      ...AKT_LAT1201_SECTIONS.map((s) => ({ id: s.id, title: s.title, order: s.order })),
      // Phuut Thai chapters (offset order)
      ...PT_LAT1201_SECTIONS.map((s) => ({ id: s.id, title: s.title, order: s.order + 100 })),
    ],
    gradient: "from-emerald-500 to-teal-500",
    borderColor: "border-emerald-200",
    iconBg: "bg-emerald-50",
    components: [
      {
        id: "lat1201-akt",
        title: "Aan Khian Thai",
        titleThai: "อ่านเขียนไทย",
        type: "aan-khian-thai",
        sections: AKT_LAT1201_SECTIONS,
      },
      {
        id: "lat1201-pt",
        title: "Phuut Thai",
        titleThai: "พูดไทย",
        type: "phuut-thai",
        sections: PT_LAT1201_SECTIONS,
      },
    ],
  },
  {
    id: "lat2201",
    title: "LAT2201",
    titleThai: "ภาษาไทยระดับ ๒",
    description: "Thai Language Level 2 — Advance your writing system mastery and conversational fluency.",
    xp: 2000,
    icon: "🌿",
    lessons: 15,
    chapters: [
      ...AKT_LAT2201_SECTIONS.map((s) => ({ id: s.id, title: s.title, order: s.order })),
      ...PT_LAT2201_SECTIONS.map((s) => ({ id: s.id, title: s.title, order: s.order + 100 })),
    ],
    gradient: "from-blue-500 to-indigo-500",
    borderColor: "border-blue-200",
    iconBg: "bg-blue-50",
    components: [
      {
        id: "lat2201-akt",
        title: "Aan Khian Thai",
        titleThai: "อ่านเขียนไทย",
        type: "aan-khian-thai",
        sections: AKT_LAT2201_SECTIONS,
      },
      {
        id: "lat2201-pt",
        title: "Phuut Thai",
        titleThai: "พูดไทย",
        type: "phuut-thai",
        sections: PT_LAT2201_SECTIONS,
      },
    ],
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

export function getModuleById(moduleId: string) {
  return MODULES.find((m) => m.id === moduleId);
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
  if (idx === -1) return false;
  if (idx === 0) return true;
  return completedIds.includes(chapterId) || completedIds.includes(sequence[idx - 1]);
}

/**
 * Check if a section is unlocked within its specific component (AKT or PT).
 * Each component's first section is always unlocked.
 * Subsequent sections unlock when the previous section in that same component is completed.
 */
export function isSectionUnlockedInComponent(
  sectionId: string,
  componentSections: Section[],
  completedIds: string[]
) {
  const idx = componentSections.findIndex((s) => s.id === sectionId);
  if (idx === -1) return false;
  if (idx === 0) return true; // First section always unlocked
  if (completedIds.includes(sectionId)) return true; // Already completed
  return completedIds.includes(componentSections[idx - 1].id);
}

export function getNextIncompleteChapterInModule(
  moduleId: string,
  completedIds: string[]
) {
  const moduleData = MODULES.find((m) => m.id === moduleId);
  if (!moduleData) return null;
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
  if (!moduleData) return 0;
  return moduleData.chapters.filter((chapter) => completedIds.includes(chapter.id)).length;
}

export function normalizeProgressIds(ids: string[]) {
  const normalized = new Set<string>();
  for (const id of ids) {
    if (ALL_CHAPTER_IDS.includes(id)) {
      normalized.add(id);
      continue;
    }
    const moduleData = MODULES.find((m) => m.id === id);
    if (moduleData) {
      moduleData.chapters.forEach((chapter) => normalized.add(chapter.id));
    }
  }
  return getChapterSequence().filter((id) => normalized.has(id));
}
