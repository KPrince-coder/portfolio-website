/**
 * SEO Service
 *
 * Service for managing SEO metadata for blog posts:
 * - Save SEO metadata
 * - Get SEO metadata
 * - Update SEO metadata
 * - Delete SEO metadata
 *
 * @module services/seoService
 */

import { supabase } from "@/integrations/supabase/client";
import type { BlogSEOMetadata } from "@/components/admin/blog/types";

// ============================================================================
// TYPES
// ============================================================================

export interface SEOMetadataInput {
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  keywords?: string[];
  canonical_url?: string;
  robots_meta?: string;
}

export interface SEOMetadataUpdate extends Partial<SEOMetadataInput> {
  post_id: string;
}

// ============================================================================
// CRUD OPERATIONS
// ============================================================================

/**
 * Save SEO metadata for a blog post
 *
 * @param postId - Blog post ID
 * @param metadata - SEO metadata
 * @returns Created SEO metadata
 *
 * @example
 * await saveSEOMetadata('post-123', {
 *   meta_title: 'My Post Title',
 *   meta_description: 'Post description',
 *   keywords: ['react', 'typescript']
 * });
 */
export async function saveSEOMetadata(
  postId: string,
  metadata: SEOMetadataInput
): Promise<BlogSEOMetadata> {
  const { data, error } = await supabase
    .from("blog_seo_metadata")
    .insert({
      post_id: postId,
      meta_title: metadata.meta_title,
      meta_description: metadata.meta_description,
      og_image: metadata.og_image,
      keywords: metadata.keywords,
      canonical_url: metadata.canonical_url,
      robots_meta: metadata.robots_meta || "index, follow",
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save SEO metadata: ${error.message}`);
  }

  return data;
}

/**
 * Get SEO metadata for a blog post
 *
 * @param postId - Blog post ID
 * @returns SEO metadata or null if not found
 *
 * @example
 * const seo = await getSEOMetadata('post-123');
 */
export async function getSEOMetadata(
  postId: string
): Promise<BlogSEOMetadata | null> {
  const { data, error } = await supabase
    .from("blog_seo_metadata")
    .select("*")
    .eq("post_id", postId)
    .single();

  if (error) {
    // Return null if not found (not an error)
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to get SEO metadata: ${error.message}`);
  }

  return data;
}

/**
 * Update SEO metadata for a blog post
 *
 * @param postId - Blog post ID
 * @param metadata - SEO metadata updates
 * @returns Updated SEO metadata
 *
 * @example
 * await updateSEOMetadata('post-123', {
 *   meta_title: 'Updated Title'
 * });
 */
export async function updateSEOMetadata(
  postId: string,
  metadata: Partial<SEOMetadataInput>
): Promise<BlogSEOMetadata> {
  // Check if metadata exists
  const existing = await getSEOMetadata(postId);

  if (!existing) {
    // Create new if doesn't exist
    return saveSEOMetadata(postId, metadata as SEOMetadataInput);
  }

  // Update existing
  const { data, error } = await supabase
    .from("blog_seo_metadata")
    .update({
      meta_title: metadata.meta_title,
      meta_description: metadata.meta_description,
      og_image: metadata.og_image,
      keywords: metadata.keywords,
      canonical_url: metadata.canonical_url,
      robots_meta: metadata.robots_meta,
    })
    .eq("post_id", postId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update SEO metadata: ${error.message}`);
  }

  return data;
}

/**
 * Delete SEO metadata for a blog post
 *
 * @param postId - Blog post ID
 *
 * @example
 * await deleteSEOMetadata('post-123');
 */
export async function deleteSEOMetadata(postId: string): Promise<void> {
  const { error } = await supabase
    .from("blog_seo_metadata")
    .delete()
    .eq("post_id", postId);

  if (error) {
    throw new Error(`Failed to delete SEO metadata: ${error.message}`);
  }
}

/**
 * Upsert SEO metadata (insert or update)
 *
 * @param postId - Blog post ID
 * @param metadata - SEO metadata
 * @returns SEO metadata
 *
 * @example
 * await upsertSEOMetadata('post-123', {
 *   meta_title: 'My Post'
 * });
 */
export async function upsertSEOMetadata(
  postId: string,
  metadata: SEOMetadataInput
): Promise<BlogSEOMetadata> {
  const { data, error } = await supabase
    .from("blog_seo_metadata")
    .upsert({
      post_id: postId,
      meta_title: metadata.meta_title,
      meta_description: metadata.meta_description,
      og_image: metadata.og_image,
      keywords: metadata.keywords,
      canonical_url: metadata.canonical_url,
      robots_meta: metadata.robots_meta || "index, follow",
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to upsert SEO metadata: ${error.message}`);
  }

  return data;
}

