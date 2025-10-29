export interface Experience {
  year: string;
  title: string;
  company: string;
  description: string;
  icon: string;
  color: string;
}

export interface ImpactMetric {
  label: string;
  value: string;
}

export interface ProfileData {
  full_name: string | null;
  about_title: string | null;
  about_description: string | null;
  about_highlights: string[] | null;
  experiences: unknown;
  impact_metrics: unknown;
  philosophy_quote: string | null;
  philosophy_author: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  hero_subtitle: string | null;
  website_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
}
