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
  // Secondary account for manual replies (free tier workaround)
  readonly secondary?: {
    readonly publicKey: string;
    readonly serviceId: string;
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
   */
  templates: Object.freeze({
    notification: import.meta.env.VITE_EMAILJS_TEMPLATE_NOTIFICATION || "",
    autoReply: import.meta.env.VITE_EMAILJS_TEMPLATE_AUTO_REPLY || "",
    manualReply: import.meta.env.VITE_EMAILJS_TEMPLATE_MANUAL_REPLY || "",
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

  /**
   * Secondary EmailJS account (for manual replies)
   *
   * Free tier workaround: EmailJS free tier allows 200 emails/month and 2 templates.
   * By using a secondary account for manual replies, we can:
   * - Keep primary account for automated emails (notifications, auto-replies)
   * - Use secondary account exclusively for admin-initiated manual replies
   * - Effectively double our template limit and email capacity
   *
   * @see {@link https://www.emailjs.com/docs/user-guide/rate-limiting/}
   * @see FREE_TIER_SOLUTION.md for detailed setup instructions
   */
  secondary: import.meta.env.VITE_EMAILJS_SECONDARY_PUBLIC_KEY
    ? Object.freeze({
        publicKey: import.meta.env.VITE_EMAILJS_SECONDARY_PUBLIC_KEY || "",
        serviceId: import.meta.env.VITE_EMAILJS_SECONDARY_SERVICE_ID || "",
      })
    : undefined,
});

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Default sender/company name for emails
 */
export const EMAIL_DEFAULTS = Object.freeze({
  senderName: "CodePrince",
  companyName: "CodePrince",
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

  // Manual reply template
  if (!emailJSConfig.templates.manualReply) {
    warnings.push(
      "VITE_EMAILJS_TEMPLATE_MANUAL_REPLY not configured (optional)"
    );
  }

  // Secondary account validation
  if (emailJSConfig.secondary) {
    if (!emailJSConfig.secondary.publicKey) {
      warnings.push(
        "Secondary account configured but VITE_EMAILJS_SECONDARY_PUBLIC_KEY is missing"
      );
    }
    if (!emailJSConfig.secondary.serviceId) {
      warnings.push(
        "Secondary account configured but VITE_EMAILJS_SECONDARY_SERVICE_ID is missing"
      );
    }
  }

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
  secondary: {
    configured: boolean;
    publicKey: boolean;
    serviceId: boolean;
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
    secondary: {
      configured: hasSecondaryAccount(),
      publicKey: !!emailJSConfig.secondary?.publicKey,
      serviceId: !!emailJSConfig.secondary?.serviceId,
    },
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if secondary account is configured
 */
export function hasSecondaryAccount(): boolean {
  return !!(
    emailJSConfig.secondary?.publicKey && emailJSConfig.secondary?.serviceId
  );
}

/**
 * Get account configuration for specific use case
 *
 * @param useCase - The type of email being sent
 * @returns Account configuration with publicKey, serviceId, and templateId
 *
 * @example
 * ```typescript
 * const config = getAccountForUseCase('manualReply');
 * emailjs.init(config.publicKey);
 * emailjs.send(config.serviceId, config.templateId, params);
 * ```
 */
export function getAccountForUseCase(
  useCase: "notification" | "autoReply" | "manualReply"
): {
  publicKey: string;
  serviceId: string;
  templateId: string;
  isSecondary: boolean;
} {
  // Use secondary account for manual replies if configured
  if (useCase === "manualReply" && hasSecondaryAccount()) {
    return {
      publicKey: emailJSConfig.secondary!.publicKey,
      serviceId: emailJSConfig.secondary!.serviceId,
      templateId: emailJSConfig.templates.manualReply,
      isSecondary: true,
    };
  }

  // Use primary account for all other cases
  return {
    publicKey: emailJSConfig.publicKey,
    serviceId: emailJSConfig.serviceId,
    templateId: emailJSConfig.templates[useCase],
    isSecondary: false,
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

    if (hasSecondaryAccount()) {
      console.log("✅ Secondary account configured for manual replies");
    }

    if (validation.warnings.length > 0) {
      console.group("⚠️ EmailJS Warnings");
      validation.warnings.forEach((warning) => console.warn(`  • ${warning}`));
      console.groupEnd();
    }
  }
}
