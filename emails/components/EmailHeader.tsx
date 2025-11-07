/**
 * Email Header Component
 *
 * Header with branding and gradient background
 */

import { Section, Heading } from "@react-email/components";
import * as React from "react";

interface EmailHeaderProps {
  title: string;
  companyName?: string;
}

export function EmailHeader({
  title,
  companyName = "Portfolio",
}: EmailHeaderProps) {
  return (
    <Section style={header}>
      <Heading style={heading}>{title}</Heading>
      {companyName && <p style={subtitle}>{companyName}</p>}
    </Section>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const header = {
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  padding: "30px",
  borderRadius: "10px 10px 0 0",
  textAlign: "center" as const,
};

const heading = {
  color: "#ffffff",
  margin: "0",
  fontSize: "24px",
  fontWeight: "bold",
  lineHeight: "1.3",
};

const subtitle = {
  color: "#ffffff",
  margin: "8px 0 0 0",
  fontSize: "14px",
  opacity: 0.9,
};
