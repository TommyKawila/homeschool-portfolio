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
  progressBarShadow: string;
  cardGlow: string;
  welcomeGradient: string;
  reportBtn: string;
  profileAtmosphere: string;
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
    progressBar: "from-violet-300 via-fuchsia-400 to-white",
    progressBarShadow: "shadow-[0_0_20px_rgba(192,38,211,0.8)]",
    cardGlow: "hover:border-violet-400/30 hover:shadow-[0_0_30px_rgba(167,139,250,0.2)]",
    welcomeGradient: "from-violet-400 via-fuchsia-400 to-pink-400",
    reportBtn: "border-pink-400/50 bg-pink-500/10 text-pink-300 hover:border-pink-400/60 hover:bg-pink-500/20",
    profileAtmosphere: "bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(167,139,250,0.18),transparent_70%)]",
  },
  punna: {
    slug: "punna",
    name: { en: "Punna Kawila", th: "ปันนา กาวิละ" },
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
    progressBar: "from-cyan-300 via-emerald-400 to-white",
    progressBarShadow: "shadow-[0_0_20px_rgba(34,211,238,0.8)]",
    cardGlow: "hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]",
    welcomeGradient: "from-cyan-400 via-emerald-400 to-blue-400",
    reportBtn: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:border-cyan-400/50 hover:bg-cyan-500/20",
    profileAtmosphere: "bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(34,211,238,0.18),transparent_70%)]",
  },
};

export function getStudent(slug: string): StudentTheme | null {
  if (slug === "mata" || slug === "punna") return STUDENTS[slug];
  return null;
}

export function isValidStudentSlug(slug: string): slug is StudentSlug {
  return STUDENT_SLUGS.includes(slug as StudentSlug);
}
