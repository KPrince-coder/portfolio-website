/**
 * EmailJS Service Types
 *
 * Type definitions for the EmailJS service
 */

// ============================================================================
// EMAIL PARAMETERS
// ============================================================================

export interface EmailParams {
  to_email: string;
  to_name?: string;
  from_name: string;
  from_email: string;
  subject: string;
  message: string;
  reply_to?: string;
  [key: string]: any;
}

export interface NotificationEmailParams {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  priority?: string;
  messageId?: string;
}

export interface AutoReplyEmailParams {
  senderName: string;
  senderEmail: string;
  subject: string;
}

export interface ManualReplyEmailParams {
  recipientName: string;
  recipientEmail: string;
  replyContent: string;
  originalMessage: string;
  originalSubject: string;
  adminName?: string;
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  duration?: number;
}
