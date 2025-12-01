import {
  Shield,
  Mail,
  Briefcase,
  FileText,
  Settings,
  Palette,
  UserCircle,
  Sparkles,
  FileUser,
  TrendingUp,
  Award,
  Link as LinkIcon,
  Upload,
  Code,
  GraduationCap,
  List,
  Folder,
  Tag,
  Image,
  Layout,
  PenSquare,
  ScrollText,
  Layers,
  Target,
  User,
  Zap,
  BookOpen,
  Droplets,
  Star,
  Search,
  BarChart3,
  FolderKanban,
} from "lucide-react";
import { AdminTab } from "./types";

// ============================================================================
// Navigation Configuration Constants
// Moved outside component to prevent recreation on every render
// ============================================================================

export const MAIN_TABS: readonly AdminTab[] = [
  { id: "overview", label: "Overview", icon: Shield },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "footer", label: "Footer", icon: Layout },
  { id: "og-image", label: "OG Image", icon: Image },
] as const;

// Main expandable section tabs
export const SECTION_TABS: readonly AdminTab[] = [
  { id: "brand", label: "Brand", icon: Palette },
  { id: "messages", label: "Messages", icon: Mail },
  { id: "profile", label: "Profile", icon: User },
  { id: "skills", label: "Skills", icon: Zap },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "posts", label: "Blog Posts", icon: BookOpen },
] as const;

export const MESSAGES_SUB_TABS: readonly AdminTab[] = [
  { id: "messages", label: "All Messages", icon: Mail },
  { id: "messages-stats", label: "Statistics", icon: TrendingUp },
  { id: "messages-contact", label: "Contact Settings", icon: Settings },
] as const;

export const BRAND_SUB_TABS: readonly AdminTab[] = [
  { id: "brand-logo", label: "Logo & Branding", icon: Palette },
  { id: "brand-colors", label: "Colors", icon: Droplets },
  { id: "brand-seo", label: "SEO", icon: Search },
] as const;

export const PROFILE_SUB_TABS: readonly AdminTab[] = [
  { id: "profile-personal", label: "Personal Info", icon: UserCircle },
  { id: "profile-hero", label: "Hero Section", icon: Star },
  { id: "profile-about", label: "About Section", icon: FileUser },
  { id: "profile-experience", label: "Experience", icon: Briefcase },
  { id: "profile-metrics", label: "Impact Metrics", icon: BarChart3 },
  { id: "profile-philosophy", label: "Philosophy", icon: Sparkles },
  { id: "profile-social", label: "Social Links", icon: LinkIcon },
  { id: "profile-resume", label: "Resume", icon: Upload },
] as const;

export const SKILLS_SUB_TABS: readonly AdminTab[] = [
  { id: "skills-header", label: "Skills Header", icon: Layers },
  { id: "skills-categories", label: "Categories", icon: Folder },
  { id: "skills-list", label: "Skills", icon: Zap },
  { id: "skills-goals", label: "Learning Goals", icon: Target },
] as const;

export const PROJECTS_SUB_TABS: readonly AdminTab[] = [
  { id: "projects-header", label: "Projects Header", icon: FileText },
  { id: "projects-categories", label: "Categories", icon: Folder },
  { id: "projects-list", label: "Projects", icon: Briefcase },
  { id: "projects-technologies", label: "Technologies", icon: Code },
] as const;

export const RESUME_SUB_TABS: readonly AdminTab[] = [
  { id: "resume-header", label: "Resume Header", icon: ScrollText },
  { id: "resume-experiences", label: "Work Experiences", icon: Briefcase },
  { id: "resume-education", label: "Education", icon: GraduationCap },
  { id: "resume-certifications", label: "Certifications", icon: Award },
] as const;

export const POSTS_SUB_TABS: readonly AdminTab[] = [
  { id: "posts-list", label: "All Posts", icon: List },
  { id: "posts-new", label: "Create New", icon: PenSquare },
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
