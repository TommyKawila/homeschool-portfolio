export type {
  Lang,
  Bilingual,
  CompletedCourse,
  ActiveCourse,
  SkillItem,
  SkillCategory,
} from "@/types/studentData";

import type { ActiveCourse, CompletedCourse, SkillCategory } from "@/types/studentData";

export const student = {
  name: { en: "Martha Kawila", th: "มาตา กาวิละ" },
  age: 10,
  presentationVideo: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with your presentation video URL
  identity: {
    en: "Homeschooler pursuing excellence through technology and nature.",
    th: "โฮมสคูลเลอร์มุ่งสู่ความเป็นเลิศผ่านเทคโนโลยีและธรรมชาติ",
  },
  philosophy: {
    en: "Learning is an exploration, not just a classroom task.",
    th: "การเรียนรู้คือการสำรวจ ไม่ใช่แค่ภาระในห้องเรียน",
  },
};

export const gpa = {
  value: 4.0,
  label: { en: "GPA", th: "เกรดเฉลี่ย" },
  scale: "4.00",
};

export const completedCourses: CompletedCourse[] = [
  { id: "-1", subject: { en: "Science", th: "วิทยาศาสตร์" }, grade: { en: "Grade 4", th: "ป.4" }, completedDate: { en: "Feb 22, 2026", th: "22 ก.พ. 2569" } },
  { id: "-2", subject: { en: "Language Arts", th: "ภาษาศิลป์" }, grade: { en: "Grade 4", th: "ป.4" }, completedDate: { en: "Sept 4, 2025", th: "4 ก.ย. 2568" } },
  { id: "-3", subject: { en: "Social Studies", th: "สังคมศึกษา" }, grade: { en: "Grade 4", th: "ป.4" }, completedDate: { en: "Aug 11, 2025", th: "11 ส.ค. 2568" } },
];

export const activeCourses: ActiveCourse[] = [
  { id: "-10", subject: { en: "Social Studies", th: "สังคมศึกษา" }, grade: { en: "Grade 5", th: "ป.5" }, progress: 84, letterGrade: "A+" },
  { id: "-11", subject: { en: "Language Arts / Reading", th: "ภาษาศิลป์ / การอ่าน" }, grade: { en: "Grade 5", th: "ป.5" }, progress: 58, letterGrade: "A" },
  { id: "-12", subject: { en: "Math", th: "คณิตศาสตร์" }, grade: { en: "Grade 4", th: "ป.4" }, progress: 46, letterGrade: "A" },
  { id: "-13", subject: { en: "Science", th: "วิทยาศาสตร์" }, grade: { en: "Grade 5", th: "ป.5" }, progress: 6, letterGrade: "A" },
];

