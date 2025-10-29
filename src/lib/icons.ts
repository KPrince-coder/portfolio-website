/**
 * Available Lucide Icons for the Icon Picker
 *
 * This is a curated list of commonly used icons.
 * Add or remove icons based on your needs.
 */
export const availableIcons = [
  // Common
  "Brain",
  "Database",
  "Smartphone",
  "Code",
  "Briefcase",
  "Award",
  "Star",
  "Zap",
  "Rocket",
  "Target",

  // Development
  "Terminal",
  "GitBranch",
  "Package",
  "Cpu",
  "Server",
  "Cloud",
  "Layers",
  "Box",

  // Design
  "Palette",
  "Pen",
  "Brush",
  "Image",
  "Layout",
  "Grid",

  // Communication
  "MessageSquare",
  "Mail",
  "Phone",
  "Video",
  "Mic",

  // Actions
  "Plus",
  "Minus",
  "Check",
  "X",
  "Edit",
  "Trash2",
  "Save",
  "Download",
  "Upload",

  // Navigation
  "Home",
  "Search",
  "Menu",
  "Settings",
  "User",
  "Users",

  // Status
  "AlertCircle",
  "CheckCircle",
  "Info",
  "XCircle",
  "TrendingUp",
  "TrendingDown",

  // Media
  "Play",
  "Pause",
  "Volume2",
  "Camera",
  "Film",

  // Files
  "File",
  "FileText",
  "Folder",
  "FolderOpen",

  // Misc
  "Heart",
  "Bookmark",
  "Flag",
  "Lock",
  "Unlock",
  "Eye",
  "EyeOff",
  "Calendar",
  "Clock",
  "MapPin",
  "Globe",
] as const;

export type IconName = (typeof availableIcons)[number];
