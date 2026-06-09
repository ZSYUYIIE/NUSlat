export interface PtSection {
  id: string;
  legacyChapterId: string;
  courseId: "lat1201" | "lat2201";
  chapterNumber: number;
  chapterTitle: string;
  letter: string;
  title: string;
  titleThai: string;
  order: number;
  pdfPages: string;
  contentType: "conversation" | "reading" | "review";
  overview: string;
  conversations: Conversation[];
  vocabulary: VocabItem[];
  notes: string[];
  quizQuestions: QuizQuestion[];
}

export interface Conversation {
  title: string;
  dialogues: { speaker: string; thai: string; phonetic: string }[];
}

export interface VocabItem {
  thai: string;
  phonetic: string;
  meaning: string;
}

export interface QuizQuestion {
  id: string;
  type: "multiple-choice" | "fill-blank" | "true-false" | "free-response";
  question: string;
  questionThai?: string;
  options?: string[];
  correctAnswer: string;
}

type SectionInput = Omit<PtSection, "id" | "legacyChapterId" | "titleThai" | "order">;

const CHAPTER_TITLES: Record<number, string> = {
  1: "At First Sight",
  2: "Snooping",
  3: "Identifying",
  4: "To Possess or Not to Possess",
  5: "Comparing",
  6: "True Thai",
  7: "When It Comes to Numbers",
  8: "Space and Time",
  9: "Give and Take",
  10: "The Story of Takeshi",
};

const chapterOrder = new Map<number, number>();

function makeSection(input: SectionInput): PtSection {
  const order = (chapterOrder.get(input.chapterNumber) ?? 0) + 1;
  chapterOrder.set(input.chapterNumber, order);
  const suffix = input.letter.toLowerCase();

  return {
    ...input,
    id: `pt-ch${input.chapterNumber}-${suffix}`,
    legacyChapterId: `pt-ch${input.chapterNumber}`,
    titleThai: `บทที่ ${input.chapterNumber}${input.letter}`,
    order,
  };
}

function dialogue(
  title: string,
  rows: Array<[speaker: string, thai: string, phonetic: string]>
): Conversation {
  return {
    title,
    dialogues: rows.map(([speaker, thai, phonetic]) => ({ speaker, thai, phonetic })),
  };
}

function vocab(thai: string, phonetic: string, meaning: string): VocabItem {
  return { thai, phonetic, meaning };
}

function mc(
  id: string,
  question: string,
  options: string[],
  correctAnswer: string
): QuizQuestion {
  return { id, type: "multiple-choice", question, options, correctAnswer };
}

function blank(id: string, question: string, correctAnswer: string): QuizQuestion {
  return { id, type: "fill-blank", question, correctAnswer };
}

function tf(id: string, question: string, correctAnswer: "True" | "False"): QuizQuestion {
  return {
    id,
    type: "true-false",
    question,
    options: ["True", "False"],
    correctAnswer,
  };
}

function response(id: string, question: string): QuizQuestion {
  return { id, type: "free-response", question, correctAnswer: "" };
}

