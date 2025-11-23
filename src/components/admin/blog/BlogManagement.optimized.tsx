/**
 * Blog Management Component - Optimized Version
 *
 * Main container for blog administration with:
 * - Tab navigation between sections
 * - Posts, Categories, and Tags management
 * - Responsive layout
 * - URL state management
 * - Lazy loading
 * - Error boundaries
 * - Accessibility features
 * - SEO optimization
 *
 * @module blog/BlogManagement
 */

import { memo, useCallback, lazy, Suspense, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ErrorBoundary } from "react-error-boundary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Folder,
  Tag,
  Plus,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

// ============================================================================
// LAZY LOADED COMPONENTS
// ============================================================================

const CategoriesSection = lazy(() =>
  import("./sections/CategoriesSection").then((m) => ({
    default: m.CategoriesSection,
  }))
);

const TagsSection = lazy(() =>
  import("./sections/TagsSection").then((m) => ({
    default: m.TagsSection,
  }))
);

// ============================================================================
// TYPES
// ============================================================================

export type BlogManagementTab = "posts" | "categories" | "tags";

export interface BlogManagementProps {
  defaultTab?: BlogManagementTab;
  onTabChange?: (tab: BlogManagementTab) => void;
}

// ============================================================================
// ERROR FALLBACK
// ============================================================================

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold">Something went wrong</p>
            <p className="text-sm mt-1">{error.message}</p>
            <Button
              onClick={resetErrorBoundary}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// LOADING SKELETON
// ============================================================================

function SectionSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

// ============================================================================
// COMPONENT
// ============================================================================

export const BlogManagement = memo(function BlogManagement({
  defaultTab = "posts",
  onTabChange,
}: BlogManagementProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

  // Get active tab from URL or use default
  const activeTab =
    (searchParams.get("tab") as BlogManagementTab) || defaultTab;

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleTabChange = useCallback(
    (value: string) => {
      const tab = value as BlogManagementTab;
      setSearchParams({ tab });
      onTabChange?.(tab);
    },
    [setSearchParams, onTabChange]
  );

  const handleNewPost = useCallback(async () => {
    setIsNavigating(true);
    try {
      navigate("/admin/blog/new");
    } finally {
      // Reset after navigation
      setTimeout(() => setIsNavigating(false), 100);
    }
  }, [navigate]);

  // ============================================================================
  // HELPERS
  // ============================================================================

  const getPageTitle = () => {
    switch (activeTab) {
      case "posts":
        return "Blog Posts Management";
      case "categories":
        return "Blog Categories Management";
      case "tags":
        return "Blog Tags Management";
      default:
        return "Blog Management";
    }
  };

  const getPageDescription = () => {
    switch (activeTab) {
      case "posts":
        return "Create, edit, and manage your blog posts";
      case "categories":
        return "Organize your blog posts into categories";
      case "tags":
        return "Manage tags for better content discovery";
      default:
        return "Manage your blog content, categories, and tags";
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>{getPageTitle()} | Admin Dashboard</title>
        <meta name="description" content={getPageDescription()} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        {/* Skip Link */}
        <a
          href="#blog-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Skip to blog content
        </a>

        {/* Header */}
        <div id="blog-content">
          <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
          <p className="text-muted-foreground">
            Manage your blog posts, categories, and tags.
          </p>
        </div>

        {/* Tabs Navigation */}
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-6"
          aria-label="Blog management sections"
        >
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger
              value="posts"
              className="flex items-center gap-2"
              aria-label="Manage blog posts"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Posts</span>
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="flex items-center gap-2"
              aria-label="Manage blog categories"
            >
              <Folder className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Categories</span>
            </TabsTrigger>
            <TabsTrigger
              value="tags"
              className="flex items-center gap-2"
              aria-label="Manage blog tags"
            >
              <Tag className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Tags</span>
            </TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <FileText
                      className="h-12 w-12 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Posts Management</h2>
                    <p className="text-sm text-muted-foreground">
                      Create and manage your blog posts
                    </p>
                  </div>
                  <Button
                    onClick={handleNewPost}
                    disabled={isNavigating}
                    aria-label="Create new blog post"
                  >
                    {isNavigating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Create New Post
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onReset={() => window.location.reload()}
            >
              <Suspense fallback={<SectionSkeleton />}>
                <CategoriesSection />
              </Suspense>
            </ErrorBoundary>
          </TabsContent>

          {/* Tags Tab */}
          <TabsContent value="tags" className="space-y-4">
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onReset={() => window.location.reload()}
            >
              <Suspense fallback={<SectionSkeleton />}>
                <TagsSection />
              </Suspense>
            </ErrorBoundary>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
});

// Display name for debugging
BlogManagement.displayName = "BlogManagement";
