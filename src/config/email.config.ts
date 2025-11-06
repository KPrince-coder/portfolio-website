/**
 * Email Configuration
 *
 * Centralized email configuration from environment variables
 *
 * @module config/email
 */

// ============================================================================
// EMAIL CONFIGURATION
// ============================================================================

export const emailConfig = {
  /**
   * Admin email to receive notifications
   */
  adminEmail: import.meta.env.VITE_ADMIN_EMAIL || "admin@example.com",

  /**
   * Company name for email templates
   */
  companyName: import.meta.env.VITE_COMPANY_NAME || "Portfolio",

  /**
   * Company email for replies
   */
  companyEmail: import.meta.env.VITE_COMPANY_EMAIL || "contact@example.com",

  /**
   * Admin panel URL (for notification links)
   */
  adminUrl: window.location.origin + "/admin",
} as const;

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate email configuration
 */
export function validateEmailConfig(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (
    !emailConfig.adminEmail ||
    emailConfig.adminEmail === "admin@example.com"
  ) {
    errors.push("VITE_ADMIN_EMAIL not configured in .env");
  }

  if (!emailConfig.companyName || emailConfig.companyName === "Portfolio") {
    errors.push("VITE_COMPANY_NAME not configured in .env");
  }

  if (
    !emailConfig.companyEmail ||
    emailConfig.companyEmail === "contact@example.com"
  ) {
    errors.push("VITE_COMPANY_EMAIL not configured in .env");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// DEVELOPMENT WARNINGS
// ============================================================================

if (import.meta.env.DEV) {
  const validation = validateEmailConfig();
  if (!validation.valid) {
    console.warn(
      "⚠️ Email configuration incomplete:",
      validation.errors.join(", ")
    );
    console.warn("Please update your .env file with proper values");
  }
}
