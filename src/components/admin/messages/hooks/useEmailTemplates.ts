/**
 * useEmailTemplates Hook
 *
 * Manages email templates for automated responses
 *
 * @module messages/hooks/useEmailTemplates
 */

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type {
  EmailTemplate,
  EmailTemplateFormData,
  EmailTemplateType,
} from "../types";

// ============================================================================
// TYPES
// ============================================================================

interface UseEmailTemplatesOptions {
  autoLoad?: boolean;
  templateType?: EmailTemplateType;
}

interface UseEmailTemplatesReturn {
  // Data
  templates: EmailTemplate[];
  activeTemplates: EmailTemplate[];

  // State
  loading: boolean;
  error: string | null;

  // Actions
  loadTemplates: () => Promise<void>;
  getTemplateById: (id: string) => EmailTemplate | undefined;
  getTemplateByType: (type: EmailTemplateType) => EmailTemplate | undefined;
  createTemplate: (data: EmailTemplateFormData) => Promise<EmailTemplate>;
  updateTemplate: (
    id: string,
    data: Partial<EmailTemplateFormData>
  ) => Promise<EmailTemplate>;
  deleteTemplate: (id: string) => Promise<void>;
  toggleTemplateActive: (id: string) => Promise<void>;

  // Template Processing
  renderTemplate: (
    template: EmailTemplate,
    variables: Record<string, any>
  ) => string;
  getAvailableVariables: (type: EmailTemplateType) => string[];
}

// ============================================================================
// CONSTANTS
// ============================================================================

const TEMPLATE_VARIABLES: Record<EmailTemplateType, string[]> = {
  new_message_notification: [
    "{{sender_name}}",
    "{{sender_email}}",
    "{{subject}}",
    "{{message}}",
    "{{created_at}}",
    "{{admin_url}}",
    "{{message_id}}",
  ],
  reply_to_sender: [
    "{{sender_name}}",
    "{{reply_content}}",
    "{{original_message}}",
    "{{original_subject}}",
    "{{admin_name}}",
  ],
  auto_reply: [
    "{{sender_name}}",
    "{{subject}}",
    "{{admin_name}}",
    "{{company_name}}",
  ],
};

// ============================================================================
// HOOK
// ============================================================================

export function useEmailTemplates(
  options: UseEmailTemplatesOptions = {}
): UseEmailTemplatesReturn {
  const { autoLoad = true, templateType } = options;

  // ============================================================================
  // STATE
  // ============================================================================

  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // DERIVED STATE
  // ============================================================================

  const activeTemplates = templates.filter((t) => t.is_active);

  // ============================================================================
  // LOAD TEMPLATES
  // ============================================================================

  const loadTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("email_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (templateType) {
        query = query.eq("template_type", templateType);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setTemplates(data || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load templates";
      setError(errorMessage);
      console.error("Load templates error:", err);
    } finally {
      setLoading(false);
    }
  }, [templateType]);

  // ============================================================================
  // AUTO LOAD
  // ============================================================================

  useEffect(() => {
    if (autoLoad) {
      loadTemplates();
    }
  }, [autoLoad, loadTemplates]);

  // ============================================================================
  // GET TEMPLATE
  // ============================================================================

  const getTemplateById = useCallback(
    (id: string) => {
      return templates.find((t) => t.id === id);
    },
    [templates]
  );

  const getTemplateByType = useCallback(
    (type: EmailTemplateType) => {
      return templates.find((t) => t.template_type === type && t.is_active);
    },
    [templates]
  );

  // ============================================================================
  // CREATE TEMPLATE
  // ============================================================================

  const createTemplate = useCallback(
    async (data: EmailTemplateFormData): Promise<EmailTemplate> => {
      try {
        const { data: template, error: createError } = await supabase
          .from("email_templates")
          .insert(data)
          .select()
          .single();

        if (createError) throw createError;

        setTemplates((prev) => [template, ...prev]);
        return template;
      } catch (err) {
        console.error("Create template error:", err);
        throw err;
      }
    },
    []
  );

  // ============================================================================
  // UPDATE TEMPLATE
  // ============================================================================

  const updateTemplate = useCallback(
    async (
      id: string,
      data: Partial<EmailTemplateFormData>
    ): Promise<EmailTemplate> => {
      try {
        const { data: template, error: updateError } = await supabase
          .from("email_templates")
          .update(data)
          .eq("id", id)
          .select()
          .single();

        if (updateError) throw updateError;

        setTemplates((prev) => prev.map((t) => (t.id === id ? template : t)));
        return template;
      } catch (err) {
        console.error("Update template error:", err);
        throw err;
      }
    },
    []
  );

  // ============================================================================
  // DELETE TEMPLATE
  // ============================================================================

  const deleteTemplate = useCallback(async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("email_templates")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Delete template error:", err);
      throw err;
    }
  }, []);

  // ============================================================================
  // TOGGLE ACTIVE
  // ============================================================================

  const toggleTemplateActive = useCallback(
    async (id: string) => {
      try {
        const template = templates.find((t) => t.id === id);
        if (!template) throw new Error("Template not found");

        await updateTemplate(id, { is_active: !template.is_active });
      } catch (err) {
        console.error("Toggle template active error:", err);
        throw err;
      }
    },
    [templates, updateTemplate]
  );

  // ============================================================================
  // RENDER TEMPLATE
  // ============================================================================

  const renderTemplate = useCallback(
    (template: EmailTemplate, variables: Record<string, any>): string => {
      let rendered = template.html_content;

      // Replace all variables
      Object.entries(variables).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        rendered = rendered.replace(
          new RegExp(placeholder, "g"),
          String(value)
        );
      });

      return rendered;
    },
    []
  );

  // ============================================================================
  // GET AVAILABLE VARIABLES
  // ============================================================================

  const getAvailableVariables = useCallback(
    (type: EmailTemplateType): string[] => {
      return TEMPLATE_VARIABLES[type] || [];
    },
    []
  );

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Data
    templates,
    activeTemplates,

    // State
    loading,
    error,

    // Actions
    loadTemplates,
    getTemplateById,
    getTemplateByType,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    toggleTemplateActive,

    // Template Processing
    renderTemplate,
    getAvailableVariables,
  };
}
