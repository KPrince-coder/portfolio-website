/**
 * EmailJS Service
 *
 * Modern email service using EmailJS with security and performance optimizations
 * November 2025 - Latest implementation
 *
 * Features:
 * - Rate limiting
 * - Error handling
 * - Retry logic
 * - Input sanitization
 * - Performance monitoring
 */

import emailjs from "@emailjs/browser";
import { emailJSConfig } from "@/config/emailjs.config";

// ============================================================================
// TYPES
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

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  duration?: number;
}

// ============================================================================
// RATE LIMITING
// ============================================================================

class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  check(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];

    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(
      (time) => now - time < emailJSConfig.rateLimit.windowMs
    );

    if (recentAttempts.length >= emailJSConfig.rateLimit.maxAttempts) {
      return false;
    }

    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

const rateLimiter = new RateLimiter();

// ============================================================================
// INPUT SANITIZATION
// ============================================================================

function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function sanitizeText(text: string): string {
  return text
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");
}

function sanitizeParams(params: EmailParams): EmailParams {
  return {
    ...params,
    to_email: sanitizeEmail(params.to_email),
    from_email: sanitizeEmail(params.from_email),
    from_name: sanitizeText(params.from_name),
    subject: sanitizeText(params.subject),
    message: sanitizeText(params.message),
    to_name: params.to_name ? sanitizeText(params.to_name) : undefined,
    reply_to: params.reply_to ? sanitizeEmail(params.reply_to) : undefined,
  };
}

// ============================================================================
// EMAIL SERVICE
// ============================================================================

export class EmailJSService {
  private static initialized = false;

  /**
   * Initialize EmailJS (call once on app start)
   */
  static init(): void {
    if (this.initialized) return;

    try {
      emailjs.init({
        publicKey: emailJSConfig.publicKey,
        blockHeadless: true, // Security: block headless browsers
        limitRate: {
          throttle: 10000, // 10 seconds between emails
        },
      });
      this.initialized = true;
      console.log("✅ EmailJS initialized");
    } catch (error) {
      console.error("❌ EmailJS initialization failed:", error);
    }
  }

  /**
   * Send email with retry logic
   */
  private static async sendWithRetry(
    serviceId: string,
    templateId: string,
    params: EmailParams,
    maxRetries = 2
  ): Promise<EmailResponse> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const startTime = performance.now();

        const response = await emailjs.send(serviceId, templateId, params);

        const duration = Math.round(performance.now() - startTime);

        return {
          success: true,
          messageId: response.text,
          duration,
        };
      } catch (error) {
        lastError = error as Error;

        if (attempt < maxRetries) {
          // Exponential backoff
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          );
        }
      }
    }

    return {
      success: false,
      error: lastError?.message || "Failed to send email",
    };
  }

  /**
   * Send notification email to admin
   */
  static async sendNotification(params: {
    senderName: string;
    senderEmail: string;
    subject: string;
    message: string;
    priority?: string;
    messageId?: string;
  }): Promise<EmailResponse> {
    // Rate limiting
    const rateLimitKey = `notification:${params.senderEmail}`;
    if (!rateLimiter.check(rateLimitKey)) {
      return {
        success: false,
        error: "Rate limit exceeded. Please try again later.",
      };
    }

    // Sanitize inputs
    const sanitized = sanitizeParams({
      to_email: emailJSConfig.adminEmail,
      to_name: "Admin",
      from_name: params.senderName,
      from_email: params.senderEmail,
      subject: params.subject,
      message: params.message,
      priority: params.priority || "medium",
      message_id: params.messageId || "",
      admin_url: `${window.location.origin}/admin/messages${params.messageId ? `?id=${params.messageId}` : ""}`,
      received_at: new Date().toLocaleString("en-US", {
        dateStyle: "full",
        timeStyle: "short",
      }),
    });

    return this.sendWithRetry(
      emailJSConfig.serviceId,
      emailJSConfig.templates.notification,
      sanitized
    );
  }

  /**
   * Send auto-reply to message sender
   */
  static async sendAutoReply(params: {
    senderName: string;
    senderEmail: string;
    subject: string;
  }): Promise<EmailResponse> {
    // Rate limiting
    const rateLimitKey = `autoreply:${params.senderEmail}`;
    if (!rateLimiter.check(rateLimitKey)) {
      return {
        success: false,
        error: "Rate limit exceeded.",
      };
    }

    // Sanitize inputs
    const sanitized = sanitizeParams({
      to_email: params.senderEmail,
      to_name: params.senderName,
      from_name: "CodePrince",
      from_email: emailJSConfig.adminEmail,
      subject: `Re: ${params.subject}`,
      message: "", // Template handles the message
      original_subject: params.subject,
      company_name: "CodePrince",
      expected_response_time: "24 hours",
    });

    return this.sendWithRetry(
      emailJSConfig.serviceId,
      emailJSConfig.templates.autoReply,
      sanitized
    );
  }

  /**
   * Send manual reply from admin panel
   */
  static async sendManualReply(params: {
    recipientName: string;
    recipientEmail: string;
    replyContent: string;
    originalMessage: string;
    originalSubject: string;
    adminName?: string;
  }): Promise<EmailResponse> {
    // Rate limiting
    const rateLimitKey = `reply:${params.recipientEmail}`;
    if (!rateLimiter.check(rateLimitKey)) {
      return {
        success: false,
        error: "Rate limit exceeded.",
      };
    }

    // Sanitize inputs
    const sanitized = sanitizeParams({
      to_email: params.recipientEmail,
      to_name: params.recipientName,
      from_name: params.adminName || "CodePrince Team",
      from_email: emailJSConfig.adminEmail,
      subject: `Re: ${params.originalSubject}`,
      message: params.replyContent,
      reply_content: params.replyContent,
      original_message: params.originalMessage,
      original_subject: params.originalSubject,
      company_name: "CodePrince",
      reply_to: emailJSConfig.adminEmail,
    });

    return this.sendWithRetry(
      emailJSConfig.serviceId,
      emailJSConfig.templates.manualReply,
      sanitized
    );
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Send notification email
 */
export async function sendNotificationEmail(params: {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  priority?: string;
  messageId?: string;
}): Promise<EmailResponse> {
  return EmailJSService.sendNotification(params);
}

/**
 * Send auto-reply email
 */
export async function sendAutoReplyEmail(params: {
  senderName: string;
  senderEmail: string;
  subject: string;
}): Promise<EmailResponse> {
  return EmailJSService.sendAutoReply(params);
}

/**
 * Send manual reply email
 */
export async function sendManualReplyEmail(params: {
  recipientName: string;
  recipientEmail: string;
  replyContent: string;
  originalMessage: string;
  originalSubject: string;
  adminName?: string;
}): Promise<EmailResponse> {
  return EmailJSService.sendManualReply(params);
}
