import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { type Profile } from "../types";

/**
 * Custom error class for profile loading errors
 */
export class ProfileLoadError extends Error {
  constructor(message: string, public code?: string, public details?: unknown) {
    super(message);
    this.name = "ProfileLoadError";
  }
}

// Global cache for profile data
const profileCache = new Map<
  string,
  {
    data: Profile | null;
    timestamp: number;
  }
>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Custom hook to fetch and manage profile data from Supabase
 *
 * Features:
 * - Type-safe with centralized Profile type
 * - Request caching to reduce API calls
 * - Request cancellation on unmount
 * - Selective field fetching for performance
 *
 * @param fields - Optional array of specific fields to fetch. Fetches all fields if not provided.
 * @param enableCache - Enable request caching (default: true)
 *
 * @returns Object containing:
 * - profile: The profile data or null
 * - loading: Loading state boolean
 * - error: ProfileLoadError if request failed
 * - refetch: Function to manually refetch the profile
 *
 * @example
 * ```tsx
 * // Fetch all fields
 * const { profile, loading, error } = useProfile();
 *
 * // Fetch specific fields only
 * const { profile } = useProfile(['full_name', 'bio', 'avatar_url']);
 *
 * // Disable caching
 * const { profile, refetch } = useProfile(undefined, false);
 * ```
 */
export const useProfile = (fields?: (keyof Profile)[], enableCache = true) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ProfileLoadError | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Memoize fields key to prevent unnecessary re-fetches
  const fieldsKey = fields?.join(",");

  const loadProfile = useCallback(async () => {
    // Cancel previous request if still pending
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      const selectFields = fieldsKey?.split(",").join(", ") || "*";
      const cacheKey = selectFields;

      // Check cache first
      if (enableCache) {
        const cached = profileCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          setProfile(cached.data);
          setError(null);
          setLoading(false);
          return;
        }
      }

      const response = await supabase
        .from("profiles")
        .select(selectFields)
        .abortSignal(abortControllerRef.current.signal)
        .single();

      if (response.error) {
        throw new ProfileLoadError(
          "Failed to load profile",
          response.error.code,
          response.error
        );
      }

      // Type assertion needed due to Supabase's dynamic select with string fields
      const profileData = response.data as unknown as Profile;
      setProfile(profileData);
      setError(null);

      // Update cache
      if (enableCache) {
        profileCache.set(cacheKey, {
          data: profileData,
          timestamp: Date.now(),
        });
      }
    } catch (err) {
      // Don't set error for aborted requests
      if (err instanceof Error && err.name !== "AbortError") {
        const profileError =
          err instanceof ProfileLoadError
            ? err
            : new ProfileLoadError("Failed to load profile", undefined, err);

        console.error("Error loading profile:", profileError);
        setError(profileError);
      }
    } finally {
      setLoading(false);
    }
  }, [fieldsKey, enableCache]);

  useEffect(() => {
    loadProfile();

    // Cleanup: abort pending request on unmount
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [loadProfile]);

  return { profile, loading, error, refetch: loadProfile };
};

/**
 * Clear the profile cache
 * Useful when you want to force a fresh fetch
 */
export const clearProfileCache = () => {
  profileCache.clear();
};
