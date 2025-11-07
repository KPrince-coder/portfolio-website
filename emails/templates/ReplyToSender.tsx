/**
 * Reply to Sender Email Template
 *
 * Sent to message sender when admin replies
 */

import { Text, Hr } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "../components/EmailLayout";
import { EmailHeader } from "../components/EmailHeader";
import { EmailFooter } from "../components/EmailFooter";
import { EmailSection } from "../components/EmailSection";

export interface ReplyToSenderProps {
  senderName: string;
  replyContent: string;
  originalMessage: string;
  originalSubject: string;
  adminName: string;
  companyName: string;
  companyEmail: string;
}

export function ReplyToSender({
  senderName = "John Doe",
  replyContent = "<p>Thank you for your message. I'll get back to you soon!</p>",
  originalMessage = "I would like to discuss a potential project...",
  originalSubject = "Project Inquiry",
  adminName = "Your Name",
  companyName = "Your Portfolio",
  companyEmail = "contact@example.com",
}: ReplyToSenderProps) {
  return (
    <EmailLayout preview={`Re: ${originalSubject}`}>
      <EmailHeader title={companyName} />

      <EmailSection>
        <Text style={greeting}>Hi {senderName},</Text>

        <div
          style={replyContentStyle}
          dangerouslySetInnerHTML={{ __html: replyContent }}
        />
      </EmailSection>

      <Hr style={divider} />

      <EmailSection background="gray" bordered>
        <Text style={originalLabel}>Your original message:</Text>
        <Text style={originalText}>{originalMessage}</Text>
      </EmailSection>

      <EmailSection>
        <Text style={signature}>Best regards,</Text>
        <Text style={signatureName}>{adminName}</Text>
        <Text style={signatureCompany}>{companyName}</Text>
        {companyEmail && (
          <Text style={signatureEmail}>
            <a href={`mailto:${companyEmail}`} style={emailLink}>
              {companyEmail}
            </a>
          </Text>
        )}
      </EmailSection>

      <EmailFooter companyName={companyName} companyEmail={companyEmail} />
    </EmailLayout>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const greeting = {
  fontSize: "16px",
  color: "#1f2937",
  margin: "0 0 20px 0",
  lineHeight: "1.5",
};

const replyContentStyle = {
  fontSize: "15px",
  color: "#374151",
  lineHeight: "1.6",
  margin: "20px 0",
};

const divider = {
  borderColor: "#e5e7eb",
  margin: "30px 0",
};

const originalLabel = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#667eea",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 10px 0",
};

const originalText = {
  fontSize: "14px",
  color: "#6b7280",
  lineHeight: "1.6",
  whiteSpace: "pre-wrap" as const,
  margin: "0",
  fontStyle: "italic",
};

const signature = {
  fontSize: "15px",
  color: "#374151",
  margin: "30px 0 5px 0",
};

const signatureName = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#667eea",
  margin: "5px 0",
};

const signatureCompany = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "5px 0",
};

const signatureEmail = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "5px 0",
};

const emailLink = {
  color: "#667eea",
  textDecoration: "none",
};

export default ReplyToSender;
