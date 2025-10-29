import React from "react";

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
  align?: "left" | "center" | "right";
  /**
   * Optional custom className for the container
   */
  className?: string;
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
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  titleHighlight,
  description,
  align = "center",
  className = "",
}) => {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const dividerAlignmentClasses = {
    left: "mr-auto",
    center: "mx-auto",
    right: "ml-auto",
  };

  const descriptionAlignmentClasses = {
    left: "mr-auto",
    center: "mx-auto",
    right: "ml-auto",
  };

  return (
    <div className={`mb-16 ${alignmentClasses[align]} ${className}`}>
      <h2 className="heading-xl mb-6">
        {title}
        {titleHighlight && (
          <>
            {" "}
            <span className="text-neural">{titleHighlight}</span>
          </>
        )}
      </h2>
      <div
        className={`w-24 h-1 bg-gradient-secondary mb-8 ${dividerAlignmentClasses[align]}`}
      ></div>
      <p
        className={`text-lg text-muted-foreground max-w-3xl leading-relaxed ${descriptionAlignmentClasses[align]}`}
      >
        {description}
      </p>
    </div>
  );
};
