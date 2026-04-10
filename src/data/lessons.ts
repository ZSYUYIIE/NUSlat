export interface LessonItem {
  id: string;
  thaiWord: string;
  phonetic: string;
  englishTranslation: string;
  options: string[];
}

export const LESSONS_1K: LessonItem[] = [
  {
    id: "1k_01",
    thaiWord: "สวัสดี",
    phonetic: "sa-wàt-dee",
    englishTranslation: "Hello / Goodbye",
    options: ["Goodbye", "Thank you", "Hello", "Excuse me"],
  },
  {
    id: "1k_02",
    thaiWord: "ขอบคุณ",
    phonetic: "khop-khun",
    englishTranslation: "Thank you",
    options: ["Sorry", "Please", "Thank you", "No"],
  },
  {
    id: "1k_03",
    thaiWord: "ช่วย",
    phonetic: "chuay",
    englishTranslation: "Help",
    options: ["Ask", "Help", "Want", "Stop"],
  },
  {
    id: "1k_04",
    thaiWord: "ใช่",
    phonetic: "chai",
    englishTranslation: "Yes",
    options: ["Yes", "No", "Maybe", "Always"],
  },
  {
    id: "1k_05",
    thaiWord: "ไม่",
    phonetic: "mai",
    englishTranslation: "No",
    options: ["Yes", "Not", "No", "Never"],
  },
  {
    id: "1k_06",
    thaiWord: "อาหาร",
    phonetic: "aa-haan",
    englishTranslation: "Food",
    options: ["Drink", "Food", "Water", "Cook"],
  },
  {
    id: "1k_07",
    thaiWord: "น้ำ",
    phonetic: "naam",
    englishTranslation: "Water",
    options: ["Water", "Tea", "Food", "Cup"],
  },
  {
    id: "1k_08",
    thaiWord: "บ้าน",
    phonetic: "baan",
    englishTranslation: "House",
    options: ["School", "House", "Shop", "Temple"],
  },
  {
    id: "1k_09",
    thaiWord: "เพื่อน",
    phonetic: "phuean",
    englishTranslation: "Friend",
    options: ["Family", "Friend", "Teacher", "Doctor"],
  },
  {
    id: "1k_10",
    thaiWord: "ช่วงเช้า",
    phonetic: "chuang-chao",
    englishTranslation: "Morning",
    options: ["Night", "Afternoon", "Morning", "Evening"],
  },
  {
    id: "1k_11",
    thaiWord: "แม่",
    phonetic: "mae",
    englishTranslation: "Mother",
    options: ["Father", "Mother", "Sister", "Brother"],
  },
  {
    id: "1k_12",
    thaiWord: "พ่อ",
    phonetic: "pho",
    englishTranslation: "Father",
    options: ["Uncle", "Father", "Grandfather", "Brother"],
  },
  {
    id: "1k_13",
    thaiWord: "ทำงาน",
    phonetic: "tham-ngan",
    englishTranslation: "Work",
    options: ["Play", "Work", "Study", "Sleep"],
  },
  {
    id: "1k_14",
    thaiWord: "ศึกษา",
    phonetic: "suk-sa",
    englishTranslation: "Study",
    options: ["Work", "Play", "Study", "Teach"],
  },
  {
    id: "1k_15",
    thaiWord: "รัก",
    phonetic: "rak",
    englishTranslation: "Love",
    options: ["Like", "Love", "Enjoy", "Want"],
  },
  {
    id: "1k_16",
    thaiWord: "ชื่อ",
    phonetic: "chuea",
    englishTranslation: "Name",
    options: ["Name", "Place", "Person", "Title"],
  },
  {
    id: "1k_17",
    thaiWord: "อายุ",
    phonetic: "aa-yu",
    englishTranslation: "Age",
    options: ["Age", "Year", "Time", "Date"],
  },
  {
    id: "1k_18",
    thaiWord: "สุขสวัสดิ์",
    phonetic: "suk-sa-wat",
    englishTranslation: "Good luck / Happiness",
    options: ["Sad", "Happy", "Good luck", "Sorry"],
  },
  {
    id: "1k_19",
    thaiWord: "กิน",
    phonetic: "gin",
    englishTranslation: "Eat",
    options: ["Drink", "Eat", "Cook", "Buy"],
  },
  {
    id: "1k_20",
    thaiWord: "เดิน",
    phonetic: "doen",
    englishTranslation: "Walk",
    options: ["Run", "Walk", "Jump", "Sit"],
  },
];

// Maps module IDs to their lesson data
export const LESSONS_BY_MODULE: Record<string, LessonItem[]> = {
  "1k": LESSONS_1K,
};

export function getLessonsByModule(moduleId: string): LessonItem[] {
  return LESSONS_BY_MODULE[moduleId] || [];
}
