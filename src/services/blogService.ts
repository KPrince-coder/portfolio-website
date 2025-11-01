/**
 * Blog Service
 *
 * Comprehensive blog post management with:
 * - CRUD operations
 * - Advanced filtering and search
 * - Publish workflow
 * - View tracking
 * - SEO management
 * - Relationship management (categories, tags)
 *
 * @module blogService
 */

import { supabase } from "@/integrations/supabase/client";
import type {
  BlogPost,
  BlogPostWithRelations,
  CreateBlogPostInput,
  UpdateBlogPostInput,
  BlogPostFilters,
  BlogPostSortOptions,
  PaginationOptions,
  PaginatedResponse,
  Result,
  SearchResult,
  BlogPostStatus,
} from "@/components/admin/blog/types";

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Ensure user has a profile and return the profile ID
 * Uses upsert to avoid race conditions
 * Returns profile.id (not user_id) for use in blog_posts.user_id foreign key
 */
async function ensureUserProfile(
  userId: string,
  email?: string
): Promise<string> {
  // First try to get existing profile
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (existing) {
    return existing.id;
  }

  // Create new profile if doesn't exist
  const { data, error } = await supabase
    .from("profiles")
    .insert({
      user_id: userId,
      full_name: email?.split("@")[0] || "User",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create profile:", error);
    throw new Error(
      `Failed to create user profile: ${error.message}. ` +
        `Please try again or contact support if the issue persists.`
    );
  }

  return data.id;
}

/**
 * Calculate reading time from content
 */
function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Extract excerpt from content if not provided
 */
function extractExcerpt(content: string, maxLength: number = 300): string {
  // Remove markdown formatting
  const plainText = content
    .replace(/#{1,6}\s/g, "") // Remove headers
    .replace(/\*\*(.+?)\*\*/g, "$1") // Remove bold
    .replace(/\*(.+?)\*/g, "$1") // Remove italic
    .replace(/\[(.+?)\]\(.+?\)/g, "$1") // Remove links
    .replace(/`(.+?)`/g, "$1") // Remove code
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.substring(0, maxLength).trim() + "...";
}

// ============================================================================
// CRUD OPERATIONS
// ============================================================================

/**
 * Get posts with advanced filtering, sorting, and pagination
 *
 * @param filters - Filter criteria
 * @param sort - Sort options
 * @param pagination - Pagination options
 * @returns Paginated posts
 *
 * @example
 * ```typescript
 * const result = await getPosts({
 *   status: 'published',
 *   category_id: 'cat-123',
 *   search: 'react hooks'
 * }, {
 *   field: 'published_at',
 *   direction: 'desc'
 * }, {
 *   page: 1,
 *   per_page: 10
 * });
 * ```
 */
export async function getPosts(
  filters: BlogPostFilters = {},
  sort: BlogPostSortOptions = { field: "created_at", direction: "desc" },
  pagination: PaginationOptions = { page: 1, per_page: DEFAULT_PAGE_SIZE }
): Promise<PaginatedResponse<BlogPostWithRelations>> {
  try {
    // Validate pagination
    const page = Math.max(1, pagination.page);
    const per_page = Math.min(MAX_PAGE_SIZE, Math.max(1, pagination.per_page));
    const from = (page - 1) * per_page;
    const to = from + per_page - 1;

    // Build query
    let query = supabase
      .from("blog_posts")
      .select(
        "*, blog_post_categories(category:blog_categories(*)), blog_post_tags(tag:blog_tags(*))",
        { count: "exact" }
      );

    // Apply filters
    if (filters.status) {
      if (Array.isArray(filters.status)) {
        query = query.in("status", filters.status);
      } else {
        query = query.eq("status", filters.status);
      }
    }

    if (filters.user_id) {
      query = query.eq("user_id", filters.user_id);
    }

    if (filters.is_featured !== undefined) {
      query = query.eq("is_featured", filters.is_featured);
    }

    if (filters.category_id) {
      query = query.contains("blog_post_categories", [
        { category_id: filters.category_id },
      ]);
    }

    if (filters.tag_id) {
      query = query.contains("blog_post_tags", [{ tag_id: filters.tag_id }]);
    }

    if (filters.date_from) {
      query = query.gte("created_at", filters.date_from);
    }

    if (filters.date_to) {
      query = query.lte("created_at", filters.date_to);
    }

    // Apply search
    if (filters.search) {
      query = query.textSearch("title", filters.search, {
        type: "websearch",
        config: "english",
      });
    }

    // Apply sorting
    query = query.order(sort.field, { ascending: sort.direction === "asc" });

    // Apply pagination
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    // Transform data to include relations
    const posts: BlogPostWithRelations[] = (data || []).map((post: any) => ({
      ...post,
      categories:
        post.blog_post_categories?.map((pc: any) => pc.category) || [],
      tags: post.blog_post_tags?.map((pt: any) => pt.tag) || [],
    }));

    const total = count || 0;
    const total_pages = Math.ceil(total / per_page);

    return {
      data: posts,
      pagination: {
        page,
        per_page,
        total,
        total_pages,
        has_next: page < total_pages,
        has_prev: page > 1,
      },
    };
  } catch (error) {
    throw new Error(
      `Failed to fetch posts: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Get single post by ID with all relations
 */
export async function getPostById(
  postId: string
): Promise<BlogPostWithRelations | null> {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        `
        *,
        blog_post_categories(category:blog_categories(*)),
        blog_post_tags(tag:blog_tags(*)),
        blog_seo_metadata(*),
        profiles(id, full_name, avatar_url)
      `
      )
      .eq("id", postId)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      ...data,
      categories:
        data.blog_post_categories?.map((pc: any) => pc.category) || [],
      tags: data.blog_post_tags?.map((pt: any) => pt.tag) || [],
      seo_metadata: data.blog_seo_metadata?.[0],
      author: data.profiles,
    };
  } catch (error) {
    throw new Error(
      `Failed to fetch post: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Get single post by slug (for public view)
 */
export async function getPostBySlug(
  slug: string
): Promise<BlogPostWithRelations | null> {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        `
        *,
        blog_post_categories(category:blog_categories(*)),
        blog_post_tags(tag:blog_tags(*)),
        blog_seo_metadata(*),
        profiles(id, full_name, avatar_url)
      `
      )
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      ...data,
      categories:
        data.blog_post_categories?.map((pc: any) => pc.category) || [],
      tags: data.blog_post_tags?.map((pt: any) => pt.tag) || [],
      seo_metadata: data.blog_seo_metadata?.[0],
      author: data.profiles,
    };
  } catch (error) {
    throw new Error(
      `Failed to fetch post by slug: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Create new blog post
 */
export async function createPost(
  input: CreateBlogPostInput
): Promise<BlogPost> {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");

    // Ensure user has a profile and get profile.id
    // blog_posts.user_id references profiles.id (not auth.users.id)
    const profileId = await ensureUserProfile(user.user.id, user.user.email);

    // Calculate read time
    const read_time_minutes = calculateReadTime(input.content);

    // Extract excerpt if not provided
    const excerpt = input.excerpt || extractExcerpt(input.content);

    // Create post - slug will be auto-generated by database trigger
    // DO NOT pass slug - let the database trigger handle it
    const { data: post, error: postError } = await supabase
      .from("blog_posts")
      .insert({
        user_id: profileId, // Use profile.id (not auth user ID)
        title: input.title,
        slug: "", // Empty string triggers auto-generation
        content: input.content,
        excerpt,
        featured_image: input.featured_image,
        status: input.status || "draft",
        scheduled_for: input.scheduled_for,
        comments_enabled: input.comments_enabled ?? true,
        is_featured: input.is_featured ?? false,
        read_time_minutes,
      })
      .select()
      .single();

    if (postError) {
      console.error("Supabase error details:", postError);
      throw postError;
    }

    // Add categories
    if (input.category_ids && input.category_ids.length > 0) {
      const categoryInserts = input.category_ids.map((category_id) => ({
        post_id: post.id,
        category_id,
      }));

      const { error: catError } = await supabase
        .from("blog_post_categories")
        .insert(categoryInserts);

      if (catError) throw catError;
    }

    // Add tags
    if (input.tag_ids && input.tag_ids.length > 0) {
      const tagInserts = input.tag_ids.map((tag_id) => ({
        post_id: post.id,
        tag_id,
      }));

      const { error: tagError } = await supabase
        .from("blog_post_tags")
        .insert(tagInserts);

      if (tagError) throw tagError;
    }

    // Add SEO metadata
    if (input.seo_metadata) {
      const { error: seoError } = await supabase
        .from("blog_seo_metadata")
        .insert({
          post_id: post.id,
          ...input.seo_metadata,
        });

      if (seoError) throw seoError;
    }

    return post;
  } catch (error) {
    console.error("Create post error:", error);
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new Error(`Failed to create post: ${errorMessage}`);
  }
}

/**
 * Update existing blog post
 */
export async function updatePost(
  input: UpdateBlogPostInput
): Promise<BlogPost> {
  try {
    const { id, category_ids, tag_ids, seo_metadata, ...postData } = input;

    // Prepare update data with proper typing
    const updateData: Partial<{
      title: string;
      slug: string;
      content: string;
      excerpt: string;
      featured_image: string;
      status: BlogPostStatus;
      scheduled_for: string;
      comments_enabled: boolean;
      is_featured: boolean;
      read_time_minutes: number;
    }> = { ...postData };

    // Update read time if content changed
    if (postData.content) {
      updateData.read_time_minutes = calculateReadTime(postData.content);
    }

    // Update excerpt if content changed but excerpt not provided
    if (postData.content && !postData.excerpt) {
      updateData.excerpt = extractExcerpt(postData.content);
    }

    // Update post
    const { data: post, error: postError } = await supabase
      .from("blog_posts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (postError) throw postError;

    // Update categories if provided
    if (category_ids !== undefined) {
      // Remove existing
      await supabase.from("blog_post_categories").delete().eq("post_id", id);

      // Add new
      if (category_ids.length > 0) {
        const categoryInserts = category_ids.map((category_id) => ({
          post_id: id,
          category_id,
        }));

        const { error: catError } = await supabase
          .from("blog_post_categories")
          .insert(categoryInserts);

        if (catError) throw catError;
      }
    }

    // Update tags if provided
    if (tag_ids !== undefined) {
      // Remove existing
      await supabase.from("blog_post_tags").delete().eq("post_id", id);

      // Add new
      if (tag_ids.length > 0) {
        const tagInserts = tag_ids.map((tag_id) => ({
          post_id: id,
          tag_id,
        }));

        const { error: tagError } = await supabase
          .from("blog_post_tags")
          .insert(tagInserts);

        if (tagError) throw tagError;
      }
    }

    // Update SEO metadata if provided
    if (seo_metadata) {
      const { error: seoError } = await supabase
        .from("blog_seo_metadata")
        .upsert({
          post_id: id,
          ...seo_metadata,
        });

      if (seoError) throw seoError;
    }

    return post;
  } catch (error) {
    throw new Error(
      `Failed to update post: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Delete blog post
 */
export async function deletePost(postId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", postId);

    if (error) throw error;
  } catch (error) {
    throw new Error(
      `Failed to delete post: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// ============================================================================
// PUBLISH WORKFLOW
// ============================================================================

/**
 * Publish a draft post
 */
export async function publishPost(postId: string): Promise<BlogPost> {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
      })
      .eq("id", postId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(
      `Failed to publish post: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Unpublish a post (revert to draft)
 */
export async function unpublishPost(postId: string): Promise<BlogPost> {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .update({
        status: "draft",
        published_at: null,
      })
      .eq("id", postId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(
      `Failed to unpublish post: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Archive a post
 */
export async function archivePost(postId: string): Promise<BlogPost> {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .update({ status: "archived" })
      .eq("id", postId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(
      `Failed to archive post: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// ============================================================================
// VIEW TRACKING
// ============================================================================

/**
 * Increment post view count
 */
export async function incrementViewCount(postId: string): Promise<void> {
  try {
    const { error } = await supabase.rpc("increment_post_view_count", {
      post_id_param: postId,
    });

    if (error) throw error;
  } catch (error) {
    // Don't throw error for view tracking failures
    console.warn("Failed to increment view count:", error);
  }
}

// ============================================================================
// SEARCH
// ============================================================================

/**
 * Full-text search across posts
 */
export async function searchPosts(query: string): Promise<SearchResult[]> {
  try {
    const { data, error } = await supabase.rpc("search_blog_posts", {
      search_query: query,
    });

    if (error) throw error;

    return (data || []).map((result: any) => ({
      post: result,
      rank: result.rank || 0,
    }));
  } catch (error) {
    throw new Error(
      `Failed to search posts: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// ============================================================================
// SAFE VERSIONS WITH RESULT TYPE
// ============================================================================

export async function getPostsSafe(
  filters?: BlogPostFilters,
  sort?: BlogPostSortOptions,
  pagination?: PaginationOptions
): Promise<Result<PaginatedResponse<BlogPostWithRelations>>> {
  try {
    const data = await getPosts(filters, sort, pagination);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

export async function createPostSafe(
  input: CreateBlogPostInput
): Promise<Result<BlogPost>> {
  try {
    const data = await createPost(input);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

export async function updatePostSafe(
  input: UpdateBlogPostInput
): Promise<Result<BlogPost>> {
  try {
    const data = await updatePost(input);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}
