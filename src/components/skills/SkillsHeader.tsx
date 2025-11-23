import React from "react";
import type { SkillsHeaderProps } from "./types";

/**
 * SkillsHeader Component
 * Displays the section title and description with optional highlighted text
 */
const SkillsHeader: React.FC<SkillsHeaderProps> = ({
  title,
  titleHighlight,
  description,
}) => {
  return (
    <div className="text-center mb-16">
      <h2 className="heading-xl mb-6">
        {title}
        {titleHighlight && (
          <>
            {" "}
            <span className="text-neural">{titleHighlight}</span>
          </>
        )}
      </h2>
      <div className="w-24 h-1 bg-gradient-secondary mx-auto mb-8"></div>
      <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default SkillsHeader;
