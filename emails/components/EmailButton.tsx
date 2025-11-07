/**
 * Email Button Component
 *
 * Styled button for CTAs
 */

import { Button } from "@react-email/components";
import * as React from "react";

interface EmailButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

export function EmailButton({
  href,
  children,
  variant = "primary",
}: EmailButtonProps) {
  const buttonStyle = variant === "primary" ? primaryButton : secondaryButton;

  return (
    <Button href={href} style={buttonStyle}>
      {children}
    </Button>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const baseButton = {
  display: "inline-block",
  padding: "12px 30px",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  borderRadius: "6px",
  textAlign: "center" as const,
  cursor: "pointer",
};

const primaryButton = {
  ...baseButton,
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "#ffffff",
};

const secondaryButton = {
  ...baseButton,
  backgroundColor: "#ffffff",
  color: "#667eea",
  border: "2px solid #667eea",
};
