/**
 * Base Email Configuration
 *
 * Shared email configuration values used across different email services
 * Single source of truth for common email settings
 *
 * @module config/email.base
 */

// ============================================================================
// BASE EMAIL CONFIGURATION
// ============================================================================

export const baseEmailConfig = Object.freeze({
  /**
   * Admin email to receive notifications
   * Used by both EmailJS and other email services
   */
  adminEmail: import.meta.env.VITE_ADMIN_EMAIL || "contact@codeprince.qzz.io",

  /**
   * Company name for email templates
   */
  companyName: import.meta.env.VITE_COMPANY_NAME || "Portfolio",

  /**
   * Company email for replies
   */
  companyEmail:
    import.meta.env.VITE_COMPANY_EMAIL || "contact@codeprince.qzz.io",
});

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns true if email format is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if email configuration is using default values
 * @param email - Email to check
 * @returns true if using default/placeholder value
 */
export function isDefaultEmail(email: string): boolean {
  const defaults = [
    "admin@example.com",
    "contact@example.com",
    "contact@codeprince.qzz.io",
  ];
  return defaults.includes(email);
}