export const PT_SECTIONS: PtSection[] = [
  makeSection({
    courseId: "lat1201",
    chapterNumber: 1,
    chapterTitle: CHAPTER_TITLES[1],
    letter: "A",
    title: "Formal Greeting",
    pdfPages: "1-2",
    contentType: "conversation",
    overview: "Use the formal Thai greeting and exchange a polite 'How are you?'",
    conversations: [
      dialogue("Formal greeting", [
        ["Mark", "สวัสดีครับ", "sawàt dii khráp"],
        ["Yoko", "สวัสดีค่ะ สบายดีหรือคะ", "sawàt dii khâ, sabaay dii rʉ̌ʉ khá"],
        ["Mark", "สบายดีครับ แล้วคุณล่ะครับ", "sabaay dii khráp, lɛ́ɛw khun lâ khráp"],
        ["Yoko", "สบายดีค่ะ ขอบคุณค่ะ", "sabaay dii khâ, khɔ̀ɔp khun khâ"],
      ]),
    ],
    vocabulary: [
      vocab("สวัสดี", "sawàt dii", "hello / goodbye"),
      vocab("สบายดี", "sabaay dii", "to be well"),
      vocab("ขอบคุณ", "khɔ̀ɔp khun", "thank you"),
    ],
    notes: ["ครับ is the common male polite particle; ค่ะ/คะ are female polite particles."],
    quizQuestions: [
      blank("pt1a-1", "Mark: sawàt dii ___", "khráp"),
      mc("pt1a-2", "Which reply means 'I am fine, thank you'?", ["sabaay dii khâ, khɔ̀ɔp khun khâ", "mây sabaay khâ", "chʉ̂ʉ Yoko khâ"], "sabaay dii khâ, khɔ̀ɔp khun khâ"),
    ],
  }),
  makeSection({
    courseId: "lat1201",
    chapterNumber: 1,
    chapterTitle: CHAPTER_TITLES[1],
    letter: "B",
    title: "Getting to Know Each Other",
    pdfPages: "3-5",
    contentType: "conversation",
    overview: "Introduce yourself, ask someone's name, and say where you come from.",
    conversations: [
      dialogue("Introductions", [
        ["Mark", "ขอโทษ ผมชื่อมาร์ค คุณชื่ออะไรครับ", "khɔ̌ɔ thôot, phǒm chʉ̂ʉ Mark. khun chʉ̂ʉ àray khráp"],
        ["Yoko", "ดิฉันชื่อโยโกะค่ะ คุณมาจากไหนคะ", "dìchǎn chʉ̂ʉ Yoko khâ. khun maa càak nǎy khá"],
        ["Mark", "ผมมาจากอเมริกาครับ", "phǒm maa càak ameerikaa khráp"],
        ["Yoko", "ดิฉันมาจากญี่ปุ่นค่ะ", "dìchǎn maa càak yîipùn khâ"],
      ]),
    ],
    vocabulary: [
      vocab("ชื่อ", "chʉ̂ʉ", "name / to be named"),
      vocab("มาจาก", "maa càak", "come from"),
      vocab("ที่ไหน", "thîi nǎy", "where"),
      vocab("อาจารย์", "aacaan", "teacher"),
    ],
    notes: ["ผม is a common first-person pronoun for men; ดิฉัน is a formal first-person pronoun for women."],
    quizQuestions: [
      blank("pt1b-1", "khun chʉ̂ʉ ___ khráp? (What is your name?)", "àray"),
      mc("pt1b-2", "How does Yoko say she comes from Japan?", ["dìchǎn maa càak yîipùn khâ", "dìchǎn chʉ̂ʉ yîipùn khâ", "dìchǎn pay yîipùn khâ"], "dìchǎn maa càak yîipùn khâ"),
      response("pt1b-3", "Introduce yourself in Thai: give your name and where you come from."),
    ],
  }),

  makeSection({
    courseId: "lat1201",
    chapterNumber: 2,
    chapterTitle: CHAPTER_TITLES[2],
    letter: "A",
    title: "Asking for Information",
    pdfPages: "6-8",
    contentType: "conversation",
    overview: "Ask yes/no questions about qualities such as beautiful, big, hot, and delicious.",
    conversations: [
      dialogue("Describing places and things", [
        ["Yoko", "ฮาวายสวยไหมคะ", "haawaay sǔay mǎy khá"],
        ["Kalani", "สวยครับ", "sǔay khráp"],
        ["Mark", "ฮาวายใหญ่ไหมครับ", "haawaay yày mǎy khráp"],
        ["Kalani", "ใหญ่ครับ", "yày khráp"],
      ]),
    ],
    vocabulary: [
      vocab("สวย", "sǔay", "beautiful"),
      vocab("ใหญ่", "yày", "big"),
      vocab("ร้อน", "rɔ́ɔn", "hot"),
      vocab("อร่อย", "arɔ̀y", "delicious"),
    ],
    notes: ["Place ไหม after a statement to turn it into a yes/no question."],
    quizQuestions: [
      mc("pt2a-1", "kaafɛɛ rɔ́ɔn mǎy asks:", ["Is the coffee hot?", "Is the coffee good?", "Is the coffee expensive?"], "Is the coffee hot?"),
      blank("pt2a-2", "haawaay sǔay ___ khá?", "mǎy"),
    ],
  }),
  makeSection({
    courseId: "lat1201",
    chapterNumber: 2,
    chapterTitle: CHAPTER_TITLES[2],
    letter: "B",
    title: "Asking for Further Information",
    pdfPages: "8-9",
    contentType: "conversation",
    overview: "Follow a yes/no answer with 'why?' and answer with 'because'.",
    conversations: [
      dialogue("Why do you like Hawaii?", [
        ["Mark", "คุณชอบฮาวายไหมครับ", "khun chɔ̂ɔp haawaay mǎy khráp"],
        ["Kalani", "ชอบครับ ชอบมาก", "chɔ̂ɔp khráp, chɔ̂ɔp mâak"],
        ["Mark", "เพราะอะไรครับ", "phrɔ́ àray khráp"],
        ["Kalani", "เพราะฮาวายสวยครับ", "phrɔ́ haawaay sǔay khráp"],
      ]),
    ],
    vocabulary: [
      vocab("ชอบ", "chɔ̂ɔp", "to like"),
      vocab("มาก", "mâak", "very / a lot"),
      vocab("เพราะ", "phrɔ́", "because"),
      vocab("ทำไม", "thammay", "why"),
    ],
    notes: ["เพราะอะไร and ทำไม both ask for a reason; answers often begin with เพราะ."],
    quizQuestions: [
      blank("pt2b-1", "___ àray khráp? (Why?)", "phrɔ́"),
      mc("pt2b-2", "Which answer means 'because Hawaii is beautiful'?", ["phrɔ́ haawaay sǔay", "haawaay sǔay mǎy", "mây chɔ̂ɔp haawaay"], "phrɔ́ haawaay sǔay"),
    ],
  }),
  makeSection({
    courseId: "lat1201",
    chapterNumber: 2,
    chapterTitle: CHAPTER_TITLES[2],
    letter: "C",
    title: "Asking for Confirmation",
    pdfPages: "10-11",
    contentType: "conversation",
    overview: "Use confirmation questions when you expect the listener to agree.",
    conversations: [
      dialogue("Confirming information", [
        ["Ann", "สิงคโปร์ร้อนไหมคะ", "sǐngkhapoo rɔ́ɔn mǎy khá"],
        ["Tara", "ร้อนค่ะ", "rɔ́ɔn khâ"],
        ["Ann", "แต่ห้องเรียนเย็น ใช่ไหมคะ", "tɛ̀ɛ hɔ̂ngrian yen, chây mǎy khá"],
        ["Tara", "ใช่ค่ะ", "chây khâ"],
      ]),
    ],
    vocabulary: [
      vocab("ใช่ไหม", "chây mǎy", "right? / isn't it?"),
      vocab("ใช่", "chây", "yes / correct"),
      vocab("ไม่ใช่", "mây chây", "no / not correct"),
      vocab("เย็น", "yen", "cool / cold"),
    ],
    notes: ["ใช่ไหม checks an assumption; ไหม asks a neutral yes/no question."],
    quizQuestions: [
      mc("pt2c-1", "Which phrase asks 'The classroom is cool, right?'", ["hɔ̂ngrian yen chây mǎy", "hɔ̂ngrian yen mǎy", "hɔ̂ngrian mây yen"], "hɔ̂ngrian yen chây mǎy"),
      tf("pt2c-2", "mây chây means 'not correct / no'.", "True"),
    ],
  }),

  makeSection({
    courseId: "lat1201",
    chapterNumber: 3,
    chapterTitle: CHAPTER_TITLES[3],
    letter: "A",
    title: "Identifying People and Nationality",
    pdfPages: "12-13",
    contentType: "conversation",
    overview: "Identify who someone is and state nationality with เป็น.",
    conversations: [
      dialogue("Who is Japanese?", [
        ["Yoko", "ดิฉันเป็นคนญี่ปุ่นค่ะ", "dìchǎn pen khon yîipùn khâ"],
        ["Ann", "ดิฉันเป็นคนเยอรมันค่ะ", "dìchǎn pen khon yəəraman khâ"],
        ["Mark", "ใครเป็นคนญี่ปุ่นครับ", "khray pen khon yîipùn khráp"],
        ["Yoko", "ดิฉันค่ะ", "dìchǎn khâ"],
      ]),
    ],
    vocabulary: [
      vocab("เป็น", "pen", "to be"),
      vocab("คน", "khon", "person"),
      vocab("ใคร", "khray", "who"),
      vocab("ญี่ปุ่น", "yîipùn", "Japan / Japanese"),
    ],
    notes: ["The common nationality pattern is เป็นคน + country name."],
    quizQuestions: [
      mc("pt3a-1", "Who is Japanese in the dialogue?", ["Yoko", "Ann", "Mark"], "Yoko"),
      blank("pt3a-2", "dìchǎn ___ khon yəəraman khâ.", "pen"),
    ],
  }),
  makeSection({
    courseId: "lat1201",
    chapterNumber: 3,
    chapterTitle: CHAPTER_TITLES[3],
    letter: "B",
    title: "Languages, Ability, and Preferences",
    pdfPages: "13-17",
    contentType: "conversation",
    overview: "Say which languages you speak, what you can do, and what food you like.",
    conversations: [
      dialogue("Language and food preferences", [
        ["Ann", "คุณพูดภาษาอะไรได้บ้างคะ", "khun phûut phaasǎa àray dâay bâang khá"],
        ["Mark", "ผมพูดภาษาอังกฤษได้ครับ", "phǒm phûut phaasǎa angkrìt dâay khráp"],
        ["Ann", "คุณชอบกินอะไรคะ", "khun chɔ̂ɔp kin àray khá"],
        ["Mark", "ผมชอบกินไก่ แต่ไม่กินหมูครับ", "phǒm chɔ̂ɔp kin kày, tɛ̀ɛ mây kin mǔu khráp"],
      ]),
    ],
    vocabulary: [
      vocab("ภาษา", "phaasǎa", "language"),
      vocab("พูด", "phûut", "to speak"),
      vocab("ได้", "dâay", "can / be able to"),
      vocab("กิน", "kin", "to eat"),
      vocab("ไก่", "kày", "chicken"),
      vocab("หมู", "mǔu", "pork / pig"),
    ],
    notes: ["Verb + ได้ expresses ability. ไม่ before a verb makes it negative."],
    quizQuestions: [
      mc("pt3b-1", "phǒm phûut phaasǎa angkrìt dâay means:", ["I can speak English.", "I study English.", "I like England."], "I can speak English."),
      blank("pt3b-2", "phǒm mây ___ mǔu khráp. (I do not eat pork.)", "kin"),
      response("pt3b-3", "Write one sentence about a language you can speak and one food you like."),
    ],
  }),

  makeSection({
    courseId: "lat1201",
    chapterNumber: 4,
    chapterTitle: CHAPTER_TITLES[4],
    letter: "A",
    title: "Reading: Yoko's Family and Home",
    pdfPages: "18-19",
    contentType: "reading",
    overview: "Read a short description of Yoko's family, home, and pets.",
    conversations: [
      dialogue("Yoko's family", [
        ["Narrator", "โยโกะเป็นคนญี่ปุ่น มาจากโตเกียว", "Yoko pen khon yîipùn, maa càak Tookiaw"],
        ["Narrator", "ที่บ้านมีหมาหนึ่งตัวและแมวสองตัว", "thîi bâan mii mǎa nʉ̀ng tua lɛ́ mɛɛw sɔ̌ɔng tua"],
        ["Narrator", "พ่อแม่และน้องชายอยู่ที่ญี่ปุ่น", "phɔ̂ɔ mɛ̂ɛ lɛ́ nɔ́ɔng chaay yùu thîi yîipùn"],
      ]),
    ],
    vocabulary: [
      vocab("มี", "mii", "to have / there is"),
      vocab("พ่อ", "phɔ̂ɔ", "father"),
      vocab("แม่", "mɛ̂ɛ", "mother"),
      vocab("น้องชาย", "nɔ́ɔng chaay", "younger brother"),
    ],
    notes: ["มี states possession or existence; ไม่มี is its negative form."],
    quizQuestions: [
      mc("pt4a-1", "How many cats are at Yoko's home?", ["One", "Two", "Three"], "Two"),
      tf("pt4a-2", "Yoko's family has one dog.", "True"),
    ],
  }),
  makeSection({
    courseId: "lat1201",
    chapterNumber: 4,
    chapterTitle: CHAPTER_TITLES[4],
    letter: "B",
    title: "Reading: Nicha's House",
    pdfPages: "20-21",
    contentType: "reading",
    overview: "Read where a home is and describe what is near it.",
    conversations: [
      dialogue("Nicha's neighbourhood", [
        ["Narrator", "บ้านณิชาอยู่ถนนสุขุมวิท", "bâan Nicha yùu thanǒn sukhumwít"],
        ["Narrator", "หน้าบ้านมีร้านกาแฟ", "nâa bâan mii ráan kaafɛɛ"],
        ["Narrator", "โรงเรียนอยู่ใกล้บ้าน", "roongrian yùu klây bâan"],
      ]),
    ],
    vocabulary: [
      vocab("บ้าน", "bâan", "house / home"),
      vocab("ถนน", "thanǒn", "road"),
      vocab("หน้า", "nâa", "in front of"),
      vocab("ใกล้", "klây", "near"),
    ],
    notes: ["อยู่ describes location; ที่ไหน asks where something is."],
    quizQuestions: [
      mc("pt4b-1", "What is in front of Nicha's house?", ["A coffee shop", "A school", "A temple"], "A coffee shop"),
      blank("pt4b-2", "roongrian yùu ___ bâan. (The school is near home.)", "klây"),
    ],
  }),
  makeSection({
    courseId: "lat1201",
    chapterNumber: 4,
    chapterTitle: CHAPTER_TITLES[4],
    letter: "C",
    title: "Locating a Place",
    pdfPages: "22-23",
    contentType: "conversation",
    overview: "Ask whether someone knows a place and identify its location.",
    conversations: [
      dialogue("Looking for a hair salon", [
        ["Ann", "คุณรู้จักร้านตัดผมไหมคะ", "khun rúucàk ráan tàt phǒm mǎy khá"],
        ["Tara", "รู้จักค่ะ", "rúucàk khâ"],
        ["Ann", "ร้านอยู่ที่ไหนคะ", "ráan yùu thîi nǎy khá"],
        ["Tara", "อยู่ข้างโรงเรียนค่ะ", "yùu khâang roongrian khâ"],
      ]),
    ],
    vocabulary: [
      vocab("รู้จัก", "rúucàk", "to know / be acquainted with"),
      vocab("ร้านตัดผม", "ráan tàt phǒm", "hair salon"),
      vocab("ข้าง", "khâang", "beside"),
      vocab("ที่ไหน", "thîi nǎy", "where"),
    ],
    notes: ["รู้จัก is used for knowing people and being familiar with places."],
    quizQuestions: [
      mc("pt4c-1", "Where is the hair salon?", ["Beside the school", "Behind the temple", "Inside the market"], "Beside the school"),
      blank("pt4c-2", "ráan yùu thîi ___ khá?", "nǎy"),
    ],
  }),
  makeSection({
    courseId: "lat1201",
    chapterNumber: 4,
    chapterTitle: CHAPTER_TITLES[4],
    letter: "D",
    title: "Giving Directions",
    pdfPages: "23-25",
    contentType: "conversation",
    overview: "Ask how to reach a place and give short route directions.",
    conversations: [
      dialogue("Directions to the shop", [
        ["Ann", "ไปร้านนั้นอย่างไรคะ", "pay ráan nán yàangray khá"],
        ["Tara", "เดินตรงไป แล้วเลี้ยวซ้ายค่ะ", "dəən trong pay, lɛ́ɛw líaaw sáay khâ"],
        ["Tara", "ร้านอยู่ขวามือ ตรงข้ามวัดค่ะ", "ráan yùu khwǎa mʉʉ, trong khâam wát khâ"],
      ]),
    ],
    vocabulary: [
      vocab("ตรงไป", "trong pay", "go straight"),
      vocab("เลี้ยวซ้าย", "líaaw sáay", "turn left"),
      vocab("ขวามือ", "khwǎa mʉʉ", "on the right"),
      vocab("ตรงข้าม", "trong khâam", "opposite"),
    ],
    notes: ["แล้ว links consecutive actions: do this, then do that."],
    quizQuestions: [
      mc("pt4d-1", "What should Ann do first?", ["Go straight", "Turn right", "Take a bus"], "Go straight"),
      blank("pt4d-2", "dəən trong pay, lɛ́ɛw líaaw ___.", "sáay"),
      response("pt4d-3", "Give two-step directions from your classroom to a nearby place."),
    ],
  }),

  makeSection({
    courseId: "lat1201",
    chapterNumber: 5,
    chapterTitle: CHAPTER_TITLES[5],
    letter: "A",
    title: "Comparing Size",
    pdfPages: "26-27",
    contentType: "conversation",
    overview: "Compare two animals or objects with adjective + กว่า.",
    conversations: [
      dialogue("Cow or buffalo?", [
        ["Ann", "นั่นวัวใช่ไหมคะ", "nân wua chây mǎy khá"],
        ["Tara", "ไม่ใช่ค่ะ นั่นควายค่ะ", "mây chây khâ, nân khwaay khâ"],
        ["Tara", "วัวใหญ่กว่าควายค่ะ", "wua yày kwàa khwaay khâ"],
      ]),
    ],
    vocabulary: [
      vocab("กว่า", "kwàa", "more than"),
      vocab("วัว", "wua", "cow"),
      vocab("ควาย", "khwaay", "water buffalo"),
      vocab("ใหญ่", "yày", "big"),
    ],
    notes: ["The comparison pattern is subject + adjective + กว่า + comparison target."],
    quizQuestions: [
      mc("pt5a-1", "wua yày kwàa khwaay means:", ["The cow is bigger than the buffalo.", "The buffalo is bigger than the cow.", "The cow is a buffalo."], "The cow is bigger than the buffalo."),
      blank("pt5a-2", "mɛɛw phɔ̌ɔm ___ mǎa. (The cat is thinner than the dog.)", "kwàa"),
    ],
  }),
  makeSection({
    courseId: "lat1201",
    chapterNumber: 5,
    chapterTitle: CHAPTER_TITLES[5],
    letter: "B",
    title: "Relationships and Reciprocal Actions",
    pdfPages: "27-28",
    contentType: "conversation",
    overview: "Describe relationships and actions people do to one another with กัน.",
    conversations: [
      dialogue("Are Julie and Alex a couple?", [
        ["Mark", "Julie กับ Alex เป็นแฟนกันไหมครับ", "Julie kàp Alex pen fɛɛn kan mǎy khráp"],
        ["Ann", "เป็นค่ะ เขารักกันค่ะ", "pen khâ, kháw rák kan khâ"],
      ]),
    ],
    vocabulary: [
      vocab("แฟน", "fɛɛn", "romantic partner"),
      vocab("รัก", "rák", "to love"),
      vocab("กัน", "kan", "each other / together"),
      vocab("กับ", "kàp", "with / and"),
    ],
    notes: ["Verb + กัน often means that people perform the action together or to each other."],
    quizQuestions: [
      mc("pt5b-1", "kháw rák kan means:", ["They love each other.", "They are siblings.", "They work together."], "They love each other."),
      blank("pt5b-2", "Julie kàp Alex pen fɛɛn ___.", "kan"),
    ],
  }),
  makeSection({
    courseId: "lat1201",
    chapterNumber: 5,
    chapterTitle: CHAPTER_TITLES[5],
    letter: "C",
    title: "Comparing Preferences and Prices",
    pdfPages: "29-30",
    contentType: "conversation",
    overview: "Compare prices and say which food you prefer more.",
    conversations: [
      dialogue("Pizza or noodles?", [
        ["Ann", "อะไรแพงกว่ากันคะ ก๋วยเตี๋ยวหรือพิซซ่า", "àray phɛɛng kwàa kan khá, kǔaytǐaw rʉ̌ʉ phítsaa"],
        ["Tara", "พิซซ่าแพงกว่าค่ะ", "phítsaa phɛɛng kwàa khâ"],
        ["Ann", "แล้วอะไรอร่อยกว่ากันคะ", "lɛ́ɛw àray arɔ̀y kwàa kan khá"],
        ["Tara", "ดิฉันชอบพิซซ่ามากกว่าค่ะ", "dìchǎn chɔ̂ɔp phítsaa mâak kwàa khâ"],
      ]),
    ],
    vocabulary: [
      vocab("แพง", "phɛɛng", "expensive"),
      vocab("อร่อย", "arɔ̀y", "delicious"),
      vocab("หรือ", "rʉ̌ʉ", "or"),
      vocab("มากกว่า", "mâak kwàa", "more"),
    ],
    notes: ["อะไร...กว่ากัน asks which of two choices has more of a quality."],
    quizQuestions: [
      mc("pt5c-1", "Which item is more expensive in the dialogue?", ["Pizza", "Noodles", "They cost the same"], "Pizza"),
      blank("pt5c-2", "dìchǎn chɔ̂ɔp phítsaa mâak ___ khâ.", "kwàa"),
    ],
  }),
  makeSection({
    courseId: "lat1201",
    chapterNumber: 5,
    chapterTitle: CHAPTER_TITLES[5],
    letter: "D",
    title: "Comparing Distance",
    pdfPages: "30-31",
    contentType: "conversation",
    overview: "Ask where a place is, whether it is walkable, and compare near and far.",
    conversations: [
      dialogue("How far is the school?", [
        ["Ann", "โรงเรียนอยู่ที่ไหนคะ", "roongrian yùu thîi nǎy khá"],
        ["Tara", "อยู่ที่โน่นค่ะ", "yùu thîi nôon khâ"],
        ["Ann", "เดินไปได้ไหมคะ", "dəən pay dâay mǎy khá"],
        ["Tara", "ไม่ได้ค่ะ โรงเรียนอยู่ไกลมาก ต้องนั่งรถไป", "mây dâay khâ, roongrian yùu klay mâak, tɔ̂ng nâng rót pay"],
      ]),
    ],
    vocabulary: [
      vocab("ไกล", "klay", "far"),
      vocab("ใกล้", "klây", "near"),
      vocab("ต้อง", "tɔ̂ng", "must / have to"),
      vocab("นั่งรถ", "nâng rót", "ride in a vehicle"),
    ],
    notes: ["เดินไปได้ไหม asks whether reaching the place on foot is possible."],
    quizQuestions: [
      mc("pt5d-1", "Why can Ann not walk to the school?", ["It is very far.", "It is closed.", "She is tired."], "It is very far."),
      blank("pt5d-2", "tɔ̂ng nâng ___ pay. (You have to go by vehicle.)", "rót"),
    ],
  }),

  makeSection({
    courseId: "lat2201",
    chapterNumber: 6,
    chapterTitle: CHAPTER_TITLES[6],
    letter: "A",
    title: "Where Are You Going?",
    pdfPages: "32-33",
    contentType: "conversation",
    overview: "Use the everyday Thai greeting 'Where are you going?'",
    conversations: [
      dialogue("At the library", [
        ["Yoko", "จะไปไหนคะ", "ca pay nǎy khá"],
        ["Kalani", "ไปห้องสมุดครับ แล้วคุณล่ะครับ", "pay hɔ̂ngsamùt khráp, lɛ́ɛw khun lâ khráp"],
        ["Yoko", "ไปโรงอาหารค่ะ", "pay roong aahǎan khâ"],
      ]),
    ],
    vocabulary: [
      vocab("จะ", "ca", "will / going to"),
      vocab("ห้องสมุด", "hɔ̂ngsamùt", "library"),
      vocab("โรงอาหาร", "roong aahǎan", "canteen"),
    ],
    notes: ["จะไปไหน is often a friendly greeting, not an intrusive demand for details."],
    quizQuestions: [
      mc("pt6a-1", "Where is Kalani going?", ["The library", "The canteen", "Home"], "The library"),
      blank("pt6a-2", "ca pay ___ khá?", "nǎy"),
    ],
  }),
  makeSection({
    courseId: "lat2201",
    chapterNumber: 6,
    chapterTitle: CHAPTER_TITLES[6],
    letter: "B",
    title: "Have You Eaten Yet?",
    pdfPages: "32-34",
    contentType: "conversation",
    overview: "Use the common Thai greeting 'Have you eaten yet?' and answer already/not yet.",
    conversations: [
      dialogue("Have you eaten?", [
        ["Mark", "ทานข้าวแล้วหรือยังครับ", "thaan khâaw lɛ́ɛw rʉ̌ʉ yang khráp"],
        ["Ann", "ทานแล้วค่ะ", "thaan lɛ́ɛw khâ"],
        ["Ann", "แล้วคุณล่ะคะ ทานแล้วหรือยัง", "lɛ́ɛw khun lâ khá, thaan lɛ́ɛw rʉ̌ʉ yang"],
        ["Mark", "ยังครับ ยังไม่หิวครับ", "yang khráp, yang mây hǐw khráp"],
      ]),
    ],
    vocabulary: [
      vocab("ทาน", "thaan", "to eat (polite)"),
      vocab("แล้ว", "lɛ́ɛw", "already"),
      vocab("ยัง", "yang", "yet / still"),
      vocab("หิว", "hǐw", "hungry"),
    ],
    notes: ["แล้วหรือยัง asks whether an action has happened yet. Answer แล้ว or ยัง."],
    quizQuestions: [
      mc("pt6b-1", "How does Mark answer 'not yet'?", ["yang khráp", "lɛ́ɛw khráp", "chây khráp"], "yang khráp"),
      blank("pt6b-2", "thaan khâaw lɛ́ɛw rʉ̌ʉ ___ khráp?", "yang"),
    ],
  }),
  makeSection({
    courseId: "lat2201",
    chapterNumber: 6,
    chapterTitle: CHAPTER_TITLES[6],
    letter: "C",
    title: "Colloquial Greeting",
    pdfPages: "32-35",
    contentType: "conversation",
    overview: "Recognize a relaxed colloquial version of the formal greeting.",
    conversations: [
      dialogue("How have you been?", [
        ["Mark", "เป็นไงมั่งครับ สบายดีหรือครับ", "pen ngay mâng khráp, sabaay dii rʉ̌ʉ khráp"],
        ["Ann", "สบายดีค่ะ", "sabaay dii khâ"],
      ]),
    ],
    vocabulary: [
      vocab("เป็นไงมั่ง", "pen ngay mâng", "how have you been?"),
      vocab("หรือ", "rʉ̌ʉ", "or / question particle"),
      vocab("สบายดี", "sabaay dii", "well"),
    ],
    notes: ["เป็นไงมั่ง is informal and suitable among acquaintances."],
    quizQuestions: [
      mc("pt6c-1", "pen ngay mâng is closest to:", ["How have you been?", "Where are you going?", "What is your name?"], "How have you been?"),
      tf("pt6c-2", "pen ngay mâng is more colloquial than sawàt dii.", "True"),
    ],
  }),
  makeSection({
    courseId: "lat2201",
    chapterNumber: 6,
    chapterTitle: CHAPTER_TITLES[6],
    letter: "D",
    title: "Explaining Why",
    pdfPages: "35-36",
    contentType: "conversation",
    overview: "Say what you want or do not want to do and explain why.",
    conversations: [
      dialogue("Hungry, but not eating here", [
        ["Kalani", "ทานข้าวแล้วหรือยังครับ", "thaan khâaw lɛ́ɛw rʉ̌ʉ yang khráp"],
        ["Ann", "ยังค่ะ", "yang khâ"],
        ["Kalani", "ยังไม่หิวหรือครับ", "yang mây hǐw rʉ̌ʉ khráp"],
        ["Ann", "หิวแล้วค่ะ แต่ยังไม่อยากไปตอนนี้", "hǐw lɛ́ɛw khâ, tɛ̀ɛ yang mây yàak pay tɔɔn níi"],
        ["Ann", "เพราะที่โรงอาหารคนเยอะค่ะ", "phrɔ́ thîi roong aahǎan khon yə́ khâ"],
      ]),
    ],
    vocabulary: [
      vocab("อยาก", "yàak", "to want"),
      vocab("ตอนนี้", "tɔɔn níi", "now"),
      vocab("คนเยอะ", "khon yə́", "many people / crowded"),
      vocab("เพราะ", "phrɔ́", "because"),
    ],
    notes: ["อยาก + verb means 'want to'; ไม่อยาก + verb means 'do not want to'."],
    quizQuestions: [
      mc("pt6d-1", "Why does Ann not want to go now?", ["The canteen is crowded.", "She is not hungry.", "The canteen is closed."], "The canteen is crowded."),
      blank("pt6d-2", "yang mây ___ pay tɔɔn níi. (I still do not want to go now.)", "yàak"),
    ],
  }),
  makeSection({
    courseId: "lat2201",
    chapterNumber: 6,
    chapterTitle: CHAPTER_TITLES[6],
    letter: "E",
    title: "Reading: Trying to Meet a Teacher",
    pdfPages: "37",
    contentType: "reading",
    overview: "Read why Ann misses her teacher and what she should do next.",
    conversations: [
      dialogue("The teacher is not in", [
        ["Narrator", "แอนอยากพบอาจารย์ เขาไปหาอาจารย์ที่ห้องทำงาน", "Ann yàak phóp aacaan, kháw pay hǎa aacaan thîi hɔ̂ng thamngaan"],
        ["Narrator", "แต่อาจารย์ไม่อยู่", "tɛ̀ɛ aacaan mây yùu"],
        ["Narrator", "แอนไม่ได้พบอาจารย์เพราะไม่ได้โทรศัพท์ไปก่อน", "Ann mây dâay phóp aacaan phrɔ́ mây dâay thoorasàp pay kɔ̀ɔn"],
      ]),
    ],
    vocabulary: [
      vocab("พบ", "phóp", "to meet"),
      vocab("ห้องทำงาน", "hɔ̂ng thamngaan", "office"),
      vocab("โทรศัพท์", "thoorasàp", "telephone / to call"),
      vocab("ก่อน", "kɔ̀ɔn", "before / first"),
    ],
    notes: ["ไม่ได้ + verb states that an intended action did not happen."],
    quizQuestions: [
      mc("pt6e-1", "Why did Ann fail to meet the teacher?", ["She did not call first.", "She went to the wrong school.", "The teacher was ill."], "She did not call first."),
      tf("pt6e-2", "The teacher was in the office when Ann arrived.", "False"),
    ],
  }),
  makeSection({
    courseId: "lat2201",
    chapterNumber: 6,
    chapterTitle: CHAPTER_TITLES[6],
    letter: "F",
    title: "Asking for a Telephone Number",
    pdfPages: "37",
    contentType: "conversation",
    overview: "Ask for and give a work or mobile telephone number.",
    conversations: [
      dialogue("The teacher's number", [
        ["Ann", "อาจารย์คะ โทรศัพท์อาจารย์เบอร์อะไรคะ", "aacaan khá, thoorasàp aacaan bəə àray khá"],
        ["Teacher", "ที่ทำงานเบอร์ 65167890 ค่ะ มือถือเบอร์ 91234567", "thîi thamngaan bəə 65167890 khâ, mʉʉthʉ̌ʉ bəə 91234567"],
        ["Ann", "ขอบคุณค่ะ", "khɔ̀ɔp khun khâ"],
      ]),
    ],
    vocabulary: [
      vocab("เบอร์", "bəə", "number"),
      vocab("มือถือ", "mʉʉthʉ̌ʉ", "mobile phone"),
      vocab("ที่ทำงาน", "thîi thamngaan", "workplace"),
    ],
    notes: ["Read phone numbers digit by digit in Thai."],
    quizQuestions: [
      blank("pt6f-1", "thoorasàp aacaan bəə ___ khá?", "àray"),
      response("pt6f-2", "Ask a classmate for a telephone number and write the complete Thai question."),
    ],
  }),

  makeSection({
    courseId: "lat2201",
    chapterNumber: 7,
    chapterTitle: CHAPTER_TITLES[7],
    letter: "A",
    title: "Giving an Address",
    pdfPages: "38",
    contentType: "conversation",
    overview: "State a simple address with house number, road, and area.",
    conversations: [
      dialogue("At the police station", [
        ["Police", "บ้านคุณอยู่ที่ไหนครับ", "bâan khun yùu thîi nǎy khráp"],
        ["Tara", "บางนาค่ะ", "baang naa khâ"],
        ["Police", "บ้านเลขที่เท่าไรครับ", "bâan lêek thîi thâwrày khráp"],
        ["Tara", "เลขที่เก้า ทับ หกสิบสี่ค่ะ", "lêek thîi kâaw tháp hòk sìp sìi khâ"],
        ["Police", "ถนนอะไร", "thanǒn àray"],
        ["Tara", "ถนนกัลปพฤกษ์ค่ะ", "thanǒn kanlapaphrʉ́k khâ"],
      ]),
    ],
    vocabulary: [
      vocab("บ้านเลขที่", "bâan lêek thîi", "house number"),
      vocab("ทับ", "tháp", "slash in an address"),
      vocab("ถนน", "thanǒn", "road"),
    ],
    notes: ["Thai addresses commonly move from a specific house number to larger areas."],
    quizQuestions: [
      mc("pt7a-1", "What is Tara's house number?", ["9/64", "64/9", "96/4"], "9/64"),
      blank("pt7a-2", "bâan lêek thîi ___ khráp? (What house number?)", "thâwrày"),
    ],
  }),
  makeSection({
    courseId: "lat2201",
    chapterNumber: 7,
    chapterTitle: CHAPTER_TITLES[7],
    letter: "B",
    title: "Talking About Price",
    pdfPages: "38-40",
    contentType: "conversation",
    overview: "Ask a unit price and react when something is expensive.",
    conversations: [
      dialogue("At a supermarket", [
        ["Mali", "แม่คะ หนูอยากทานไก่อบ", "mɛ̂ɛ khá, nǔu yàak thaan kày òp"],
        ["Mother", "ตัวละเท่าไรจ๊ะ", "tua lá thâwrày cá"],
        ["Mali", "ตัวละเจ็ดเหรียญค่ะ", "tua lá cèt rǐan khâ"],
        ["Mother", "แพงจัง", "phɛɛng cang"],
        ["Mali", "แต่นู่อยากทานมาก", "tɛ̀ɛ nǔu yàak thaan mâak"],
      ]),
    ],
    vocabulary: [
      vocab("ตัวละ", "tua lá", "per animal/item"),
      vocab("เท่าไร", "thâwrày", "how much"),
      vocab("แพงจัง", "phɛɛng cang", "so expensive!"),
      vocab("อย่า", "yàa", "do not"),
    ],
    notes: ["Classifier + ละ expresses a price per unit."],
    quizQuestions: [
      mc("pt7b-1", "How much is the roast chicken?", ["Seven dollars", "Seventeen dollars", "Seventy dollars"], "Seven dollars"),
      blank("pt7b-2", "tua lá ___ cá? (How much each?)", "thâwrày"),
    ],
  }),
  makeSection({
    courseId: "lat2201",
    chapterNumber: 7,
    chapterTitle: CHAPTER_TITLES[7],
    letter: "C",
    title: "Bargaining at the Market",
    pdfPages: "39-42",
    contentType: "conversation",
    overview: "Ask a price by weight, request a discount, and total a purchase.",
    conversations: [
      dialogue("Buying mangosteens", [
        ["Yoko", "มังคุดนี่ขายอย่างไรคะ", "mangkhút nîi khǎay yàangray khá"],
        ["Vendor", "กิโลละแปดสิบห้าบาทค่ะ", "kiloo lá pɛ̀ɛt sìp hâa bàat khâ"],
        ["Yoko", "โอ้โฮ แพงจัง ลดหน่อยได้ไหมคะ", "oohǒo, phɛɛng cang, lót nɔ̀y dâay mǎy khá"],
        ["Vendor", "แปดสิบก็แล้วกัน", "pɛ̀ɛt sìp kɔ̂ lɛ́ɛw kan"],
        ["Yoko", "สามกิโลค่ะ", "sǎam kiloo khâ"],
        ["Vendor", "รวมร้อยยี่สิบห้าบาทค่ะ", "ruam rɔ́ɔy yîi sìp hâa bàat khâ"],
      ]),
    ],
    vocabulary: [
      vocab("กิโลละ", "kiloo lá", "per kilogram"),
      vocab("ลด", "lót", "to reduce / discount"),
      vocab("ก็แล้วกัน", "kɔ̂ lɛ́ɛw kan", "let's settle on that"),
      vocab("รวม", "ruam", "total"),
    ],
    notes: ["The printed conversation demonstrates bargaining language; check the stated total as part of the exercise."],
    quizQuestions: [
      mc("pt7c-1", "What price does the vendor agree to after bargaining?", ["80 baht per kilo", "85 baht per kilo", "75 baht per kilo"], "80 baht per kilo"),
      blank("pt7c-2", "lót nɔ̀y dâay ___ khá? (Can you reduce it a little?)", "mǎy"),
    ],
  }),
  makeSection({
    courseId: "lat2201",
    chapterNumber: 7,
    chapterTitle: CHAPTER_TITLES[7],
    letter: "D",
    title: "Ordering at a Café",
    pdfPages: "42",
    contentType: "conversation",
    overview: "Order a drink and specify what should or should not be added.",
    conversations: [
      dialogue("Coffee order", [
        ["Waiter", "คุณจะทานอะไรครับ", "khun ca thaan àray khráp"],
        ["Mali", "ขอกาแฟร้อนถ้วยหนึ่งค่ะ", "khɔ̌ɔ kaafɛɛ rɔ́ɔn thûay nʉ̀ng khâ"],
        ["Waiter", "ใส่นมกับน้ำตาลด้วยไหมครับ", "sày nom kàp náamtaan dûay mǎy khráp"],
        ["Mali", "ไม่ใส่ค่ะ", "mây sày khâ"],
        ["Waiter", "กาแฟดำถ้วยหนึ่งนะครับ", "kaafɛɛ dam thûay nʉ̀ng ná khráp"],
      ]),
    ],
    vocabulary: [
      vocab("ขอ", "khɔ̌ɔ", "may I have / request"),
      vocab("ถ้วย", "thûay", "cup (classifier)"),
      vocab("ใส่", "sày", "to put in"),
      vocab("กาแฟดำ", "kaafɛɛ dam", "black coffee"),
    ],
    notes: ["ขอ + item is a natural way to order or request something."],
    quizQuestions: [
      mc("pt7d-1", "How does Mali take her coffee?", ["Black", "With milk", "With sugar only"], "Black"),
      blank("pt7d-2", "khɔ̌ɔ kaafɛɛ rɔ́ɔn ___ nʉ̀ng khâ.", "thûay"),
    ],
  }),
  makeSection({
    courseId: "lat2201",
    chapterNumber: 7,
    chapterTitle: CHAPTER_TITLES[7],
    letter: "E",
    title: "Reading: A Coffee Invitation",
    pdfPages: "43-44",
    contentType: "reading",
    overview: "Read a short narrative that links shopping, inviting, reporting speech, and ordering.",
    conversations: [
      dialogue("Mother invites Father for coffee", [
        ["Narrator", "แม่ไปตลาดเพราะต้องไปซื้อกระโปรง", "mɛ̂ɛ pay talàat phrɔ́ tɔ̂ng pay sʉ́ʉ kraproong"],
        ["Narrator", "แม่ไปหาพ่อที่ที่ทำงาน แล้วบอกว่าอยากกินกาแฟ", "mɛ̂ɛ pay hǎa phɔ̂ɔ thîi thamngaan, lɛ́ɛw bɔ̀ɔk wâa yàak kin kaafɛɛ"],
        ["Mother", "เราไปกินกาแฟกันเถอะค่ะ", "raw pay kin kaafɛɛ kan thə̀ khâ"],
        ["Father", "ได้ครับ", "dâay khráp"],
      ]),
    ],
    vocabulary: [
      vocab("บอกว่า", "bɔ̀ɔk wâa", "say / tell that"),
      vocab("กันเถอะ", "kan thə̀", "let's"),
      vocab("กระโปรง", "kraproong", "skirt"),
      vocab("ที่ทำงาน", "thîi thamngaan", "workplace"),
    ],
    notes: ["ว่า connects a speech or thought verb to the following message."],
    quizQuestions: [
      mc("pt7e-1", "Why did Mother go to the market?", ["To buy a skirt", "To meet Father", "To drink coffee"], "To buy a skirt"),
      mc("pt7e-2", "raw pay kin kaafɛɛ kan thə̀ means:", ["Let's go drink coffee.", "Do not drink coffee.", "Who bought coffee?"], "Let's go drink coffee."),
    ],
  }),

  makeSection({
    courseId: "lat2201",
    chapterNumber: 8,
    chapterTitle: CHAPTER_TITLES[8],
    letter: "A",
    title: "Visiting Someone Who Is Ill",
    pdfPages: "45-46",
    contentType: "conversation",
    overview: "Ask where someone is, discuss illness, and place events in yesterday/tomorrow time.",
    conversations: [
      dialogue("Mana is in hospital", [
        ["Grandma", "มาหาใครจ๊ะ", "maa hǎa khray cá"],
        ["Tara", "สวัสดีค่ะคุณยาย มานะอยู่ไหมคะ", "sawàt dii khâ khun yaay, Mana yùu mǎy khá"],
        ["Grandma", "ไม่อยู่จ้ะ ตอนนี้เขาอยู่ที่โรงพยาบาล", "mây yùu câ, tɔɔn níi kháw yùu thîi roongphayaabaan"],
        ["Grandma", "เมื่อวานนี้เขาปวดหัวมาก พรุ่งนี้ก็กลับบ้านได้", "mʉ̂awaan níi kháw pùat hǔa mâak, phrûng níi kɔ̂ klàp bâan dâay"],
      ]),
    ],
    vocabulary: [
      vocab("โรงพยาบาล", "roongphayaabaan", "hospital"),
      vocab("ปวดหัว", "pùat hǔa", "have a headache"),
      vocab("เมื่อวานนี้", "mʉ̂awaan níi", "yesterday"),
      vocab("พรุ่งนี้", "phrûng níi", "tomorrow"),
    ],
    notes: ["Time expressions usually appear near the beginning of a Thai sentence."],
    quizQuestions: [
      mc("pt8a-1", "Where is Mana now?", ["At the hospital", "At school", "At home"], "At the hospital"),
      mc("pt8a-2", "When can Mana return home?", ["Tomorrow", "Yesterday", "Next month"], "Tomorrow"),
    ],
  }),
  makeSection({
    courseId: "lat2201",
    chapterNumber: 8,
    chapterTitle: CHAPTER_TITLES[8],
    letter: "B",
    title: "Speaking More Clearly",
    pdfPages: "46-48",
    contentType: "conversation",
    overview: "Ask someone to speak louder, slower, or a little more clearly.",
    conversations: [
      dialogue("Grandpa cannot hear", [
        ["Grandpa", "มาหามานะหรือ", "maa hǎa Mana rə̌ə"],
        ["Wit", "ครับ เขาเป็นไงมั่งครับคุณตา", "khráp, kháw pen ngay mâng khráp khun taa"],
        ["Grandpa", "อะไรนะ พูดดัง ๆ หน่อยได้ไหม ตาไม่ได้ยิน", "àray ná, phûut dang dang nɔ̀y dâay mǎy, taa mây dâayyin"],
        ["Wit", "ครับ ผมมาหามานะครับ", "khráp, phǒm maa hǎa Mana khráp"],
        ["Grandpa", "ดีขึ้นเยอะแล้ว เขาอยู่ข้างบน", "dii khʉ̂n yə́ lɛ́ɛw, kháw yùu khâang bon"],
      ]),
    ],
    vocabulary: [
      vocab("ดัง", "dang", "loud"),
      vocab("เบา", "bao", "soft / quiet"),
      vocab("ช้า", "cháa", "slow"),
      vocab("ข้างบน", "khâang bon", "upstairs / above"),
    ],
    notes: ["Adjective repeated + หน่อย softens a request: ดัง ๆ หน่อย, ช้า ๆ หน่อย."],
    quizQuestions: [
      mc("pt8b-1", "What does Grandpa ask Wit to do?", ["Speak louder", "Go upstairs", "Speak faster"], "Speak louder"),
      blank("pt8b-2", "phûut dang dang ___ dâay mǎy?", "nɔ̀y"),
    ],
  }),
  makeSection({
    courseId: "lat2201",
    chapterNumber: 8,
    chapterTitle: CHAPTER_TITLES[8],
    letter: "C",
    title: "Reading Dates and Birthdays",
    pdfPages: "49-50",
    contentType: "reading",
    overview: "Read dates, months, birthdays, and actions planned for a particular day.",
    conversations: [
      dialogue("Diary entry", [
        ["Narrator", "วันนี้เป็นวันที่เก้าเดือนสิงหาคม", "wan níi pen wan thîi kâaw dʉan sǐnghǎakhom"],
        ["Narrator", "และเป็นวันเกิดประเทศสิงคโปร์", "lɛ́ pen wan kə̀ət pràthêet sǐngkhapoo"],
        ["Narrator", "เมื่อวานนี้เป็นวันเกิดน้องชายฉัน", "mʉ̂awaan níi pen wan kə̀ət nɔ́ɔng chaay chǎn"],
        ["Narrator", "ฉันให้กีตาร์เขา เพราะปีนี้เขาอยากได้กีตาร์", "chǎn hây kiitaa kháw phrɔ́ pii níi kháw yàak dâay kiitaa"],
      ]),
    ],
    vocabulary: [
      vocab("วันที่", "wan thîi", "date / day number"),
      vocab("เดือน", "dʉan", "month"),
      vocab("วันเกิด", "wan kə̀ət", "birthday"),
      vocab("ปี", "pii", "year"),
    ],
    notes: ["Thai dates use วันที่ + number + เดือน + month name."],
    quizQuestions: [
      mc("pt8c-1", "What date is the diary entry?", ["9 August", "8 September", "19 August"], "9 August"),
      mc("pt8c-2", "What gift did the writer give the younger brother?", ["A guitar", "A watch", "A book"], "A guitar"),
    ],
  }),

  makeSection({
    courseId: "lat2201",
    chapterNumber: 9,
    chapterTitle: CHAPTER_TITLES[9],
    letter: "A",
    title: "Requesting a Favour",
    pdfPages: "51-52",
    contentType: "conversation",
    overview: "Ask what someone wants and politely request that they buy or bring something.",
    conversations: [
      dialogue("Shopping request", [
        ["Tara", "ฉันจะไปซื้อของที่ซูเปอร์มาร์เก็ต เธออยากได้อะไรไหม", "chǎn ca pay sʉ́ʉ khɔ̌ɔng thîi súpəəmaakét, thəə yàak dâay àray mǎy"],
        ["Ann", "ฉันอยากได้ซาชิมิ เธอช่วยซื้อมาให้หน่อยได้ไหม", "chǎn yàak dâay saachimí, thəə chûay sʉ́ʉ maa hây nɔ̀y dâay mǎy"],
        ["Tara", "ได้สิ เธออยากได้ปลาอะไรล่ะ", "dâay sì, thəə yàak dâay plaa àray lâ"],
        ["Ann", "ปลาอะไรก็ได้", "plaa àray kɔ̂ dâay"],
      ]),
    ],
    vocabulary: [
      vocab("ช่วย", "chûay", "to help / please"),
      vocab("ซื้อมาให้", "sʉ́ʉ maa hây", "buy and bring for someone"),
      vocab("อะไรก็ได้", "àray kɔ̂ dâay", "anything is fine"),
      vocab("ของ", "khɔ̌ɔng", "thing / goods"),
    ],
    notes: ["ช่วย + verb + หน่อยได้ไหม is a polite favour request."],
    quizQuestions: [
      mc("pt9a-1", "What does Ann ask Tara to buy?", ["Sashimi", "Coffee", "A birthday cake"], "Sashimi"),
      blank("pt9a-2", "thəə ___ sʉ́ʉ maa hây nɔ̀y dâay mǎy?", "chûay"),
    ],
  }),
  makeSection({
    courseId: "lat2201",
    chapterNumber: 9,
    chapterTitle: CHAPTER_TITLES[9],
    letter: "B",
    title: "Having Someone Do Something",
    pdfPages: "52-53",
    contentType: "conversation",
    overview: "Use ให้ to tell, ask, or arrange for another person to do an action.",
    conversations: [
      dialogue("The missing homework", [
        ["Kalani", "อาจารย์เรียกคุณไปหาทำไม", "aacaan rîak khun pay hǎa thammay"],
        ["Yoko", "เพราะฉันไม่ได้ส่งการบ้าน", "phrɔ́ chǎn mây dâay sòng kaan bâan"],
        ["Yoko", "ฉันลืมเอาการบ้านมา", "chǎn lʉʉm aw kaan bâan maa"],
        ["Ann", "ฉันให้ธาราเอามาให้", "chǎn hây Tara aw maa hây"],
        ["Alex", "ผมให้ Julie ทำให้", "phǒm hây Julie tham hây"],
      ]),
    ],
    vocabulary: [
      vocab("ส่ง", "sòng", "to submit / send"),
      vocab("การบ้าน", "kaan bâan", "homework"),
      vocab("ลืม", "lʉʉm", "to forget"),
      vocab("ให้", "hây", "give / have someone do"),
    ],
    notes: ["Person A + ให้ + person B + verb can mean A has or tells B to do the verb."],
    quizQuestions: [
      mc("pt9b-1", "Why did the teacher call Yoko?", ["She did not submit homework.", "She arrived late.", "She forgot her phone."], "She did not submit homework."),
      mc("pt9b-2", "phǒm hây Julie tham hây means:", ["I had Julie do it for me.", "I did it for Julie.", "Julie forgot to do it."], "I had Julie do it for me."),
    ],
  }),
  makeSection({
    courseId: "lat2201",
    chapterNumber: 9,
    chapterTitle: CHAPTER_TITLES[9],
    letter: "C",
    title: "Reading: Giving a Birthday Present",
    pdfPages: "54-55",
    contentType: "reading",
    overview: "Read a family birthday story and track who gives what to whom.",
    conversations: [
      dialogue("Uncle's birthday", [
        ["Narrator", "ธาราอยู่กับพ่อแม่และคุณตาคุณยาย", "Tara yùu kàp phɔ̂ɔ mɛ̂ɛ lɛ́ khun taa khun yaay"],
        ["Narrator", "วันนี้เป็นวันเกิดคุณลุง", "wan níi pen wan kə̀ət khun lung"],
        ["Narrator", "ธาราเอาของขวัญวันเกิดไปให้คุณลุง", "Tara aw khɔ̌ɔng khwǎn wan kə̀ət pay hây khun lung"],
        ["Grandma", "หลานให้อะไร", "lǎan hây àray"],
        ["Uncle", "ให้นาฬิกาสายครับ", "hây naalikaa sǎay khráp"],
      ]),
    ],
    vocabulary: [
      vocab("ของขวัญ", "khɔ̌ɔng khwǎn", "gift"),
      vocab("หลาน", "lǎan", "grandchild / niece / nephew"),
      vocab("คุณลุง", "khun lung", "uncle"),
      vocab("นาฬิกา", "naalikaa", "watch / clock"),
    ],
    notes: ["เอา...ไปให้ describes taking something away from the speaker to give it to someone."],
    quizQuestions: [
      mc("pt9c-1", "Whose birthday is it?", ["Tara's uncle", "Tara's brother", "Tara's grandmother"], "Tara's uncle"),
      mc("pt9c-2", "What present does Tara give?", ["A watch", "A guitar", "A phone"], "A watch"),
    ],
  }),
  makeSection({
    courseId: "lat2201",
    chapterNumber: 9,
    chapterTitle: CHAPTER_TITLES[9],
    letter: "D",
    title: "Family Relationships",
    pdfPages: "55-56",
    contentType: "reading",
    overview: "Follow a family tree and use Thai kinship terms accurately.",
    conversations: [
      dialogue("Tara's relatives", [
        ["Narrator", "ปู่กับย่าคือพ่อแม่ของพ่อ", "pùu kàp yâa khʉʉ phɔ̂ɔ mɛ̂ɛ khɔ̌ɔng phɔ̂ɔ"],
        ["Narrator", "ตากับยายคือพ่อแม่ของแม่", "taa kàp yaay khʉʉ phɔ̂ɔ mɛ̂ɛ khɔ̌ɔng mɛ̂ɛ"],
        ["Narrator", "ลูกของลุงหรือป้าคือลูกพี่ลูกน้อง", "lûuk khɔ̌ɔng lung rʉ̌ʉ pâa khʉʉ lûuk phîi lûuk nɔ́ɔng"],
      ]),
    ],
    vocabulary: [
      vocab("ปู่", "pùu", "paternal grandfather"),
      vocab("ย่า", "yâa", "paternal grandmother"),
      vocab("ตา", "taa", "maternal grandfather"),
      vocab("ยาย", "yaay", "maternal grandmother"),
      vocab("ลูกพี่ลูกน้อง", "lûuk phîi lûuk nɔ́ɔng", "cousin"),
    ],
    notes: ["Thai kinship terms distinguish the father's and mother's sides of the family."],
    quizQuestions: [
      mc("pt9d-1", "Which word means maternal grandmother?", ["yaay", "yâa", "pâa"], "yaay"),
      mc("pt9d-2", "Which pair refers to the father's parents?", ["pùu and yâa", "taa and yaay", "lung and pâa"], "pùu and yâa"),
    ],
  }),
  makeSection({
    courseId: "lat2201",
    chapterNumber: 9,
    chapterTitle: CHAPTER_TITLES[9],
    letter: "E",
    title: "Family Dinner and Future Plans",
    pdfPages: "56-58",
    contentType: "conversation",
    overview: "Use family requests, reasons, weather, and future study plans in one conversation.",
    conversations: [
      dialogue("Dinner with the family", [
        ["Mother", "ธารากินน้อยจัง อาหารไม่อร่อยหรือจ๊ะ", "Tara kin nɔ́ɔy cang, aahǎan mây arɔ̀y rʉ̌ʉ cá"],
        ["Tara", "อร่อยค่ะ แต่หนูอิ่มแล้วค่ะ", "arɔ̀y khâ, tɛ̀ɛ nǔu ìm lɛ́ɛw khâ"],
        ["Father", "วันนี้ทำไมกลับบ้านช้าล่ะลูก", "wan níi thammay klàp bâan cháa lâ lûuk"],
        ["Tara", "ฝนตกค่ะ รถติดมาก", "fǒn tòk khâ, rót tìt mâak"],
        ["Grandmother", "ช่วยส่งชามต้มยำกุ้งมาให้ยายหน่อยสิจ๊ะ", "chûay sòng chaam tôm yam kûng maa hây yaay nɔ̀y sì cá"],
        ["Father", "ปีหน้าแม่จะส่งธาราไปเรียนที่อเมริกา", "pii nâa mɛ̂ɛ ca sòng Tara pay rian thîi ameerikaa"],
      ]),
    ],
    vocabulary: [
      vocab("อิ่ม", "ìm", "full"),
      vocab("ฝนตก", "fǒn tòk", "it rains"),
      vocab("รถติด", "rót tìt", "traffic jam"),
      vocab("ปีหน้า", "pii nâa", "next year"),
    ],
    notes: ["ส่ง can mean send, submit, pass, or take someone somewhere depending on context."],
    quizQuestions: [
      mc("pt9e-1", "Why did Tara arrive home late?", ["It rained and traffic was heavy.", "She ate at school.", "She missed the train."], "It rained and traffic was heavy."),
      mc("pt9e-2", "Where may Tara study next year?", ["The United States", "Japan", "Thailand"], "The United States"),
      blank("pt9e-3", "chûay ___ chaam tôm yam kûng maa hây yaay nɔ̀y.", "sòng"),
    ],
  }),

  makeSection({
    courseId: "lat2201",
    chapterNumber: 10,
    chapterTitle: CHAPTER_TITLES[10],
    letter: "A",
    title: "Review 1: Takeshi's First Class",
    pdfPages: "60",
    contentType: "review",
    overview: "Create Takeshi's first NUS classroom introduction and describe his girlfriend.",
    conversations: [
      dialogue("Mission briefing", [
        ["Prompt", "ทาเคชิแนะนำตัวกับนักเรียนที่นั่งข้าง ๆ", "Takeshi introduces himself to the student beside him."],
        ["Prompt", "บอกชื่อ ประเทศ และถามข้อมูลของอีกฝ่าย", "Give a name and country, then ask the other person's information."],
      ]),
    ],
    vocabulary: [],
    notes: ["This comprehensive exercise revisits Chapter 1 and is intended for creative pair work."],
    quizQuestions: [
      response("pt10a-1", "Write Takeshi's opening greeting and self-introduction in Thai."),
      response("pt10a-2", "Write two facts about Takeshi's girlfriend using Chapter 1 language."),
    ],
  }),
  makeSection({
    courseId: "lat2201",
    chapterNumber: 10,
    chapterTitle: CHAPTER_TITLES[10],
    letter: "B",
    title: "Review 2: Planning a Trip",
    pdfPages: "61",
    contentType: "review",
    overview: "Recommend a holiday destination and describe what Takeshi liked or disliked there.",
    conversations: [
      dialogue("Mission briefing", [
        ["Prompt", "เสนอที่เที่ยวและบอกเหตุผล", "Suggest a destination and give a reason."],
        ["Prompt", "เปรียบเทียบอากาศ อาหาร ราคา และกิจกรรม", "Discuss weather, food, price, and activities."],
      ]),
    ],
    vocabulary: [],
    notes: ["This review follows the Chapter 2 A-B order printed in the workbook."],
    quizQuestions: [
      response("pt10b-1", "Recommend a place to Takeshi using เพราะ to give at least one reason."),
      response("pt10b-2", "Write one thing he liked and one thing he did not like about the trip."),
    ],
  }),
  makeSection({
    courseId: "lat2201",
    chapterNumber: 10,
    chapterTitle: CHAPTER_TITLES[10],
    letter: "C",
    title: "Review 3: International Classmates",
    pdfPages: "62-63",
    contentType: "review",
    overview: "Identify nationalities, languages, personalities, preferences, and homework answers.",
    conversations: [
      dialogue("Mission briefing", [
        ["Prompt", "บอกว่าเพื่อนเป็นคนประเทศอะไร", "Say which country each classmate is from."],
        ["Prompt", "บอกว่าเขาพูดภาษาอะไรและชอบอะไร", "Say which languages they speak and what they like."],
      ]),
    ],
    vocabulary: [],
    notes: ["The source page contains four activities; complete them in the printed C-D sequence."],
    quizQuestions: [
      response("pt10c-1", "Describe one classmate's nationality and language ability."),
      response("pt10c-2", "Complete a short profile of Takeshi's girlfriend, including food or hobbies."),
      blank("pt10c-3", "___ Singapore kin puu. (Singaporeans eat crab.)", "khon"),
    ],
  }),
  makeSection({
    courseId: "lat2201",
    chapterNumber: 10,
    chapterTitle: CHAPTER_TITLES[10],
    letter: "D",
    title: "Review 4: Family and Directions",
    pdfPages: "64",
    contentType: "review",
    overview: "Describe Takeshi's family and pets, then guide his girlfriend through a neighbourhood.",
    conversations: [
      dialogue("Mission briefing", [
        ["Prompt", "เล่าเรื่องครอบครัวและสัตว์เลี้ยงของทาเคชิ", "Describe Takeshi's family and pets."],
        ["Prompt", "บอกทางไปร้านหรือสถานที่ในละแวกนั้น", "Give directions to a nearby shop or place."],
      ]),
    ],
    vocabulary: [],
    notes: ["This comprehensive exercise revisits possession, family, location, and directions."],
    quizQuestions: [
      response("pt10d-1", "Write three sentences about Takeshi's family, home, or pets."),
      response("pt10d-2", "Give at least two direction steps to help his girlfriend."),
    ],
  }),
  makeSection({
    courseId: "lat2201",
    chapterNumber: 10,
    chapterTitle: CHAPTER_TITLES[10],
    letter: "E",
    title: "Review 5: Choosing a Home",
    pdfPages: "65",
    contentType: "review",
    overview: "Compare living in a house and a dormitory, then develop Takeshi's relationship story.",
    conversations: [
      dialogue("Mission briefing", [
        ["Prompt", "เปรียบเทียบบ้านกับหอพัก", "Compare a house with a dormitory."],
        ["Prompt", "เล่าว่าทาเคชิกับแฟนรู้จักกันอย่างไร", "Tell how Takeshi and his girlfriend met."],
      ]),
    ],
    vocabulary: [],
    notes: ["Use กว่า for comparisons and reciprocal กัน where appropriate."],
    quizQuestions: [
      response("pt10e-1", "Give two advantages of a house and two advantages of a dormitory."),
      response("pt10e-2", "Write a short account of how Takeshi and his girlfriend got to know each other."),
    ],
  }),
  makeSection({
    courseId: "lat2201",
    chapterNumber: 10,
    chapterTitle: CHAPTER_TITLES[10],
    letter: "F",
    title: "Review 6: Weekly Schedules",
    pdfPages: "66-67",
    contentType: "review",
    overview: "Read two weekly timetables and schedule shared guitar practice.",
    conversations: [
      dialogue("Mission briefing", [
        ["Prompt", "ดูตารางของทาเคชิและแอน", "Read Takeshi's and Ann's schedules."],
        ["Prompt", "หาเวลาว่างสามครั้ง ครั้งละสองชั่วโมง", "Find three shared two-hour practice sessions."],
      ]),
    ],
    vocabulary: [],
    notes: ["This exercise emphasizes time expressions, daily actions, and negotiation."],
    quizQuestions: [
      response("pt10f-1", "Choose one shared two-hour practice time and write it in Thai."),
      response("pt10f-2", "Propose a second practice time and explain why both people are free."),
    ],
  }),
  makeSection({
    courseId: "lat2201",
    chapterNumber: 10,
    chapterTitle: CHAPTER_TITLES[10],
    letter: "G",
    title: "Review 7: Police Report and Market",
    pdfPages: "68-69",
    contentType: "review",
    overview: "Create a police interview, then bargain and order food for Takeshi's family.",
    conversations: [
      dialogue("Mission briefing", [
        ["Prompt", "ยืนยันที่อยู่และบอกว่าอยู่ที่ไหนตอนเกิดเหตุ", "Confirm an address and say where you were during the incident."],
        ["Prompt", "ต่อราคาและสั่งอาหารกับเครื่องดื่ม", "Bargain, then order food and drinks."],
      ]),
    ],
    vocabulary: [],
    notes: ["Follow the printed A police task before the B market and food-court task."],
    quizQuestions: [
      response("pt10g-1", "Write a short police question-and-answer exchange about an address."),
      response("pt10g-2", "Write a market request that asks the seller to reduce the price."),
    ],
  }),
  makeSection({
    courseId: "lat2201",
    chapterNumber: 10,
    chapterTitle: CHAPTER_TITLES[10],
    letter: "H",
    title: "Review 8: At the Hospital",
    pdfPages: "70",
    contentType: "review",
    overview: "Create a hospital conversation after Takeshi's father becomes ill.",
    conversations: [
      dialogue("Mission briefing", [
        ["Prompt", "พ่อของทาเคชิไม่สบายหลังอาหารกลางวัน", "Takeshi's father becomes ill after lunch."],
        ["Prompt", "สนทนากับหมอและพยาบาล", "Talk with the doctor and nurse."],
      ]),
    ],
    vocabulary: [],
    notes: ["Use illness, time, location, and speaking-request language from Chapter 8."],
    quizQuestions: [
      response("pt10h-1", "Describe at least two symptoms to the doctor in Thai."),
      response("pt10h-2", "Write one question a doctor or nurse might ask Takeshi."),
    ],
  }),
  makeSection({
    courseId: "lat2201",
    chapterNumber: 10,
    chapterTitle: CHAPTER_TITLES[10],
    letter: "I",
    title: "Review 9: Gift, Post Office, and Final Story",
    pdfPages: "71-72",
    contentType: "review",
    overview: "Plan a grandmother's gift and errand, then complete the semester-long Takeshi story.",
    conversations: [
      dialogue("Mission briefing", [
        ["Prompt", "เลือกของขวัญวันเกิดให้คุณยาย", "Choose a birthday gift for Grandmother."],
        ["Prompt", "ขอให้แฟนไปซื้อของและไปไปรษณีย์ด้วยกัน", "Ask the girlfriend to shop and go to the post office together."],
        ["Prompt", "สรุปเรื่องทาเคชิและแฟนของเขา", "Complete and compare the final stories of Takeshi and his girlfriend."],
      ]),
    ],
    vocabulary: [],
    notes: ["This is the final workbook task and should be completed after all earlier review sections."],
    quizQuestions: [
      response("pt10i-1", "Write a polite favour request about buying a birthday gift."),
      response("pt10i-2", "Write a short ending for Takeshi's story after his exchange at NUS."),
      response("pt10i-3", "Write what Takeshi's girlfriend plans to do next."),
    ],
  }),
];

export const PT_SECTION_SUMMARIES = PT_SECTIONS.map((section) => ({
  id: section.id,
  legacyChapterId: section.legacyChapterId,
  courseId: section.courseId,
  chapterNumber: section.chapterNumber,
  chapterTitle: section.chapterTitle,
  letter: section.letter,
  title: section.title,
  order: section.order,
}));

export function getPtSectionById(id: string) {
  return PT_SECTIONS.find((section) => section.id === id);
}

export function getPtSectionsByCourse(courseId: string) {
  return PT_SECTIONS.filter((section) => section.courseId === courseId).sort(
    (a, b) => a.chapterNumber - b.chapterNumber || a.order - b.order
  );
}

export function getPtSectionsByChapter(chapterNumber: number) {
  return PT_SECTIONS.filter((section) => section.chapterNumber === chapterNumber).sort(
    (a, b) => a.order - b.order
  );
}
