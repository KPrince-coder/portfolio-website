import React from "react";
import { SectionHeader } from "@/components/ui/section-header";
import type { AboutHeaderProps } from "./types";

/**
 * AboutHeader Component
 * Displays the section title and description using SectionHeader
 */
const AboutHeader: React.FC<AboutHeaderProps> = ({
  title,
  fullName,
  description,
}) => {
  return (
    <SectionHeader
      title={title}
      titleHighlight={fullName}
      description={description}
      align="center"
      id="about-heading"
    />
  );
};

export default React.memo(AboutHeader);
