/**
 * Skills Module Type Definitions
 *
 * This module contains all TypeScript interfaces and types for the Skills feature.
 * These types align with the Supabase database schema defined in:
 * - supabase/migrations/20241028000003_skills.sql
 * - supabase/migrations/20241028000004_skills_extended.sql
 */

// ============================================================================
// Icon and Color Types (Strict Type Safety)
// ============================================================================

/**
 * Available Lucide icon names for skills and categories
 */
export type IconName =
  | "Brain"
  | "Database"
  | "Smartphone"
  | "Code"
  | "Briefcase"
  | "Award"
  | "Star"
  | "Zap"
  | "Rocket"
  | "Target"
  | "Layers"
  | "Package"
  | "Terminal"
  | "Globe"
  | "Cpu";

/**
 * Available Tailwind color classes for skills
 */
export type ColorClass =
  | "text-secondary"
  | "text-accent"
  | "text-success"
  | "text-warning"
  | "text-neural";

/**
 * Learning goal status types
 */
export type LearningGoalStatus = "learning" | "exploring" | "researching";

// ============================================================================
// Database Entity Interfaces
// ============================================================================

/**
 * Skill Category
 * Represents a category for organizing skills (e.g., AI & ML, Frontend, Backend)
 */
export interface SkillCategory {
  id: string;
  name: string;
  label: string;
  icon: IconName;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Skill with Category Information
 * Extended skill interface that includes denormalized category data
 * from the skills_with_categories view
 */
export interface Skill {
  id: string;
  category_id: string;
  name: string;
  proficiency: number; // 0-100
  description: string;
  icon: IconName;
  color: ColorClass;
  display_order: number;
  is_featured: boolean;
  category_name: string;
  category_label: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Learning Goal
 * Represents a current learning objective or area of exploration
 */
export interface LearningGoal {
  id: string;
  title: string;
  status: LearningGoalStatus;
  color: ColorClass;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// Profile Skills Data
// ============================================================================

/**
 * Profile Skills Section Data
 * Header information for the Skills section from the profiles table
 */
export interface ProfileSkillsData {
  skills_title: string | null;
  skills_description: string | null;
}

// ============================================================================
// Composite Data Types
// ============================================================================

/**
 * Complete Skills Data
 * Aggregated data for the Skills section including all related entities
 */
export interface SkillsData {
  categories: SkillCategory[];
  skills: Skill[];
  learningGoals: LearningGoal[];
  profileData: ProfileSkillsData | null;
}

// ============================================================================
// Form Data Types (for Admin Components)
// ============================================================================

/**
 * Skill Form Data
 * Data structure for creating/editing skills (omits auto-generated fields)
 */
export interface SkillFormData {
  category_id: string;
  name: string;
  proficiency: number;
  description: string;
  icon: IconName;
  color: ColorClass;
  display_order: number;
  is_featured: boolean;
}

/**
 * Learning Goal Form Data
 * Data structure for creating/editing learning goals (omits auto-generated fields)
 */
export interface LearningGoalFormData {
  title: string;
  status: LearningGoalStatus;
  color: ColorClass;
  display_order: number;
  is_active: boolean;
}

/**
 * Skill Category Form Data
 * Data structure for creating/editing categories (omits auto-generated fields)
 */
export interface SkillCategoryFormData {
  name: string;
  label: string;
  icon: IconName;
  display_order: number;
}

// ============================================================================
// View-Specific Types
// ============================================================================

/**
 * Skill with Category (View Type)
 * Type alias for clarity when working with the skills_with_categories view
 */
export type SkillWithCategory = Skill;

/**
 * Grouped Skills
 * Skills organized by category for display purposes
 */
export type GroupedSkills = Record<string, Skill[]>;

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Skill Filter Options
 * Available filter options for the skills display
 */
export interface SkillFilterOptions {
  category: string; // "all" or category name
  featured: boolean;
  minProficiency: number;
}

/**
 * Skills Statistics
 * Computed statistics about skills
 */
export interface SkillsStats {
  totalSkills: number;
  featuredSkills: number;
  averageProficiency: number;
  categoriesCount: number;
  activeGoalsCount: number;
}
