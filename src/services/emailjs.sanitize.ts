/**
 * Email Input Sanitization Utilities
 *
 * Security utilities for sanitizing email inputs
 */

import type { EmailParams } from "./emailjs.types";

// ============================================================================
// SANITIZATION FUNCTIONS
// ============================================================================

/**
 * Sanitize email address
 * - Trims whitespace
 * - Converts to lowercase
 */
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Sanitize text content
 * - Trims whitespace
 * - Removes script tags
 * - Removes iframe tags
 */
export function sanitizeText(text: string): string {
  return text
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");
}

/**
 * Sanitize HTML content (more aggressive)
 * - Removes all HTML tags
 * - Preserves line breaks
 */
export function sanitizeHTML(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .trim();
}

/**
 * Sanitize all email parameters
 */
export function sanitizeParams(params: EmailParams): EmailParams {
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

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate email parameters
 */
export function validateEmailParams(params: EmailParams): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!params.to_email || !isValidEmail(params.to_email)) {
    errors.push("Invalid recipient email");
  }

  if (!params.from_email || !isValidEmail(params.from_email)) {
    errors.push("Invalid sender email");
  }

  if (!params.from_name || params.from_name.trim().length === 0) {
    errors.push("Sender name is required");
  }

  if (!params.subject || params.subject.trim().length === 0) {
    errors.push("Subject is required");
  }

  if (!params.message || params.message.trim().length === 0) {
    errors.push("Message is required");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
