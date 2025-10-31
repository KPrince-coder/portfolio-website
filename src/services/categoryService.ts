/**
 * Category Service
 *
 * Blog category management with:
 * - CRUD operations
 * - Slug generation
 * - Post count tracking
 * - Sorting and ordering
 * - Validation
 *
 * @module categoryService
 */

import { supabase } from "@/integrations/supabase/client";
import type {
  BlogCategory,
  CreateCategoryInput,
  UpdateCategoryInput,
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
 * Validate category input
 */
function validateCategory(input: CreateCategoryInput | UpdateCategoryInput): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if ("name" in input && input.name) {
    if (input.name.length < 2) {
      errors.push("Category name must be at least 2 characters");
    }
    if (input.name.length > 50) {
      errors.push("Category name must be less than 50 characters");
    }
  }

  if (input.color && !/^#[0-9A-F]{6}$/i.test(input.color)) {
    errors.push("Color must be a valid hex color (e.g., #3B82F6)");
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
 * Get all categories with optional sorting
 *
 * @param sortBy - Field to sort by
 * @param sortDirection - Sort direction
 * @returns Array of categories
 *
 * @example
 * ```typescript
 * const categories = await getCategories('display_order', 'asc');
 * ```
 */
export async function getCategories(
  sortBy: "name" | "display_order" | "created_at" = "display_order",
  sortDirection: "asc" | "desc" = "asc"
): Promise<BlogCategory[]> {
  try {
    const { data, error } = await supabase
      .from("blog_categories")
      .select("*")
      .order(sortBy, { ascending: sortDirection === "asc" });

    if (error) throw error;
    return data || [];
  } catch (error) {
    throw new Error(
      `Failed to fetch categories: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Get single category by ID
 */
export async function getCategoryById(
  categoryId: string
): Promise<BlogCategory | null> {
  try {
    const { data, error } = await supabase
      .from("blog_categories")
      .select("*")
      .eq("id", categoryId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(
      `Failed to fetch category: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Get single category by slug
 */
export async function getCategoryBySlug(
  slug: string
): Promise<BlogCategory | null> {
  try {
    const { data, error } = await supabase
      .from("blog_categories")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(
      `Failed to fetch category by slug: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Get category with post count
 */
export async function getCategoryWithPostCount(categoryId: string): Promise<{
  category: BlogCategory;
  post_count: number;
} | null> {
  try {
    const category = await getCategoryById(categoryId);
    if (!category) return null;

    const { count, error } = await supabase
      .from("blog_post_categories")
      .select("*", { count: "exact", head: true })
      .eq("category_id", categoryId);

    if (error) throw error;

    return {
      category,
      post_count: count || 0,
    };
  } catch (error) {
    throw new Error(
      `Failed to fetch category with post count: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Get all categories with post counts
 */
export async function getCategoriesWithPostCounts(): Promise<
  Array<{
    category: BlogCategory;
    post_count: number;
  }>
> {
  try {
    const categories = await getCategories();

    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const { count, error } = await supabase
          .from("blog_post_categories")
          .select("*", { count: "exact", head: true })
          .eq("category_id", category.id);

        if (error) throw error;

        return {
          category,
          post_count: count || 0,
        };
      })
    );

    return categoriesWithCounts;
  } catch (error) {
    throw new Error(
      `Failed to fetch categories with post counts: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Create new category
 */
export async function createCategory(
  input: CreateCategoryInput
): Promise<BlogCategory> {
  try {
    // Validate input
    const validation = validateCategory(input);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
    }

    // Generate slug if not provided
    const slug = input.slug || generateSlug(input.name);

    // Check if slug already exists
    const existing = await getCategoryBySlug(slug);
    if (existing) {
      throw new Error(`Category with slug "${slug}" already exists`);
    }

    // Get next display order
    const { data: categories } = await supabase
      .from("blog_categories")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1);

    const nextOrder =
      categories && categories.length > 0
        ? (categories[0].display_order || 0) + 1
        : 0;

    // Create category
    const { data, error } = await supabase
      .from("blog_categories")
      .insert({
        name: input.name,
        slug,
        description: input.description,
        color: input.color || "#3B82F6",
        icon: input.icon,
        display_order: input.display_order ?? nextOrder,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(
      `Failed to create category: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Update existing category
 */
export async function updateCategory(
  input: UpdateCategoryInput
): Promise<BlogCategory> {
  try {
    // Validate input
    const validation = validateCategory(input);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
    }

    const { id, ...updateData } = input;

    // If slug is being updated, check for conflicts
    if (updateData.slug) {
      const existing = await getCategoryBySlug(updateData.slug);
      if (existing && existing.id !== id) {
        throw new Error(
          `Category with slug "${updateData.slug}" already exists`
        );
      }
    }

    // Update category
    const { data, error } = await supabase
      .from("blog_categories")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(
      `Failed to update category: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Delete category
 * Note: This will fail if category has posts (foreign key constraint)
 */
export async function deleteCategory(categoryId: string): Promise<void> {
  try {
    // Check if category has posts
    const { count, error: countError } = await supabase
      .from("blog_post_categories")
      .select("*", { count: "exact", head: true })
      .eq("category_id", categoryId);

    if (countError) throw countError;

    if (count && count > 0) {
      throw new Error(
        `Cannot delete category with ${count} post(s). Remove posts from this category first.`
      );
    }

    // Delete category
    const { error } = await supabase
      .from("blog_categories")
      .delete()
      .eq("id", categoryId);

    if (error) throw error;
  } catch (error) {
    throw new Error(
      `Failed to delete category: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Reorder categories
 */
export async function reorderCategories(categoryIds: string[]): Promise<void> {
  try {
    // Update display_order for each category
    const updates = categoryIds.map((id, index) =>
      supabase
        .from("blog_categories")
        .update({ display_order: index })
        .eq("id", id)
    );

    await Promise.all(updates);
  } catch (error) {
    throw new Error(
      `Failed to reorder categories: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// ============================================================================
// SAFE VERSIONS WITH RESULT TYPE
// ============================================================================

export async function getCategoriesSafe(
  sortBy?: "name" | "display_order" | "created_at",
  sortDirection?: "asc" | "desc"
): Promise<Result<BlogCategory[]>> {
  try {
    const data = await getCategories(sortBy, sortDirection);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

export async function createCategorySafe(
  input: CreateCategoryInput
): Promise<Result<BlogCategory>> {
  try {
    const data = await createCategory(input);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

export async function updateCategorySafe(
  input: UpdateCategoryInput
): Promise<Result<BlogCategory>> {
  try {
    const data = await updateCategory(input);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

export async function deleteCategorySafe(
  categoryId: string
): Promise<Result<void>> {
  try {
    await deleteCategory(categoryId);
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}
