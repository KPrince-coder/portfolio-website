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
import { emailJSConfig, EMAIL_DEFAULTS } from "@/config/emailjs.config";
import { RateLimiter } from "./emailjs.rateLimit";
import { sanitizeParams } from "./emailjs.sanitize";
import type {
  EmailParams,
  EmailResponse,
  NotificationEmailParams,
  AutoReplyEmailParams,
  ManualReplyEmailParams,
} from "./emailjs.types";

// Re-export types for convenience
export type {
  EmailParams,
  EmailResponse,
  NotificationEmailParams,
  AutoReplyEmailParams,
  ManualReplyEmailParams,
};

// ============================================================================
// RATE LIMITER INSTANCE
// ============================================================================

const rateLimiter = new RateLimiter({
  maxAttempts: emailJSConfig.rateLimit.maxAttempts,
  windowMs: emailJSConfig.rateLimit.windowMs,
});

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
  static async sendNotification(
    params: NotificationEmailParams
  ): Promise<EmailResponse> {
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
      current_year: new Date().getFullYear().toString(),
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
  static async sendAutoReply(
    params: AutoReplyEmailParams
  ): Promise<EmailResponse> {
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
      current_year: new Date().getFullYear().toString(),
    });

    return this.sendWithRetry(
      emailJSConfig.serviceId,
      emailJSConfig.templates.autoReply,
      sanitized
    );
  }

  /**
   * Send manual reply from admin panel
   * Uses the manual reply template (dual-purpose auto-reply template)
   */
  static async sendManualReply(
    params: ManualReplyEmailParams
  ): Promise<EmailResponse> {
    console.log("📧 Sending manual reply email...", {
      serviceId: emailJSConfig.serviceId,
      templateId: emailJSConfig.templates.manualReply,
      to: params.recipientEmail,
    });

    // Rate limiting
    const rateLimitKey = `reply:${params.recipientEmail}`;
    if (!rateLimiter.check(rateLimitKey)) {
      console.error("❌ Rate limit exceeded for:", params.recipientEmail);
      return {
        success: false,
        error: "Rate limit exceeded.",
      };
    }

    // Sanitize inputs
    const sanitized = sanitizeParams({
      to_email: params.recipientEmail,
      to_name: params.recipientName,
      from_name: params.adminName || EMAIL_DEFAULTS.senderName,
      from_email: emailJSConfig.adminEmail,
      subject: `Re: ${params.originalSubject}`,
      message: params.replyContent,
      reply_content: params.replyContent,
      original_message: params.originalMessage,
      original_subject: params.originalSubject,
      company_name: EMAIL_DEFAULTS.companyName,
      is_manual_reply: "true", // Flag to differentiate from auto-reply
      current_year: new Date().getFullYear().toString(),
    });

    const result = await this.sendWithRetry(
      emailJSConfig.serviceId,
      emailJSConfig.templates.manualReply,
      sanitized
    );

    if (result.success) {
      console.log("✅ Manual reply email sent successfully");
    } else {
      console.error("❌ Failed to send manual reply email:", result.error);
    }

    return result;
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Send notification email
 */
export async function sendNotificationEmail(
  params: NotificationEmailParams
): Promise<EmailResponse> {
  return EmailJSService.sendNotification(params);
}

/**
 * Send auto-reply email
 */
export async function sendAutoReplyEmail(
  params: AutoReplyEmailParams
): Promise<EmailResponse> {
  return EmailJSService.sendAutoReply(params);
}

/**
 * Send manual reply email
 */
export async function sendManualReplyEmail(
  params: ManualReplyEmailParams
): Promise<EmailResponse> {
  return EmailJSService.sendManualReply(params);
}
