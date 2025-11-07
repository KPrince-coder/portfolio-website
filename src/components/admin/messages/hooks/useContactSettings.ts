/**
 * useContactSettings Hook
 *
 * Manages contact page settings (title, description, response time, expectations)
 *
 * @module messages/hooks/useContactSettings
 */

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ContactSettings, ExpectationItem } from "../types";
import { DEFAULT_EXPECTATION } from "../constants";

// ============================================================================
// TYPES
// ============================================================================

interface UseContactSettingsReturn {
  // Data
  settings: ContactSettings | null;

  // State
  loading: boolean;
  saving: boolean;
  error: string | null;

  // Actions
  fetchSettings: () => Promise<void>;
  updateSettings: (updates: Partial<ContactSettings>) => void;
  saveSettings: () => Promise<void>;
  addExpectation: () => void;
  removeExpectation: (index: number) => void;
  updateExpectation: (
    index: number,
    field: keyof ExpectationItem,
    value: string
  ) => void;
}

// ============================================================================
// HOOK
// ============================================================================

export function useContactSettings(): UseContactSettingsReturn {
  // ============================================================================
  // STATE
  // ============================================================================

  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // FETCH SETTINGS
  // ============================================================================

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("contact_settings")
        .select("*")
        .eq("is_active", true)
        .single();

      if (fetchError) throw fetchError;

      setSettings(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load settings";
      setError(errorMessage);
      console.error("Failed to fetch contact settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================================================
  // AUTO LOAD
  // ============================================================================

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // ============================================================================
  // UPDATE SETTINGS
  // ============================================================================

  const updateSettings = useCallback(
    (updates: Partial<ContactSettings>) => {
      if (!settings) return;
      setSettings({ ...settings, ...updates });
    },
    [settings]
  );

  // ============================================================================
  // SAVE SETTINGS
  // ============================================================================

  const saveSettings = useCallback(async () => {
    if (!settings) {
      throw new Error("No settings to save");
    }

    try {
      setSaving(true);
      setError(null);

      const { error: saveError } = await supabase
        .from("contact_settings")
        .update({
          title: settings.title,
          description: settings.description,
          messages_title: settings.messages_title,
          response_time: settings.response_time,
          expectations: settings.expectations,
          updated_at: new Date().toISOString(),
        })
        .eq("id", settings.id);

      if (saveError) throw saveError;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save settings";
      setError(errorMessage);
      console.error("Failed to save settings:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [settings]);

  // ============================================================================
  // EXPECTATIONS MANAGEMENT
  // ============================================================================

  const addExpectation = useCallback(() => {
    if (!settings) return;
    setSettings({
      ...settings,
      expectations: [...settings.expectations, { ...DEFAULT_EXPECTATION }],
    });
  }, [settings]);

  const removeExpectation = useCallback(
    (index: number) => {
      if (!settings) return;
      setSettings({
        ...settings,
        expectations: settings.expectations.filter((_, i) => i !== index),
      });
    },
    [settings]
  );

  const updateExpectation = useCallback(
    (index: number, field: keyof ExpectationItem, value: string) => {
      if (!settings) return;
      const newExpectations = [...settings.expectations];
      newExpectations[index] = { ...newExpectations[index], [field]: value };
      setSettings({ ...settings, expectations: newExpectations });
    },
    [settings]
  );

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Data
    settings,

    // State
    loading,
    saving,
    error,

    // Actions
    fetchSettings,
    updateSettings,
    saveSettings,
    addExpectation,
    removeExpectation,
    updateExpectation,
  };
}
