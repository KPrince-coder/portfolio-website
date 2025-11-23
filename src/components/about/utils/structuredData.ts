import type { ProfileData } from "../types";

/**
 * Generate structured data (JSON-LD) for SEO
 * Follows schema.org Person specification
 */
export const generateStructuredData = (
  profile: ProfileData | null,
  fullName: string,
  bio: string | null,
  aboutDescription: string,
  avatarUrl: string | null,
  location: string | null
) => {
  if (!profile) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: fullName,
    description: bio || aboutDescription,
    image: avatarUrl,
    jobTitle: profile.hero_subtitle || "Data & AI Engineer",
    address: location
      ? {
          "@type": "PostalAddress",
          addressLocality: location,
        }
      : undefined,
    url: profile.website_url,
    sameAs: [
      profile.github_url,
      profile.linkedin_url,
      profile.twitter_url,
    ].filter(Boolean),
  };
};
