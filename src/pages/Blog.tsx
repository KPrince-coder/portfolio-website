/**
 * Blog Page Component
 *
 * Public blog listing page with:
 * - SEO optimization (meta tags, structured data)
 * - Performance optimization (memoization, lazy loading)
 * - Responsive design
 * - Advanced filtering and search
 * - Pagination
 * - Loading states and error handling
 *
 * @module pages/Blog
 */

import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { Loader2, FileText, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { BlogFilters } from "@/components/blog/BlogFilters";
import { useBlogPosts } from "@/components/blog/hooks/useBlogPosts";

// ============================================================================
// CONSTANTS
// ============================================================================

const SITE_NAME = "Your Blog";
const SITE_URL = "https://yourdomain.com";
const DEFAULT_DESCRIPTION =
  "Discover insightful articles, tutorials, and thoughts on web development, technology, and more.";

// ============================================================================
// COMPONENT
// ============================================================================

export function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();

  // ============================================================================
  // BLOG POSTS HOOK
  // ============================================================================

  const {
    posts,
    pagination,
    loading,
    error,
    filters,
    updateFilter,
    clearFilters,
    searchQuery,
    setSearchQuery,
    sort,
    setSort,
    currentPage,
    setCurrentPage,
    hasFilters,
    totalPosts,
  } = useBlogPosts({
    initialFilters: {
      category: searchParams.get("category") || undefined,
      tag: searchParams.get("tag") || undefined,
      search: searchParams.get("search") || undefined,
      featured: searchParams.get("featured") === "true" ? true : undefined,
    },
    initialPagination: {
      page: parseInt(searchParams.get("page") || "1"),
      per_page: 12,
    },
  });

  // ============================================================================
  // URL SYNC
  // ============================================================================

  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.category) params.set("category", filters.category);
    if (filters.tag) params.set("tag", filters.tag);
    if (searchQuery) params.set("search", searchQuery);
    if (filters.featured) params.set("featured", "true");
    if (currentPage > 1) params.set("page", currentPage.toString());

    setSearchParams(params, { replace: true });
  }, [filters, searchQuery, currentPage, setSearchParams]);

  // ============================================================================
  // SEO META TAGS
  // ============================================================================

  const metaTags = React.useMemo(() => {
    let title = SITE_NAME;
    let description = DEFAULT_DESCRIPTION;

    if (hasFilters) {
      const filterParts = [];
      if (filters.category) filterParts.push(`Category: ${filters.category}`);
      if (filters.tag) filterParts.push(`Tag: ${filters.tag}`);
      if (searchQuery) filterParts.push(`Search: ${searchQuery}`);
      if (filters.featured) filterParts.push("Featured Posts");

      title = `${filterParts.join(" | ")} - ${SITE_NAME}`;
      description = `Browse ${filterParts
        .join(", ")
        .toLowerCase()} on ${SITE_NAME}.`;
    }

    if (currentPage > 1) {
      title = `${title} - Page ${currentPage}`;
    }

    return {
      title,
      description,
      canonicalUrl: `${SITE_URL}/blog`,
      ogTitle: title,
      ogDescription: description,
      ogType: "website",
      twitterCard: "summary_large_image",
    };
  }, [hasFilters, filters, searchQuery, currentPage]);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderLoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <Card key={index} className="h-full">
          <div className="p-0">
            <Skeleton className="aspect-video w-full" />
          </div>
          <CardContent className="p-4">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4 mb-3" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderEmptyState = () => {
    if (hasFilters) {
      return (
        <Card className="text-center py-12">
          <CardContent>
            <SearchIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No posts found</h3>
            <p className="text-muted-foreground mb-4">
              No posts match your current filters. Try adjusting your search
              criteria.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear all filters
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="text-center py-12">
        <CardContent>
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
          <p className="text-muted-foreground">
            Check back soon for new content!
          </p>
        </CardContent>
      </Card>
    );
  };

  const renderPagination = () => {
    if (!pagination || pagination.total_pages <= 1) return null;

    const { page, total_pages, has_prev, has_next } = pagination;

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(page - 1)}
          disabled={!has_prev || loading}
        >
          Previous
        </Button>

        <div className="flex items-center gap-1">
          {/* Show page numbers */}
          {Array.from({ length: Math.min(5, total_pages) }, (_, i) => {
            let pageNum;
            if (total_pages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= total_pages - 2) {
              pageNum = total_pages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }

            return (
              <Button
                key={pageNum}
                variant={pageNum === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
                disabled={loading}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          onClick={() => setCurrentPage(page + 1)}
          disabled={!has_next || loading}
        >
          Next
        </Button>
      </div>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
        <link rel="canonical" href={metaTags.canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={metaTags.ogTitle} />
        <meta property="og:description" content={metaTags.ogDescription} />
        <meta property="og:type" content={metaTags.ogType} />
        <meta property="og:url" content={metaTags.canonicalUrl} />

        {/* Twitter Card */}
        <meta name="twitter:card" content={metaTags.twitterCard} />
        <meta name="twitter:title" content={metaTags.ogTitle} />
        <meta name="twitter:description" content={metaTags.ogDescription} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: SITE_NAME,
            description: DEFAULT_DESCRIPTION,
            url: `${SITE_URL}/blog`,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${SITE_URL}/blog`,
            },
          })}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {DEFAULT_DESCRIPTION}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <BlogFilters
            filters={filters}
            onFilterChange={updateFilter}
            onClearFilters={clearFilters}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sort={sort}
            onSortChange={setSort}
            loading={loading}
            totalPosts={totalPosts}
          />
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-8 border-destructive">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-destructive">
                <Loader2 className="h-4 w-4" />
                <span>Failed to load posts: {error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content */}
        {loading ? (
          renderLoadingSkeleton()
        ) : posts.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <BlogPostCard
                  key={post.id}
                  post={post}
                  variant={index === 0 && !hasFilters ? "featured" : "default"}
                  showExcerpt
                  showCategories
                  showReadTime
                  showViewCount
                />
              ))}
            </div>

            {/* Pagination */}
            {renderPagination()}
          </>
        )}
      </div>
    </>
  );
}
