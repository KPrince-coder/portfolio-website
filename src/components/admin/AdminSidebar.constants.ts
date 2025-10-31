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
} from "lucide-react";
import { AdminTab } from "./types";

// ============================================================================
// Navigation Configuration Constants
// Moved outside component to prevent recreation on every render
// ============================================================================

export const MAIN_TABS: readonly AdminTab[] = [
  { id: "overview", label: "Overview", icon: Shield },
  { id: "messages", label: "Messages", icon: Mail },
  { id: "posts", label: "Blog Posts", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
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

// ============================================================================
// Animation and Layout Constants
// ============================================================================

export const SIDEBAR_COLLAPSED_WIDTH = 64; // px
export const SIDEBAR_EXPANDED_WIDTH = 256; // px
export const SIDEBAR_ANIMATION_DURATION = 300; // ms
export const MOBILE_SIDEBAR_CLOSE_DELAY = 100; // ms
