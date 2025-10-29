/**
 * Frontend Resume Types
 * Type definitions for the public-facing resume section
 */

export interface ResumeWorkExperience {
  id: string;
  title: string;
  company: string;
  location?: string;
  employment_type?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
  achievements?: string[];
  company_url?: string;
  display_order: number;
}

export interface ResumeEducation {
  id: string;
  degree: string;
  field_of_study?: string;
  school: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  gpa?: string;
  grade?: string;
  description?: string;
  activities?: string[];
  school_url?: string;
  display_order: number;
}

export interface ResumeCertification {
  id: string;
  name: string;
  issuing_organization: string;
  issue_date?: string;
  expiry_date?: string;
  does_not_expire: boolean;
  credential_id?: string;
  credential_url?: string;
  description?: string;
  display_order: number;
}

export interface ResumeStats {
  years_of_experience?: number;
  projects_completed?: number;
  technologies_mastered?: number;
  show_resume_stats: boolean;
}

export interface ResumeData {
  experiences: ResumeWorkExperience[];
  education: ResumeEducation[];
  certifications: ResumeCertification[];
  stats: ResumeStats;
  title?: string;
  description?: string;
  resume_url?: string;
}
