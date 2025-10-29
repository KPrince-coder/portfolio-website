export interface SkillCategory {
  id: string;
  name: string;
  label: string;
  icon: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  category_id: string;
  name: string;
  proficiency: number;
  description: string;
  icon: string;
  color: string;
  display_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface SkillWithCategory extends Skill {
  category_name: string;
  category_label: string;
  category_icon: string;
}

export interface LearningGoal {
  id: string;
  title: string;
  status: "learning" | "exploring" | "researching";
  color: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SkillFormData {
  category_id: string;
  name: string;
  proficiency: number;
  description: string;
  icon: string;
  color: string;
  display_order: number;
  is_featured: boolean;
}

export interface LearningGoalFormData {
  title: string;
  status: "learning" | "exploring" | "researching";
  color: string;
  display_order: number;
  is_active: boolean;
}

// ============================================================================
// Result Types
// ============================================================================

/**
 * Generic result type for database operations
 * Provides type-safe error handling with discriminated unions
 */
export type Result<T> = { data: T; error: null } | { data: null; error: Error };

/**
 * Result type for delete operations
 */
export type DeleteResult = { error: Error | null };

// ============================================================================
// Component Props Interfaces
// ============================================================================

/**
 * SkillsManagementRouter Component Props
 */
export interface SkillsManagementRouterProps {
  activeSubTab: string;
}

/**
 * SkillsList Component Props
 */
export interface SkillsListProps {
  skills: SkillWithCategory[];
  loading: boolean;
  onEdit: (skill: SkillWithCategory) => void;
  onDelete: (id: string) => Promise<DeleteResult>;
}

/**
 * SkillForm Component Props
 * Uses discriminated union for type-safe create/update operations
 */
export type SkillFormProps =
  | {
      mode: "create";
      skill: null;
      onClose: () => void;
      onSave: (
        data: Omit<Skill, "id" | "created_at" | "updated_at">
      ) => Promise<Result<Skill>>;
    }
  | {
      mode: "edit";
      skill: Skill;
      onClose: () => void;
      onSave: (id: string, data: Partial<Skill>) => Promise<Result<Skill>>;
    };

/**
 * LearningGoalsList Component Props
 */
export interface LearningGoalsListProps {
  goals: LearningGoal[];
  loading: boolean;
  onEdit: (goal: LearningGoal) => void;
  onDelete: (id: string) => Promise<DeleteResult>;
}

/**
 * LearningGoalForm Component Props
 * Uses discriminated union for type-safe create/update operations
 */
export type LearningGoalFormProps =
  | {
      mode: "create";
      goal: null;
      onClose: () => void;
      onSave: (
        data: Omit<LearningGoal, "id" | "created_at" | "updated_at">
      ) => Promise<Result<LearningGoal>>;
    }
  | {
      mode: "edit";
      goal: LearningGoal;
      onClose: () => void;
      onSave: (
        id: string,
        data: Partial<LearningGoal>
      ) => Promise<Result<LearningGoal>>;
    };
