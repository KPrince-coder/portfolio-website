/**
 * EmailJS Configuration
 *
 * Modern email service configuration using EmailJS
 * November 2025 - Latest implementation
 *
 * @see https://www.emailjs.com/docs/
 */

import { baseEmailConfig, isValidEmail } from "./email.base";

// ============================================================================
// TYPES
// ============================================================================

export interface EmailJSConfig {
  readonly publicKey: string;
  readonly serviceId: string;
  readonly templates: {
    readonly notification: string;
    readonly autoReply: string;
    readonly manualReply: string;
  };
  readonly adminEmail: string;
  readonly rateLimit: {
    readonly maxAttempts: number;
    readonly windowMs: number;
  };
}

// ============================================================================
// CONFIGURATION
// ============================================================================

export const emailJSConfig: EmailJSConfig = Object.freeze({
  /**
   * EmailJS Public Key (safe to expose in frontend)
   * Get from: https://dashboard.emailjs.com/admin/account
   */
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "",

  /**
   * EmailJS Service ID (Gmail/Outlook/etc)
   * Get from: https://dashboard.emailjs.com/admin
   */
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "",

  /**
   * Template IDs for different email types
   * Note: manualReply uses mailto: link (no template needed for free tier)
   */
  templates: Object.freeze({
    notification: import.meta.env.VITE_EMAILJS_TEMPLATE_NOTIFICATION || "",
    autoReply: import.meta.env.VITE_EMAILJS_TEMPLATE_AUTO_REPLY || "",
    manualReply: "", // Not used - manual replies use mailto: link
  }),

  /**
   * Admin email to receive notifications
   * Shared from base email configuration
   */
  adminEmail: baseEmailConfig.adminEmail,

  /**
   * Rate limiting configuration
   */
  rateLimit: Object.freeze({
    maxAttempts: 3,
    windowMs: 60000, // 1 minute
  }),
});

// ============================================================================
// VALIDATION
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate EmailJS configuration
 * @returns Validation result with errors and warnings
 */
export function validateEmailJSConfig(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Critical configuration
  if (!emailJSConfig.publicKey) {
    errors.push("VITE_EMAILJS_PUBLIC_KEY not configured");
  }

  if (!emailJSConfig.serviceId) {
    errors.push("VITE_EMAILJS_SERVICE_ID not configured");
  }

  if (!emailJSConfig.templates.notification) {
    errors.push("VITE_EMAILJS_TEMPLATE_NOTIFICATION not configured");
  }

  if (!emailJSConfig.templates.autoReply) {
    warnings.push("VITE_EMAILJS_TEMPLATE_AUTO_REPLY not configured (optional)");
  }

  // Manual reply doesn't need a template (uses mailto:)
  // No warning needed

  // Validate email format
  if (emailJSConfig.adminEmail && !isValidEmail(emailJSConfig.adminEmail)) {
    errors.push("VITE_ADMIN_EMAIL has invalid format");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Check if EmailJS is ready to use
 * @returns true if all required configuration is present
 */
export function isEmailJSConfigured(): boolean {
  return validateEmailJSConfig().valid;
}

/**
 * Get configuration status for debugging
 */
export function getConfigStatus(): {
  configured: boolean;
  publicKey: boolean;
  serviceId: boolean;
  templates: {
    notification: boolean;
    autoReply: boolean;
    manualReply: boolean;
  };
} {
  return {
    configured: isEmailJSConfigured(),
    publicKey: !!emailJSConfig.publicKey,
    serviceId: !!emailJSConfig.serviceId,
    templates: {
      notification: !!emailJSConfig.templates.notification,
      autoReply: !!emailJSConfig.templates.autoReply,
      manualReply: !!emailJSConfig.templates.manualReply,
    },
  };
}

// ============================================================================
// DEVELOPMENT WARNINGS
// ============================================================================

if (import.meta.env.DEV) {
  const validation = validateEmailJSConfig();

  if (!validation.valid) {
    console.group("⚠️ EmailJS Configuration Issues");
    console.warn(
      "EmailJS is not properly configured. Email functionality will not work."
    );

    if (validation.errors.length > 0) {
      console.error("❌ Errors (required):");
      validation.errors.forEach((error) => console.error(`  • ${error}`));
    }

    if (validation.warnings.length > 0) {
      console.warn("⚠️ Warnings (optional):");
      validation.warnings.forEach((warning) => console.warn(`  • ${warning}`));
    }

    console.info("📝 Setup instructions:");
    console.info("  1. Copy .env.example to .env");
    console.info(
      "  2. Get credentials from https://dashboard.emailjs.com/admin"
    );
    console.info("  3. Add the required environment variables to .env");
    console.info("  4. Restart the development server");
    console.groupEnd();
  } else {
    console.log("✅ EmailJS configured successfully");

    if (validation.warnings.length > 0) {
      console.group("⚠️ EmailJS Warnings");
      validation.warnings.forEach((warning) => console.warn(`  • ${warning}`));
      console.groupEnd();
    }
  }
}
