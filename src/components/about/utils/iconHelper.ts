import * as Icons from "lucide-react";

/**
 * Get icon component by name
 * Falls back to Briefcase icon if not found
 */
export const getIcon = (iconName: string) => {
  const Icon = (Icons as any)[iconName] || Icons.Briefcase;
  return Icon;
};
