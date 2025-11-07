/**
 * Email Layout Component
 *
 * Base layout wrapper for all email templates
 * Provides consistent structure and styling
 */

import { Html, Head, Body, Container, Preview } from "@react-email/components";
import * as React from "react";

interface EmailLayoutProps {
  preview: string;
  children: React.ReactNode;
}

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>{children}</Container>
      </Body>
    </Html>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};
