import { Database } from "@/integrations/supabase/types";

/**
 * Project from database
 */
export type Project = Database["public"]["Tables"]["projects"]["Row"];

/**
 * Project category from database
 */
export type ProjectCategory =
  Database["public"]["Tables"]["project_categories"]["Row"];

/**
 * Technology from database
 */
export type Technology = Database["public"]["Tables"]["technologies"]["Row"];

/**
 * Project with category information (from view)
 */
export interface ProjectWithCategory extends Project {
  category_name: string;
  category_label: string;
  category_icon: string;
  category_color: string;
}

/**
 * Projects data structure
 */
export interface ProjectsData {
  projects: ProjectWithCategory[];
  categories: ProjectCategory[];
  technologies: Technology[];
  profileData: {
    projects_title: string;
    projects_description: string;
  } | null;
}

/**
 * ProjectsHeader component props
 */
export interface ProjectsHeaderProps {
  title: string;
  titleHighlight?: string;
  description: string;
}

/**
 * CategoryFilter component props
 */
export interface CategoryFilterProps {
  categories: ProjectCategory[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

/**
 * ProjectsGrid component props
 */
export interface ProjectsGridProps {
  projects: ProjectWithCategory[];
}

/**
 * ProjectCard component props
 */
export interface ProjectCardProps {
  project: ProjectWithCategory;
}
