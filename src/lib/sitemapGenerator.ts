/**
 * Sitemap Generator
 *
 * Generates XML sitemap for blog posts with:
 * - Dynamic sitemap generation
 * - Priority and frequency settings
 * - Last modified dates
 * - Multiple URL support
 *
 * @module lib/sitemapGenerator
 */

import { getPosts } from "@/services/blogService";
import type { BlogPostWithRelations } from "@/components/admin/blog/types";
import { SEO_CONFIG } from "@/config/seo.config";

// ============================================================================
// TYPES
// ============================================================================

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
}

interface SitemapOptions {
  baseUrl: string;
  includeStaticPages?: boolean;
  includeBlogPosts?: boolean;
  includeCategories?: boolean;
  includeTags?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_OPTIONS: Required<SitemapOptions> = {
  baseUrl: SEO_CONFIG.siteUrl,
  includeStaticPages: true,
  includeBlogPosts: true,
  includeCategories: true,
  includeTags: true,
};

// Static pages configuration
const STATIC_PAGES: SitemapUrl[] = [
  {
    loc: "/",
    changefreq: "daily",
    priority: 1.0,
  },
  {
    loc: "/blog",
    changefreq: "daily",
    priority: 0.9,
  },
];

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Format date to W3C format (YYYY-MM-DD)
 */
function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().split("T")[0];
}

/**
 * Generate URL entry XML
 */
function generateUrlEntry(url: SitemapUrl, baseUrl: string): string {
  const loc = `${baseUrl}${url.loc}`.replace(/([^:]\/)\/+/g, "$1"); // Remove double slashes

  let xml = "  <url>\n";
  xml += `    <loc>${escapeXml(loc)}</loc>\n`;

  if (url.lastmod) {
    xml += `    <lastmod>${formatDate(url.lastmod)}</lastmod>\n`;
  }

  if (url.changefreq) {
    xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
  }

  if (url.priority !== undefined) {
    xml += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
  }

  xml += "  </url>\n";

  return xml;
}

// ============================================================================
// MAIN FUNCTIONS
// ============================================================================

/**
 * Generate sitemap XML
 */
export async function generateSitemap(
  options: Partial<SitemapOptions> = {}
): Promise<string> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const urls: SitemapUrl[] = [];

  // Add static pages
  if (opts.includeStaticPages) {
    urls.push(...STATIC_PAGES);
  }

  // Add blog posts
  if (opts.includeBlogPosts) {
    try {
      const response = await getPosts(
        { status: "published" },
        { field: "published_at", direction: "desc" },
        { page: 1, per_page: 1000 } // Get all published posts
      );

      const postUrls: SitemapUrl[] = response.data.map((post) => ({
        loc: `/blog/${post.slug}`,
        lastmod: post.updated_at || post.published_at || post.created_at,
        changefreq: "weekly",
        priority: post.is_featured ? 0.8 : 0.7,
      }));

      urls.push(...postUrls);
    } catch (error) {
      console.error("Failed to fetch blog posts for sitemap:", error);
    }
  }

  // Generate XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  urls.forEach((url) => {
    xml += generateUrlEntry(url, opts.baseUrl);
  });

  xml += "</urlset>";

  return xml;
}

/**
 * Generate sitemap and save to file (for build-time generation)
 */
export async function generateSitemapFile(
  outputPath: string,
  options: Partial<SitemapOptions> = {}
): Promise<void> {
  const sitemap = await generateSitemap(options);

  // In a real implementation, you would write to file system
  // For now, we'll just log it
  console.log("Sitemap generated:", sitemap);
  console.log("Output path:", outputPath);

  // Example: fs.writeFileSync(outputPath, sitemap, 'utf-8');
}

/**
 * Get sitemap as response (for API endpoint)
 */
export async function getSitemapResponse(
  options: Partial<SitemapOptions> = {}
): Promise<Response> {
  const sitemap = await generateSitemap(options);

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600", // Cache for 1 hour
    },
  });
}

// ============================================================================
// SITEMAP INDEX (for large sites)
// ============================================================================

/**
 * Generate sitemap index for multiple sitemaps
 */
export function generateSitemapIndex(
  sitemaps: string[],
  baseUrl: string
): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  sitemaps.forEach((sitemap) => {
    xml += "  <sitemap>\n";
    xml += `    <loc>${escapeXml(`${baseUrl}${sitemap}`)}</loc>\n`;
    xml += `    <lastmod>${formatDate(new Date())}</lastmod>\n`;
    xml += "  </sitemap>\n";
  });

  xml += "</sitemapindex>";

  return xml;
}
