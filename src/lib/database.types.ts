export interface Database {
  public: {
    Tables: {
      portfolio_settings: {
        Row: PortfolioSettings;
        Insert: Partial<PortfolioSettings>;
        Update: Partial<PortfolioSettings>;
      };
      courses: {
        Row: CourseRow;
        Insert: Partial<CourseRow> & Pick<CourseRow, "subject_en" | "status">;
        Update: Partial<CourseRow>;
      };
      activities: {
        Row: ActivityRow;
        Insert: Partial<ActivityRow> & Pick<ActivityRow, "category" | "title_en">;
        Update: Partial<ActivityRow>;
      };
      report_sections: {
        Row: ReportSectionRow;
        Insert: Partial<ReportSectionRow> & Pick<ReportSectionRow, "section_name">;
        Update: Partial<ReportSectionRow>;
      };
    };
  };
}

export interface ReportSectionRow {
  id: number;
  section_name: string;
  student_slug: string | null;
  content_en: string | null;
  content_th: string | null;
}

export interface PortfolioSettings {
  student_slug: string | null;
  gpa: number;
  profile_photo_url: string | null;
  presentation_video_url: string | null;
  annual_report_summary_en: string | null;
  annual_report_summary_th: string | null;
  future_plans_en: string | null;
  future_plans_th: string | null;
  parent_signature_en: string | null;
  parent_signature_th: string | null;
  updated_at: string;
}

export interface CourseRow {
  id: string | number;
  student_slug: string | null;
  subject_en: string;
  subject_th: string;
  grade_en: string;
  grade_th: string;
  status: "active" | "completed";
  progress: number;
  letter_grade: string;
  completed_date_en: string | null;
  completed_date_th: string | null;
  certificate_url: string | null;
  images: string[] | null;
}

export interface ActivityRow {
  id: string | number;
  student_slug: string | null;
  category: "agri-science" | "adventure-fitness" | "life-skills";
  title_en: string;
  title_th: string;
  description_en: string;
  description_th: string;
  images: string[] | null;
  video_url: string | null;
  sort_order: number;
}

