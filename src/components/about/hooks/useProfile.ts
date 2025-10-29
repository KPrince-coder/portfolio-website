import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ProfileData } from "../types";

/**
 * Custom hook to fetch and manage profile data
 * Handles loading state and error handling
 */
export const useProfile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      // Get the first/primary profile (for single-user portfolio)
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "full_name, about_title, about_description, about_highlights, experiences, impact_metrics, philosophy_quote, philosophy_author, avatar_url, bio, location, hero_subtitle, website_url, github_url, linkedin_url, twitter_url"
        )
        .order("created_at", { ascending: true })
        .limit(1);

      if (error) throw error;

      const profileData = data?.[0];
      if (profileData) {
        setProfile(profileData as ProfileData);
      }
      setError(null);
    } catch (err) {
      console.error("Error loading profile:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return { profile, loading, error, refetch: loadProfile };
};
