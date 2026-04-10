import type { LessonItem } from "@/data/lessons";

export interface ChapterContent {
  id: string;
  moduleId: string;
  title: string;
  order: number;
  lessons: Array<LessonItem & { correctOption: string }>;
}

const CHAPTERS: ChapterContent[] = [
  {
    id: "1k-ch1",
    moduleId: "1k",
    title: "Greetings",
    order: 1,
    lessons: [
      {
        id: "1kch1_01",
        thaiWord: "สวัสดี",
        phonetic: "sa-wat-dee",
        englishTranslation: "Hello",
        options: ["Thank you", "Goodbye", "Hello", "Please"],
        correctOption: "Hello",
      },
      {
        id: "1kch1_02",
        thaiWord: "ขอบคุณ",
        phonetic: "khop-khun",
        englishTranslation: "Thank you",
        options: ["Sorry", "Thanks", "Thank you", "Excuse me"],
        correctOption: "Thank you",
      },
      {
        id: "1kch1_03",
        thaiWord: "ใช่",
        phonetic: "chai",
        englishTranslation: "Yes",
        options: ["No", "Yes", "Later", "Maybe"],
        correctOption: "Yes",
      },
      {
        id: "1kch1_04",
        thaiWord: "ไม่",
        phonetic: "mai",
        englishTranslation: "No",
        options: ["No", "Yes", "Never", "Stop"],
        correctOption: "No",
      },
    ],
  },
  {
    id: "1k-ch2",
    moduleId: "1k",
    title: "Daily Essentials",
    order: 2,
    lessons: [
      {
        id: "1kch2_01",
        thaiWord: "น้ำ",
        phonetic: "naam",
        englishTranslation: "Water",
        options: ["Food", "Water", "Tea", "Cup"],
        correctOption: "Water",
      },
      {
        id: "1kch2_02",
        thaiWord: "อาหาร",
        phonetic: "aa-haan",
        englishTranslation: "Food",
        options: ["Drink", "Food", "Market", "Kitchen"],
        correctOption: "Food",
      },
      {
        id: "1kch2_03",
        thaiWord: "กิน",
        phonetic: "gin",
        englishTranslation: "Eat",
        options: ["Eat", "Drink", "Cook", "Buy"],
        correctOption: "Eat",
      },
      {
        id: "1kch2_04",
        thaiWord: "ช่วย",
        phonetic: "chuay",
        englishTranslation: "Help",
        options: ["Ask", "Help", "Need", "Wait"],
        correctOption: "Help",
      },
    ],
  },
  {
    id: "1k-ch3",
    moduleId: "1k",
    title: "People & Places",
    order: 3,
    lessons: [
      {
        id: "1kch3_01",
        thaiWord: "บ้าน",
        phonetic: "baan",
        englishTranslation: "House",
        options: ["School", "House", "Temple", "Road"],
        correctOption: "House",
      },
      {
        id: "1kch3_02",
        thaiWord: "เพื่อน",
        phonetic: "phuean",
        englishTranslation: "Friend",
        options: ["Family", "Friend", "Teacher", "Doctor"],
        correctOption: "Friend",
      },
      {
        id: "1kch3_03",
        thaiWord: "แม่",
        phonetic: "mae",
        englishTranslation: "Mother",
        options: ["Mother", "Father", "Sister", "Brother"],
        correctOption: "Mother",
      },
      {
        id: "1kch3_04",
        thaiWord: "พ่อ",
        phonetic: "pho",
        englishTranslation: "Father",
        options: ["Uncle", "Brother", "Father", "Grandfather"],
        correctOption: "Father",
      },
    ],
  },
  {
    id: "2k-ch1",
    moduleId: "2k",
    title: "Food & Shopping",
    order: 1,
    lessons: [
      {
        id: "2kch1_01",
        thaiWord: "ตลาด",
        phonetic: "ta-lat",
        englishTranslation: "Market",
        options: ["Market", "Store", "Food", "Money"],
        correctOption: "Market",
      },
      {
        id: "2kch1_02",
        thaiWord: "ราคา",
        phonetic: "raa-khaa",
        englishTranslation: "Price",
        options: ["Cheap", "Price", "Buy", "Pay"],
        correctOption: "Price",
      },
      {
        id: "2kch1_03",
        thaiWord: "ซื้อ",
        phonetic: "seu",
        englishTranslation: "Buy",
        options: ["Sell", "Buy", "Pay", "Take"],
        correctOption: "Buy",
      },
    ],
  },
  {
    id: "2k-ch2",
    moduleId: "2k",
    title: "Travel & Directions",
    order: 2,
    lessons: [
      {
        id: "2kch2_01",
        thaiWord: "ซ้าย",
        phonetic: "sai",
        englishTranslation: "Left",
        options: ["Right", "Left", "Straight", "Back"],
        correctOption: "Left",
      },
      {
        id: "2kch2_02",
        thaiWord: "ขวา",
        phonetic: "khwaa",
        englishTranslation: "Right",
        options: ["Right", "Left", "Ahead", "Down"],
        correctOption: "Right",
      },
      {
        id: "2kch2_03",
        thaiWord: "ตรงไป",
        phonetic: "trong-bpai",
        englishTranslation: "Go straight",
        options: ["Go straight", "Turn", "Stop", "Arrive"],
        correctOption: "Go straight",
      },
    ],
  },
  {
    id: "2k-ch3",
    moduleId: "2k",
    title: "School & Work",
    order: 3,
    lessons: [
      {
        id: "2kch3_01",
        thaiWord: "เรียน",
        phonetic: "rian",
        englishTranslation: "Study",
        options: ["Study", "Work", "Teach", "Read"],
        correctOption: "Study",
      },
      {
        id: "2kch3_02",
        thaiWord: "ครู",
        phonetic: "khruu",
        englishTranslation: "Teacher",
        options: ["Teacher", "Student", "Worker", "Friend"],
        correctOption: "Teacher",
      },
      {
        id: "2kch3_03",
        thaiWord: "ทำงาน",
        phonetic: "tham-ngaan",
        englishTranslation: "Work",
        options: ["Work", "Rest", "Play", "Learn"],
        correctOption: "Work",
      },
    ],
  },
  {
    id: "3k-ch1",
    moduleId: "3k",
    title: "Health & Emotions",
    order: 1,
    lessons: [
      {
        id: "3kch1_01",
        thaiWord: "ป่วย",
        phonetic: "puai",
        englishTranslation: "Sick",
        options: ["Sick", "Healthy", "Pain", "Hospital"],
        correctOption: "Sick",
      },
      {
        id: "3kch1_02",
        thaiWord: "มีความสุข",
        phonetic: "mii-khwaam-suk",
        englishTranslation: "Happy",
        options: ["Happy", "Sad", "Angry", "Calm"],
        correctOption: "Happy",
      },
      {
        id: "3kch1_03",
        thaiWord: "เศร้า",
        phonetic: "sao",
        englishTranslation: "Sad",
        options: ["Sad", "Tired", "Excited", "Strong"],
        correctOption: "Sad",
      },
    ],
  },
  {
    id: "3k-ch2",
    moduleId: "3k",
    title: "Culture & Media",
    order: 2,
    lessons: [
      {
        id: "3kch2_01",
        thaiWord: "วัฒนธรรม",
        phonetic: "wat-tha-na-tham",
        englishTranslation: "Culture",
        options: ["Culture", "Language", "History", "Art"],
        correctOption: "Culture",
      },
      {
        id: "3kch2_02",
        thaiWord: "ข่าว",
        phonetic: "khao",
        englishTranslation: "News",
        options: ["News", "Book", "Movie", "Song"],
        correctOption: "News",
      },
      {
        id: "3kch2_03",
        thaiWord: "ดนตรี",
        phonetic: "don-dtrii",
        englishTranslation: "Music",
        options: ["Music", "Dance", "Poetry", "Drawing"],
        correctOption: "Music",
      },
    ],
  },
  {
    id: "3k-ch3",
    moduleId: "3k",
    title: "Debate & Opinions",
    order: 3,
    lessons: [
      {
        id: "3kch3_01",
        thaiWord: "คิดเห็น",
        phonetic: "khit-hen",
        englishTranslation: "Opinion",
        options: ["Opinion", "Reason", "Question", "Debate"],
        correctOption: "Opinion",
      },
      {
        id: "3kch3_02",
        thaiWord: "เพราะว่า",
        phonetic: "phro-wa",
        englishTranslation: "Because",
        options: ["Because", "Although", "Therefore", "However"],
        correctOption: "Because",
      },
      {
        id: "3kch3_03",
        thaiWord: "เห็นด้วย",
        phonetic: "hen-duai",
        englishTranslation: "Agree",
        options: ["Agree", "Disagree", "Ignore", "Discuss"],
        correctOption: "Agree",
      },
    ],
  },
];

export function getChaptersByModule(moduleId: string) {
  return CHAPTERS.filter((chapter) => chapter.moduleId === moduleId).sort(
    (a, b) => a.order - b.order
  );
}

export function getChapterById(chapterId: string) {
  return CHAPTERS.find((chapter) => chapter.id === chapterId);
}
