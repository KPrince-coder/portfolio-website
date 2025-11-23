/**
 * SEO Types
 *
 * Type definitions for SEO utilities
 *
 * @module utils/seo.types
 */

/**
 * Configuration for updating meta tags
 */
export interface MetaTagConfig {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

/**
 * Meta tag attribute types
 */
export type MetaTagAttribute = "name" | "property";

/**
 * OG Image parameters
 */
export interface OGImageParams {
  title?: string;
  subtitle?: string;
  theme?: "light" | "dark";
  template?: string;
}
