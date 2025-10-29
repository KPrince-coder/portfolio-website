import { Database } from "@/integrations/supabase/types";

// ============================================================================
// Database Entity Interfaces
// ============================================================================

/**
 * Project category data from the database
 */
export type ProjectCategory =
  Database["public"]["Tables"]["project_categories"]["Row"];

/**
 * Project data from the database
 */
export type Project = Database["public"]["Tables"]["projects"]["Row"];

/**
 * Technology data from the database
 */
export type Technology = Database["public"]["Tables"]["technologies"]["Row"];

/**
 * Project-Technology relationship
 */
export type ProjectTechnology =
  Database["public"]["Tables"]["project_technologies"]["Row"];

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
 * Project with technology count
 */
export interface ProjectWithTechCount extends Project {
  technology_count: number;
}

// ============================================================================
// Form Data Types
// ============================================================================

/**
 * Project category form data
 */
export interface ProjectCategoryFormData {
  name: string;
  label: string;
  icon: string;
  color: string;
  description?: string;
  display_order: number;
  is_active: boolean;
}

/**
 * Project form data
 */
export interface ProjectFormData {
  category_id: string;
  title: string;
  slug: string;
  description: string;
  long_description?: string;
  image_url?: string;
  demo_url?: string;
  github_url?: string;
  technologies: string[];
  tags?: string[];
  status: "completed" | "in-progress" | "planned" | "archived";
  stars?: number;
  forks?: number;
  views?: number;
  is_featured: boolean;
  display_order: number;
  start_date?: string;
  end_date?: string;
}

/**
 * Technology form data
 */
export interface TechnologyFormData {
  name: string;
  label: string;
  icon: string;
  color: string;
  category?: string;
  display_order: number;
  is_active: boolean;
}

/**
 * Projects header form data (for profiles table)
 */
export interface ProjectsHeaderFormData {
  projects_title: string;
  projects_description: string;
}

// ============================================================================
// Component Props Interfaces
// ============================================================================

/**
 * ProjectsManagement Component Props
 */
export interface ProjectsManagementProps {
  activeTab: string;
}

/**
 * ProjectsManagementRouter Component Props
 */
export interface ProjectsManagementRouterProps {
  activeSubTab: string;
}

/**
 * ProjectsHeaderSection Component Props
 */
export interface ProjectsHeaderSectionProps {
  // No specific props needed - uses internal state
}

/**
 * ProjectsCategoriesSection Component Props
 */
export interface ProjectsCategoriesSectionProps {
  // No specific props needed - uses internal state
}

/**
 * ProjectsListSection Component Props
 */
export interface ProjectsListSectionProps {
  // No specific props needed - uses internal state
}

/**
 * TechnologiesSection Component Props
 */
export interface TechnologiesSectionProps {
  // No specific props needed - uses internal state
}

/**
 * ProjectsList Component Props
 */
export interface ProjectsListProps {
  projects: ProjectWithCategory[];
  loading: boolean;
  onEdit: (project: ProjectWithCategory) => void;
  onDelete: (id: string) => Promise<{ error: Error | null }>;
  onToggleFeatured: (
    id: string,
    featured: boolean
  ) => Promise<{ error: Error | null }>;
}

/**
 * ProjectForm Component Props
 */
export interface ProjectFormProps {
  project: Project | null;
  onClose: () => void;
  onSave:
    | ((
        id: string,
        data: Partial<Project>
      ) => Promise<{ data: any; error: Error | null }>)
    | ((
        data: Omit<Project, "id" | "created_at" | "updated_at">
      ) => Promise<{ data: any; error: Error | null }>);
}

/**
 * ProjectCategoryForm Component Props
 */
export interface ProjectCategoryFormProps {
  category: ProjectCategory | null;
  onClose: () => void;
  onSave:
    | ((
        id: string,
        data: Partial<ProjectCategory>
      ) => Promise<{ data: any; error: Error | null }>)
    | ((
        data: Omit<ProjectCategory, "id" | "created_at" | "updated_at">
      ) => Promise<{ data: any; error: Error | null }>);
}

/**
 * TechnologyForm Component Props
 */
