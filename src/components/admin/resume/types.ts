/**
 * Resume Admin Types
 * Centralized type definitions for resume management
 */

// =====================================================
// Database Types
// =====================================================

export interface ResumeWorkExperience {
  id: string;
  user_id: string;
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
  company_logo_url?: string;
  display_order: number;
  is_featured: boolean;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface ResumeEducation {
  id: string;
  user_id: string;
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
  school_logo_url?: string;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface ResumeCertification {
  id: string;
  user_id: string;
  name: string;
  issuing_organization: string;
  issue_date?: string;
  expiry_date?: string;
  does_not_expire: boolean;
  credential_id?: string;
  credential_url?: string;
  description?: string;
  logo_url?: string;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface ResumeStats {
  resume_title?: string;
  resume_description?: string;
  years_of_experience?: number;
  projects_completed?: number;
  technologies_mastered?: number;
  show_resume_stats: boolean;
}

// =====================================================
// Form Types
// =====================================================

export interface WorkExperienceFormData {
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
  company_logo_url?: string;
  display_order: number;
  is_featured: boolean;
  is_visible: boolean;
}

export interface EducationFormData {
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
  school_logo_url?: string;
  display_order: number;
  is_visible: boolean;
}

export interface CertificationFormData {
  name: string;
  issuing_organization: string;
  issue_date?: string;
  expiry_date?: string;
  does_not_expire: boolean;
  credential_id?: string;
  credential_url?: string;
  description?: string;
  logo_url?: string;
  display_order: number;
  is_visible: boolean;
}

// =====================================================
// Component Props
// =====================================================

export interface WorkExperienceFormProps {
  experience?: ResumeWorkExperience;
  onClose: () => void;
  onSave: (
    data: WorkExperienceFormData | Partial<ResumeWorkExperience>
  ) => Promise<{ data: any; error: Error | null }>;
}

export interface EducationFormProps {
  education?: ResumeEducation;
  onClose: () => void;
  onSave: (
    data: EducationFormData | Partial<ResumeEducation>
  ) => Promise<{ data: any; error: Error | null }>;
}

export interface CertificationFormProps {
  certification?: ResumeCertification;
  onClose: () => void;
  onSave: (
    data: CertificationFormData | Partial<ResumeCertification>
  ) => Promise<{ data: any; error: Error | null }>;
}

export interface ResumeManagementProps {
  activeTab: string;
}

// =====================================================
// Constants
// =====================================================

export const EMPLOYMENT_TYPES = [
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Contract", label: "Contract" },
  { value: "Freelance", label: "Freelance" },
  { value: "Internship", label: "Internship" },
  { value: "Temporary", label: "Temporary" },
] as const;
