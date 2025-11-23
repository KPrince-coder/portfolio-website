import React from "react";
import { cn } from "@/lib/utils";

/**
 * Section alignment options
 */
export type SectionAlignment = "left" | "center" | "right";

/**
 * Alignment class mappings (moved outside component for performance)
 */
const ALIGNMENT_CLASSES = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

const DIVIDER_ALIGNMENT_CLASSES = {
  left: "mr-auto",
  center: "mx-auto",
  right: "ml-auto",
} as const;

const DESCRIPTION_ALIGNMENT_CLASSES = {
  left: "mr-auto",
  center: "mx-auto",
  right: "ml-auto",
} as const;

export interface SectionHeaderProps {
  /**
   * Main title text
   */
  title: string;
  /**
   * Optional highlighted portion of the title (displayed in accent color)
   */
  titleHighlight?: string;
  /**
   * Section description text
   */
  description: string;
  /**
   * Optional alignment (default: center)
   */
  align?: SectionAlignment;
  /**
   * Optional custom className for the container
   */
  className?: string;
  /**
   * Optional ID for the heading (auto-generated from title if not provided)
   */
  id?: string;
}

/**
 * SectionHeader Component
 * Reusable section header with title, optional highlight, and description
 * Used across Skills, Projects, and other sections for consistency
 *
 * @example
 * ```tsx
 * <SectionHeader
 *   title="Technical"
 *   titleHighlight="Expertise"
 *   description="A comprehensive toolkit for building intelligent systems"
 * />
 * ```
 *
 * @example With custom alignment
 * ```tsx
 * <SectionHeader
 *   title="Featured Projects"
 *   description="Showcasing my best work"
 *   align="left"
 * />
 * ```
 */
export const SectionHeader = React.memo<SectionHeaderProps>(
  ({
    title,
    titleHighlight,
    description,
    align = "center",
    className = "",
    id,
  }) => {
    // Generate heading ID from title if not provided
    const headingId =
      id || `section-${title.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <div
        className={cn(
          "mb-8 md:mb-12 lg:mb-16",
          ALIGNMENT_CLASSES[align],
          className
        )}
        role="region"
        aria-labelledby={headingId}
      >
        <h2 id={headingId} className="heading-xl mb-6">
          {title}
          {titleHighlight && (
            <span className="text-neural"> {titleHighlight}</span>
          )}
        </h2>
        <div
          className={cn(
            "w-16 md:w-20 lg:w-24 h-1 bg-gradient-secondary mb-6 md:mb-8",
            DIVIDER_ALIGNMENT_CLASSES[align]
          )}
          aria-hidden="true"
        />
        <p
          className={cn(
            "text-lg text-muted-foreground max-w-3xl leading-relaxed",
            DESCRIPTION_ALIGNMENT_CLASSES[align]
          )}
        >
          {description}
        </p>
      </div>
    );
  }
);

SectionHeader.displayName = "SectionHeader";
