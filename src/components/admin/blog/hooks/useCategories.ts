/**
 * Categories Hook
 *
 * Custom hook for managing blog categories with:
 * - CRUD operations
 * - Loading states
 * - Error handling
 * - Optimistic updates
 *
 * @module blog/hooks/useCategories
 */

import { useState, useEffect, useCallback } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/categoryService";
import type {
  BlogCategory,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../types";

// ============================================================================
// TYPES
// ============================================================================

export interface UseCategoriesReturn {
  // Data
  categories: BlogCategory[];

  // State
  loading: boolean;
  error: string | null;

  // Actions
  refetch: () => Promise<void>;
  createNewCategory: (data: CreateCategoryInput) => Promise<BlogCategory>;
  updateCategoryById: (
    id: string,
    data: Partial<CreateCategoryInput>
  ) => Promise<void>;
  deleteCategoryById: (id: string) => Promise<void>;
}

// ============================================================================
// HOOK
// ============================================================================

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // FETCH CATEGORIES
  // ============================================================================

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch categories";
      setError(errorMessage);
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================================================
  // INITIAL FETCH
  // ============================================================================

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ============================================================================
  // CREATE CATEGORY
  // ============================================================================

  const createNewCategory = useCallback(
    async (data: CreateCategoryInput): Promise<BlogCategory> => {
      try {
        setLoading(true);
        setError(null);

        const newCategory = await createCategory(data);

        // Optimistic update
        setCategories((prev) => [...prev, newCategory]);

        return newCategory;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create category";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ============================================================================
  // UPDATE CATEGORY
  // ============================================================================

  const updateCategoryById = useCallback(
    async (id: string, data: Partial<CreateCategoryInput>): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const updateData: UpdateCategoryInput = { id, ...data };
        await updateCategory(updateData);

        // Optimistic update
        setCategories((prev) =>
          prev.map((cat) => (cat.id === id ? { ...cat, ...data } : cat))
        );

        // Refetch to ensure consistency
        await fetchCategories();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update category";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchCategories]
  );

  // ============================================================================
  // DELETE CATEGORY
  // ============================================================================

  const deleteCategoryById = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      await deleteCategory(id);

      // Optimistic update
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete category";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Data
    categories,

    // State
    loading,
    error,

    // Actions
    refetch: fetchCategories,
    createNewCategory,
    updateCategoryById,
    deleteCategoryById,
  };
}
