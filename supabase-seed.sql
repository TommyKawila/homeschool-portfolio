-- Run this in Supabase SQL Editor to create tables and seed data

create table if not exists portfolio_settings (
  id int primary key default 1,
  gpa numeric(3,2) default 4.00,
  profile_photo_url text,
  presentation_video_url text,
  annual_report_summary_en text,
  annual_report_summary_th text,
  updated_at timestamptz default now()
);

create table if not exists courses (
  id serial primary key,
  subject_en text not null,
  subject_th text not null default '',
  grade_en text not null default '',
  grade_th text not null default '',
  status text not null check (status in ('active','completed')),
  progress int default 0,
  letter_grade text default 'A',
  completed_date_en text,
  completed_date_th text
);

create table if not exists activities (
  id serial primary key,
  category text not null check (category in ('agri-science','adventure-fitness','life-skills')),
  title_en text not null,
  title_th text not null default '',
  description_en text not null default '',
  description_th text not null default '',
  image_url text,
  video_url text,
  sort_order int default 0
);

-- Seed: settings
insert into portfolio_settings (id, gpa, presentation_video_url)
values (1, 4.00, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')
on conflict (id) do nothing;

-- Seed: active courses
insert into courses (subject_en, subject_th, grade_en, grade_th, status, progress, letter_grade) values
  ('Social Studies', 'สังคมศึกษา', 'Grade 5', 'ป.5', 'active', 84, 'A+'),
  ('Language Arts / Reading', 'ภาษาศิลป์ / การอ่าน', 'Grade 5', 'ป.5', 'active', 58, 'A'),
  ('Math', 'คณิตศาสตร์', 'Grade 4', 'ป.4', 'active', 46, 'A'),
  ('Science', 'วิทยาศาสตร์', 'Grade 5', 'ป.5', 'active', 6, 'A');

-- Seed: completed courses
insert into courses (subject_en, subject_th, grade_en, grade_th, status, progress, letter_grade, completed_date_en, completed_date_th) values
  ('Science', 'วิทยาศาสตร์', 'Grade 4', 'ป.4', 'completed', 100, 'A+', 'Feb 22, 2026', '22 ก.พ. 2569'),
  ('Language Arts', 'ภาษาศิลป์', 'Grade 4', 'ป.4', 'completed', 100, 'A', 'Sept 4, 2025', '4 ก.ย. 2568'),
  ('Social Studies', 'สังคมศึกษา', 'Grade 4', 'ป.4', 'completed', 100, 'A+', 'Aug 11, 2025', '11 ส.ค. 2568');

-- Seed: activities
insert into activities (category, title_en, title_th, description_en, description_th, sort_order) values
  ('agri-science', 'Soil mixing', 'การปรุงดินปลูก', 'Hands-on soil preparation and composition.', 'ฝึกปรุงดินและส่วนผสมด้วยตนเอง', 1),
  ('agri-science', 'Worm compost', 'ปุ๋ยหมักไส้เดือน', 'Vermicomposting and organic waste cycling.', 'ทำปุ๋ยหมักและรีไซเคิลขยะอินทรีย์', 2),
  ('agri-science', 'Lettuce seed propagation', 'เพาะเมล็ดผักกาด', 'From seed to harvest tracking.', 'ติดตามจากเมล็ดถึงเก็บเกี่ยว', 3),
  ('adventure-fitness', 'Hiking Doi Pha Hom Pok / Ang Khang', 'เดินป่าดอยผ้าห่มปก / อ่างขาง', 'Mountain trekking and nature exploration.', 'เดินป่าและสำรวจธรรมชาติ', 1),
  ('adventure-fitness', '5K Fun Run', 'วิ่งสนุก 5 กิโล', 'Endurance and community participation.', 'ความอดทนและการมีส่วนร่วมในชุมชน', 2),
  ('adventure-fitness', 'Fitness tracking', 'บันทึกการออกกำลังกาย', 'Regular activity and progress logging.', 'บันทึกกิจกรรมและความก้าวหน้าสม่ำเสมอ', 3),
  ('life-skills', 'Cooking prep', 'เตรียมอาหาร', 'Kitchen safety and meal preparation.', 'ความปลอดภัยในครัวและการเตรียมอาหาร', 1),
  ('life-skills', 'Housework', 'งานบ้าน', 'Daily chores and household responsibility.', 'งานบ้านและความรับผิดชอบในบ้าน', 2),
  ('life-skills', 'Personal responsibility', 'ความรับผิดชอบส่วนตัว', 'Self-care and accountability.', 'ดูแลตนเองและรับผิดชอบการกระทำ', 3);

-- Storage bucket (run via Supabase Dashboard > Storage > New bucket "portfolio" public)
