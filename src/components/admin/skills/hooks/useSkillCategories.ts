import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { SkillCategory } from "../types";

// Type assertion for tables not yet in generated types
const db = supabase as any;

/**
 * Custom hook to fetch and manage skill categories
 */
export const useSkillCategories = () => {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await db
        .from("skill_categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setCategories(data as unknown as SkillCategory[]);
      setError(null);
    } catch (err) {
      console.error("Error loading skill categories:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    categories,
    loading,
    error,
    refetch: loadCategories,
  };
};
