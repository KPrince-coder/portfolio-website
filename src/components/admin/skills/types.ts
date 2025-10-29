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
