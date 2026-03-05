export type Lang = "en" | "th";
export type Bilingual = { en: string; th: string };

export type CompletedCourse = {
  id: string;
  subject: Bilingual;
  grade: Bilingual;
  completedDate: Bilingual;
  certificateUrl?: string;
};

export type ActiveCourse = {
  id: string;
  subject: Bilingual;
  grade: Bilingual;
  progress: number;
  letterGrade: string;
};

export type SkillItem = {
  title: Bilingual;
  description: Bilingual;
  image?: string;
  videoUrl?: string;
};

export type SkillCategory = {
  id: string;
  title: Bilingual;
  subtitle?: Bilingual;
  items: SkillItem[];
};
