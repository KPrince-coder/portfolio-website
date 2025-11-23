/**
 * Brand Identity Hook
 *
 * Manages portfolio branding (logo, colors, SEO)
 * Note: Contact info and social links are managed in profiles
 */

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// ============================================================================
// TYPES
// ============================================================================

export interface BrandIdentity {
  id: string;
  logo_text: string;
  logo_icon: string;
  logo_icon_color: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  favicon_url?: string;
  email_header_color: string;
  email_footer_text: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BrandIdentityFormData {
  logo_text: string;
  logo_icon: string;
  logo_icon_color: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  favicon_url?: string;
  email_header_color: string;
  email_footer_text: string;
}

// ============================================================================
// HOOK
// ============================================================================

export function useBrandIdentity() {
  const { toast } = useToast();
  const [brandIdentity, setBrandIdentity] = useState<BrandIdentity | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // FETCH ACTIVE BRAND IDENTITY
  // ============================================================================

  const fetchBrandIdentity = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("brand_identity")
        .select("*")
        .eq("is_active", true)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No active brand identity found, create default
          await createDefaultBrandIdentity();
          return;
        }
        throw error;
      }

      setBrandIdentity(data);
    } catch (err) {
      console.error("Fetch brand identity error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch brand identity"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================================================
  // CREATE DEFAULT BRAND IDENTITY
  // ============================================================================

  const createDefaultBrandIdentity = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("brand_identity")
        .insert({
          logo_text: "DataFlow",
          logo_icon: "Brain",
          logo_icon_color: "#667eea",
          primary_color: "#667eea",
          secondary_color: "#764ba2",
          accent_color: "#10b981",
          email_header_color: "#667eea",
          email_footer_text: "Thank you for your interest",
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      setBrandIdentity(data);
    } catch (err) {
      console.error("Create default brand identity error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create default brand identity"
      );
    }
  }, []);

  // ============================================================================
  // UPDATE BRAND IDENTITY
  // ============================================================================

  const updateBrandIdentity = useCallback(
    async (data: Partial<BrandIdentityFormData>) => {
      if (!brandIdentity) {
        throw new Error("No brand identity to update");
      }

      try {
        const { data: updatedData, error } = await supabase
          .from("brand_identity")
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq("id", brandIdentity.id)
          .select()
          .single();

        if (error) throw error;

        setBrandIdentity(updatedData);

        toast({
          title: "Brand identity updated",
          description: "Your brand settings have been saved successfully.",
        });

        return updatedData;
      } catch (err) {
        console.error("Update brand identity error:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to update brand identity";

        toast({
          variant: "destructive",
          title: "Update failed",
          description: errorMessage,
        });

        throw err;
      }
    },
    [brandIdentity, toast]
  );

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    fetchBrandIdentity();
  }, [fetchBrandIdentity]);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    brandIdentity,
    loading,
    error,
    updateBrandIdentity,
    refetch: fetchBrandIdentity,
  };
}

// ============================================================================
// CONVENIENCE HOOK FOR PUBLIC USE
// ============================================================================

/**
 * Hook for public access to brand identity (no update capabilities)
 */
export function usePublicBrandIdentity() {
  const [brandIdentity, setBrandIdentity] = useState<BrandIdentity | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicBrandIdentity = async () => {
      try {
        const { data, error } = await supabase
          .from("brand_identity")
          .select("*")
          .eq("is_active", true)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Fetch public brand identity error:", error);
        }

        setBrandIdentity(data || null);
      } catch (err) {
        console.error("Fetch public brand identity error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicBrandIdentity();
  }, []);

  return {
    brandIdentity,
    loading,
  };
}
