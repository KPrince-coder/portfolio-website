import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Shared Profile Data Interface
 * Contains all fields from the profiles table
 */
export interface ProfileData {
  // Personal Information
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;

  // Hero Section
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_tagline: string | null;

  // About Section
  about_title: string | null;
  about_description: string | null;
  about_highlights: string[] | null;

  // Extended Profile Data
  experiences: unknown;
  impact_metrics: unknown;
  philosophy_quote: string | null;
  philosophy_author: string | null;

  // Social Links
  website_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  email: string | null;
  phone: string | null;

  // Resume
  resume_url: string | null;
  resume_file_name: string | null;
  resume_updated_at: string | null;
}

/**
 * Shared custom hook to fetch profile data
 * Can be used across Hero, About, and other components
 *
 * @param fields - Optional array of specific fields to fetch. If not provided, fetches all fields.
 * @returns Profile data, loading state, error, and refetch function
 */
export const useProfile = (fields?: (keyof ProfileData)[]) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);

      // If specific fields requested, use them; otherwise fetch all
      const selectFields = fields?.join(", ") || "*";

      const { data, error } = await supabase
        .from("profiles")
        .select(selectFields)
        .single();

      if (error) throw error;
      setProfile(data as ProfileData);
      setError(null);
    } catch (err) {
      console.error("Error loading profile:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [fields]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return { profile, loading, error, refetch: loadProfile };
};
