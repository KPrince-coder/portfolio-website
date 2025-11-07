/**
 * Messages Module Types
 *
 * Type definitions for contact messages, email templates, and related functionality
 * Aligned with Supabase schema for consistency
 *
 * @module messages/types
 */

import { Json } from "@/integrations/supabase/types";

// ============================================================================
// MESSAGE TYPES
// ============================================================================

export type MessageStatus = "unread" | "read" | "replied" | "spam";
export type MessagePriority = "low" | "medium" | "high";
export type MessageCategory =
  | "general"
  | "support"
  | "feedback"
  | "business"
  | "other";

/**
 * Contact Message - Aligned with Supabase contact_messages table
 */
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string | null;
  priority: string | null;
  category: string | null;
  tags: string[] | null;
  archived: boolean | null;
  is_replied: boolean | null;
  reply_content: string | null;
  reply_sent_at: string | null;
  admin_notes: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
}

export interface MessageFilters {
  status?: MessageStatus | "all" | "archived";
  priority?: MessagePriority | "all";
  category?: MessageCategory | "all";
  search?: string;
}

export interface MessageStats {
  totalMessages: number;
  unreadMessages: number;
  repliedMessages: number;
  averageResponseTime: number; // in hours
  messagesThisWeek: number;
  messagesThisMonth: number;
}

// ============================================================================
// EMAIL TEMPLATE TYPES
// ============================================================================

export type EmailTemplateType =
  | "new_message_notification"
  | "reply_to_sender"
  | "auto_reply";

/**
 * Email Template - Aligned with Supabase email_templates table
 */
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  text_content: string | null;
  template_type: string;
  is_active: boolean | null;
  variables: Json | null;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplateFormData {
  name: string;
  subject: string;
  html_content: string;
  text_content?: string;
  template_type: EmailTemplateType;
  is_active: boolean;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface MessagesListProps {
  onReplyToMessage?: (messageId: string) => void;
  onViewMessage?: (messageId: string) => void;
}

export interface MessageReplyProps {
  message: ContactMessage;
  onSendReply: (content: string) => Promise<void>;
  onSaveDraft: (content: string) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export interface MessageStatsProps {
  stats: MessageStats;
}

export interface EmailTemplateFormProps {
  template?: EmailTemplate;
  onSave: (data: EmailTemplateFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

// ============================================================================
// API TYPES
// ============================================================================

export interface CreateMessageInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  category?: MessageCategory;
}

export interface UpdateMessageInput {
  id: string;
  status?: MessageStatus;
  priority?: MessagePriority;
  category?: MessageCategory;
  tags?: string[];
  archived?: boolean;
  reply_content?: string;
  reply_sent_at?: string;
  is_replied?: boolean;
}

export interface SendReplyInput {
  messageId: string;
  replyContent: string;
  sendEmail?: boolean;
}

// ============================================================================
// EMAIL SERVICE TYPES
// ============================================================================

export interface SendNotificationParams {
  messageId: string;
  adminEmail?: string;
}

export interface SendReplyParams {
  messageId: string;
  replyContent: string;
  adminName?: string;
}

export interface EmailResponse {
  success: boolean;
  email_id?: string;
  message: string;
  error?: string;
  details?: string;
  duration_ms?: number;
  response_time_hours?: number;
}

export interface EmailLog {
  id: string;
  message_id: string;
  email_type: "notification" | "reply" | "auto_reply";
  recipient_email: string;
  subject: string;
  status: "sent" | "failed" | "pending";
  error_message?: string;
  sent_at?: string;
  created_at: string;
}

export interface EmailStatistics {
  total_sent: number;
  total_failed: number;
  success_rate: number;
  avg_response_time_hours: number;
  emails_by_type: {
    notification: number;
    reply: number;
    auto_reply: number;
  };
}

// ============================================================================
// CONTACT SETTINGS TYPES
// ============================================================================

export interface ExpectationItem {
  text: string;
  color: string;
}

export interface ContactSettings {
  id: string;
  title: string;
  title_highlight: string;
  description: string;
  response_time: string;
  expectations: ExpectationItem[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactSettingsFormData {
  title: string;
  title_highlight: string;
  description: string;
  response_time: string;
  expectations: ExpectationItem[];
}

export interface ColorOption {
  value: string;
  label: string;
  color: string;
}

// ============================================================================
// RESULT TYPES
// ============================================================================

export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export interface PaginationOptions {
  page: number;
  per_page: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}
