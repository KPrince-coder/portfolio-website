import { Database } from "@/integrations/supabase/types";

// ============================================================================
// Database Types
// ============================================================================

/**
 * Profile data from the database
 */
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

/**
 * Profile update data
 */
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

// ============================================================================
// Data Entity Interfaces
// ============================================================================

/**
 * Experience Entry
 * Represents a professional experience in the timeline
 */
export interface Experience {
  year: string;
  title: string;
  company: string;
  description: string;
  icon: string;
  color: string;
}

/**
 * Impact Metric
 * Represents an achievement or impact metric
 */
export interface ImpactMetric {
  label: string;
  value: string;
}

// ============================================================================
// Component Props Interfaces
// ============================================================================

/**
 * Base Section Props
 * Common props for all profile section components
 */
export interface BaseSectionProps {
  formData: Partial<ProfileUpdate>;
  onInputChange: (field: keyof ProfileUpdate, value: any) => void;
}

/**
 * ProfileManagement Component Props
 */
export interface ProfileManagementProps {
  activeSubTab?: string;
}

/**
 * PersonalInfoSection Component Props
 */
export interface PersonalInfoSectionProps extends BaseSectionProps {}

/**
 * HeroSection Component Props
 */
export interface HeroSectionProps extends BaseSectionProps {}

/**
 * AboutSection Component Props
 */
export interface AboutSectionProps extends BaseSectionProps {}

/**
 * ExperienceSection Component Props
 */
export interface ExperienceSectionProps extends BaseSectionProps {}

/**
 * ImpactMetricsSection Component Props
 */
export interface ImpactMetricsSectionProps extends BaseSectionProps {}

/**
 * PhilosophySection Component Props
 */
export interface PhilosophySectionProps extends BaseSectionProps {}

/**
 * SocialLinksSection Component Props
 */
export interface SocialLinksSectionProps extends BaseSectionProps {}

/**
 * ResumeSection Component Props
 */
export interface ResumeSectionProps extends BaseSectionProps {}
