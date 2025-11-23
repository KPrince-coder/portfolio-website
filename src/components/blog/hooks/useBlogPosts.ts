/**
 * Blog Posts Hook (Public)
 *
 * Optimized hook for fetching and managing public blog posts with:
 * - Performance optimization (memoization, debouncing)
 * - SEO-friendly filtering (published posts only)
 * - URL synchronization
 * - Advanced filtering and search
 * - Pagination with smooth scrolling
 *
 * @module blog/hooks/useBlogPosts
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { getPosts } from "@/services/blogService";
import type {
  BlogPostWithRelations,
  BlogPostFilters,
  BlogPostSortOptions,
  PaginationOptions,
  PaginatedResponse,
} from "@/components/admin/blog/types";

// ============================================================================
// TYPES
// ============================================================================

export interface PublicBlogFilters {
  category?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
}

export interface UseBlogPostsOptions {
  initialFilters?: PublicBlogFilters;
  initialSort?: BlogPostSortOptions;
  initialPagination?: PaginationOptions;
  autoFetch?: boolean;
}

export interface UseBlogPostsReturn {
  // Data
  posts: BlogPostWithRelations[];
  pagination: PaginatedResponse<BlogPostWithRelations>["pagination"] | null;

  // State
  loading: boolean;
  error: string | null;

  // Filters
  filters: PublicBlogFilters;
  updateFilter: <K extends keyof PublicBlogFilters>(
    key: K,
    value: PublicBlogFilters[K]
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

  // Computed
  hasFilters: boolean;
  totalPosts: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_FILTERS: PublicBlogFilters = {};
const DEFAULT_SORT: BlogPostSortOptions = {
  field: "published_at",
  direction: "desc",
};
const DEFAULT_PAGINATION: PaginationOptions = {
  page: 1,
  per_page: 12, // Good for grid layout (3x4, 2x6, 1x12)
};
const SEARCH_DEBOUNCE_MS = 300;

// ============================================================================
// HOOK
// ============================================================================

export function useBlogPosts(
  options: UseBlogPostsOptions = {}
): UseBlogPostsReturn {
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
  const [filters, setFilters] = useState<PublicBlogFilters>(initialFilters);
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || "");

  // Sort
  const [sort, setSort] = useState<BlogPostSortOptions>(initialSort);

  // Pagination
  const [currentPage, setCurrentPage] = useState(initialPagination.page);
  const [perPage, setPerPage] = useState(initialPagination.per_page);

  // ============================================================================
  // DEBOUNCED SEARCH
  // ============================================================================

  const debouncedSearchQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);

  // ============================================================================
  // MEMOIZED VALUES
  // ============================================================================

  const effectiveFilters = useMemo((): BlogPostFilters => {
    const blogFilters: BlogPostFilters = {
      status: "published", // Only show published posts
      search: debouncedSearchQuery || undefined,
    };

    // Add category filter (assuming we'll pass slug and convert to ID)
    if (filters.category) {
      blogFilters.category_id = filters.category;
    }

    // Add tag filter
    if (filters.tag) {
      blogFilters.tag_id = filters.tag;
    }

    // Add featured filter
    if (filters.featured !== undefined) {
      blogFilters.is_featured = filters.featured;
    }

    return blogFilters;
  }, [filters, debouncedSearchQuery]);

  const paginationOptions = useMemo(
    (): PaginationOptions => ({
      page: currentPage,
      per_page: perPage,
    }),
    [currentPage, perPage]
  );

  const hasFilters = useMemo(() => {
    return Boolean(
      filters.category ||
        filters.tag ||
        filters.featured !== undefined ||
        debouncedSearchQuery
    );
  }, [filters, debouncedSearchQuery]);

  const totalPosts = useMemo(() => {
    return pagination?.total || 0;
  }, [pagination]);

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
      console.error("Failed to fetch blog posts:", err);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveFilters, sort]);

  // ============================================================================
  // FILTER FUNCTIONS
  // ============================================================================

  const updateFilter = useCallback(
    <K extends keyof PublicBlogFilters>(
      key: K,
      value: PublicBlogFilters[K]
    ) => {
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
    // Smooth scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handlePerPageChange = useCallback((newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page
  }, []);

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

    // Computed
    hasFilters,
    totalPosts,
  };
}
