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
    gradient: "from-green-400 to-emerald-500",
    borderColor: "border-green-400",
    iconBg: "bg-green-100",
  },
  {
    id: "2k",
    title: "2,000 Words",
    description:
      "Expand your vocabulary to 2,000 words and tackle intermediate topics.",
    xp: 1000,
    icon: "🌿",
    lessons: 25,
    gradient: "from-blue-400 to-cyan-500",
    borderColor: "border-blue-400",
    iconBg: "bg-blue-100",
  },
  {
    id: "3k",
    title: "3,000 Words",
    description:
      "Achieve advanced vocabulary mastery with 3,000 words and complex structures.",
    xp: 1500,
    icon: "🌳",
    lessons: 30,
    gradient: "from-purple-400 to-violet-500",
    borderColor: "border-purple-400",
    iconBg: "bg-purple-100",
  },
];
