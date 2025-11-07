/**
 * Auto Reply Email Template
 *
 * Automatic acknowledgment sent immediately after message submission
 */

import { Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "../components/EmailLayout";
import { EmailHeader } from "../components/EmailHeader";
import { EmailFooter } from "../components/EmailFooter";
import { EmailSection } from "../components/EmailSection";

export interface AutoReplyProps {
  senderName: string;
  subject: string;
  adminName: string;
  companyName: string;
  expectedResponseTime?: string;
}

export function AutoReply({
  senderName = "John Doe",
  subject = "Project Inquiry",
  adminName = "Support Team",
  companyName = "Portfolio",
  expectedResponseTime = "24 hours",
}: AutoReplyProps) {
  return (
    <EmailLayout preview="Thank you for your message">
      <EmailHeader title="Message Received" companyName={companyName} />

      <EmailSection>
        <Text style={greeting}>Hi {senderName},</Text>

        <Text style={paragraph}>
          Thank you for reaching out! We've received your message regarding "
          <strong>{subject}</strong>" and wanted to let you know that we'll get
          back to you as soon as possible.
        </Text>

        <Text style={paragraph}>
          Our team typically responds within{" "}
          <strong>{expectedResponseTime}</strong>. We appreciate your patience
          and look forward to connecting with you.
        </Text>
      </EmailSection>

      <EmailSection background="gray" bordered>
        <Text style={infoTitle}>What happens next?</Text>
        <ul style={list}>
          <li style={listItem}>We'll review your message carefully</li>
          <li style={listItem}>
            A team member will respond within {expectedResponseTime}
          </li>
          <li style={listItem}>
            You'll receive a personalized reply to your inquiry
          </li>
        </ul>
      </EmailSection>

      <EmailSection>
        <Text style={paragraph}>
          In the meantime, feel free to explore our website or check out our
          latest projects.
        </Text>

        <Text style={signature}>Best regards,</Text>
        <Text style={signatureName}>{adminName}</Text>
        <Text style={signatureCompany}>{companyName}</Text>
      </EmailSection>

      <EmailFooter companyName={companyName} />
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

const paragraph = {
  fontSize: "15px",
  color: "#374151",
  lineHeight: "1.6",
  margin: "0 0 15px 0",
};

const infoTitle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#667eea",
  margin: "0 0 15px 0",
};

const list = {
  margin: "0",
  padding: "0 0 0 20px",
};

const listItem = {
  fontSize: "14px",
  color: "#374151",
  lineHeight: "1.6",
  margin: "0 0 10px 0",
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

export default AutoReply;
