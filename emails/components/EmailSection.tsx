/**
 * Email Section Component
 *
 * Content section with consistent padding and styling
 */

import { Section } from "@react-email/components";
import * as React from "react";

interface EmailSectionProps {
  children: React.ReactNode;
  background?: "white" | "gray";
  bordered?: boolean;
}

export function EmailSection({
  children,
  background = "white",
  bordered = false,
}: EmailSectionProps) {
  const sectionStyle = {
    ...baseSection,
    backgroundColor: background === "white" ? "#ffffff" : "#f9f9f9",
    ...(bordered && borderStyle),
  };

  return <Section style={sectionStyle}>{children}</Section>;
}

// ============================================================================
// STYLES
// ============================================================================

const baseSection = {
  padding: "20px 30px",
  borderRadius: "8px",
  margin: "10px 0",
};

const borderStyle = {
  border: "1px solid #e6ebf1",
};