// ============================================================================
// BATCH OPERATIONS
// ============================================================================

/**
 * Get SEO metadata for multiple posts
 *
 * @param postIds - Array of post IDs
 * @returns Array of SEO metadata
 *
 * @example
 * const seoData = await getBulkSEOMetadata(['post-1', 'post-2']);
 */
export async function getBulkSEOMetadata(
  postIds: string[]
): Promise<BlogSEOMetadata[]> {
  const { data, error } = await supabase
    .from("blog_seo_metadata")
    .select("*")
    .in("post_id", postIds);

  if (error) {
    throw new Error(`Failed to get bulk SEO metadata: ${error.message}`);
  }

  return data || [];
}

/**
 * Delete SEO metadata for multiple posts
 *
 * @param postIds - Array of post IDs
 *
 * @example
 * await deleteBulkSEOMetadata(['post-1', 'post-2']);
 */
export async function deleteBulkSEOMetadata(postIds: string[]): Promise<void> {
  const { error } = await supabase
    .from("blog_seo_metadata")
    .delete()
    .in("post_id", postIds);

  if (error) {
    throw new Error(`Failed to delete bulk SEO metadata: ${error.message}`);
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if post has SEO metadata
 *
 * @param postId - Blog post ID
 * @returns True if metadata exists
 *
 * @example
 * const hasSEO = await hasSEOMetadata('post-123');
 */
export async function hasSEOMetadata(postId: string): Promise<boolean> {
  const metadata = await getSEOMetadata(postId);
  return metadata !== null;
}

/**
 * Get all posts with SEO metadata
 *
 * @returns Array of post IDs with SEO metadata
 *
 * @example
 * const postIds = await getPostsWithSEO();
 */
export async function getPostsWithSEO(): Promise<string[]> {
  const { data, error } = await supabase
    .from("blog_seo_metadata")
    .select("post_id");

  if (error) {
    throw new Error(`Failed to get posts with SEO: ${error.message}`);
  }

  return data?.map((item) => item.post_id) || [];
}

/**
 * Get all posts without SEO metadata
 *
 * @returns Array of post IDs without SEO metadata
 *
 * @example
 * const postIds = await getPostsWithoutSEO();
 */
export async function getPostsWithoutSEO(): Promise<string[]> {
  // Get all posts
  const { data: posts, error: postsError } = await supabase
    .from("blog_posts")
    .select("id");

  if (postsError) {
    throw new Error(`Failed to get posts: ${postsError.message}`);
  }

  // Get posts with SEO
  const postsWithSEO = await getPostsWithSEO();

  // Return posts without SEO
  return (
    posts
      ?.filter((post) => !postsWithSEO.includes(post.id))
      .map((post) => post.id) || []
  );
}

/**
 * Copy SEO metadata from one post to another
 *
 * @param sourcePostId - Source post ID
 * @param targetPostId - Target post ID
 * @returns Copied SEO metadata
 *
 * @example
 * await copySEOMetadata('post-1', 'post-2');
 */
export async function copySEOMetadata(
  sourcePostId: string,
  targetPostId: string
): Promise<BlogSEOMetadata> {
  const sourceSEO = await getSEOMetadata(sourcePostId);

  if (!sourceSEO) {
    throw new Error("Source post has no SEO metadata");
  }

  return saveSEOMetadata(targetPostId, {
    meta_title: sourceSEO.meta_title,
    meta_description: sourceSEO.meta_description,
    og_image: sourceSEO.og_image,
    keywords: sourceSEO.keywords,
    canonical_url: sourceSEO.canonical_url,
    robots_meta: sourceSEO.robots_meta,
  });
}