export interface TechnologyFormProps {
  technology: Technology | null;
  onClose: () => void;
  onSave:
    | ((
        id: string,
        data: Partial<Technology>
      ) => Promise<{ data: any; error: Error | null }>)
    | ((
        data: Omit<Technology, "id" | "created_at" | "updated_at">
      ) => Promise<{ data: any; error: Error | null }>);
}

// ============================================================================
// Filter and Search Types
// ============================================================================

/**
 * Project filter options
 */
export interface ProjectFilters {
  category?: string;
  status?: "completed" | "in-progress" | "planned" | "archived" | "all";
  featured?: boolean;
  search?: string;
}

/**
 * Technology filter options
 */
export interface TechnologyFilters {
  category?: string;
  active?: boolean;
  search?: string;
}

// ============================================================================
// Hook Return Types
// ============================================================================

/**
 * useProjects hook return type
 */
export interface UseProjectsReturn {
  projects: ProjectWithCategory[];
  loading: boolean;
  error: Error | null;
  createProject: (
    data: ProjectFormData
  ) => Promise<{ data: any; error: Error | null }>;
  updateProject: (
    id: string,
    data: Partial<ProjectFormData>
  ) => Promise<{ data: any; error: Error | null }>;
  deleteProject: (id: string) => Promise<{ error: Error | null }>;
  toggleFeatured: (
    id: string,
    featured: boolean
  ) => Promise<{ error: Error | null }>;
  uploadImage: (
    file: File
  ) => Promise<{ url: string | null; error: Error | null }>;
  refetch: () => Promise<void>;
}

/**
 * useProjectCategories hook return type
 */
export interface UseProjectCategoriesReturn {
  categories: ProjectCategory[];
  loading: boolean;
  error: Error | null;
  createCategory: (
    data: ProjectCategoryFormData
  ) => Promise<{ data: any; error: Error | null }>;
  updateCategory: (
    id: string,
    data: Partial<ProjectCategoryFormData>
  ) => Promise<{ data: any; error: Error | null }>;
  deleteCategory: (id: string) => Promise<{ error: Error | null }>;
  reorderCategories: (
    categories: ProjectCategory[]
  ) => Promise<{ error: Error | null }>;
  refetch: () => Promise<void>;
}

/**
 * useTechnologies hook return type
 */
export interface UseTechnologiesReturn {
  technologies: Technology[];
  loading: boolean;
  error: Error | null;
  createTechnology: (
    data: TechnologyFormData
  ) => Promise<{ data: any; error: Error | null }>;
  updateTechnology: (
    id: string,
    data: Partial<TechnologyFormData>
  ) => Promise<{ data: any; error: Error | null }>;
  deleteTechnology: (id: string) => Promise<{ error: Error | null }>;
  refetch: () => Promise<void>;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Project status options
 */
export const PROJECT_STATUSES = [
  { value: "completed", label: "Completed", color: "text-success" },
  { value: "in-progress", label: "In Progress", color: "text-warning" },
  { value: "planned", label: "Planned", color: "text-secondary" },
  { value: "archived", label: "Archived", color: "text-muted-foreground" },
] as const;

/**
 * Technology categories
 */
export const TECHNOLOGY_CATEGORIES = [
  { value: "frontend", label: "Frontend", color: "text-secondary" },
  { value: "backend", label: "Backend", color: "text-accent" },
  { value: "database", label: "Database", color: "text-success" },
  { value: "devops", label: "DevOps", color: "text-warning" },
  { value: "ai-ml", label: "AI/ML", color: "text-neural" },
] as const;

/**
 * Project category colors
 */
export const PROJECT_CATEGORY_COLORS = [
  { value: "text-secondary", label: "Blue", preview: "bg-secondary" },
  { value: "text-accent", label: "Pink", preview: "bg-accent" },
  { value: "text-neural", label: "Cyan", preview: "bg-neural" },
  { value: "text-success", label: "Green", preview: "bg-success" },
  { value: "text-warning", label: "Orange", preview: "bg-warning" },
  { value: "text-primary", label: "Default", preview: "bg-primary" },
] as const;
