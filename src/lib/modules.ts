export interface Module {
  id: string;
  title: string;
  description: string;
  xp: number;
  icon: string;
  lessons: number;
  gradient: string;
  borderColor: string;
  iconBg: string;
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
    gradient: "from-violet-500 to-purple-500",
    borderColor: "border-violet-200",
    iconBg: "bg-violet-50",
  },
];
