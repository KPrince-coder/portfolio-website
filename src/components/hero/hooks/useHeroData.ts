import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { HeroData } from "../types";

/**
 * Custom hook to fetch and manage hero section data
 * Handles loading state and error handling
 */
export const useHeroData = () => {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadHeroData = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "full_name, hero_title, hero_subtitle, hero_tagline, avatar_url, github_url, linkedin_url, email, website_url, twitter_url"
        )
        .single();

      if (error) throw error;
      setHeroData(data as HeroData);
      setError(null);
    } catch (err) {
      console.error("Error loading hero data:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHeroData();
  }, [loadHeroData]);

  return { heroData, loading, error, refetch: loadHeroData };
};
