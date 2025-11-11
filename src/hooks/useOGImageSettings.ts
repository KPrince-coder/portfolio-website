/**
 * useOGImageSettings Hook
 *
 * Manages OG image settings data and operations
 */

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { OGImageSettings } from "@/types/og-image";

interface UseOGImageSettingsReturn {
  settings: OGImageSettings | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (updates: Partial<OGImageSettings>) => void;
  saveSettings: () => Promise<void>;
  getOGImageUrl: (title?: string, subtitle?: string) => string;
}

export function useOGImageSettings(): UseOGImageSettingsReturn {
  const [settings, setSettings] = useState<OGImageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await (supabase as any)
        .from("og_image_settings")
        .select("*")
        .eq("is_active", true)
        .single();

      if (fetchError) throw fetchError;
      setSettings(data as OGImageSettings);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load OG image settings";
      setError(errorMessage);
      console.error("Failed to fetch OG image settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = useCallback((updates: Partial<OGImageSettings>) => {
    setSettings((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const saveSettings = useCallback(async () => {
    if (!settings) throw new Error("No settings to save");

    try {
      setSaving(true);
      setError(null);

      const { error: saveError } = await (supabase as any)
        .from("og_image_settings")
        .update({
          template_name: settings.template_name,
          title: settings.title,
          subtitle: settings.subtitle,
          tagline: settings.tagline,
          show_logo: settings.show_logo,
          logo_text: settings.logo_text,
          background_color: settings.background_color,
          background_gradient_start: settings.background_gradient_start,
          background_gradient_end: settings.background_gradient_end,
          title_color: settings.title_color,
          subtitle_color: settings.subtitle_color,
          accent_color: settings.accent_color,
          layout: settings.layout,
          title_font_size: settings.title_font_size,
          subtitle_font_size: settings.subtitle_font_size,
          show_pattern: settings.show_pattern,
          pattern_type: settings.pattern_type,
          updated_at: new Date().toISOString(),
        })
        .eq("id", settings.id);

      if (saveError) throw saveError;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save settings";
      setError(errorMessage);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [settings]);

  const getOGImageUrl = useCallback(
    (title?: string, subtitle?: string): string => {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const baseUrl = `${supabaseUrl}/functions/v1/og-image`;

      const params = new URLSearchParams();
      if (title) params.append("title", title);
      if (subtitle) params.append("subtitle", subtitle);

      return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
    },
    []
  );

  return {
    settings,
    loading,
    saving,
    error,
    fetchSettings,
    updateSettings,
    saveSettings,
    getOGImageUrl,
  };
}
