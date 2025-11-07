/**
 * useFooterSettings Hook
 *
 * Manages footer settings data and operations
 */

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { FooterSettings, FooterLink } from "../types";
import { parseFooterLinks } from "../utils";

interface UseFooterSettingsReturn {
  settings: FooterSettings | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (updates: Partial<FooterSettings>) => void;
  saveSettings: () => Promise<void>;
  addLink: () => void;
  removeLink: (index: number) => void;
  updateLink: (
    index: number,
    field: keyof FooterLink,
    value: string | boolean
  ) => void;
}

export function useFooterSettings(): UseFooterSettingsReturn {
  const [settings, setSettings] = useState<FooterSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("footer_settings")
        .select("*")
        .eq("is_active", true)
        .single();

      if (fetchError) throw fetchError;

      // Parse links from JSON
      const parsedSettings: FooterSettings = {
        ...data,
        links: parseFooterLinks(data.links),
      };

      setSettings(parsedSettings);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load settings";
      setError(errorMessage);
      console.error("Failed to fetch footer settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = useCallback((updates: Partial<FooterSettings>) => {
    setSettings((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const saveSettings = useCallback(async () => {
    if (!settings) throw new Error("No settings to save");

    try {
      setSaving(true);
      setError(null);

      const { error: saveError } = await supabase
        .from("footer_settings")
        .update({
          copyright_text: settings.copyright_text,
          company_name: settings.company_name,
          tagline: settings.tagline,
          show_tagline: settings.show_tagline,
          show_social_links: settings.show_social_links,
          links: JSON.stringify(settings.links),
          layout: settings.layout,
          show_back_to_top: settings.show_back_to_top,
          background_style: settings.background_style,
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

  const addLink = useCallback(() => {
    if (!settings) return;
    updateSettings({
      links: [
        ...settings.links,
        { label: "New Link", url: "#", is_active: true },
      ],
    });
  }, [settings, updateSettings]);

  const removeLink = useCallback(
    (index: number) => {
      if (!settings) return;
      updateSettings({
        links: settings.links.filter((_, i) => i !== index),
      });
    },
    [settings, updateSettings]
  );

  const updateLink = useCallback(
    (index: number, field: keyof FooterLink, value: string | boolean) => {
      if (!settings) return;
      const newLinks = [...settings.links];
      newLinks[index] = { ...newLinks[index], [field]: value };
      updateSettings({ links: newLinks });
    },
    [settings, updateSettings]
  );

  return {
    settings,
    loading,
    saving,
    error,
    fetchSettings,
    updateSettings,
    saveSettings,
    addLink,
    removeLink,
    updateLink,
  };
}
