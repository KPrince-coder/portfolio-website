/**
 * Frontend Resume Types
 * Type definitions for the public-facing resume section
 *
 * @module resume/types
 */

// ============================================================================
// Utility Types
// ============================================================================

/**
 * ISO date string in YYYY-MM-DD format
 * @example "2024-01-15"
 */
export type ISODateString = string;

/**
 * Employment type options
 */
export type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Freelance"
  | "Internship"
  | "Temporary";

/**
 * Sortable item interface
 */
export interface SortableItem {
  display_order: number;
}

// ============================================================================
// Core Data Interfaces
// ============================================================================

/**
 * Work experience entry for resume display
 * Represents a single position in the professional timeline
 */
export interface ResumeWorkExperience extends SortableItem {
  /** Unique identifier */
  id: string;
  /** Job title/position */
  title: string;
  /** Company/organization name */
  company: string;
  /** Physical location (city, state/country) */
  location?: string;
  /** Employment type */
  employment_type?: EmploymentType;
  /** Start date in ISO format (YYYY-MM-DD) */
  start_date: ISODateString;
  /** End date in ISO format (YYYY-MM-DD), null if current */
  end_date?: ISODateString;
  /** Whether this is the current position */
  is_current: boolean;
  /** Brief description of role and responsibilities */
  description?: string;
  /** List of key achievements and accomplishments */
  achievements?: string[];
  /** Company website URL */
  company_url?: string;
  /** Sort order for display (lower numbers first) */
  display_order: number;
}

/**
 * Education entry for resume display
 * Represents academic credentials and qualifications
 */
export interface ResumeEducation extends SortableItem {
  /** Unique identifier */
  id: string;
  /** Degree or certification name */
  degree: string;
  /** Major or area of study */
  field_of_study?: string;
  /** School/university name */
  school: string;
  /** Physical location (city, state/country) */
  location?: string;
  /** Start date in ISO format (YYYY-MM-DD) */
  start_date?: ISODateString;
  /** End date in ISO format (YYYY-MM-DD) */
  end_date?: ISODateString;
  /** Grade point average */
  gpa?: string;
  /** Final grade or honors */
  grade?: string;
  /** Additional details about the program */
  description?: string;
  /** Extracurricular activities and achievements */
  activities?: string[];
  /** School website URL */
  school_url?: string;
  /** Sort order for display (lower numbers first) */
  display_order: number;
}

/**
 * Professional certification entry
 * Represents industry certifications and credentials
 */
export interface ResumeCertification extends SortableItem {
  /** Unique identifier */
  id: string;
  /** Certification name */
  name: string;
  /** Organization that issued the certification */
  issuing_organization: string;
  /** Date certification was issued (YYYY-MM-DD) */
  issue_date?: ISODateString;
  /** Date certification expires (YYYY-MM-DD) */
  expiry_date?: ISODateString;
  /** Whether certification never expires */
  does_not_expire: boolean;
  /** Credential ID or license number */
  credential_id?: string;
  /** URL to verify credential */
  credential_url?: string;
  /** Additional details about the certification */
  description?: string;
  /** Sort order for display (lower numbers first) */
  display_order: number;
}

/**
 * Resume statistics and metrics
 * High-level career summary numbers
 */
export interface ResumeStats {
  /** Total years of professional experience */
  years_of_experience?: number;
  /** Number of completed projects */
  projects_completed?: number;
  /** Number of technologies/tools mastered */
  technologies_mastered?: number;
  /** Whether to display stats section */
  show_resume_stats: boolean;
}

/**
 * Complete resume data structure
 * Aggregates all resume sections
 */
export interface ResumeData {
  /** Work experience entries */
  experiences: ResumeWorkExperience[];
  /** Education entries */
  education: ResumeEducation[];
  /** Certification entries */
  certifications: ResumeCertification[];
  /** Career statistics */
  stats: ResumeStats;
  /** Resume section title */
  title?: string;
  /** Resume section description */
  description?: string;
  /** URL to downloadable resume PDF */
  resume_url?: string;
}

// ============================================================================
// Form Data Types
// ============================================================================

/**
 * Work experience form data (without generated fields)
 */
export type ResumeWorkExperienceFormData = Omit<ResumeWorkExperience, "id">;

/**
 * Education form data (without generated fields)
 */
export type ResumeEducationFormData = Omit<ResumeEducation, "id">;

/**
 * Certification form data (without generated fields)
 */
