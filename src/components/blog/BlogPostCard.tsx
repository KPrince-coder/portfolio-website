/**
 * Blog Post Card Component
 *
 * Optimized blog post card with:
 * - SEO-friendly structure
 * - Performance optimizations (memoization, lazy loading)
 * - Responsive design
 * - Accessibility features
 * - Modern UI patterns
 *
 * @module blog/BlogPostCard
 */

import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Clock, Eye, Calendar, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { calculateReadTime } from "@/lib/seoUtils";
import type { BlogPostWithRelations } from "@/components/admin/blog/types";

// ============================================================================
// TYPES
// ============================================================================

interface BlogPostCardProps {
  post: BlogPostWithRelations;
  variant?: "default" | "featured" | "compact";
  showExcerpt?: boolean;
  showCategories?: boolean;
  showTags?: boolean;
  showReadTime?: boolean;
  showViewCount?: boolean;
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const BlogPostCard = React.memo<BlogPostCardProps>(
  function BlogPostCard({
    post,
    variant = "default",
    showExcerpt = true,
    showCategories = true,
    showTags = false,
    showReadTime = true,
    showViewCount = true,
    className = "",
  }) {
    // ============================================================================
    // COMPUTED VALUES
    // ============================================================================

    const readTime = React.useMemo(() => {
      return calculateReadTime(post.content);
    }, [post.content]);

    const publishedDate = React.useMemo(() => {
      const date = post.published_at || post.created_at;
      return format(new Date(date), "MMM d, yyyy");
    }, [post.published_at, post.created_at]);

    const postUrl = `/blog/${post.slug}`;
    const featuredImage = post.featured_image;

    // ============================================================================
    // RENDER HELPERS
    // ============================================================================

    const renderImage = () => {
      if (!featuredImage) {
        return (
          <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <div className="text-muted-foreground text-sm font-medium">
              {post.title.charAt(0).toUpperCase()}
            </div>
          </div>
        );
      }

      return (
        <div className="aspect-video overflow-hidden">
          <img
            src={featuredImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        </div>
      );
    };

    const renderCategories = () => {
      if (!showCategories || !post.categories?.length) return null;

      return (
        <div className="flex flex-wrap gap-1 mb-2">
          {post.categories.slice(0, 2).map((category) => (
            <Link key={category.id} to={`/blog?category=${category.id}`}>
              <Badge
                variant="secondary"
                className="text-xs cursor-pointer hover:bg-secondary/80"
              >
                {category.name}
              </Badge>
            </Link>
          ))}
          {post.categories.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{post.categories.length - 2}
            </Badge>
          )}
        </div>
      );
    };

    const renderTags = () => {
      if (!showTags || !post.tags?.length) return null;

      return (
        <div className="flex flex-wrap gap-1 mt-2">
          {post.tags.slice(0, 3).map((tag) => (
            <Link key={tag.id} to={`/blog?tag=${tag.id}`}>
              <Badge
                variant="outline"
                className="text-xs cursor-pointer hover:bg-accent"
              >
                #{tag.name}
              </Badge>
            </Link>
          ))}
          {post.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{post.tags.length - 3}
            </Badge>
          )}
        </div>
      );
    };

    const renderMeta = () => {
      const metaItems = [];

      // Published date
      metaItems.push(
        <div
          key="date"
          className="flex items-center gap-1 text-xs text-muted-foreground"
        >
          <Calendar className="h-3 w-3" />
          <time dateTime={post.published_at || post.created_at}>
            {publishedDate}
          </time>
        </div>
      );

      // Read time
      if (showReadTime) {
        metaItems.push(
          <div
            key="read-time"
            className="flex items-center gap-1 text-xs text-muted-foreground"
          >
            <Clock className="h-3 w-3" />
            <span>{readTime} min read</span>
          </div>
        );
      }

      // View count
      if (showViewCount && post.view_count > 0) {
        metaItems.push(
          <div
            key="views"
            className="flex items-center gap-1 text-xs text-muted-foreground"
          >
            <Eye className="h-3 w-3" />
            <span>{post.view_count.toLocaleString()} views</span>
          </div>
        );
      }

      return (
        <div className="flex items-center gap-3 flex-wrap">{metaItems}</div>
      );
    };

    // ============================================================================
    // VARIANT STYLES
    // ============================================================================

    const getCardClassName = () => {
      const baseClasses = "group transition-all duration-300 hover:shadow-lg";

      switch (variant) {
        case "featured":
          return `${baseClasses} border-primary/20 bg-gradient-to-br from-primary/5 to-transparent`;
        case "compact":
          return `${baseClasses} h-full`;
        default:
          return `${baseClasses} h-full hover:border-primary/20`;
      }
    };

    // ============================================================================
    // RENDER
    // ============================================================================

    return (
      <article className={className}>
        <Card className={getCardClassName()}>
          {/* Featured Image */}
          <CardHeader className="p-0">
            <Link to={postUrl} className="block">
              {renderImage()}
            </Link>
          </CardHeader>

          {/* Content */}
          <CardContent className="p-4 pb-2">
            {/* Categories */}
            {renderCategories()}

            {/* Title */}
            <h2 className="font-semibold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
              <Link to={postUrl} className="hover:underline">
                {post.title}
              </Link>
            </h2>

            {/* Excerpt */}
            {showExcerpt && post.excerpt && (
              <p className="text-muted-foreground text-sm leading-relaxed mb-3 line-clamp-3">
                {post.excerpt}
              </p>
            )}

            {/* Tags */}
            {renderTags()}
          </CardContent>

          {/* Footer */}
          <CardFooter className="p-4 pt-2 flex items-center justify-between">
            {/* Meta information */}
            {renderMeta()}

            {/* Read more button */}
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto group/button"
              asChild
            >
              <Link to={postUrl}>
                Read more
                <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover/button:translate-x-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </article>
    );
  }
);

BlogPostCard.displayName = "BlogPostCard";
