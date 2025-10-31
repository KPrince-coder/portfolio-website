/**
 * Tags Hook
 *
 * Custom hook for managing blog tags with:
 * - CRUD operations
 * - Search functionality
 * - Loading states
 * - Error handling
 * - Optimistic updates
 *
 * @module blog/hooks/useTags
 */

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  getTags,
  getPopularTags,
  createTag,
  updateTag,
  deleteTag,
  searchTags,
} from "@/services/tagService";
import type { BlogTag, CreateTagInput, UpdateTagInput } from "../types";

// ============================================================================
// TYPES
// ============================================================================

export interface UseTagsReturn {
  // Data
  tags: BlogTag[];
  popularTags: BlogTag[];

  // State
  loading: boolean;
  error: string | null;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Actions
  refetch: () => Promise<void>;
  createNewTag: (data: CreateTagInput) => Promise<BlogTag>;
  updateTagById: (id: string, data: Partial<CreateTagInput>) => Promise<void>;
  deleteTagById: (id: string) => Promise<void>;
}

// ============================================================================
// HOOK
// ============================================================================

export function useTags(): UseTagsReturn {
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [popularTags, setPopularTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // ============================================================================
  // FETCH TAGS
  // ============================================================================

  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (debouncedSearchQuery) {
        const searchResults = await searchTags(debouncedSearchQuery);
        setTags(searchResults);
      } else {
        const data = await getTags();
        setTags(data);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch tags";
      setError(errorMessage);
      console.error("Failed to fetch tags:", err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchQuery]);

  // ============================================================================
  // FETCH POPULAR TAGS
  // ============================================================================

  const fetchPopularTags = useCallback(async () => {
    try {
      const data = await getPopularTags(10);
      setPopularTags(data);
    } catch (err) {
      console.error("Failed to fetch popular tags:", err);
    }
  }, []);

  // ============================================================================
  // INITIAL FETCH
  // ============================================================================

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  useEffect(() => {
    fetchPopularTags();
  }, [fetchPopularTags]);

  // ============================================================================
  // CREATE TAG
  // ============================================================================

  const createNewTag = useCallback(
    async (data: CreateTagInput): Promise<BlogTag> => {
      try {
        setLoading(true);
        setError(null);

        const newTag = await createTag(data);

        // Optimistic update
        setTags((prev) => [...prev, newTag]);

        return newTag;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create tag";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ============================================================================
  // UPDATE TAG
  // ============================================================================

  const updateTagById = useCallback(
    async (id: string, data: Partial<CreateTagInput>): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const updateData: UpdateTagInput = { id, ...data };
        await updateTag(updateData);

        // Optimistic update
        setTags((prev) =>
          prev.map((tag) => (tag.id === id ? { ...tag, ...data } : tag))
        );

        // Refetch to ensure consistency
        await fetchTags();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update tag";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchTags]
  );

  // ============================================================================
  // DELETE TAG
  // ============================================================================

  const deleteTagById = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      await deleteTag(id);

      // Optimistic update
      setTags((prev) => prev.filter((tag) => tag.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete tag";
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
    tags,
    popularTags,

    // State
    loading,
    error,

    // Search
    searchQuery,
    setSearchQuery,

    // Actions
    refetch: fetchTags,
    createNewTag,
    updateTagById,
    deleteTagById,
  };
}
