/**
 * Email Footer Component
 *
 * Footer with company information and links
 */

import { Section, Text, Hr, Link } from "@react-email/components";
import * as React from "react";

interface EmailFooterProps {
  companyName: string;
  companyEmail?: string;
  unsubscribeUrl?: string;
}

export function EmailFooter({
  companyName,
  companyEmail,
  unsubscribeUrl,
}: EmailFooterProps) {
  return (
    <Section style={footer}>
      <Hr style={hr} />
      <Text style={footerText}>
        © {new Date().getFullYear()} {companyName}. All rights reserved.
      </Text>
      {companyEmail && (
        <Text style={footerText}>
          <Link href={`mailto:${companyEmail}`} style={link}>
            {companyEmail}
          </Link>
        </Text>
      )}
      {unsubscribeUrl && (
        <Text style={footerText}>
          <Link href={unsubscribeUrl} style={link}>
            Unsubscribe
          </Link>
        </Text>
      )}
    </Section>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const footer = {
  padding: "20px 30px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footerText = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "4px 0",
  textAlign: "center" as const,
};

const link = {
  color: "#667eea",
  textDecoration: "none",
};
