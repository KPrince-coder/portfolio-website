/**
 * Blog Types
 *
 * TypeScript type definitions for blog system
 * Comprehensive types with strict null checks
 *
 * @module blog/types
 */

// ============================================================================
// ENUMS
// ============================================================================

export type BlogPostStatus = "draft" | "published" | "scheduled" | "archived";

export type ImageFormat = "jpeg" | "jpg" | "png" | "webp" | "gif";

// ============================================================================
// CORE TYPES
// ============================================================================

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  status: BlogPostStatus;
  published_at?: string;
  scheduled_for?: string;
  view_count: number;
  read_time_minutes?: number;
  comments_enabled: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogSEOMetadata {
  post_id: string;
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  keywords?: string[];
  canonical_url?: string;
  robots_meta: string;
  created_at: string;
  updated_at: string;
}

export interface BlogImage {
  id: string;
  post_id?: string;
  original_url: string;
  storage_path: string;
  optimized_url: string;
  thumbnail_url?: string;
  medium_url?: string;
  large_url?: string;
  webp_url?: string;
  alt_text?: string;
  caption?: string;
  width?: number;
  height?: number;
  file_size?: number;
  optimized_size?: number;
  format?: ImageFormat;
  compression_ratio?: number;
  is_featured: boolean;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// EXTENDED TYPES WITH RELATIONS
// ============================================================================

export interface BlogPostWithRelations extends BlogPost {
  categories?: BlogCategory[];
  tags?: BlogTag[];
  seo_metadata?: BlogSEOMetadata;
  featured_image_data?: BlogImage;
  author?: {
    id: string;
    full_name?: string;
    avatar_url?: string;
  };
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface CreateBlogPostInput {
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  status?: BlogPostStatus;
  scheduled_for?: string;
  comments_enabled?: boolean;
  is_featured?: boolean;
  category_ids?: string[];
  tag_ids?: string[];
  seo_metadata?: Partial<BlogSEOMetadata>;
}

export interface UpdateBlogPostInput extends Partial<CreateBlogPostInput> {
  id: string;
}

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  description?: string;
  color?: string;
  icon?: string;
  display_order?: number;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  id: string;
}

export interface CreateTagInput {
  name: string;
  slug?: string;
}

export interface UpdateTagInput extends Partial<CreateTagInput> {
  id: string;
}

// ============================================================================
// FILTER & QUERY TYPES
// ============================================================================

export interface BlogPostFilters {
  status?: BlogPostStatus | BlogPostStatus[];
  category_id?: string;
  tag_id?: string;
  search?: string;
  is_featured?: boolean;
  user_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface BlogPostSortOptions {
  field: "created_at" | "published_at" | "updated_at" | "view_count" | "title";
  direction: "asc" | "desc";
}

export interface PaginationOptions {
  page: number;
  per_page: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// ============================================================================
// RESULT TYPES
// ============================================================================

export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface BlogAnalytics {
  total_posts: number;
  published_posts: number;
  draft_posts: number;
  total_views: number;
  total_categories: number;
  total_tags: number;
  popular_posts: BlogPost[];
  recent_posts: BlogPost[];
  trending_tags: BlogTag[];
}

// ============================================================================
// SEARCH TYPES
// ============================================================================

export interface SearchResult {
  post: BlogPost;
  rank: number;
  highlight?: {
    title?: string;
    excerpt?: string;
    content?: string;
  };
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}
