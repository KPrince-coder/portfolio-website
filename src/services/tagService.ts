/**
 * Tag Service
 *
 * Blog tag management with:
 * - CRUD operations
 * - Slug generation
 * - Usage tracking
 * - Popular tags
 * - Search functionality
 * - Validation
 *
 * @module tagService
 */

import { supabase } from "@/integrations/supabase/client";
import type {
  BlogTag,
  CreateTagInput,
  UpdateTagInput,
  Result,
} from "@/components/admin/blog/types";

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate URL-friendly slug from name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Validate tag input
 */
function validateTag(input: CreateTagInput | UpdateTagInput): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if ("name" in input && input.name) {
    if (input.name.length < 2) {
      errors.push("Tag name must be at least 2 characters");
    }
    if (input.name.length > 30) {
      errors.push("Tag name must be less than 30 characters");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// CRUD OPERATIONS
// ============================================================================

/**
 * Get all tags with optional sorting
 *
 * @param sortBy - Field to sort by
 * @param sortDirection - Sort direction
 * @returns Array of tags
 *
 * @example
 * ```typescript
 * const tags = await getTags('usage_count', 'desc');
 * ```
 */
export async function getTags(
  sortBy: "name" | "usage_count" | "created_at" = "name",
  sortDirection: "asc" | "desc" = "asc"
): Promise<BlogTag[]> {
  try {
    const { data, error } = await supabase
      .from("blog_tags")
      .select("*")
      .order(sortBy, { ascending: sortDirection === "asc" });

    if (error) throw error;
    return data || [];
  } catch (error) {
    throw new Error(
      `Failed to fetch tags: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Get popular tags (sorted by usage count)
 */
export async function getPopularTags(limit: number = 10): Promise<BlogTag[]> {
  try {
    const { data, error } = await supabase
      .from("blog_tags")
      .select("*")
      .order("usage_count", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    throw new Error(
      `Failed to fetch popular tags: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Get single tag by ID
 */
export async function getTagById(tagId: string): Promise<BlogTag | null> {
  try {
    const { data, error } = await supabase
      .from("blog_tags")
      .select("*")
      .eq("id", tagId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(
      `Failed to fetch tag: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Get single tag by slug
 */
export async function getTagBySlug(slug: string): Promise<BlogTag | null> {
  try {
    const { data, error } = await supabase
      .from("blog_tags")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(
      `Failed to fetch tag by slug: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Search tags by name
 */
export async function searchTags(query: string): Promise<BlogTag[]> {
  try {
    const { data, error } = await supabase
      .from("blog_tags")
      .select("*")
      .ilike("name", `%${query}%`)
      .order("usage_count", { ascending: false })
      .limit(20);

    if (error) throw error;
    return data || [];
  } catch (error) {
    throw new Error(
      `Failed to search tags: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Get tag with post count
 */
export async function getTagWithPostCount(tagId: string): Promise<{
  tag: BlogTag;
  post_count: number;
} | null> {
  try {
    const tag = await getTagById(tagId);
    if (!tag) return null;

    const { count, error } = await supabase
      .from("blog_post_tags")
      .select("*", { count: "exact", head: true })
      .eq("tag_id", tagId);

    if (error) throw error;

    return {
      tag,
      post_count: count || 0,
    };
  } catch (error) {
    throw new Error(
      `Failed to fetch tag with post count: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Get all tags with post counts
 */
export async function getTagsWithPostCounts(): Promise<
  Array<{
    tag: BlogTag;
    post_count: number;
  }>
> {
  try {
    const tags = await getTags();

    const tagsWithCounts = await Promise.all(
      tags.map(async (tag) => {
        const { count, error } = await supabase
          .from("blog_post_tags")
          .select("*", { count: "exact", head: true })
          .eq("tag_id", tag.id);

        if (error) throw error;

        return {
          tag,
          post_count: count || 0,
        };
      })
    );

    return tagsWithCounts;
  } catch (error) {
    throw new Error(
      `Failed to fetch tags with post counts: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Create new tag
 */
export async function createTag(input: CreateTagInput): Promise<BlogTag> {
  try {
    // Validate input
    const validation = validateTag(input);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
    }

    // Generate slug if not provided
    const slug = input.slug || generateSlug(input.name);

    // Check if slug already exists
    const existing = await getTagBySlug(slug);
    if (existing) {
      throw new Error(`Tag with slug "${slug}" already exists`);
    }

    // Create tag
    const { data, error } = await supabase
      .from("blog_tags")
      .insert({
        name: input.name,
        slug,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(
      `Failed to create tag: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Update existing tag
 */
export async function updateTag(input: UpdateTagInput): Promise<BlogTag> {
  try {
    // Validate input
    const validation = validateTag(input);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
    }

    const { id, ...updateData } = input;

    // If slug is being updated, check for conflicts
    if (updateData.slug) {
      const existing = await getTagBySlug(updateData.slug);
      if (existing && existing.id !== id) {
        throw new Error(`Tag with slug "${updateData.slug}" already exists`);
      }
    }

    // Update tag
    const { data, error } = await supabase
      .from("blog_tags")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(
      `Failed to update tag: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Delete tag
 * Note: This will fail if tag has posts (foreign key constraint)
 */
export async function deleteTag(tagId: string): Promise<void> {
  try {
    // Check if tag has posts
    const { count, error: countError } = await supabase
      .from("blog_post_tags")
      .select("*", { count: "exact", head: true })
      .eq("tag_id", tagId);

    if (countError) throw countError;

    if (count && count > 0) {
      throw new Error(
        `Cannot delete tag with ${count} post(s). Remove posts from this tag first.`
      );
    }

    // Delete tag
    const { error } = await supabase.from("blog_tags").delete().eq("id", tagId);

    if (error) throw error;
  } catch (error) {
    throw new Error(
      `Failed to delete tag: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Get or create tag by name
 * Useful for auto-creating tags when user types new ones
 */
export async function getOrCreateTag(name: string): Promise<BlogTag> {
  try {
    const slug = generateSlug(name);

    // Try to find existing tag
    const existing = await getTagBySlug(slug);
    if (existing) return existing;

    // Create new tag
    return await createTag({ name, slug });
  } catch (error) {
    throw new Error(
      `Failed to get or create tag: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Bulk create or get tags
 * Useful for handling multiple tags at once
 */
export async function getOrCreateTags(names: string[]): Promise<BlogTag[]> {
  try {
    const tags = await Promise.all(names.map((name) => getOrCreateTag(name)));
    return tags;
  } catch (error) {
    throw new Error(
      `Failed to get or create tags: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Clean up unused tags (tags with 0 usage_count)
 */
export async function cleanupUnusedTags(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("blog_tags")
      .delete()
      .eq("usage_count", 0)
      .select();

    if (error) throw error;
    return data?.length || 0;
  } catch (error) {
    throw new Error(
      `Failed to cleanup unused tags: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// ============================================================================
// SAFE VERSIONS WITH RESULT TYPE
// ============================================================================

export async function getTagsSafe(
  sortBy?: "name" | "usage_count" | "created_at",
  sortDirection?: "asc" | "desc"
): Promise<Result<BlogTag[]>> {
  try {
    const data = await getTags(sortBy, sortDirection);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

export async function createTagSafe(
  input: CreateTagInput
): Promise<Result<BlogTag>> {
  try {
    const data = await createTag(input);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

export async function updateTagSafe(
  input: UpdateTagInput
): Promise<Result<BlogTag>> {
  try {
    const data = await updateTag(input);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

export async function deleteTagSafe(tagId: string): Promise<Result<void>> {
  try {
    await deleteTag(tagId);
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

export async function searchTagsSafe(
  query: string
): Promise<Result<BlogTag[]>> {
  try {
    const data = await searchTags(query);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}
