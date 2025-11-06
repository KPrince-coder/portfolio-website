/**
 * Shared Types for Supabase Edge Functions
 *
 * Centralized type definitions for email functions
 */

// ============================================================================
// Email Types
// ============================================================================

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  text_content: string | null;
  template_type: EmailTemplateType;
  is_active: boolean;
  variables?: Record<string, any>;
}

export type EmailTemplateType =
  | "new_message_notification"
  | "reply_to_sender"
  | "auto_reply"
  | "welcome"
  | "password_reset"
  | "custom";

export type EmailStatus =
  | "pending"
  | "sent"
  | "delivered"
  | "bounced"
  | "failed"
  | "complained"
  | "opened"
  | "clicked";

export interface EmailLog {
  id?: string;
  resend_email_id?: string;
  message_id?: string;
  template_id?: string;
  email_type: string;
  from_email: string;
  from_name?: string;
  to_email: string;
  to_name?: string;
  reply_to?: string;
  subject: string;
  html_content?: string;
  text_content?: string;
  template_variables?: Record<string, any>;
  status: EmailStatus;
  sent_at?: string;
  error_message?: string;
  error_code?: string;
  metadata?: Record<string, any>;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  category: string;
  created_at: string;
  reply_content?: string;
  reply_sent_at?: string;
  is_replied: boolean;
}

// ============================================================================
// Request/Response Types
// ============================================================================

export interface SendNotificationRequest {
  message_id: string;
  admin_email?: string;
}

export interface SendReplyRequest {
  message_id: string;
  reply_content: string;
  admin_name?: string;
}

export interface EmailResponse {
  success: boolean;
  email_id?: string;
  message: string;
  error?: string;
  details?: string;
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface BrandSettings {
  email_branding?: {
    company_name?: string;
    company_email?: string;
    logo_url?: string;
    primary_color?: string;
    footer_text?: string;
  };
  notification_settings?: {
    admin_email?: string;
    reply_from_name?: string;
    auto_reply_enabled?: boolean;
  };
}

// ============================================================================
// Error Types
// ============================================================================

export class EmailError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = "EmailError";
  }
}

export class ValidationError extends EmailError {
  constructor(message: string, details?: any) {
    super(message, "VALIDATION_ERROR", 400, details);
    this.name = "ValidationError";
  }
}

export class TemplateError extends EmailError {
  constructor(message: string, details?: any) {
    super(message, "TEMPLATE_ERROR", 404, details);
    this.name = "TemplateError";
  }
}

export class DeliveryError extends EmailError {
  constructor(message: string, details?: any) {
    super(message, "DELIVERY_ERROR", 500, details);
    this.name = "DeliveryError";
  }
}
