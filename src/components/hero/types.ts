// ============================================================================
// Data Interfaces (from Supabase)
// ============================================================================

/**
 * Hero section data from profiles table
 * Matches the database schema with snake_case naming
 */
export interface HeroData {
  full_name: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_tagline: string | null;
  avatar_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  email: string | null;
  website_url: string | null;
  twitter_url: string | null;
}

// ============================================================================
// Component Props Interfaces
// ============================================================================

/**
 * SocialLinks Component Props
 *
 * Displays social media and contact links as icon buttons.
 * All props are optional - only links with values will be displayed.
 *
 * @example
 * ```tsx
 * <SocialLinks
 *   githubUrl="https://github.com/username"
 *   linkedinUrl="https://linkedin.com/in/username"
 *   email="user@example.com"
 * />
 * ```
 */
export interface SocialLinksProps {
  /** GitHub profile URL */
  githubUrl?: string | null;
  /** LinkedIn profile URL */
  linkedinUrl?: string | null;
  /** Email address (will be converted to mailto: link) */
  email?: string | null;
  /** Personal website URL */
  websiteUrl?: string | null;
  /** Twitter/X profile URL */
  twitterUrl?: string | null;
}
