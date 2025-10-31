import React from "react";
import { cn } from "@/lib/utils";

/**
 * SkipToContent - Accessibility link for keyboard users
 *
 * Features:
 * - Hidden by default, visible on focus
 * - Allows keyboard users to skip navigation and jump to main content
 * - Positioned at top-left when focused
 * - High z-index to appear above all content
 *
 * Requirements: 8.7
 */
export const SkipToContent: React.FC = () => {
  return (
    <a
      href="#main-content"
      className={cn(
        // Hidden by default
        "sr-only",
        // Visible on focus
        "focus:not-sr-only",
        // Positioning
        "focus:fixed focus:top-4 focus:left-4 focus:z-[100]",
        // Styling
        "focus:px-4 focus:py-2",
        "focus:bg-primary focus:text-primary-foreground",
        "focus:rounded-md focus:shadow-lg",
        // Typography
        "focus:text-sm focus:font-medium",
        // Transitions
        "focus:transition-all focus:duration-200"
      )}
    >
      Skip to main content
    </a>
  );
};

export default SkipToContent;
