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
// Generic Result Types
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
// Enum Types
// ============================================================================

/**
 * Project status values
 */
export type ProjectStatus =
  | "completed"
  | "in-progress"
  | "planned"
  | "archived";

/**
 * Technology category values
 */
export type TechnologyCategory =
  | "frontend"
  | "backend"
  | "database"
  | "devops"
  | "ai-ml";

/**
 * Valid Lucide icon names for projects
 */
export type ProjectIconName =
  | "Globe"
  | "Smartphone"
  | "Brain"
  | "Database"
  | "Cloud"
  | "Package"
  | "Folder"
  | "Code"
  | "Briefcase"
  | "Zap"
  | "Rocket"
  | "Target";

/**
 * Valid Tailwind color classes for projects
 */
export type ProjectColorClass =
  | "text-secondary"
  | "text-accent"
  | "text-neural"
  | "text-success"
  | "text-warning"
  | "text-primary";

// ============================================================================
// Form Data Types
// ============================================================================

/**
 * Project category form data
 */
export interface ProjectCategoryFormData {
  name: string;
  label: string;
  icon: ProjectIconName;
  color: ProjectColorClass;
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
  status: ProjectStatus;
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
  icon: ProjectIconName;
  color: ProjectColorClass;
  category?: TechnologyCategory;
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
// Validation Types
// ============================================================================

/**
 * Validation result for form fields
 */
export type ValidationResult =
  | { valid: true }
  | { valid: false; error: string };

/**
 * Form validation state
 */
export interface FormValidation {
  [field: string]: ValidationResult;
}

/**
 * Project form validation errors
 */
export interface ProjectFormErrors {
  title?: string;
  slug?: string;
  category_id?: string;
  description?: string;
  demo_url?: string;
  github_url?: string;
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
  onDelete: (id: string) => Promise<DeleteResult>;
  onToggleFeatured: (id: string, featured: boolean) => Promise<DeleteResult>;
}

/**
 * ProjectForm Component Props - Create Mode
 */
export type ProjectFormPropsCreate = {
  mode: "create";
  project: null;
  onClose: () => void;
  onSave: (
    data: Omit<Project, "id" | "created_at" | "updated_at">
  ) => Promise<Result<Project>>;
};

/**
 * ProjectForm Component Props - Edit Mode
 */
export type ProjectFormPropsEdit = {
  mode: "edit";
  project: Project;
  onClose: () => void;
  onSave: (id: string, data: Partial<Project>) => Promise<Result<Project>>;
};

/**
 * ProjectForm Component Props
 */
export type ProjectFormProps = ProjectFormPropsCreate | ProjectFormPropsEdit;

/**
 * ProjectCategoryForm Component Props - Create Mode
 */
export type ProjectCategoryFormPropsCreate = {
  mode: "create";
  category: null;
  onClose: () => void;
  onSave: (
    data: Omit<ProjectCategory, "id" | "created_at" | "updated_at">
  ) => Promise<Result<ProjectCategory>>;
};

/**
 * ProjectCategoryForm Component Props - Edit Mode
 */
export type ProjectCategoryFormPropsEdit = {
  mode: "edit";
  category: ProjectCategory;
  onClose: () => void;
  onSave: (
    id: string,
    data: Partial<ProjectCategory>
  ) => Promise<Result<ProjectCategory>>;
};

/**
 * ProjectCategoryForm Component Props
 */
export type ProjectCategoryFormProps =
  | ProjectCategoryFormPropsCreate
  | ProjectCategoryFormPropsEdit;

/**
 * TechnologyForm Component Props - Create Mode
 */
export type TechnologyFormPropsCreate = {
  mode: "create";
  technology: null;
  onClose: () => void;
  onSave: (
    data: Omit<Technology, "id" | "created_at" | "updated_at">
  ) => Promise<Result<Technology>>;
};

/**
 * TechnologyForm Component Props - Edit Mode
 */
export type TechnologyFormPropsEdit = {
  mode: "edit";
  technology: Technology;
  onClose: () => void;
  onSave: (
    id: string,
    data: Partial<Technology>
  ) => Promise<Result<Technology>>;
};

/**
 * TechnologyForm Component Props
 */
export type TechnologyFormProps =
  | TechnologyFormPropsCreate
  | TechnologyFormPropsEdit;

// ============================================================================
// Filter and Search Types
// ============================================================================

/**
 * Project filter options
 */
export interface ProjectFilters {
  category?: string;
  status?: ProjectStatus | "all";
  featured?: boolean;
  search?: string;
}

/**
 * Technology filter options
 */
export interface TechnologyFilters {
  category?: TechnologyCategory;
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
  createProject: (data: ProjectFormData) => Promise<Result<Project>>;
  updateProject: (
    id: string,
    data: Partial<ProjectFormData>
  ) => Promise<Result<Project>>;
  deleteProject: (id: string) => Promise<DeleteResult>;
  toggleFeatured: (id: string, featured: boolean) => Promise<DeleteResult>;
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
  ) => Promise<Result<ProjectCategory>>;
  updateCategory: (
    id: string,
    data: Partial<ProjectCategoryFormData>
  ) => Promise<Result<ProjectCategory>>;
  deleteCategory: (id: string) => Promise<DeleteResult>;
  reorderCategories: (categories: ProjectCategory[]) => Promise<DeleteResult>;
  refetch: () => Promise<void>;
}

