/**
 * Skills Module Type Definitions
 *
 * This module contains all TypeScript interfaces and types for the Skills feature.
 * These types align with the Supabase database schema defined in:
 * - supabase/migrations/20241028000003_skills.sql
 * - supabase/migrations/20241028000004_skills_extended.sql
 */

// ============================================================================
// Icon and Color Types
// ============================================================================

/**
 * Icon Name Type
 * Supports all 300+ Lucide icons dynamically
 * The icon name is stored as a string in the database and resolved at runtime
 * Falls back to "Code" icon if the specified icon is not found
 *
 * @see src/lib/icons.ts for the complete list of available icons
 * @see src/components/skills/utils.ts for the getIcon() helper function
 */
export type IconName = string;

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
// Learning Goal Status Configuration
// ============================================================================

/**
 * Status labels for learning goals
 * Immutable configuration for display text
 */
export const STATUS_LABELS = {
  learning: "Currently learning",
  exploring: "Exploring",
  researching: "Researching",
} as const satisfies Record<LearningGoalStatus, string>;

/**
 * Status colors for learning goals
 * Maps status to Tailwind color classes
 */
export const STATUS_COLORS = {
  learning: "text-secondary",
  exploring: "text-accent",
  researching: "text-success",
} as const satisfies Record<LearningGoalStatus, ColorClass>;

/**
 * Status icons for learning goals
 * Maps status to Lucide icon names
 */
export const STATUS_ICONS = {
  learning: "BookOpen",
  exploring: "Compass",
  researching: "Search",
} as const satisfies Record<LearningGoalStatus, string>;

/**
 * Complete status configuration
 * Single source of truth for all status-related display properties
 *
 * @example
 * const config = STATUS_CONFIG[goal.status];
 * <Badge className={config.color}>{config.label}</Badge>
 */
export const STATUS_CONFIG = {
  learning: {
    label: STATUS_LABELS.learning,
    color: STATUS_COLORS.learning,
    icon: STATUS_ICONS.learning,
  },
  exploring: {
    label: STATUS_LABELS.exploring,
    color: STATUS_COLORS.exploring,
    icon: STATUS_ICONS.exploring,
  },
  researching: {
    label: STATUS_LABELS.researching,
    color: STATUS_COLORS.researching,
    icon: STATUS_ICONS.researching,
  },
} as const;

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

// ============================================================================
// Component Props Interfaces
// ============================================================================

/**
 * SkillsHeader Component Props
 */
export interface SkillsHeaderProps {
  title: string;
  description: string;
}

/**
 * CategoryFilter Component Props
 */
export interface CategoryFilterProps {
  categories: SkillCategory[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

/**
 * SkillCard Component Props
 */
export interface SkillCardProps {
  skill: Skill;
  index: number;
}

/**
 * SkillsGrid Component Props
 */
export interface SkillsGridProps {
  skills: Skill[];
}

/**
 * LearningGoalsCard Component Props
 */
export interface LearningGoalsCardProps {
  goals: LearningGoal[];
}
