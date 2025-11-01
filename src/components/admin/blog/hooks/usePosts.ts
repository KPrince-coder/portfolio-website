/**
 * Posts Hook
 *
 * Custom hook for managing blog posts with:
 * - Data fetching with filters
 * - Pagination
 * - Search
 * - Loading states
 * - Error handling
 * - Optimistic updates
 * - Bulk operations
 *
 * @module blog/hooks/usePosts
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  getPosts,
  deletePost,
  publishPost,
  unpublishPost,
  archivePost,
} from "@/services/blogService";
import type {
  BlogPostWithRelations,
  BlogPostFilters,
  BlogPostSortOptions,
  PaginationOptions,
  PaginatedResponse,
  BlogPostStatus,
} from "../types";

// ============================================================================
// TYPES
// ============================================================================

export interface UsePostsOptions {
  initialFilters?: BlogPostFilters;
  initialSort?: BlogPostSortOptions;
  initialPagination?: PaginationOptions;
  autoFetch?: boolean;
}

export interface UsePostsReturn {
  // Data
  posts: BlogPostWithRelations[];
  pagination: PaginatedResponse<BlogPostWithRelations>["pagination"] | null;

  // State
  loading: boolean;
  error: string | null;

  // Filters
  filters: BlogPostFilters;
  setFilters: (filters: BlogPostFilters) => void;
  updateFilter: <K extends keyof BlogPostFilters>(
    key: K,
    value: BlogPostFilters[K]
  ) => void;
  clearFilters: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Sort
  sort: BlogPostSortOptions;
  setSort: (sort: BlogPostSortOptions) => void;

  // Pagination
  currentPage: number;
  setCurrentPage: (page: number) => void;
  perPage: number;
  setPerPage: (perPage: number) => void;

  // Actions
  refetch: () => Promise<void>;
  deletePostById: (postId: string) => Promise<void>;
  publishPostById: (postId: string) => Promise<void>;
  unpublishPostById: (postId: string) => Promise<void>;
  archivePostById: (postId: string) => Promise<void>;

  // Bulk actions
  selectedPosts: string[];
  setSelectedPosts: (postIds: string[]) => void;
  togglePostSelection: (postId: string) => void;
  selectAllPosts: () => void;
  clearSelection: () => void;
  bulkDelete: () => Promise<void>;
  bulkPublish: () => Promise<void>;
  bulkArchive: () => Promise<void>;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_FILTERS: BlogPostFilters = {};
const DEFAULT_SORT: BlogPostSortOptions = {
  field: "created_at",
  direction: "desc",
};
const DEFAULT_PAGINATION: PaginationOptions = {
  page: 1,
  per_page: 10,
};

// ============================================================================
// HOOK
// ============================================================================

export function usePosts(options: UsePostsOptions = {}): UsePostsReturn {
  const {
    initialFilters = DEFAULT_FILTERS,
    initialSort = DEFAULT_SORT,
    initialPagination = DEFAULT_PAGINATION,
    autoFetch = true,
  } = options;

  // ============================================================================
  // STATE
  // ============================================================================

  const [posts, setPosts] = useState<BlogPostWithRelations[]>([]);
  const [pagination, setPagination] = useState<
    PaginatedResponse<BlogPostWithRelations>["pagination"] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filters, setFilters] = useState<BlogPostFilters>(initialFilters);
  const [searchQuery, setSearchQuery] = useState("");

  // Sort
  const [sort, setSort] = useState<BlogPostSortOptions>(initialSort);

  // Pagination
  const [currentPage, setCurrentPage] = useState(initialPagination.page);
  const [perPage, setPerPage] = useState(initialPagination.per_page);

  // Selection
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);

  // ============================================================================
  // DEBOUNCED SEARCH
  // ============================================================================

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // ============================================================================
  // MEMOIZED VALUES
  // ============================================================================

  const effectiveFilters = useMemo(
    () => ({
      ...filters,
      search: debouncedSearchQuery || undefined,
    }),
    [filters, debouncedSearchQuery]
  );

  const paginationOptions = useMemo(
    () => ({
      page: currentPage,
      per_page: perPage,
    }),
    [currentPage, perPage]
  );

  // ============================================================================
  // FETCH FUNCTION
  // ============================================================================

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getPosts(
        effectiveFilters,
        sort,
        paginationOptions
      );

      setPosts(response.data);
      setPagination(response.pagination);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch posts";
      setError(errorMessage);
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  }, [effectiveFilters, sort, paginationOptions]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Auto-fetch when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchPosts();
    }
  }, [fetchPosts, autoFetch]);

  // Reset page when filters or search change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [effectiveFilters, sort]);

  // Clear selection when posts change
  useEffect(() => {
    setSelectedPosts([]);
  }, [posts]);

  // ============================================================================
  // FILTER FUNCTIONS
  // ============================================================================

  const updateFilter = useCallback(
    <K extends keyof BlogPostFilters>(key: K, value: BlogPostFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery("");
  }, []);

  // ============================================================================
  // PAGINATION FUNCTIONS
  // ============================================================================

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePerPageChange = useCallback((newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page
  }, []);

  // ============================================================================
  // POST ACTIONS
  // ============================================================================

  const deletePostById = useCallback(
    async (postId: string) => {
      try {
        setLoading(true);
        await deletePost(postId);

        // Optimistic update
        setPosts((prev) => prev.filter((post) => post.id !== postId));

        // Refetch to ensure consistency
        await fetchPosts();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete post";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchPosts]
  );

  const publishPostById = useCallback(
    async (postId: string) => {
      try {
        setLoading(true);
        await publishPost(postId);

        // Optimistic update
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  status: "published" as BlogPostStatus,
                  published_at: new Date().toISOString(),
                }
              : post
          )
        );

        // Refetch to ensure consistency
        await fetchPosts();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to publish post";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchPosts]
  );

  const unpublishPostById = useCallback(
    async (postId: string) => {
      try {
        setLoading(true);
        await unpublishPost(postId);

        // Optimistic update
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  status: "draft" as BlogPostStatus,
                  published_at: undefined,
                }
              : post
          )
        );

        // Refetch to ensure consistency
        await fetchPosts();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to unpublish post";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchPosts]
  );

  const archivePostById = useCallback(
    async (postId: string) => {
      try {
        setLoading(true);
        await archivePost(postId);

        // Optimistic update
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? { ...post, status: "archived" as BlogPostStatus }
              : post
          )
        );

        // Refetch to ensure consistency
        await fetchPosts();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to archive post";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchPosts]
  );

  // ============================================================================
  // SELECTION FUNCTIONS
  // ============================================================================

  const togglePostSelection = useCallback((postId: string) => {
    setSelectedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  }, []);

  const selectAllPosts = useCallback(() => {
    setSelectedPosts(posts.map((post) => post.id));
  }, [posts]);

  const clearSelection = useCallback(() => {
    setSelectedPosts([]);
  }, []);

  // ============================================================================
  // BULK ACTIONS
  // ============================================================================

  const bulkDelete = useCallback(async () => {
    try {
      setLoading(true);

      await Promise.all(selectedPosts.map((postId) => deletePost(postId)));

      // Clear selection and refetch
      setSelectedPosts([]);
      await fetchPosts();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete posts";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedPosts, fetchPosts]);

  const bulkPublish = useCallback(async () => {
    try {
      setLoading(true);

      await Promise.all(selectedPosts.map((postId) => publishPost(postId)));

      // Clear selection and refetch
      setSelectedPosts([]);
      await fetchPosts();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to publish posts";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedPosts, fetchPosts]);

  const bulkArchive = useCallback(async () => {
    try {
      setLoading(true);

      await Promise.all(selectedPosts.map((postId) => archivePost(postId)));

      // Clear selection and refetch
      setSelectedPosts([]);
      await fetchPosts();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to archive posts";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedPosts, fetchPosts]);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Data
    posts,
    pagination,

    // State
    loading,
    error,

    // Filters
    filters,
    setFilters,
    updateFilter,
    clearFilters,

    // Search
    searchQuery,
    setSearchQuery,

    // Sort
    sort,
    setSort,

    // Pagination
    currentPage,
    setCurrentPage: handlePageChange,
    perPage,
    setPerPage: handlePerPageChange,

    // Actions
    refetch: fetchPosts,
    deletePostById,
    publishPostById,
    unpublishPostById,
    archivePostById,

    // Bulk actions
    selectedPosts,
    setSelectedPosts,
    togglePostSelection,
    selectAllPosts,
    clearSelection,
    bulkDelete,
    bulkPublish,
    bulkArchive,
  };
}
