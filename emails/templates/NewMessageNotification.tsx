/**
 * New Message Notification Email Template
 *
 * Sent to admin when a new contact message is received
 */

import { Text, Hr } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "../components/EmailLayout";
import { EmailHeader } from "../components/EmailHeader";
import { EmailFooter } from "../components/EmailFooter";
import { EmailSection } from "../components/EmailSection";
import { EmailButton } from "../components/EmailButton";

export interface NewMessageNotificationProps {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  priority: "high" | "medium" | "low";
  category: string;
  createdAt: string;
  adminUrl: string;
  messageId: string;
  companyName: string;
}

export function NewMessageNotification({
  senderName = "John Doe",
  senderEmail = "john@example.com",
  subject = "Project Inquiry",
  message = "I would like to discuss a potential project...",
  priority = "medium",
  category = "general",
  createdAt = new Date().toLocaleString(),
  adminUrl = "https://yoursite.com/admin",
  messageId = "123",
  companyName = "Your Portfolio",
}: NewMessageNotificationProps) {
  const priorityColor = {
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#10b981",
  }[priority];

  return (
    <EmailLayout preview={`New message from ${senderName}`}>
      <EmailHeader title="New Contact Message" companyName={companyName} />

      <EmailSection background="gray" bordered>
        <Text style={label}>From:</Text>
        <Text style={value}>{senderName}</Text>

        <Text style={label}>Email:</Text>
        <Text style={value}>
          <a href={`mailto:${senderEmail}`} style={emailLink}>
            {senderEmail}
          </a>
        </Text>

        <Text style={label}>Subject:</Text>
        <Text style={value}>{subject}</Text>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <span style={{ ...badge, backgroundColor: priorityColor }}>
            {priority.toUpperCase()}
          </span>
          <span style={{ ...badge, backgroundColor: "#6b7280" }}>
            {category}
          </span>
        </div>
      </EmailSection>

      <EmailSection>
        <Text style={label}>Message:</Text>
        <Text style={messageText}>{message}</Text>
      </EmailSection>

      <EmailSection background="gray">
        <Text style={timestamp}>Received: {createdAt}</Text>
      </EmailSection>

      <div style={{ textAlign: "center", margin: "30px 0" }}>
        <EmailButton href={`${adminUrl}/messages?id=${messageId}`}>
          View in Admin Panel
        </EmailButton>
      </div>

      <EmailFooter companyName={companyName} />
    </EmailLayout>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const label = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#6b7280",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "10px 0 5px 0",
};

const value = {
  fontSize: "16px",
  color: "#1f2937",
  margin: "0 0 15px 0",
  lineHeight: "1.5",
};

const emailLink = {
  color: "#667eea",
  textDecoration: "none",
};

const badge = {
  display: "inline-block",
  padding: "4px 12px",
  borderRadius: "12px",
  fontSize: "11px",
  fontWeight: "600",
  color: "#ffffff",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const messageText = {
  fontSize: "15px",
  color: "#374151",
  lineHeight: "1.6",
  whiteSpace: "pre-wrap" as const,
  margin: "0",
};

const timestamp = {
  fontSize: "12px",
  color: "#9ca3af",
  margin: "0",
  textAlign: "center" as const,
};

export default NewMessageNotification;
