/**
 * SEO Configuration
 *
 * Centralized SEO configuration with environment variable support
 *
 * @module config/seo
 */

export const SEO_CONFIG = {
  siteName: import.meta.env.VITE_SITE_NAME || "Your Portfolio",
  siteUrl: import.meta.env.VITE_SITE_URL || "https://codeprince.netlify.app",
  twitterHandle: import.meta.env.VITE_TWITTER_HANDLE || "@yourhandle",
  defaultAuthor: import.meta.env.VITE_DEFAULT_AUTHOR || "Your Name",
  defaultImage: import.meta.env.VITE_DEFAULT_OG_IMAGE || "/og-image.jpg",
  locale: "en_US",
  twitterCardType: "summary_large_image" as const,
  facebookAppId: import.meta.env.VITE_FACEBOOK_APP_ID || "",
} as const;

export type SEOConfig = typeof SEO_CONFIG;
