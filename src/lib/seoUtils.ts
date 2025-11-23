/**
 * SEO Utilities
 *
 * Helper functions for SEO optimization:
 * - Slug generation
 * - Read time calculation
 * - Excerpt extraction
 * - Meta tags generation
 * - Structured data generation
 *
 * @module lib/seoUtils
 */

import type {
  BlogPost,
  BlogPostWithRelations,
} from "@/components/admin/blog/types";

// ============================================================================
// TYPES
// ============================================================================

export interface MetaTags {
  title: string;
  description: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
}

export interface StructuredData {
  "@context": string;
  "@type": string;
  headline: string;
  description?: string;
  image?: string | string[];
  datePublished?: string;
  dateModified?: string;
  author?: {
    "@type": string;
    name: string;
  };
  publisher?: {
    "@type": string;
    name: string;
    logo?: {
      "@type": string;
      url: string;
    };
  };
  mainEntityOfPage?: {
    "@type": string;
    "@id": string;
  };
}

// ============================================================================
// CONSTANTS
// ============================================================================

const WORDS_PER_MINUTE = 200; // Average reading speed
const EXCERPT_MAX_LENGTH = 160; // Optimal for meta descriptions

// ============================================================================
// SLUG GENERATION
// ============================================================================

/**
 * Generate URL-friendly slug from title
 *
 * @param title - Post title
 * @returns URL-friendly slug
 *
 * @example
 * generateSlug('Hello World!') // 'hello-world'
 * generateSlug('React & TypeScript') // 'react-typescript'
 */
export function generateSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .trim()
      // Remove special characters except spaces and hyphens
      .replace(/[^\w\s-]/g, "")
      // Replace spaces with hyphens
      .replace(/\s+/g, "-")
      // Replace multiple hyphens with single hyphen
      .replace(/-+/g, "-")
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, "")
  );
}

// ============================================================================
// READ TIME CALCULATION
// ============================================================================

/**
 * Calculate estimated reading time in minutes
 *
 * @param content - Post content (Markdown or plain text)
 * @returns Reading time in minutes
 *
 * @example
 * calculateReadTime('Lorem ipsum...') // 5
 */
export function calculateReadTime(content: string): number {
  // Remove Markdown formatting
  const plainText = content
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, "")
    // Remove inline code
    .replace(/`[^`]+`/g, "")
    // Remove headers
    .replace(/#{1,6}\s/g, "")
    // Remove bold/italic
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    // Remove links
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    // Remove images
    .replace(/!\[.*?\]\(.*?\)/g, "")
    // Remove HTML tags
    .replace(/<[^>]*>/g, "")
    .trim();

  // Count words
  const words = plainText.split(/\s+/).filter(Boolean).length;

  // Calculate reading time
  const minutes = Math.ceil(words / WORDS_PER_MINUTE);

  // Minimum 1 minute
  return Math.max(1, minutes);
}

// ============================================================================
// EXCERPT EXTRACTION
// ============================================================================

/**
 * Extract excerpt from content
 *
 * @param content - Post content (Markdown or plain text)
 * @param maxLength - Maximum length (default: 160)
 * @returns Excerpt text
 *
 * @example
 * extractExcerpt('Lorem ipsum...', 100) // 'Lorem ipsum...'
 */
export function extractExcerpt(
  content: string,
  maxLength: number = EXCERPT_MAX_LENGTH
): string {
  // Remove Markdown formatting
  const plainText = content
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, "")
    // Remove inline code
    .replace(/`[^`]+`/g, "")
    // Remove headers
    .replace(/#{1,6}\s/g, "")
    // Remove bold/italic
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    // Remove links (keep text)
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    // Remove images
    .replace(/!\[.*?\]\(.*?\)/g, "")
    // Remove HTML tags
    .replace(/<[^>]*>/g, "")
    // Remove extra whitespace
    .replace(/\s+/g, " ")
    .trim();

  // If content is shorter than max length, return as is
  if (plainText.length <= maxLength) {
    return plainText;
  }

  // Truncate at word boundary
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + "...";
  }

  return truncated + "...";
}

