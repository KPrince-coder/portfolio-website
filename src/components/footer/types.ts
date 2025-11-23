/**
 * Footer Module Types
 *
 * Type definitions for footer components and settings
 *
 * @module footer/types
 */

// ============================================================================
// TYPE UNIONS
// ============================================================================

/**
 * Available footer layout options
 */
export type FooterLayout = "left" | "center" | "right" | "split";

/**
 * Available background style options
 */
export type FooterBackgroundStyle =
  | "subtle"
  | "solid"
  | "gradient"
  | "transparent";

/**
 * Individual footer link configuration
 */
export interface FooterLink {
  /** Display text for the link */
  label: string;
  /** URL destination (internal or external) */
  url: string;
  /** Whether the link is currently active/visible */
  is_active: boolean;
}

/**
 * Complete footer settings from database
 * Aligned with Supabase footer_settings table
 */
export interface FooterSettings {
  /** Unique identifier */
  id: string;
  /** Copyright text (e.g., "© 2024 Company Name. All rights reserved.") */
  copyright_text: string;
  /** Company or brand name */
  company_name: string;
  /** Optional tagline or slogan */
  tagline: string;
  /** Whether to display the tagline */
  show_tagline: boolean;
  /** Whether to display social media links */
  show_social_links: boolean;
  /** Array of footer navigation links */
  links: FooterLink[];
  /** Layout style */
  layout: FooterLayout;
  /** Whether to show back-to-top button */
  show_back_to_top: boolean;
  /** Background styling option */
  background_style: FooterBackgroundStyle;
  /** Whether these settings are active */
  is_active: boolean;
  /** ISO timestamp of creation */
  created_at: string;
  /** ISO timestamp of last update */
  updated_at: string;
}

/**
 * Footer settings form data (subset without metadata fields)
 * Used for creating/updating footer settings
 */
export interface FooterSettingsFormData {
  /** Copyright text */
  copyright_text: string;
  /** Company or brand name */
  company_name: string;
  /** Optional tagline or slogan */
  tagline: string;
  /** Whether to display the tagline */
  show_tagline: boolean;
  /** Whether to display social media links */
  show_social_links: boolean;
  /** Array of footer navigation links */
  links: FooterLink[];
  /** Layout style */
  layout: FooterLayout;
  /** Whether to show back-to-top button */
  show_back_to_top: boolean;
  /** Background styling option */
  background_style: FooterBackgroundStyle;
}

/**
 * Social media links configuration
 * All fields are optional to allow flexible social presence
 */
export interface SocialLinks {
  /** Email address for contact */
  email?: string;
  /** GitHub profile URL */
  githubUrl?: string;
  /** LinkedIn profile URL */
  linkedinUrl?: string;
  /** Twitter/X profile URL */
  twitterUrl?: string;
  /** Personal or company website URL */
  websiteUrl?: string;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

/**
 * Props for Footer component
 */
export interface FooterProps {
  /** Optional CSS class name */
  className?: string;
}

/**
 * Props for FooterLinks component
 */
export interface FooterLinksProps {
  /** Array of footer links to display */
  links: FooterLink[];
  /** Optional CSS class name */
  className?: string;
}

/**
 * Props for FooterSocialLinks component
 */
export interface FooterSocialLinksProps {
  /** Social media links configuration */
  socialLinks: SocialLinks;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Props for FooterCopyright component
 */
export interface FooterCopyrightProps {
  /** Copyright text to display */
  text: string;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Props for BackToTopButton component
 */
export interface BackToTopButtonProps {
  /** Optional CSS class name */
  className?: string;
  /** Scroll threshold in pixels before showing button */
  threshold?: number;
}