export const practicalSkills: SkillCategory[] = [
  {
    id: "agri-science",
    title: { en: "Agri-Science", th: "เกษตรศาสตร์" },
    items: [
      { title: { en: "Soil mixing", th: "การปรุงดินปลูก" }, description: { en: "Hands-on soil preparation and composition.", th: "ฝึกปรุงดินและส่วนผสมด้วยตนเอง" }, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
      { title: { en: "Worm compost", th: "ปุ๋ยหมักไส้เดือน" }, description: { en: "Vermicomposting and organic waste cycling.", th: "ทำปุ๋ยหมักและรีไซเคิลขยะอินทรีย์" }, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
      { title: { en: "Lettuce seed propagation", th: "เพาะเมล็ดผักกาด" }, description: { en: "From seed to harvest tracking.", th: "ติดตามจากเมล็ดถึงเก็บเกี่ยว" } },
    ],
  },
  {
    id: "adventure-fitness",
    title: { en: "Adventure & Fitness", th: "ผจญภัยและฟิตเนส" },
    items: [
      { title: { en: "Hiking Doi Pha Hom Pok / Ang Khang", th: "เดินป่าดอยผ้าห่มปก / อ่างขาง" }, description: { en: "Mountain trekking and nature exploration.", th: "เดินป่าและสำรวจธรรมชาติ" }, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
      { title: { en: "5K Fun Run", th: "วิ่งสนุก 5 กิโล" }, description: { en: "Endurance and community participation.", th: "ความอดทนและการมีส่วนร่วมในชุมชน" } },
      { title: { en: "Fitness tracking", th: "บันทึกการออกกำลังกาย" }, description: { en: "Regular activity and progress logging.", th: "บันทึกกิจกรรมและความก้าวหน้าสม่ำเสมอ" }, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    ],
  },
  {
    id: "life-skills",
    title: { en: "Life Skills", th: "ทักษะชีวิต" },
    items: [
      { title: { en: "Cooking prep", th: "เตรียมอาหาร" }, description: { en: "Kitchen safety and meal preparation.", th: "ความปลอดภัยในครัวและการเตรียมอาหาร" }, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
      { title: { en: "Housework", th: "งานบ้าน" }, description: { en: "Daily chores and household responsibility.", th: "งานบ้านและความรับผิดชอบในบ้าน" } },
      { title: { en: "Personal responsibility", th: "ความรับผิดชอบส่วนตัว" }, description: { en: "Self-care and accountability.", th: "ดูแลตนเองและรับผิดชอบการกระทำ" }, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    ],
  },
  {
    id: "proud_achievements",
    title: { en: "Proud Achievements", th: "ความภาคภูมิใจ" },
    items: [],
  },
];

export const annualReport = {
  schoolName: { en: "Mata Panna Homeschool", th: "โฮมสคูลมาตาปันนา" },
  academicYear: { en: "Academic Year 2025–2026", th: "ปีการศึกษา 2568–2569" },
  studentLevel: { en: "Grade 4 Equivalent", th: "เทียบเท่าชั้นประถมศึกษาปีที่ 4" },
  gpaNote: { en: "GPA 4.00 — Consistent A/A+ in all subjects", th: "เกรดเฉลี่ย 4.00 — ได้เกรด A/A+ ทุกวิชา" },
  coreCurriculum: {
    heading: { en: "Core Curriculum (Acellus Power Homeschool)", th: "หลักสูตรแกนกลาง (Acellus Power Homeschool)" },
    items: [
      { en: "Science (Grade 3–4)", th: "วิทยาศาสตร์ (ป.3–4)" },
      { en: "Math (Grade 2–3)", th: "คณิตศาสตร์ (ป.2–3)" },
      { en: "Language Arts (Grade 3–4)", th: "ภาษาศิลป์ (ป.3–4)" },
      { en: "Social Studies (Grade 3–4)", th: "สังคมศึกษา (ป.3–4)" },
      { en: "Art", th: "ศิลปะ" },
      { en: "Spanish", th: "ภาษาสเปน" },
      { en: "Emotional Health", th: "สุขภาพจิต" },
    ],
  },
  integratedSkills: {
    heading: { en: "Integrated Skills & Activities", th: "ทักษะบูรณาการและกิจกรรม" },
    sections: [
      {
        title: { en: "Thai & Math with Grandpa (Retired Teacher)", th: "ภาษาไทยและคณิตศาสตร์กับคุณตา (ครูเกษียณ)" },
        icon: "book-open" as const,
      },
      {
        title: { en: "Agri-Science", th: "เกษตรศาสตร์" },
        icon: "sprout" as const,
        items: [
          { en: "Soil mixing and bed preparation", th: "ปรุงดินและเตรียมแปลง" },
          { en: "Earthworm composting", th: "ปุ๋ยหมักไส้เดือน" },
        ],
      },
      {
        title: { en: "Life Skills", th: "ทักษะชีวิต" },
        icon: "home" as const,
        items: [
          { en: "Bed making, Laundry, Car washing", th: "เก็บเตียง ซักผ้า ล้างรถ" },
          { en: "Cooking: Sandwiches, Rice, Cutting vegetables", th: "ทำอาหาร: แซนวิช หุงข้าว หั่นผัก" },
        ],
      },
      {
        title: { en: "Technology & Creativity", th: "เทคโนโลยีและความคิดสร้างสรรค์" },
        icon: "sparkles" as const,
        items: [
          { en: "AI Image Prompting and Character Design", th: "สร้างภาพ AI และออกแบบตัวละคร" },
        ],
      },
      {
        title: { en: "Nightly Stories (10–15 min)", th: "นิทานก่อนนอน (10–15 นาที)" },
        icon: "moon" as const,
        items: [
          { en: "Topics: Photosynthesis, Human Body", th: "เรื่อง: การสังเคราะห์แสง ร่างกายมนุษย์" },
        ],
      },
    ],
  },
  wellness: {
    heading: { en: "Wellness & Mental Health", th: "สุขภาพกายและจิตใจ" },
    items: [
      { en: "7-minute meditation nightly", th: "นั่งสมาธิ 7 นาทีทุกคืน" },
      { en: "Treadmill 2–3 days/week", th: "ลู่วิ่ง 2–3 วัน/สัปดาห์" },
      { en: "Outdoor play with Dad, Trampoline", th: "เล่นกลางแจ้งกับพ่อ แทรมโพลีน" },
      { en: "Hiking Doi Pha Hom Pok / Ang Khang", th: "เดินป่าดอยผ้าห่มปก / อ่างขาง" },
      { en: "5K Fun Run", th: "วิ่งสนุก 5 กิโลเมตร" },
    ],
    note: {
      en: "Note: Shifted from swimming to biking/agri-science due to long winter season.",
      th: "หมายเหตุ: ปรับจากว่ายน้ำเป็นปั่นจักรยาน/เกษตร เนื่องจากฤดูหนาวยาวนาน",
    },
  },
  strengths: {
    heading: { en: "Strengths", th: "จุดแข็ง" },
    items: [
      { en: "Focused and self-disciplined", th: "มีสมาธิและมีวินัย" },
      { en: "Responsible and reliable", th: "รับผิดชอบและไว้ใจได้" },
      { en: "Good communication skills", th: "ทักษะสื่อสารดี" },
      { en: "Healthy lifestyle habits", th: "มีนิสัยรักสุขภาพ" },
      { en: "Creative thinker", th: "คิดสร้างสรรค์" },
    ],
  },
  futurePlan: {
    heading: { en: "Future Plan", th: "แผนอนาคต" },
    items: [
      { en: "Continue Acellus English curriculum", th: "เรียนหลักสูตร Acellus ภาษาอังกฤษต่อเนื่อง" },
      { en: "Thai language with Grandpa", th: "ภาษาไทยกับคุณตา" },
      { en: "Daily meditation practice", th: "ฝึกสมาธิทุกวัน" },
      { en: "Art and Agri-science integration", th: "บูรณาการศิลปะและเกษตรศาสตร์" },
    ],
  },
  signature: {
    name: { en: "Ms. Pornpunsa Kawila", th: "น.ส. พรพรรษา กาวิละ" },
    role: { en: "Education Manager", th: "ผู้จัดการศึกษา" },
  },
};

export const labels = {
  academicDashboard: { en: "Academic Dashboard", th: "ผลการเรียน" },
  practicalSkillModules: { en: "Practical Skill Modules", th: "ทักษะปฏิบัติ" },
  viewReport: { en: "View report", th: "ดูรายงาน" },
  clickToViewAcellus: { en: "Click to view full Acellus report", th: "คลิกดูรายงาน Acellus เต็ม" },
  acellusReport: { en: "Acellus Report", th: "รายงาน Acellus" },
  activeCourses: { en: "Active Courses", th: "วิชาที่กำลังเรียน" },
  completedCourses: { en: "Completed Courses", th: "วิชาที่เรียนสำเร็จแล้ว" },
  academicSummary: { en: "Academic Summary", th: "สรุปผลการเรียน" },
  reportMode: { en: "Report mode", th: "โหมดรายงาน" },
  dashboard: { en: "Dashboard", th: "แดชบอร์ด" },
  age: { en: "Age", th: "อายุ" },
  watchPresentation: { en: "Watch Presentation", th: "ชมวิดีโอแนะนำ" },
  watchVideo: { en: "Watch Video", th: "ชมวิดีโอ" },
  playVideo: { en: "Play Video", th: "เล่นวิดีโอ" },
  annualReport: { en: "Annual Report", th: "รายงานประจำปี" },
  viewFullJourney: { en: "View Full Journey", th: "ดูเส้นทางการเรียนรู้" },
  downloadPdf: { en: "Download PDF Report", th: "ดาวน์โหลดรายงาน PDF" },
  welcomeMessage: { en: "Welcome to Martha's Learning Universe", th: "ยินดีต้อนรับสู่จักรวาลแห่งการเรียนรู้ของมาตา" },
  milestones: { en: "Milestones", th: "เป้าหมายที่สำเร็จ" },
  viewCertificate: { en: "View Certificate", th: "ดูใบประกาศ" },
  viewPhoto: { en: "Photo", th: "รูปภาพ" },
  watchClip: { en: "Clip", th: "คลิป" },
  inProgress: { en: "In Progress", th: "กำลังเรียน" },
  completed: { en: "Completed", th: "สำเร็จแล้ว" },
} as const;
