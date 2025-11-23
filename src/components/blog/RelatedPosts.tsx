/**
 * Related Posts Component
 *
 * Displays related blog posts based on:
 * - Same categories
 * - Same tags
 * - Similar content
 *
 * @module blog/RelatedPosts
 */

import React, { useEffect, useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogPostCard } from "./BlogPostCard";
import { getPosts } from "@/services/blogService";
import type { BlogPostWithRelations } from "@/components/admin/blog/types";

// ============================================================================
// TYPES
// ============================================================================

interface RelatedPostsProps {
  currentPostId: string;
  categoryIds?: string[];
  tagIds?: string[];
  limit?: number;
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const RelatedPosts = React.memo<RelatedPostsProps>(
  function RelatedPosts({
    currentPostId,
    categoryIds = [],
    tagIds = [],
    limit = 3,
    className = "",
  }) {
    // ============================================================================
    // STATE
    // ============================================================================

    const [posts, setPosts] = useState<BlogPostWithRelations[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ============================================================================
    // FETCH RELATED POSTS
    // ============================================================================

    const fetchRelatedPosts = useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        // Strategy: Fetch posts with same categories or tags
        // Prioritize posts with matching categories, then tags
        const relatedPosts: BlogPostWithRelations[] = [];

        // Try to get posts from same categories first
        if (categoryIds.length > 0) {
          const categoryResponse = await getPosts(
            {
              status: "published",
              category_id: categoryIds[0], // Use first category
            },
            { field: "published_at", direction: "desc" },
            { page: 1, per_page: limit + 5 } // Fetch extra to filter out current post
          );

          relatedPosts.push(
            ...categoryResponse.data.filter((p) => p.id !== currentPostId)
          );
        }

        // If we don't have enough posts, try tags
        if (relatedPosts.length < limit && tagIds.length > 0) {
          const tagResponse = await getPosts(
            {
              status: "published",
              tag_id: tagIds[0], // Use first tag
            },
            { field: "published_at", direction: "desc" },
            { page: 1, per_page: limit + 5 }
          );

          const tagPosts = tagResponse.data.filter(
            (p) =>
              p.id !== currentPostId &&
              !relatedPosts.some((rp) => rp.id === p.id)
          );

          relatedPosts.push(...tagPosts);
        }

        // If still not enough, get latest posts
        if (relatedPosts.length < limit) {
          const latestResponse = await getPosts(
            { status: "published" },
            { field: "published_at", direction: "desc" },
            { page: 1, per_page: limit + 5 }
          );

          const latestPosts = latestResponse.data.filter(
            (p) =>
              p.id !== currentPostId &&
              !relatedPosts.some((rp) => rp.id === p.id)
          );

          relatedPosts.push(...latestPosts);
        }

        // Limit to requested number
        setPosts(relatedPosts.slice(0, limit));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch related posts";
        setError(errorMessage);
        console.error("Failed to fetch related posts:", err);
      } finally {
        setLoading(false);
      }
    }, [currentPostId, categoryIds, tagIds, limit]);

    // ============================================================================
    // EFFECTS
    // ============================================================================

    useEffect(() => {
      fetchRelatedPosts();
    }, [fetchRelatedPosts]);

    // ============================================================================
    // RENDER
    // ============================================================================

    // Don't render if no posts or error
    if (error || posts.length === 0) {
      return null;
    }

    return (
      <section className={className}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Related Posts</h2>
          <Button variant="ghost" size="sm" asChild>
            <a href="/blog">
              View all
              <ArrowRight className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: limit }).map((_, index) => (
              <div
                key={index}
                className="h-96 bg-muted animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogPostCard
                key={post.id}
                post={post}
                variant="compact"
                showExcerpt
                showCategories
                showReadTime={false}
                showViewCount={false}
              />
            ))}
          </div>
        )}
      </section>
    );
  }
);

RelatedPosts.displayName = "RelatedPosts";
