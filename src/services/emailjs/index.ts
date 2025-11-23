/**
 * EmailJS Service - Public API
 *
 * Centralized exports for the EmailJS service module
 */

// Main service
export { EmailJSService } from "../emailjs.service";

// Convenience functions
export {
  sendNotificationEmail,
  sendAutoReplyEmail,
  sendManualReplyEmail,
} from "../emailjs.service";

// Types
export type {
  EmailParams,
  EmailResponse,
  NotificationEmailParams,
  AutoReplyEmailParams,
  ManualReplyEmailParams,
} from "../emailjs.types";

// Utilities (if needed externally)
export { RateLimiter } from "../emailjs.rateLimit";
export {
  sanitizeEmail,
  sanitizeText,
  sanitizeHTML,
  sanitizeParams,
  isValidEmail,
  validateEmailParams,
} from "../emailjs.sanitize";
