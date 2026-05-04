export interface PtChapter {
  id: string;
  courseId: string;
  title: string;
  titleThai: string;
  order: number;
  conversations: Conversation[];
  vocabulary: VocabItem[];
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
  type: "multiple-choice" | "fill-blank" | "true-false";
  question: string;
  questionThai?: string;
  options?: string[];
  correctAnswer: string;
}

export const PT_CHAPTERS: PtChapter[] = [
  {
    id: "pt-ch1", courseId: "lat1201", title: "Chapter 1: At First Sight", titleThai: "บทที่ ๑", order: 1,
    conversations: [
      { title: "A. Formal Greeting", dialogues: [
        { speaker: "Mark", thai: "สวัสดีครับ", phonetic: "sawàt dii khráp" },
        { speaker: "Yoko", thai: "สวัสดีค่ะ สบายดีเหรอคะ", phonetic: "sawàt dii khâ sabaay dii rəə khá" },
        { speaker: "Mark", thai: "สบายดีครับ แล้วคุณล่ะครับ", phonetic: "sabaay dii khráp léew khun lâ khráp" },
        { speaker: "Yoko", thai: "สบายดีค่ะ ขอบคุณค่ะ", phonetic: "sabaay dii khâ khòop khun khâ" },
      ]},
      { title: "B. Getting to Know Each Other", dialogues: [
        { speaker: "Mark", thai: "ขอโทษ ผมชื่อมาร์ค คุณชื่ออะไรครับ", phonetic: "khɔ̌ɔ thôot phǒm chʉ̂ʉ Mark khun chʉ̂ʉ ʔaray khráp" },
        { speaker: "Yoko", thai: "ดิฉันชื่อโยโกะค่ะ คุณมาจากไหนคะ", phonetic: "dichán chʉ̂ʉ Yoko khâ khun maa càak nǎy khá" },
        { speaker: "Mark", thai: "ผมมาจากอเมริกา แล้วคุณล่ะครับ", phonetic: "phǒm maa càak ʔameerikaa léew khun lâ khráp" },
        { speaker: "Yoko", thai: "ดิฉันมาจากญี่ปุ่นค่ะ", phonetic: "dichán maa càak yîipùn khâ" },
      ]},
    ],
    vocabulary: [
      { thai: "สวัสดี", phonetic: "sawàt dii", meaning: "Hello/Goodbye" },
      { thai: "สบายดี", phonetic: "sabaay dii", meaning: "I'm fine" },
      { thai: "ขอบคุณ", phonetic: "khòop khun", meaning: "Thank you" },
      { thai: "ขอโทษ", phonetic: "khɔ̌ɔ thôot", meaning: "Excuse me / Sorry" },
      { thai: "ชื่อ", phonetic: "chʉ̂ʉ", meaning: "Name" },
      { thai: "มาจาก", phonetic: "maa càak", meaning: "Come from" },
      { thai: "ครับ", phonetic: "khráp", meaning: "Polite particle (male)" },
      { thai: "ค่ะ/คะ", phonetic: "khâ/khá", meaning: "Polite particle (female)" },
    ],
    quizQuestions: [
      { id: "pt1-q1", type: "fill-blank", question: "Jack: sawàt dii ___ (male polite particle)", correctAnswer: "khráp" },
      { id: "pt1-q2", type: "multiple-choice", question: "How do you say 'What is your name?' in Thai?", options: ["คุณชื่ออะไร", "คุณมาจากไหน", "สบายดีไหม", "ขอบคุณ"], correctAnswer: "คุณชื่ออะไร" },
      { id: "pt1-q3", type: "multiple-choice", question: "Which word means 'teacher'?", options: ["นักเรียน", "อาจารย์", "เพื่อน", "คุณ"], correctAnswer: "อาจารย์" },
    ],
  },
  {
    id: "pt-ch2", courseId: "lat1201", title: "Chapter 2: Snooping", titleThai: "บทที่ ๒", order: 2,
    conversations: [
      { title: "A. Asking for Information", dialogues: [
        { speaker: "Yoko", thai: "ฮาวายสวยไหมคะ", phonetic: "haawaay sǔay máy khá" },
        { speaker: "Kalani", thai: "สวยครับ", phonetic: "sǔay khráp" },
        { speaker: "Mark", thai: "ฮาวายใหญ่ไหมครับ", phonetic: "haawaay yày máy khráp" },
        { speaker: "Kalani", thai: "ใหญ่ครับ", phonetic: "yày khráp" },
      ]},
      { title: "B. Asking for Further Information", dialogues: [
        { speaker: "Mark", thai: "คุณชอบฮาวายไหม", phonetic: "khun chɔ̂ɔp haawaay máy" },
        { speaker: "Kalani", thai: "ชอบครับ ชอบมาก", phonetic: "chɔ̂ɔp khráp chɔ̂ɔp mâak" },
        { speaker: "Mark", thai: "เพราะอะไรครับ", phonetic: "phrɔ́ ʔaray khráp" },
        { speaker: "Kalani", thai: "เพราะฮาวายสวยครับ", phonetic: "phrɔ́ haawaay sǔay khráp" },
      ]},
    ],
    vocabulary: [
      { thai: "สวย", phonetic: "sǔay", meaning: "beautiful" },
      { thai: "ใหญ่", phonetic: "yày", meaning: "big" },
      { thai: "เล็ก", phonetic: "lék", meaning: "small" },
      { thai: "ร้อน", phonetic: "rɔ́ɔn", meaning: "hot" },
      { thai: "อร่อย", phonetic: "ʔarɔ̀y", meaning: "delicious" },
      { thai: "ดี", phonetic: "dii", meaning: "good" },
      { thai: "แพง", phonetic: "phɛɛng", meaning: "expensive" },
      { thai: "ชอบ", phonetic: "chɔ̂ɔp", meaning: "to like" },
      { thai: "เพราะ", phonetic: "phrɔ́", meaning: "because" },
      { thai: "สั้น", phonetic: "sân", meaning: "short" },
      { thai: "ยาว", phonetic: "yaaw", meaning: "long" },
      { thai: "เย็น", phonetic: "yen", meaning: "cool/cold" },
    ],
    quizQuestions: [
      { id: "pt2-q1", type: "multiple-choice", question: "kaafɛɛ rɔ́ɔn máy — What is being asked?", options: ["Is coffee hot?", "Is coffee good?", "Is coffee expensive?", "Is coffee sweet?"], correctAnswer: "Is coffee hot?" },
      { id: "pt2-q2", type: "multiple-choice", question: "What does ชอบ mean?", options: ["to like", "to eat", "to go", "to see"], correctAnswer: "to like" },
      { id: "pt2-q3", type: "true-false", question: "เพราะ means 'because'", options: ["True", "False"], correctAnswer: "True" },
    ],
  },
  {
    id: "pt-ch3", courseId: "lat1201", title: "Chapter 3: Identifying", titleThai: "บทที่ ๓", order: 3,
    conversations: [
      { title: "A. Nationality", dialogues: [
        { speaker: "Yoko", thai: "ดิฉันเป็นคนญี่ปุ่น", phonetic: "dichán pen khon yîipùn" },
        { speaker: "Ann", thai: "ดิฉันเป็นคนเยอรมัน", phonetic: "dichán pen khon yəəraman" },
      ]},
    ],
    vocabulary: [
      { thai: "เป็น", phonetic: "pen", meaning: "to be" },
      { thai: "คน", phonetic: "khon", meaning: "person" },
      { thai: "ภาษา", phonetic: "phaasǎa", meaning: "language" },
      { thai: "พูด", phonetic: "phûut", meaning: "to speak" },
      { thai: "เรียน", phonetic: "rian", meaning: "to study" },
      { thai: "ได้", phonetic: "dâay", meaning: "can/able to" },
      { thai: "หมา", phonetic: "mǎa", meaning: "dog" },
      { thai: "แมว", phonetic: "mɛɛw", meaning: "cat" },
      { thai: "หนู", phonetic: "nǔu", meaning: "mouse" },
      { thai: "หมู", phonetic: "mǔu", meaning: "pig" },
      { thai: "ไก่", phonetic: "kày", meaning: "chicken" },
      { thai: "เนื้อ", phonetic: "nʉ́a", meaning: "beef" },
    ],
    quizQuestions: [
      { id: "pt3-q1", type: "multiple-choice", question: "khray pen khon yîipùn?", options: ["Yoko", "Ann", "Kalani", "Mark"], correctAnswer: "Yoko" },
      { id: "pt3-q2", type: "multiple-choice", question: "What does ภาษา mean?", options: ["language", "country", "person", "name"], correctAnswer: "language" },
    ],
  },
  {
    id: "pt-ch4", courseId: "lat1201", title: "Chapter 4: To Possess or Not to Possess", titleThai: "บทที่ ๔", order: 4,
    conversations: [
      { title: "A. Reading: Yoko's Family", dialogues: [
        { speaker: "Narrator", thai: "คุณโยโกะเป็นคนญี่ปุ่น เขามาจากโตเกียว", phonetic: "khun Yoko pen khon yîipùn kháw maa càak tookiaw" },
        { speaker: "Narrator", thai: "ที่บ้านเขามีหมาหนึ่งตัว และแมวสองตัว", phonetic: "thîi bâan kháw mii mǎa nʉ̀ng tua lɛ́ mɛɛw sɔ̌ɔng tua" },
      ]},
    ],
    vocabulary: [
      { thai: "มี", phonetic: "mii", meaning: "to have" },
      { thai: "ไม่มี", phonetic: "mây mii", meaning: "don't have" },
      { thai: "พ่อ", phonetic: "phɔ̂ɔ", meaning: "father" },
      { thai: "แม่", phonetic: "mɛ̂ɛ", meaning: "mother" },
      { thai: "ลูกสาว", phonetic: "lûuk sǎaw", meaning: "daughter" },
      { thai: "ลูกชาย", phonetic: "lûuk chaay", meaning: "son" },
      { thai: "พี่สาว", phonetic: "phîi sǎaw", meaning: "older sister" },
      { thai: "น้องชาย", phonetic: "nɔ́ɔng chaay", meaning: "younger brother" },
      { thai: "บ้าน", phonetic: "bâan", meaning: "house" },
      { thai: "โรงเรียน", phonetic: "roong rian", meaning: "school" },
      { thai: "ถนน", phonetic: "thanǒn", meaning: "road" },
      { thai: "วัด", phonetic: "wát", meaning: "temple" },
      { thai: "รถยนต์", phonetic: "rót yon", meaning: "car" },
    ],
    quizQuestions: [
      { id: "pt4-q1", type: "multiple-choice", question: "How many cats does Yoko's family have?", options: ["1", "2", "3", "0"], correctAnswer: "2" },
      { id: "pt4-q2", type: "multiple-choice", question: "What does มี mean?", options: ["to have", "to be", "to go", "to like"], correctAnswer: "to have" },
    ],
  },
  {
    id: "pt-ch5", courseId: "lat1201", title: "Chapter 5: Comparing", titleThai: "บทที่ ๕", order: 5,
    conversations: [
      { title: "A. Comparison", dialogues: [
        { speaker: "Ann", thai: "นั่นวัวใช่ไหมคะ", phonetic: "nân wua châay máy khá" },
        { speaker: "Tara", thai: "ไม่ใช่ค่ะ นั่นควายค่ะ วัวใหญ่กว่าควาย", phonetic: "mây châay khâ nân khwaay khâ wua yày kwàa khwaay" },
      ]},
    ],
    vocabulary: [
      { thai: "กว่า", phonetic: "kwàa", meaning: "more than (comparative)" },
      { thai: "วัว", phonetic: "wua", meaning: "cow" },
      { thai: "ควาย", phonetic: "khwaay", meaning: "water buffalo" },
      { thai: "นก", phonetic: "nók", meaning: "bird" },
      { thai: "รัก", phonetic: "rák", meaning: "to love" },
      { thai: "ไกล", phonetic: "klay", meaning: "far" },
      { thai: "ใกล้", phonetic: "klây", meaning: "near" },
    ],
    quizQuestions: [
      { id: "pt5-q1", type: "multiple-choice", question: "wua yày kwàa khwaay — What does this mean?", options: ["Cows are bigger than buffalo", "Buffalo are bigger than cows", "Cows are smaller", "They are the same size"], correctAnswer: "Cows are bigger than buffalo" },
    ],
  },
  // --- LAT2201 chapters ---
  {
    id: "pt-ch6", courseId: "lat2201", title: "Chapter 6: True Thai", titleThai: "บทที่ ๖", order: 1,
    conversations: [
      { title: "A. Where are you going?", dialogues: [
        { speaker: "Yoko", thai: "จะไปไหนคะ", phonetic: "ca pay nǎy khá" },
        { speaker: "Kalani", thai: "ไปห้องสมุดครับ", phonetic: "pay hɔ̂ng samùt khráp" },
      ]},
      { title: "B. Have you eaten?", dialogues: [
        { speaker: "Mark", thai: "ทานข้าวแล้วหรือยังครับ", phonetic: "thaan khâaw lɛ́ɛw rʉ̌ʉ yang khráp" },
        { speaker: "Ann", thai: "ทานแล้วค่ะ", phonetic: "thaan lɛ́ɛw khâ" },
      ]},
    ],
    vocabulary: [
      { thai: "จะ", phonetic: "ca", meaning: "will" },
      { thai: "ไป", phonetic: "pay", meaning: "to go" },
      { thai: "มา", phonetic: "maa", meaning: "to come" },
      { thai: "แล้ว", phonetic: "lɛ́ɛw", meaning: "already" },
      { thai: "ยัง", phonetic: "yang", meaning: "yet/still" },
      { thai: "ห้องสมุด", phonetic: "hɔ̂ng samùt", meaning: "library" },
      { thai: "โรงอาหาร", phonetic: "roong ʔaahǎan", meaning: "canteen" },
      { thai: "หิว", phonetic: "hǐw", meaning: "hungry" },
      { thai: "อิ่ม", phonetic: "ʔìm", meaning: "full (stomach)" },
      { thai: "ทำไม", phonetic: "thammay", meaning: "why" },
      { thai: "เชิญ", phonetic: "chəən", meaning: "please (invitation)" },
    ],
    quizQuestions: [
      { id: "pt6-q1", type: "multiple-choice", question: "What does จะไปไหน mean?", options: ["Where are you going?", "Where did you come from?", "Have you eaten?", "How are you?"], correctAnswer: "Where are you going?" },
      { id: "pt6-q2", type: "multiple-choice", question: "ทานข้าวแล้วหรือยัง means:", options: ["Have you eaten yet?", "What will you eat?", "Where do you eat?", "Do you like rice?"], correctAnswer: "Have you eaten yet?" },
    ],
  },
  {
    id: "pt-ch7", courseId: "lat2201", title: "Chapter 7: When It Comes to Numbers", titleThai: "บทที่ ๗", order: 2,
    conversations: [
      { title: "A. Address", dialogues: [
        { speaker: "Police", thai: "บ้านคุณอยู่ที่ไหนครับ", phonetic: "bâan khun yùu thîi nǎy khráp" },
        { speaker: "Tara", thai: "บางนาค่ะ", phonetic: "baang naa khâ" },
      ]},
    ],
    vocabulary: [
      { thai: "เท่าไหร่", phonetic: "thâwrày", meaning: "how much" },
      { thai: "ราคา", phonetic: "raakhaa", meaning: "price" },
      { thai: "บาท", phonetic: "bàat", meaning: "baht (currency)" },
      { thai: "ซื้อ", phonetic: "sʉ́ʉ", meaning: "to buy" },
      { thai: "ขาย", phonetic: "khǎay", meaning: "to sell" },
      { thai: "ลด", phonetic: "lót", meaning: "to reduce/discount" },
      { thai: "แพง", phonetic: "phɛɛng", meaning: "expensive" },
      { thai: "ถูก", phonetic: "thùuk", meaning: "cheap" },
    ],
    quizQuestions: [
      { id: "pt7-q1", type: "multiple-choice", question: "What does เท่าไหร่ mean?", options: ["how much", "how many", "how far", "how long"], correctAnswer: "how much" },
    ],
  },
  {
    id: "pt-ch8", courseId: "lat2201", title: "Chapter 8: Space and Time", titleThai: "บทที่ ๘", order: 3,
    conversations: [
      { title: "A. Visiting", dialogues: [
        { speaker: "Grandma", thai: "มาหาใครจ๊ะ", phonetic: "maa hǎa khray cá" },
        { speaker: "Tara", thai: "มานะอยู่ไหมคะ", phonetic: "Mana yùu máy khá" },
        { speaker: "Grandma", thai: "ไม่อยู่จะ ตอนนี้เขาอยู่ที่โรงพยาบาล", phonetic: "mây yùu câ tɔɔn níi kháw yùu thîi roong phayaabaan" },
      ]},
    ],
    vocabulary: [
      { thai: "เมื่อวาน", phonetic: "mʉ̂awaan", meaning: "yesterday" },
      { thai: "พรุ่งนี้", phonetic: "phrûng níi", meaning: "tomorrow" },
      { thai: "วันนี้", phonetic: "wan níi", meaning: "today" },
      { thai: "ปวดหัว", phonetic: "pùat hǔa", meaning: "headache" },
      { thai: "โรงพยาบาล", phonetic: "roong phayaabaan", meaning: "hospital" },
      { thai: "หมอ", phonetic: "mɔ̌ɔ", meaning: "doctor" },
      { thai: "ยา", phonetic: "yaa", meaning: "medicine" },
      { thai: "ดัง", phonetic: "dang", meaning: "loud" },
      { thai: "เบา/ค่อย", phonetic: "baw/khɔ̂y", meaning: "soft/quiet" },
    ],
    quizQuestions: [
      { id: "pt8-q1", type: "multiple-choice", question: "What does โรงพยาบาล mean?", options: ["hospital", "school", "temple", "market"], correctAnswer: "hospital" },
    ],
  },
  {
    id: "pt-ch9", courseId: "lat2201", title: "Chapter 9: Give and Take", titleThai: "บทที่ ๙", order: 4,
    conversations: [
      { title: "A. Shopping Request", dialogues: [
        { speaker: "Tara", thai: "ฉันจะไปซื้อของที่ซุปเปอร์มาร์เก็ต เธออยากได้อะไรไหม", phonetic: "chán ca pay sʉ́ʉ khɔ̌ɔng thîi súpəəmaakét thəə yàak dâay ʔaray máy" },
        { speaker: "Ann", thai: "ฉันอยากได้ซาชิมิ เธอช่วยซื้อมาให้หน่อยได้ไหม", phonetic: "chán yàak dâay saachimí thəə chûay sʉ́ʉ maa hây nɔ̀y dâay máy" },
      ]},
    ],
    vocabulary: [
      { thai: "ให้", phonetic: "hây", meaning: "to give" },
      { thai: "ช่วย", phonetic: "chûay", meaning: "to help" },
      { thai: "เอา", phonetic: "ʔaw", meaning: "to take/bring" },
      { thai: "ส่ง", phonetic: "sòng", meaning: "to send" },
      { thai: "ลืม", phonetic: "lʉʉm", meaning: "to forget" },
      { thai: "การบ้าน", phonetic: "kaan bâan", meaning: "homework" },
      { thai: "ของขวัญ", phonetic: "khɔ̌ɔng khwǎn", meaning: "gift" },
      { thai: "วันเกิด", phonetic: "wan kə̀ət", meaning: "birthday" },
    ],
    quizQuestions: [
      { id: "pt9-q1", type: "multiple-choice", question: "What does ช่วย mean?", options: ["to help", "to give", "to take", "to forget"], correctAnswer: "to help" },
    ],
  },
  {
    id: "pt-ch10", courseId: "lat2201", title: "Chapter 10: The Story of Takeshi", titleThai: "บทที่ ๑๐", order: 5,
    conversations: [
      { title: "Comprehensive Review", dialogues: [
        { speaker: "Narrator", thai: "บทนี้เป็นแบบฝึกหัดรวม", phonetic: "bòt níi pen bɛ̀ɛp fʉ̀khàt ruam" },
      ]},
    ],
    vocabulary: [],
    quizQuestions: [
      { id: "pt10-q1", type: "multiple-choice", question: "The Story of Takeshi is:", options: ["A comprehensive exercise chapter", "A grammar lesson", "A reading passage", "A listening exercise"], correctAnswer: "A comprehensive exercise chapter" },
    ],
  },
];

export function getPtChapterById(id: string) {
  return PT_CHAPTERS.find((c) => c.id === id);
}

export function getPtChaptersByCourse(courseId: string) {
  return PT_CHAPTERS.filter((c) => c.courseId === courseId).sort((a, b) => a.order - b.order);
}
