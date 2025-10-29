import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ProjectCategory, ProjectCategoryFormData } from "../types";

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
 * Custom hook to fetch and manage project categories
 *
 * @returns {Object} Hook state and methods
 * @returns {ProjectCategory[]} categories - Array of project categories
 * @returns {boolean} loading - Loading state
 * @returns {Error | null} error - Error state
 * @returns {Function} refetch - Manually refetch categories
 * @returns {Function} createCategory - Create a new category
 * @returns {Function} updateCategory - Update an existing category
 * @returns {Function} deleteCategory - Delete a category by ID
 * @returns {Function} reorderCategories - Reorder categories
 *
 * @example
 * const { categories, loading, createCategory, deleteCategory } = useProjectCategories();
 *
 * // Create a new category
 * const result = await createCategory({
 *   name: 'web-apps',
 *   label: 'Web Applications',
 *   icon: 'Globe',
 *   color: 'text-secondary',
 *   display_order: 1,
 *   is_active: true
 * });
 *
 * // Delete a category
 * const deleteResult = await deleteCategory(categoryId);
 */
export const useProjectCategories = () => {
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await db
        .from("project_categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setCategories(data as unknown as ProjectCategory[]);
      setError(null);
    } catch (err) {
      console.error("Error loading project categories:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(
    async (
      categoryData: ProjectCategoryFormData
    ): Promise<MutationResult<ProjectCategory>> => {
      try {
        const { data, error } = await db
          .from("project_categories")
          .insert([categoryData])
          .select()
          .single();

        if (error) throw error;
        await loadCategories();
        return { data, error: null };
      } catch (err) {
        console.error("Error creating project category:", err);
        return { data: null, error: err as Error };
      }
    },
    [loadCategories]
  );

  const updateCategory = useCallback(
    async (
      id: string,
      categoryData: Partial<ProjectCategoryFormData>
    ): Promise<MutationResult<ProjectCategory>> => {
      try {
        const { data, error } = await db
          .from("project_categories")
          .update(categoryData)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        await loadCategories();
        return { data, error: null };
      } catch (err) {
        console.error("Error updating project category:", err);
        return { data: null, error: err as Error };
      }
    },
    [loadCategories]
  );

  const deleteCategory = useCallback(
    async (id: string): Promise<DeleteResult> => {
      try {
        const { error } = await db
          .from("project_categories")
          .delete()
          .eq("id", id);

        if (error) throw error;
        await loadCategories();
        return { error: null };
      } catch (err) {
        console.error("Error deleting project category:", err);
        return { error: err as Error };
      }
    },
    [loadCategories]
  );

  const reorderCategories = useCallback(
    async (reorderedCategories: ProjectCategory[]): Promise<DeleteResult> => {
      try {
        // Update display_order for each category
        const updates = reorderedCategories.map((category, index) =>
          db
            .from("project_categories")
            .update({ display_order: index })
            .eq("id", category.id)
        );

        const results = await Promise.all(updates);
        const errors = results.filter((r) => r.error);

        if (errors.length > 0) throw errors[0].error;

        await loadCategories();
        return { error: null };
      } catch (err) {
        console.error("Error reordering project categories:", err);
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
    updateCategory,
    deleteCategory,
    reorderCategories,
  };
};
