export type StudentSlug = "mata" | "punna";

export interface StudentTheme {
  slug: StudentSlug;
  name: { en: string; th: string };
  age: number;
  identity: { en: string; th: string };
  philosophy: { en: string; th: string };
  primary: string;
  secondary: string;
  gradient: string;
  badgeBorder: string;
  badgeBg: string;
  badgeText: string;
  progressBar: string;
  cardGlow: string;
  welcomeGradient: string;
}

export const STUDENT_SLUGS: StudentSlug[] = ["mata", "punna"];

export const STUDENTS: Record<StudentSlug, StudentTheme> = {
  mata: {
    slug: "mata",
    name: { en: "Mata Kawila", th: "มาตา กาวิละ" },
    age: 10,
    identity: {
      en: "Homeschooler pursuing excellence through technology and nature.",
      th: "โฮมสคูลเลอร์มุ่งสู่ความเป็นเลิศผ่านเทคโนโลยีและธรรมชาติ",
    },
    philosophy: {
      en: "Learning is an exploration, not just a classroom task.",
      th: "การเรียนรู้คือการสำรวจ ไม่ใช่แค่ภาระในห้องเรียน",
    },
    primary: "amber",
    secondary: "violet",
    gradient: "from-amber-400 to-violet-400",
    badgeBorder: "border-amber-400/50",
    badgeBg: "bg-amber-400/15",
    badgeText: "text-amber-300",
    progressBar: "from-violet-500 to-violet-400",
    cardGlow: "hover:border-violet-400/30 hover:shadow-[0_0_30px_rgba(167,139,250,0.1)]",
    welcomeGradient: "from-violet-300 via-amber-200 to-amber-300",
  },
  punna: {
    slug: "punna",
    name: { en: "Punna Kawila", th: "ปัญญา กาวิละ" },
    age: 8,
    identity: {
      en: "Young explorer building skills through play and curiosity.",
      th: "นักสำรวจตัวน้อยสร้างทักษะผ่านการเล่นและความอยากรู้",
    },
    philosophy: {
      en: "Every day is a chance to discover something new.",
      th: "ทุกวันคือโอกาสในการค้นพบสิ่งใหม่",
    },
    primary: "cyan",
    secondary: "pink",
    gradient: "from-cyan-400 to-pink-400",
    badgeBorder: "border-cyan-400/50",
    badgeBg: "bg-cyan-400/15",
    badgeText: "text-cyan-300",
    progressBar: "from-cyan-500 to-pink-400",
    cardGlow: "hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]",
    welcomeGradient: "from-cyan-300 via-pink-200 to-pink-400",
  },
};

export function getStudent(slug: string): StudentTheme | null {
  if (slug === "mata" || slug === "punna") return STUDENTS[slug];
  return null;
}

export function isValidStudentSlug(slug: string): slug is StudentSlug {
  return STUDENT_SLUGS.includes(slug as StudentSlug);
}
