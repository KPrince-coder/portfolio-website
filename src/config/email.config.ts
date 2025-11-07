/**
 * Email Configuration
 *
 * Centralized email configuration from environment variables, profiles, and brand identity
 *
 * @module config/email
 */

import { supabase } from "@/integrations/supabase/client";

// ============================================================================
// EMAIL CONFIGURATION
// ============================================================================

export const emailConfig = {
  /**
   * Admin email to receive notifications
   */
  adminEmail: import.meta.env.VITE_ADMIN_EMAIL || "admin@example.com",

  /**
   * Company name for email templates (fallback)
   */
  companyName: import.meta.env.VITE_COMPANY_NAME || "Portfolio",

  /**
   * Company email for replies (fallback)
   */
  companyEmail: import.meta.env.VITE_COMPANY_EMAIL || "contact@example.com",

  /**
   * Admin panel URL (for notification links)
   */
  adminUrl: window.location.origin + "/admin",
} as const;

// ============================================================================
// DYNAMIC EMAIL CONFIG (FROM PROFILES AND BRAND IDENTITY)
// ============================================================================

/**
 * Get email configuration with profile and brand identity data
 */
export async function getEmailConfigWithBrand() {
  try {
    // Get profile data (for portfolio name and contact email)
    const { data: profile } = await supabase
      .from("profiles")
      .select("hero_title, email")
      .limit(1)
      .single();

    // Get brand identity (for logo and email branding)
    const { data: brandIdentity } = await supabase
      .from("brand_identity")
      .select("logo_text, email_footer_text")
      .eq("is_active", true)
      .single();

    return {
      ...emailConfig,
      companyName:
        brandIdentity?.logo_text ||
        profile?.hero_title ||
        emailConfig.companyName,
      companyEmail: profile?.email || emailConfig.companyEmail,
      footerText:
        brandIdentity?.email_footer_text || "Thank you for your interest",
    };
  } catch (error) {
    console.warn("Failed to fetch brand/profile data for email config:", error);
    return {
      ...emailConfig,
      footerText: "Thank you for your interest",
    };
  }
}

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