// ============================================================================
// META TAGS GENERATION
// ============================================================================

/**
 * Generate meta tags for a blog post
 *
 * @param post - Blog post with relations
 * @param siteUrl - Base site URL
 * @returns Meta tags object
 *
 * @example
 * generateMetaTags(post, 'https://example.com')
 */
export function generateMetaTags(
  post: BlogPostWithRelations,
  siteUrl: string = ""
): MetaTags {
  const title = post.title;
  const description = post.excerpt || extractExcerpt(post.content);
  const image = post.featured_image || "";
  const url = `${siteUrl}/blog/${post.slug}`;

  // Extract keywords from tags
  const keywords = post.tags?.map((tag) => tag.name) || [];

  return {
    // Basic meta tags
    title,
    description,
    keywords,
    canonicalUrl: url,

    // Open Graph tags
    ogTitle: title,
    ogDescription: description,
    ogImage: image,
    ogType: "article",

    // Twitter Card tags
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
  };
}

// ============================================================================
// STRUCTURED DATA GENERATION
// ============================================================================

/**
 * Generate Schema.org structured data (JSON-LD) for a blog post
 *
 * @param post - Blog post with relations
 * @param siteUrl - Base site URL
 * @param siteName - Site name
 * @param siteLogoUrl - Site logo URL
 * @returns Structured data object
 *
 * @example
 * generateStructuredData(post, 'https://example.com', 'My Blog', 'https://example.com/logo.png')
 */
export function generateStructuredData(
  post: BlogPostWithRelations,
  siteUrl: string = "",
  siteName: string = "",
  siteLogoUrl: string = ""
): StructuredData {
  const url = `${siteUrl}/blog/${post.slug}`;
  const imageUrl = post.featured_image || "";

  const structuredData: StructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || extractExcerpt(post.content),
    image: imageUrl ? [imageUrl] : undefined,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  // Add author if available
  if (post.author) {
    structuredData.author = {
      "@type": "Person",
      name: post.author.full_name || "Anonymous",
    };
  }

  // Add publisher if site info available
  if (siteName) {
    structuredData.publisher = {
      "@type": "Organization",
      name: siteName,
      logo: siteLogoUrl
        ? {
            "@type": "ImageObject",
            url: siteLogoUrl,
          }
        : undefined,
    };
  }

  return structuredData;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validate slug format
 *
 * @param slug - Slug to validate
 * @returns True if valid
 */
export function isValidSlug(slug: string): boolean {
  // Slug should only contain lowercase letters, numbers, and hyphens
  // Should not start or end with hyphen
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Sanitize slug (ensure it's valid)
 *
 * @param slug - Slug to sanitize
 * @returns Sanitized slug
 */
export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Generate unique slug by appending number if needed
 *
 * @param baseSlug - Base slug
 * @param existingSlugs - Array of existing slugs
 * @returns Unique slug
 */
export function generateUniqueSlug(
  baseSlug: string,
  existingSlugs: string[]
): string {
  let slug = baseSlug;
  let counter = 1;

  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Truncate text at word boundary
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add (default: '...')
 * @returns Truncated text
 */
export function truncateText(
  text: string,
  maxLength: number,
  suffix: string = "..."
): string {
  if (text.length <= maxLength) {
    return text;
  }

  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + suffix;
  }

  return truncated + suffix;
}

/**
 * Count words in text
 *
 * @param text - Text to count
 * @returns Word count
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Estimate content length category
 *
 * @param content - Content to analyze
 * @returns Length category
 */
export function getContentLength(content: string): "short" | "medium" | "long" {
  const words = countWords(content);

  if (words < 500) return "short";
  if (words < 1500) return "medium";
  return "long";
}
