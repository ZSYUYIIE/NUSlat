export interface AktLesson {
  id: string;
  courseId: string;
  title: string;
  order: number;
  sections: AktSection[];
  quizQuestions: QuizQuestion[];
}

export interface AktSection {
  type: "text" | "table" | "note";
  title?: string;
  content: string;
  tableData?: string[][];
}

export interface QuizQuestion {
  id: string;
  type: "multiple-choice" | "fill-blank" | "true-false";
  question: string;
  questionThai?: string;
  options?: string[];
  correctAnswer: string;
}

export const AKT_LESSONS: AktLesson[] = [
  {
    id: "akt-part1",
    courseId: "lat1201",
    title: "Part One: Thai Characters",
    order: 1,
    sections: [
      { type: "text", title: "Consonants", content: "There are 44 consonant symbols in the Thai writing system. They are ordered after the Indic script." },
      { type: "table", title: "Sample Consonants", content: "", tableData: [
        ["Thai", "Name", "Sound"],
        ["ก", "กอ ไก่", "k"],
        ["ข", "ขอ ไข่", "kh"],
        ["ค", "คอ ควาย", "kh"],
        ["ง", "งอ งู", "ng"],
        ["จ", "จอ จาน", "c"],
        ["ช", "ชอ ช้าง", "ch"],
        ["ด", "ดอ เด็ก", "d"],
        ["ต", "ตอ เต่า", "t"],
        ["บ", "บอ ใบไม้", "b"],
        ["ป", "ปอ ปลา", "p"],
        ["อ", "ออ อ่าง", "ʔ"],
      ]},
      { type: "text", title: "Vowels", content: "Thai has 9 simple vowels (monophthongs) that can be short or long, plus 3 diphthongs (ia, ua, ɯa)." },
      { type: "table", title: "Simple Vowels", content: "", tableData: [
        ["Short", "Long", "Example"],
        ["a", "aa", "กา (kaa) — crow"],
        ["i", "ii", "ตี (tii) — to hit"],
        ["u", "uu", "ปู (puu) — crab"],
        ["e", "ee", "เก (kee) — you"],
        ["ɛ", "ɛɛ", "แก (kɛɛ) — he/she"],
        ["o", "oo", "โต (too) — big"],
        ["ɔ", "ɔɔ", "กอ (kɔɔ) — hug"],
        ["ɯ", "ɯɯ", "คือ (khɯɯ) — is"],
        ["ə", "əə", "เออ (ʔəə) — um"],
      ]},
      { type: "text", title: "Tone Marks", content: "Thai has 4 tone marks: ่ (mai eek), ้ (mai tho), ๊ (mai tri), ๋ (mai jattawa)." },
      { type: "text", title: "Thai Numbers", content: "๐ ๑ ๒ ๓ ๔ ๕ ๖ ๗ ๘ ๙ correspond to 0–9." },
    ],
    quizQuestions: [
      { id: "akt-p1-q1", type: "multiple-choice", question: "What sound does ก make?", options: ["k", "kh", "g", "ng"], correctAnswer: "k" },
      { id: "akt-p1-q2", type: "multiple-choice", question: "What is the name of ช?", options: ["ชอ ช้าง", "ชอ ฉิ่ง", "จอ จาน", "ซอ โซ่"], correctAnswer: "ชอ ช้าง" },
      { id: "akt-p1-q3", type: "multiple-choice", question: "How many consonant symbols are there in Thai?", options: ["21", "32", "44", "48"], correctAnswer: "44" },
      { id: "akt-p1-q4", type: "multiple-choice", question: "Which Thai numeral represents 5?", options: ["๓", "๕", "๗", "๙"], correctAnswer: "๕" },
    ],
  },
  {
    id: "akt-l1",
    courseId: "lat1201",
    title: "Lesson 1: Sounds and Signs",
    order: 2,
    sections: [
      { type: "text", title: "The Sounds of Thai", content: "Modern Standard Thai has 21 consonant sounds and 21 vowels. Consonant sounds are divided into three groups: Plain stops (p, t, k, c, b, d, ʔ), Aspirated stops and fricatives (ph, th, kh, ch, f, s, h), and Sonorants (m, n, ŋ, y, r, w, l)." },
      { type: "text", title: "Vowels", content: "Monophthongs — short: a, i, ɯ, u, e, ɛ, o, ɔ, ə; long: aa, ii, ɯɯ, uu, ee, ɛɛ, oo, ɔɔ, əə. Diphthongs: ia, ɯa, ua." },
      { type: "text", title: "Tones", content: "Thai has five distinct tones: mid, low, falling, high, and rising." },
      { type: "text", title: "The Signs of Thai", content: "The Thai alphabet is based on ancient Khmer and Mon scripts, derived from southern Indian scripts. King Ramkhamhaeng of Sukhothai is credited with developing the Thai writing system in 1283." },
    ],
    quizQuestions: [
      { id: "akt-l1-q1", type: "multiple-choice", question: "How many consonant sounds are in Standard Thai?", options: ["18", "21", "44", "32"], correctAnswer: "21" },
      { id: "akt-l1-q2", type: "multiple-choice", question: "How many tones does Standard Thai have?", options: ["3", "4", "5", "6"], correctAnswer: "5" },
      { id: "akt-l1-q3", type: "multiple-choice", question: "Which group does 'm' belong to?", options: ["Plain stops", "Aspirated stops", "Sonorants", "Fricatives"], correctAnswer: "Sonorants" },
    ],
  },
  {
    id: "akt-l2",
    courseId: "lat1201",
    title: "Lesson 2: Thai Syllables",
    order: 3,
    sections: [
      { type: "text", title: "Open and Closed Syllables", content: "Thai syllables are categorized as open (ending with a vowel: CV, CVV) and closed (ending with a consonant: CVC, CVVC)." },
      { type: "text", title: "Consonant Groups", content: "Thai consonants are divided into three groups by their tonal effect: Mid consonants (column #1 + อ), High consonants (column #2 + ศ, ษ, ส, ห), Low consonants (columns #3, 4, 5 + ย, ร, ล, ว, ฮ, ฬ)." },
      { type: "table", title: "Consonant Chart 1", content: "", tableData: [
        ["Place", "1 (Mid)", "2 (High)", "3 (Low)", "4 (Low)", "5 (Low)"],
        ["Velar", "ก k", "ข kh", "ค kh", "ฆ kh", "ง ng"],
        ["Palatal", "จ c", "ฉ ch", "ช ch", "ซ s", "ญ y"],
        ["Alveolar", "ฎ d / ฏ t", "ฐ th", "ฑ th", "ฒ th", "ณ n"],
        ["Alveolar", "ด d / ต t", "ถ th", "ท th", "ธ th", "น n"],
        ["Bilabial", "บ b / ป p", "ผ ph / ฝ f", "พ ph / ฟ f", "ภ ph", "ม m"],
      ]},
    ],
    quizQuestions: [
      { id: "akt-l2-q1", type: "multiple-choice", question: "An open syllable ends with a:", options: ["Consonant", "Vowel", "Tone mark", "Cluster"], correctAnswer: "Vowel" },
      { id: "akt-l2-q2", type: "multiple-choice", question: "Which group does ก belong to?", options: ["Mid", "High", "Low"], correctAnswer: "Mid" },
      { id: "akt-l2-q3", type: "multiple-choice", question: "Which group does ข belong to?", options: ["Mid", "High", "Low"], correctAnswer: "High" },
    ],
  },
  {
    id: "akt-l3", courseId: "lat1201", title: "Lesson 3: Mid Consonants — Initials", order: 4,
    sections: [
      { type: "table", title: "Initial Mid Consonants", content: "", tableData: [
        ["Thai", "Sound", "Name"],
        ["ก", "k", "กอ ไก่"], ["จ", "c", "จอ จาน"], ["ฎ", "d", "ดอ ชฎา"], ["ฏ", "t", "ตอ ปฏัก"],
        ["ด", "d", "ดอ เด็ก"], ["ต", "t", "ตอ เต่า"], ["บ", "b", "บอ ใบไม้"], ["ป", "p", "ปอ ปลา"], ["อ", "ʔ", "ออ อ่าง"],
      ]},
      { type: "table", title: "Long Simple Vowels", content: "", tableData: [
        ["Thai Form", "Sound"], ["-า", "aa"], ["-ี", "ii"], ["-ู", "uu"], ["-ือ", "ɯɯ"],
        ["แ-", "ɛɛ"], ["เ-", "ee"], ["โ-", "oo"], ["-อ", "ɔɔ"], ["เ-อ", "əə"],
      ]},
    ],
    quizQuestions: [
      { id: "akt-l3-q1", type: "multiple-choice", question: "Write กา in phonetic:", options: ["kaa", "kii", "kuu", "kɔɔ"], correctAnswer: "kaa" },
      { id: "akt-l3-q2", type: "multiple-choice", question: "What does ตี mean?", options: ["to hit", "crow", "crab", "you"], correctAnswer: "to hit" },
      { id: "akt-l3-q3", type: "multiple-choice", question: "Which Thai script represents 'puu' (crab)?", options: ["ปู", "ปี", "ปา", "ปอ"], correctAnswer: "ปู" },
    ],
  },
  {
    id: "akt-l4", courseId: "lat1201", title: "Lesson 4: Low Consonants — Sonorants", order: 5,
    sections: [
      { type: "table", title: "Initial Sonorants", content: "", tableData: [
        ["Thai", "Sound", "Name"],
        ["ง", "ng", "งอ งู"], ["น", "n", "นอ หนู"], ["ม", "m", "มอ ม้า"],
        ["ย", "y", "ยอ ยักษ์"], ["ร", "r", "รอ เรือ"], ["ล", "l", "ลอ ลิง"], ["ว", "w", "วอ แหวน"],
      ]},
      { type: "table", title: "Final Sonorants", content: "Sonorants can also appear in final position.", tableData: [
        ["Final Sound", "Thai"], ["ng", "ง"], ["n", "น"], ["m", "ม"], ["y", "ย"], ["w", "ว"],
      ]},
    ],
    quizQuestions: [
      { id: "akt-l4-q1", type: "multiple-choice", question: "What is the phonetic for จาน?", options: ["caan", "ciin", "caan", "cuun"], correctAnswer: "caan" },
      { id: "akt-l4-q2", type: "multiple-choice", question: "What does ยาว mean?", options: ["to be long", "to sleep", "to forget", "to die"], correctAnswer: "to be long" },
    ],
  },
  {
    id: "akt-l5", courseId: "lat1201", title: "Lesson 5: Initial Mid Consonants and Short Vowels", order: 6,
    sections: [
      { type: "text", title: "Short Vowels", content: "Open syllables with initial Mid consonant and a short vowel always have low tone. Example: จะ (càʔ) = 'will'." },
      { type: "table", title: "Tone Rules So Far", content: "", tableData: [
        ["Initial", "Vowel", "Final", "Tone", "Example"],
        ["Mid", "long", "—", "mid", "kaa"], ["Mid", "long", "sonorant", "mid", "kaan"],
        ["Mid", "short", "sonorant", "mid", "kan"], ["Mid", "short", "—", "low", "kàʔ"],
      ]},
    ],
    quizQuestions: [
      { id: "akt-l5-q1", type: "multiple-choice", question: "What tone does จะ have?", options: ["mid", "low", "high", "falling"], correctAnswer: "low" },
      { id: "akt-l5-q2", type: "multiple-choice", question: "What does เป็น mean?", options: ["to be", "to go", "duck", "to bite"], correctAnswer: "to be" },
    ],
  },
  {
    id: "akt-l6", courseId: "lat1201", title: "Lesson 6: Final Mid Consonants", order: 7,
    sections: [
      { type: "table", title: "Final Mid Consonants", content: "", tableData: [
        ["Thai", "Initial", "Final"], ["ก", "k", "k"], ["จ", "c", "t"], ["ด", "d", "t"], ["บ", "b", "p"], ["อ", "ʔ", "—"],
      ]},
      { type: "text", title: "New Tone Rules", content: "Mid short + Mid final = low tone (e.g., กับ kàp). Mid long + Mid final = low tone (e.g., กาบ kàap)." },
    ],
    quizQuestions: [
      { id: "akt-l6-q1", type: "multiple-choice", question: "What is the final sound of จ?", options: ["t", "c", "k", "p"], correctAnswer: "t" },
      { id: "akt-l6-q2", type: "multiple-choice", question: "What does ปิด mean?", options: ["to close", "to open", "to cut", "to hit"], correctAnswer: "to close" },
    ],
  },
  {
    id: "akt-l7", courseId: "lat1201", title: "Lesson 7: Tones — Default Tones", order: 8,
    sections: [
      { type: "text", title: "Live and Dead Syllables", content: "Live syllables: open + long vowel (CVV), or closed + sonorant final (CVC/CVVC with n,m,ng,w,y). Dead syllables: open + short vowel (CV), or closed + oral stop final (CVC/CVVC with p,t,k)." },
      { type: "table", title: "Default Tones", content: "", tableData: [
        ["Initial", "Live (long)", "Live (short)", "Dead (long)", "Dead (short)"],
        ["Mid", "mid", "mid", "low", "low"],
        ["High", "rising", "rising", "low", "low"],
        ["Low", "mid", "mid", "falling", "high"],
      ]},
    ],
    quizQuestions: [
      { id: "akt-l7-q1", type: "multiple-choice", question: "กา (Mid + Live + Long) has what default tone?", options: ["mid", "low", "rising", "falling"], correctAnswer: "mid" },
      { id: "akt-l7-q2", type: "true-false", question: "Dead syllables include open syllables with short vowels.", options: ["True", "False"], correctAnswer: "True" },
    ],
  },
  {
    id: "akt-l8", courseId: "lat1201", title: "Lesson 8: More on Low Consonants", order: 9,
    sections: [
      { type: "text", title: "All Low Consonants", content: "There are 24 Low consonants total. New ones include: ค (kh), ช (ch), ซ (s), ท (th), พ (ph), ฟ (f), ฮ (h)." },
    ],
    quizQuestions: [
      { id: "akt-l8-q1", type: "multiple-choice", question: "What sound does ฟ make initially?", options: ["f", "ph", "p", "b"], correctAnswer: "f" },
    ],
  },
  {
    id: "akt-l9", courseId: "lat1201", title: "Lesson 9: High Consonants", order: 10,
    sections: [
      { type: "text", title: "High Consonants", content: "11 High consonants: ข (kh), ฃ (kh, obsolete), ฉ (ch), ฐ (th), ถ (th), ผ (ph), ฝ (f), ศ (s), ษ (s), ส (s), ห (h)." },
    ],
    quizQuestions: [
      { id: "akt-l9-q1", type: "multiple-choice", question: "Which group does ส belong to?", options: ["Mid", "High", "Low"], correctAnswer: "High" },
    ],
  },
  {
    id: "akt-l10", courseId: "lat1201", title: "Lesson 10: Initial High Consonants in Dead Syllables", order: 11,
    sections: [
      { type: "text", title: "High Consonants in Dead Syllables", content: "High initial + dead syllable (long vowel) = low tone. High initial + dead syllable (short vowel) = low tone. Examples: ขูด (khùut), สิบ (sìp), หก (hòk)." },
    ],
    quizQuestions: [
      { id: "akt-l10-q1", type: "multiple-choice", question: "What tone does สิบ (sìp) have?", options: ["low", "mid", "high", "rising"], correctAnswer: "low" },
    ],
  },
  {
    id: "akt-l11", courseId: "lat1201", title: "Lesson 11: Special High Consonants", order: 12,
    sections: [
      { type: "text", title: "High Sonorants", content: "7 Low sonorant sounds gain High sonorant counterparts by prefixing ห: หง (ng), หน (n), หม (m), หย/หญ (y), หร (r), หล (l), หว (w). These follow High consonant tone rules." },
    ],
    quizQuestions: [
      { id: "akt-l11-q1", type: "multiple-choice", question: "หมา has what default tone?", options: ["rising", "mid", "low", "falling"], correctAnswer: "rising" },
      { id: "akt-l11-q2", type: "multiple-choice", question: "What does หนัก mean?", options: ["heavy", "light", "small", "big"], correctAnswer: "heavy" },
    ],
  },
  // --- LAT2201 Lessons ---
  {
    id: "akt-l12", courseId: "lat2201", title: "Lesson 12: Tones and Tone Marks", order: 1,
    sections: [
      { type: "text", title: "Four Tone Marks", content: "่ mai eek (1st mark), ้ mai tho (2nd mark), ๊ mai tri (3rd mark), ๋ mai jattawa (4th mark). They mark non-default tones." },
    ],
    quizQuestions: [
      { id: "akt-l12-q1", type: "multiple-choice", question: "How many tone marks exist in Thai?", options: ["3", "4", "5", "6"], correctAnswer: "4" },
    ],
  },
  { id: "akt-l13", courseId: "lat2201", title: "Lesson 13: Mid Consonants and Tone Marks", order: 2, sections: [{ type: "text", title: "Mid + Tone Marks", content: "Mid consonant live syllables can bear all 5 tones using all 4 tone marks. Dead syllables can bear 3 tones with 2 marks." }], quizQuestions: [{ id: "akt-l13-q1", type: "multiple-choice", question: "Mid consonant live syllables can bear how many tones?", options: ["3", "4", "5"], correctAnswer: "5" }] },
  { id: "akt-l14", courseId: "lat2201", title: "Lesson 14: High Consonants and Tone Marks", order: 3, sections: [{ type: "text", title: "High + Tone Marks", content: "High consonant live syllables can bear 3 tones with 2 tone marks. Dead syllables bear 2 tones with 1 mark." }], quizQuestions: [{ id: "akt-l14-q1", type: "multiple-choice", question: "High consonant live syllables can bear how many tones?", options: ["2", "3", "5"], correctAnswer: "3" }] },
  { id: "akt-l15", courseId: "lat2201", title: "Lesson 15: Low Consonants and Tone Marks", order: 4, sections: [{ type: "text", title: "Low + Tone Marks", content: "Low consonant live syllables can bear 3 tones with 2 marks. Dead syllables bear 2 tones with 1 mark." }], quizQuestions: [{ id: "akt-l15-q1", type: "multiple-choice", question: "Low consonant dead syllables can bear how many tones?", options: ["2", "3", "5"], correctAnswer: "2" }] },
  { id: "akt-l16", courseId: "lat2201", title: "Lesson 16: Consonant Clusters", order: 5, sections: [{ type: "text", title: "Clusters", content: "11 consonant clusters in Thai: kr, kl, kw, khr, khl, khw, pr, pl, phr, phl, tr. The tone is determined by the first consonant." }], quizQuestions: [{ id: "akt-l16-q1", type: "multiple-choice", question: "What does ครู mean?", options: ["teacher", "student", "school", "class"], correctAnswer: "teacher" }] },
  { id: "akt-l17", courseId: "lat2201", title: "Lesson 17: Diphthongs", order: 6, sections: [{ type: "text", title: "Diphthongs", content: "Three diphthongs: /ia/ (เ-ีย), /ɯa/ (เ-ือ), /ua/ (-ว/-วX). Example: เรียน (rian) = to study." }], quizQuestions: [{ id: "akt-l17-q1", type: "multiple-choice", question: "What does เรียน mean?", options: ["to study", "to teach", "to read", "to write"], correctAnswer: "to study" }] },
  { id: "akt-l18", courseId: "lat2201", title: "Lesson 18: Special Vowel Forms", order: 7, sections: [{ type: "text", title: "Special Forms", content: "Special vowel signs: ำ (am), ไ/ใ (ay), เ-า (aw). Only 20 words use ใ (mai muan); all others use ไ (mai malai)." }], quizQuestions: [{ id: "akt-l18-q1", type: "multiple-choice", question: "What does ทำ mean?", options: ["to do/make", "to go", "to give", "to eat"], correctAnswer: "to do/make" }] },
  { id: "akt-l19", courseId: "lat2201", title: "Lesson 19: The Regular Irregulars", order: 8, sections: [{ type: "text", title: "Regular Irregulars", content: "Includes อย- initial (อย่า, อยู่, อย่าง, อยาก), lengthened vowels (น้ำ pronounced náam), short vowels written long, and tone changes in rapid speech." }], quizQuestions: [{ id: "akt-l19-q1", type: "multiple-choice", question: "What does อยาก mean?", options: ["to want", "to stay", "don't", "a kind"], correctAnswer: "to want" }] },
  { id: "akt-l20", courseId: "lat2201", title: "Lesson 20: Pseudo-clusters", order: 9, sections: [{ type: "text", title: "Pseudo-clusters", content: "Two adjacent consonants that don't form a real cluster. The first has a hidden short /a/. Examples: ขนม (khanǒm), ถนน (thanǒn), สนุก (sanùk)." }], quizQuestions: [{ id: "akt-l20-q1", type: "multiple-choice", question: "What does ขนม mean?", options: ["dessert", "road", "fun", "notebook"], correctAnswer: "dessert" }] },
  { id: "akt-l21", courseId: "lat2201", title: "Lesson 21: Miscellaneous", order: 10, sections: [{ type: "text", title: "Miscellaneous", content: "Covers the irregular short vowel /a/ (รร ro han, unwritten /a/), irregular /r/ sounds, vowel shortening marks (ไม้ไต่คู่), and การันต์ (sound silencers)." }], quizQuestions: [{ id: "akt-l21-q1", type: "multiple-choice", question: "What is การันต์ used for?", options: ["Silencing consonants", "Adding tone", "Lengthening vowels", "Marking stress"], correctAnswer: "Silencing consonants" }] },
];

export function getAktLessonById(id: string) {
  return AKT_LESSONS.find((l) => l.id === id);
}

export function getAktLessonsByCourse(courseId: string) {
  return AKT_LESSONS.filter((l) => l.courseId === courseId).sort((a, b) => a.order - b.order);
}
