/**
 * useContactData Hook
 *
 * Fetches contact information from the backend (profiles and contact_settings)
 * Follows modular architecture with centralized types, constants, and utilities
 */

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ContactData, ProfileData, ContactSettings } from "../types";
import { DEFAULT_CONTACT_DATA } from "../constants";
import { mergeContactData } from "../utils";

export function useContactData() {
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: profile, error: profileError } = await (supabase as any)
          .from("profiles")
          .select(
            "email, phone, website_url, github_url, linkedin_url, twitter_url"
          )
          .limit(1)
          .single();

        if (profileError) {
          console.warn("Profile fetch warning:", profileError);
        }

        const { data: settings, error: settingsError } = await (supabase as any)
          .from("contact_settings")
          .select(
            "title, title_highlight, description, response_time, expectations"
          )
          .eq("is_active", true)
          .single();

        if (settingsError) {
          console.warn("Settings fetch warning:", settingsError);
        }

        const mergedData = mergeContactData(
          profile as ProfileData | null,
          settings as ContactSettings | null
        );

        setContactData(mergedData);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        console.error("Failed to fetch contact data:", error);
        setError(error);
        setContactData(DEFAULT_CONTACT_DATA);
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, []);

  return { contactData, loading, error };
}
