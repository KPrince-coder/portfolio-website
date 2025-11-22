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
   * Uses mailto: link to open user's email client (no template needed)
   */
  static async sendManualReply(
    params: ManualReplyEmailParams
  ): Promise<EmailResponse> {
    try {
      // Convert HTML to plain text for email body
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = params.replyContent;
      const plainTextReply = tempDiv.textContent || tempDiv.innerText || "";

      // Build email body with context
      const emailBody = `${plainTextReply}

---
Original Message:
From: ${params.recipientName} <${params.recipientEmail}>
Subject: ${params.originalSubject}

${params.originalMessage}`;

      // Create mailto link
      const subject = encodeURIComponent(`Re: ${params.originalSubject}`);
      const body = encodeURIComponent(emailBody);
      const mailtoLink = `mailto:${params.recipientEmail}?subject=${subject}&body=${body}`;

      // Open email client
      window.open(mailtoLink, "_blank");

      return {
        success: true,
        messageId: "mailto-opened",
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message || "Failed to open email client",
      };
    }
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
