/**
 * useSocialLinks Hook
 *
 * Fetches social media links from profiles table
 */

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { SocialLinks } from "../types";

export function useSocialLinks() {
  const [socialLinks, setSocialLinks] = useState<SocialLinks | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("profiles")
          .select("email, github_url, linkedin_url, twitter_url, website_url")
          .limit(1)
          .single();

        if (error) {
          console.warn("Failed to fetch social links:", error);
          setSocialLinks(null);
          return;
        }

        setSocialLinks({
          email: data.email,
          githubUrl: data.github_url,
          linkedinUrl: data.linkedin_url,
          twitterUrl: data.twitter_url,
          websiteUrl: data.website_url,
        });
      } catch (err) {
        console.error("Error fetching social links:", err);
        setSocialLinks(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  return { socialLinks, loading };
}
