import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { SkillCategory } from "../types";

// Type assertion for tables not yet in generated types
const db = supabase as any;

/**
 * Result type for mutation operations
 */
type MutationResult<T = any> =
  | { data: T; error: null }
  | { data: null; error: Error };

type DeleteResult = { error: null } | { error: Error };

/**
 * Custom hook to fetch and manage skill categories
 *
 * @returns {Object} Hook state and methods
 * @returns {SkillCategory[]} categories - Array of skill categories
 * @returns {boolean} loading - Loading state
 * @returns {Error | null} error - Error state
 * @returns {Function} refetch - Manually refetch categories
 * @returns {Function} createCategory - Create a new category
 * @returns {Function} deleteCategory - Delete a category by ID
 *
 * @example
 * const { categories, loading, createCategory, deleteCategory } = useSkillCategories();
 *
 * // Create a new category
 * const result = await createCategory({
 *   name: 'frontend',
 *   label: 'Frontend Development',
 *   icon: 'Code',
 *   display_order: 1
 * });
 *
 * // Delete a category
 * const deleteResult = await deleteCategory(categoryId);
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

  const createCategory = useCallback(
    async (
      categoryData: Omit<SkillCategory, "id" | "created_at" | "updated_at">
    ): Promise<MutationResult<SkillCategory>> => {
      try {
        const { data, error } = await db
          .from("skill_categories")
          .insert([categoryData])
          .select()
          .single();

        if (error) throw error;
        await loadCategories();
        return { data, error: null };
      } catch (err) {
        console.error("Error creating category:", err);
        return { data: null, error: err as Error };
      }
    },
    [loadCategories]
  );

  const deleteCategory = useCallback(
    async (id: string): Promise<DeleteResult> => {
      try {
        const { error } = await db
          .from("skill_categories")
          .delete()
          .eq("id", id);

        if (error) throw error;
        await loadCategories();
        return { error: null };
      } catch (err) {
        console.error("Error deleting category:", err);
        return { error: err as Error };
      }
    },
    [loadCategories]
  );

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    categories,
    loading,
    error,
    refetch: loadCategories,
    createCategory,
    deleteCategory,
  };
};