export type ResumeCertificationFormData = Omit<ResumeCertification, "id">;

// ============================================================================
// State Management Types
// ============================================================================

/**
 * Resume data loading state
 */
export interface ResumeLoadingState {
  experiences: boolean;
  education: boolean;
  certifications: boolean;
  stats: boolean;
}

/**
 * Resume data error state
 */
export interface ResumeErrorState {
  experiences: Error | null;
  education: Error | null;
  certifications: Error | null;
  stats: Error | null;
}

/**
 * Complete resume state for hooks
 */
export interface ResumeState {
  data: ResumeData;
  loading: ResumeLoadingState;
  error: ResumeErrorState;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Employment type options for dropdowns
 */
export const EMPLOYMENT_TYPES = [
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Contract", label: "Contract" },
  { value: "Freelance", label: "Freelance" },
  { value: "Internship", label: "Internship" },
  { value: "Temporary", label: "Temporary" },
] as const;

/**
 * Default resume stats
 */
export const DEFAULT_RESUME_STATS: ResumeStats = {
  years_of_experience: 0,
  projects_completed: 0,
  technologies_mastered: 0,
  show_resume_stats: false,
};

/**
 * Default loading state
 */
export const DEFAULT_LOADING_STATE: ResumeLoadingState = {
  experiences: true,
  education: true,
  certifications: true,
  stats: true,
};

/**
 * Default error state
 */
export const DEFAULT_ERROR_STATE: ResumeErrorState = {
  experiences: null,
  education: null,
  certifications: null,
  stats: null,
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Type guard to check if a date string is valid ISO format
 * @param date - Date string to validate
 * @returns True if valid ISO date (YYYY-MM-DD)
 */
export const isValidISODate = (date: string): boolean => {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
};

/**
 * Type guard to check if work experience is valid
 * @param exp - Partial work experience object
 * @returns True if all required fields are present
 */
export const isValidWorkExperience = (
  exp: Partial<ResumeWorkExperience>
): exp is ResumeWorkExperience => {
  return Boolean(
    exp.id &&
      exp.title &&
      exp.company &&
      exp.start_date &&
      typeof exp.display_order === "number" &&
      typeof exp.is_current === "boolean"
  );
};

/**
 * Type guard to check if education is valid
 * @param edu - Partial education object
 * @returns True if all required fields are present
 */
export const isValidEducation = (
  edu: Partial<ResumeEducation>
): edu is ResumeEducation => {
  return Boolean(
    edu.id && edu.degree && edu.school && typeof edu.display_order === "number"
  );
};

/**
 * Type guard to check if certification is valid
 * @param cert - Partial certification object
 * @returns True if all required fields are present
 */
export const isValidCertification = (
  cert: Partial<ResumeCertification>
): cert is ResumeCertification => {
  return Boolean(
    cert.id &&
      cert.name &&
      cert.issuing_organization &&
      typeof cert.display_order === "number" &&
      typeof cert.does_not_expire === "boolean"
  );
};

/**
 * Sort items by display order
 * @param items - Array of sortable items
 * @returns Sorted array (ascending by display_order)
 */
export const sortByDisplayOrder = <T extends SortableItem>(items: T[]): T[] => {
  return [...items].sort((a, b) => a.display_order - b.display_order);
};

/**
 * Calculate years of experience from work history
 * @param experiences - Array of work experiences
 * @returns Total years of experience (rounded to 1 decimal)
 */
export const calculateYearsOfExperience = (
  experiences: ResumeWorkExperience[]
): number => {
  const totalMonths = experiences.reduce((total, exp) => {
    const start = new Date(exp.start_date);
    const end = exp.end_date ? new Date(exp.end_date) : new Date();
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    return total + Math.max(0, months);
  }, 0);

  return Math.round((totalMonths / 12) * 10) / 10;
};

/**
 * Format date range for display
 * @param startDate - Start date (YYYY-MM-DD)
 * @param endDate - End date (YYYY-MM-DD) or null for current
 * @param isCurrent - Whether this is current position
 * @returns Formatted date range (e.g., "Jan 2020 - Present")
 */
export const formatDateRange = (
  startDate: string,
  endDate?: string,
  isCurrent?: boolean
): string => {
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const start = formatDate(startDate);
  const end = isCurrent ? "Present" : endDate ? formatDate(endDate) : "Present";

  return `${start} - ${end}`;
};
