import * as Icons from "lucide-react";

/**
 * Get a Lucide icon component by name
 * Supports all 300+ icons from lucide-react
 * Falls back to Code icon if the specified icon is not found
 *
 * @param iconName - The name of the Lucide icon (e.g., "Brain", "Database", "Code")
 * @returns The icon component
 *
 * @example
 * ```tsx
 * const Icon = getIcon("Brain");
 * return <Icon className="w-6 h-6" />;
 * ```
 */
export const getIcon = (
  iconName: string
): React.ComponentType<{ className?: string }> => {
  const Icon = Icons[iconName as keyof typeof Icons] as React.ComponentType<{
    className?: string;
  }>;

  // Fallback to Code icon if the specified icon doesn't exist
  return Icon || Icons.Code;
};
