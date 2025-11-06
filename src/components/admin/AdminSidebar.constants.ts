import {
  Shield,
  Mail,
  Briefcase,
  FileText,
  Settings,
  UserCircle,
  Sparkles,
  FileUser,
  Briefcase as BriefcaseIcon,
  TrendingUp,
  Award,
  Link as LinkIcon,
  Upload,
  FolderKanban,
  Code,
  GraduationCap,
  List,
  Plus,
  Folder,
  Tag,
} from "lucide-react";
import { AdminTab } from "./types";

// ============================================================================
// Navigation Configuration Constants
// Moved outside component to prevent recreation on every render
// ============================================================================

export const MAIN_TABS: readonly AdminTab[] = [
  { id: "overview", label: "Overview", icon: Shield },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

export const MESSAGES_SUB_TABS: readonly AdminTab[] = [
  { id: "messages", label: "All Messages", icon: Mail },
  { id: "messages-stats", label: "Statistics", icon: TrendingUp },
  { id: "messages-templates", label: "Templates", icon: FileText },
] as const;

export const PROFILE_SUB_TABS: readonly AdminTab[] = [
  { id: "profile-personal", label: "Personal Info", icon: UserCircle },
  { id: "profile-hero", label: "Hero Section", icon: Sparkles },
  { id: "profile-about", label: "About Section", icon: FileUser },
  { id: "profile-experience", label: "Experience", icon: BriefcaseIcon },
  { id: "profile-metrics", label: "Impact Metrics", icon: TrendingUp },
  { id: "profile-philosophy", label: "Philosophy", icon: Award },
  { id: "profile-social", label: "Social Links", icon: LinkIcon },
  { id: "profile-resume", label: "Resume", icon: Upload },
] as const;

export const SKILLS_SUB_TABS: readonly AdminTab[] = [
  { id: "skills-header", label: "Skills Header", icon: FileText },
  { id: "skills-categories", label: "Categories", icon: Briefcase },
  { id: "skills-list", label: "Skills", icon: Award },
  { id: "skills-goals", label: "Learning Goals", icon: TrendingUp },
] as const;

export const PROJECTS_SUB_TABS: readonly AdminTab[] = [
  { id: "projects-header", label: "Projects Header", icon: FileText },
  { id: "projects-categories", label: "Categories", icon: FolderKanban },
  { id: "projects-list", label: "Projects", icon: Briefcase },
  { id: "projects-technologies", label: "Technologies", icon: Code },
] as const;

export const RESUME_SUB_TABS: readonly AdminTab[] = [
  { id: "resume-header", label: "Resume Header", icon: FileText },
  { id: "resume-experiences", label: "Work Experiences", icon: BriefcaseIcon },
  { id: "resume-education", label: "Education", icon: GraduationCap },
  { id: "resume-certifications", label: "Certifications", icon: Award },
] as const;

export const POSTS_SUB_TABS: readonly AdminTab[] = [
  { id: "posts-list", label: "All Posts", icon: List },
  { id: "posts-new", label: "Create New", icon: Plus },
  { id: "posts-categories", label: "Categories", icon: Folder },
  { id: "posts-tags", label: "Tags", icon: Tag },
] as const;

// ============================================================================
// Animation and Layout Constants
// ============================================================================

// Using rem units for better accessibility (1rem = 16px default)
export const SIDEBAR_COLLAPSED_WIDTH = 5; // rem (80px at default font size)
export const SIDEBAR_EXPANDED_WIDTH = 18; // rem (288px at default font size)
export const SIDEBAR_ANIMATION_DURATION = 300; // ms
export const MOBILE_SIDEBAR_CLOSE_DELAY = 100; // ms