/**
 * useTechnologies hook return type
 */
export interface UseTechnologiesReturn {
  technologies: Technology[];
  loading: boolean;
  error: Error | null;
  createTechnology: (data: TechnologyFormData) => Promise<Result<Technology>>;
  updateTechnology: (
    id: string,
    data: Partial<TechnologyFormData>
  ) => Promise<Result<Technology>>;
  deleteTechnology: (id: string) => Promise<DeleteResult>;
  refetch: () => Promise<void>;
}

// ============================================================================
// Event Handler Types
// ============================================================================

/**
 * Event handler types for better type safety
 */
export type ProjectEventHandler = (project: Project) => void;
export type ProjectAsyncEventHandler = (project: Project) => Promise<void>;
export type ProjectDeleteHandler = (id: string) => Promise<DeleteResult>;
export type ProjectToggleFeaturedHandler = (
  id: string,
  featured: boolean
) => Promise<DeleteResult>;

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Readonly project for display components
 */
export type ReadonlyProject = Readonly<Project>;

/**
 * Readonly project with category
 */
export type ReadonlyProjectWithCategory = Readonly<ProjectWithCategory>;

/**
 * Loading state for async operations
 */
export type LoadingState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success" }
  | { status: "error"; error: Error };

/**
 * Hook state with loading
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Project status options
 */
export const PROJECT_STATUSES: ReadonlyArray<{
  value: ProjectStatus;
  label: string;
  color: string;
}> = [
  { value: "completed", label: "Completed", color: "text-success" },
  { value: "in-progress", label: "In Progress", color: "text-warning" },
  { value: "planned", label: "Planned", color: "text-secondary" },
  { value: "archived", label: "Archived", color: "text-muted-foreground" },
] as const;

/**
 * Technology categories
 */
export const TECHNOLOGY_CATEGORIES: ReadonlyArray<{
  value: TechnologyCategory;
  label: string;
  color: ProjectColorClass;
}> = [
  { value: "frontend", label: "Frontend", color: "text-secondary" },
  { value: "backend", label: "Backend", color: "text-accent" },
  { value: "database", label: "Database", color: "text-success" },
  { value: "devops", label: "DevOps", color: "text-warning" },
  { value: "ai-ml", label: "AI/ML", color: "text-neural" },
] as const;

/**
 * Project category colors
 */
export const PROJECT_CATEGORY_COLORS: ReadonlyArray<{
  value: ProjectColorClass;
  label: string;
  preview: string;
}> = [
  { value: "text-secondary", label: "Blue", preview: "bg-secondary" },
  { value: "text-accent", label: "Pink", preview: "bg-accent" },
  { value: "text-neural", label: "Cyan", preview: "bg-neural" },
  { value: "text-success", label: "Green", preview: "bg-success" },
  { value: "text-warning", label: "Orange", preview: "bg-warning" },
  { value: "text-primary", label: "Default", preview: "bg-primary" },
] as const;

/**
 * Available project icons
 */
export const PROJECT_ICONS: ReadonlyArray<ProjectIconName> = [
  "Globe",
  "Smartphone",
  "Brain",
  "Database",
  "Cloud",
  "Package",
  "Folder",
  "Code",
  "Briefcase",
  "Zap",
  "Rocket",
  "Target",
] as const;
