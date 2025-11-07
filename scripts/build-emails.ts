/**
 * Build Email Templates Script
 *
 * Renders React Email templates to HTML and stores them in the database
 *
 * Usage: npx tsx scripts/build-emails.ts
 */

import * as React from "react";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import {
  NewMessageNotification,
  ReplyToSender,
  AutoReply,
  renderEmail,
} from "../emails";

// Load environment variables from .env file
config();

// ============================================================================
// CONFIGURATION
// ============================================================================

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
// Try multiple possible variable names for the service role key
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌ Missing environment variables:");
  console.error("   VITE_SUPABASE_URL:", SUPABASE_URL ? "✓" : "✗");
  console.error(
    "   SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_KEY):",
    SUPABASE_SERVICE_KEY ? "✓" : "✗"
  );
  console.error("\n💡 Get your service role key from:");
  console.error(
    "   https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api"
  );
  console.error("\n   Add it to your .env file as:");
  console.error("   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ============================================================================
// TEMPLATE DEFINITIONS
// ============================================================================

const templates = [
  {
    name: "New Message Notification",
    description:
      "Notification sent to admin when a new contact message is received",
    template_type: "new_message_notification",
    component: NewMessageNotification,
    sampleProps: {
      senderName: "John Doe",
      senderEmail: "john@example.com",
      subject: "Project Inquiry",
      message: "I would like to discuss a potential project with you.",
      priority: "medium" as const,
      category: "general",
      createdAt: new Date().toLocaleString(),
      adminUrl: "https://yoursite.com/admin",
      messageId: "sample-id",
      companyName: "Your Portfolio",
    },
    availableVariables: {
      senderName: "Name of the message sender",
      senderEmail: "Email address of the sender",
      subject: "Subject of the message",
      message: "Content of the message",
      priority: "Priority level (high, medium, low)",
      category: "Message category",
      createdAt: "Timestamp when message was received",
      adminUrl: "URL to admin panel",
      messageId: "Unique message identifier",
      companyName: "Your portfolio name",
    },
    requiredVariables: [
      "senderName",
      "senderEmail",
      "subject",
      "message",
      "adminUrl",
    ],
  },
  {
    name: "Reply to Sender",
    description: "Reply email sent to message sender",
    template_type: "reply_to_sender",
    component: ReplyToSender,
    sampleProps: {
      senderName: "John Doe",
      replyContent:
        "<p>Thank you for your message. We'll get back to you soon!</p>",
      originalMessage: "I would like to discuss a potential project with you.",
      originalSubject: "Project Inquiry",
      adminName: "Support Team",
      companyName: "Your Company",
      companyEmail: "contact@example.com",
    },
    availableVariables: {
      senderName: "Name of the message sender",
      replyContent: "HTML content of the reply",
      originalMessage: "Original message content",
      originalSubject: "Original message subject",
      adminName: "Your name",
      companyName: "Your portfolio name",
      companyEmail: "Your email",
    },
    requiredVariables: [
      "senderName",
      "replyContent",
      "originalMessage",
      "adminName",
      "companyName",
    ],
  },
  {
    name: "Auto Reply",
    description:
      "Automatic acknowledgment sent immediately after message submission",
    template_type: "auto_reply",
    component: AutoReply,
    sampleProps: {
      senderName: "John Doe",
      subject: "Project Inquiry",
      adminName: "Your Name",
      companyName: "Your Portfolio",
      expectedResponseTime: "24 hours",
    },
    availableVariables: {
      senderName: "Name of the message sender",
      subject: "Subject of the message",
      adminName: "Your name",
      companyName: "Your portfolio name",
      expectedResponseTime: "Expected response time",
    },
    requiredVariables: ["senderName", "subject", "companyName"],
  },
];

// ============================================================================
// BUILD FUNCTION
// ============================================================================

async function buildEmails() {
  console.log("🚀 Building email templates...\n");

  for (const template of templates) {
    try {
      console.log(`📧 Building: ${template.name}`);

      // Render template
      const component = React.createElement(
        template.component as React.ComponentType<any>,
        template.sampleProps as any
      );
      const { html, text } = await renderEmail(component);

      console.log(`   ✓ Rendered HTML (${html.length} chars)`);
      console.log(`   ✓ Rendered Text (${text.length} chars)`);

      // Store in database
      const { data, error } = await supabase
        .from("react_email_templates")
        .upsert(
          {
            name: template.name,
            description: template.description,
            template_type: template.template_type,
            component_name: template.component.name || template.template_type,
            html_template: html,
            text_template: text,
            is_active: true,
            available_variables: template.availableVariables,
            required_variables: template.requiredVariables,
            preview_props: template.sampleProps,
          },
          {
            onConflict: "name",
          }
        )
        .select()
        .single();

      if (error) {
        console.error(`   ❌ Database error:`, error.message);
        continue;
      }

      console.log(`   ✓ Stored in database (ID: ${data.id})`);
      console.log("");
    } catch (error) {
      console.error(`   ❌ Error:`, error);
      console.log("");
    }
  }

  console.log("✅ Email templates built successfully!");
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getSubjectForTemplate(type: string): string {
  const subjects: Record<string, string> = {
    new_message_notification: "New Contact Message from {{sender_name}}",
    reply_to_sender: "Re: {{original_subject}}",
    auto_reply: "Thank you for your message",
  };
  return subjects[type] || "Message from {{company_name}}";
}

// ============================================================================
// RUN
// ============================================================================

buildEmails()
  .then(() => {
    console.log("\n🎉 Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Build failed:", error);
    process.exit(1);
  });
