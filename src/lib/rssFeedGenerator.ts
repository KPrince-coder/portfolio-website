/**
 * RSS Feed Generator
 *
 * Generates RSS 2.0 feed for blog posts with:
 * - Dynamic feed generation
 * - Full content or excerpt
 * - Categories and tags
 * - Media enclosures
 *
 * @module lib/rssFeedGenerator
 */

import { getPosts } from "@/services/blogService";
import type { BlogPostWithRelations } from "@/components/admin/blog/types";

// ============================================================================
// TYPES
// ============================================================================

interface RSSFeedOptions {
  baseUrl: string;
  title: string;
  description: string;
  language?: string;
  copyright?: string;
  managingEditor?: string;
  webMaster?: string;
  maxItems?: number;
  includeFullContent?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_OPTIONS: Required<RSSFeedOptions> = {
  baseUrl: "https://yourdomain.com",
  title: "Your Blog",
  description: "Latest blog posts and articles",
  language: "en-us",
  copyright: `Copyright ${new Date().getFullYear()}`,
  managingEditor: "editor@yourdomain.com",
  webMaster: "webmaster@yourdomain.com",
  maxItems: 50,
  includeFullContent: false,
};

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
 * Format date to RFC 822 format (required by RSS)
 */
function formatRFC822Date(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toUTCString();
}

/**
 * Strip HTML tags from content
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

/**
 * Convert markdown to plain text (simple version)
 */
function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/#{1,6}\s/g, "") // Remove headers
    .replace(/\*\*(.+?)\*\*/g, "$1") // Remove bold
    .replace(/\*(.+?)\*/g, "$1") // Remove italic
    .replace(/\[(.+?)\]\(.+?\)/g, "$1") // Remove links
    .replace(/`(.+?)`/g, "$1") // Remove code
    .replace(/\n{2,}/g, "\n\n") // Normalize line breaks
    .trim();
}

/**
 * Generate RSS item XML
 */
function generateRSSItem(
  post: BlogPostWithRelations,
  baseUrl: string,
  includeFullContent: boolean
): string {
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  const pubDate = formatRFC822Date(post.published_at || post.created_at);

  let xml = "    <item>\n";
  xml += `      <title>${escapeXml(post.title)}</title>\n`;
  xml += `      <link>${escapeXml(postUrl)}</link>\n`;
  xml += `      <guid isPermaLink="true">${escapeXml(postUrl)}</guid>\n`;
  xml += `      <pubDate>${pubDate}</pubDate>\n`;

  // Description (excerpt or full content)
  const description = includeFullContent
    ? markdownToPlainText(post.content)
    : post.excerpt ||
      markdownToPlainText(post.content.substring(0, 300)) + "...";

  xml += `      <description><![CDATA[${description}]]></description>\n`;

  // Full content (optional)
  if (includeFullContent) {
    xml += `      <content:encoded><![CDATA[${post.content}]]></content:encoded>\n`;
  }

  // Author
  if (post.author?.full_name) {
    xml += `      <author>${escapeXml(post.author.full_name)}</author>\n`;
  }

  // Categories
  if (post.categories && post.categories.length > 0) {
    post.categories.forEach((category) => {
      xml += `      <category>${escapeXml(category.name)}</category>\n`;
    });
  }

  // Featured image as enclosure
  if (post.featured_image) {
    xml += `      <enclosure url="${escapeXml(
      post.featured_image
    )}" type="image/jpeg" />\n`;
  }

  xml += "    </item>\n";

  return xml;
}

// ============================================================================
// MAIN FUNCTIONS
// ============================================================================

/**
 * Generate RSS feed XML
 */
export async function generateRSSFeed(
  options: Partial<RSSFeedOptions> = {}
): Promise<string> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Fetch published posts
  let posts: BlogPostWithRelations[] = [];
  try {
    const response = await getPosts(
      { status: "published" },
      { field: "published_at", direction: "desc" },
      { page: 1, per_page: opts.maxItems }
    );
    posts = response.data;
  } catch (error) {
    console.error("Failed to fetch blog posts for RSS feed:", error);
  }

  // Generate XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml +=
    '<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">\n';
  xml += "  <channel>\n";

  // Channel metadata
  xml += `    <title>${escapeXml(opts.title)}</title>\n`;
  xml += `    <link>${escapeXml(opts.baseUrl)}</link>\n`;
  xml += `    <description>${escapeXml(opts.description)}</description>\n`;
  xml += `    <language>${opts.language}</language>\n`;
  xml += `    <copyright>${escapeXml(opts.copyright)}</copyright>\n`;
  xml += `    <managingEditor>${escapeXml(
    opts.managingEditor
  )}</managingEditor>\n`;
  xml += `    <webMaster>${escapeXml(opts.webMaster)}</webMaster>\n`;
  xml += `    <lastBuildDate>${formatRFC822Date(new Date())}</lastBuildDate>\n`;
  xml += `    <atom:link href="${escapeXml(
    opts.baseUrl
  )}/rss.xml" rel="self" type="application/rss+xml" />\n`;

  // Items
  posts.forEach((post) => {
    xml += generateRSSItem(post, opts.baseUrl, opts.includeFullContent);
  });

  xml += "  </channel>\n";
  xml += "</rss>";

  return xml;
}

/**
 * Generate RSS feed and save to file (for build-time generation)
 */
export async function generateRSSFeedFile(
  outputPath: string,
  options: Partial<RSSFeedOptions> = {}
): Promise<void> {
  const feed = await generateRSSFeed(options);

  // In a real implementation, you would write to file system
  // For now, we'll just log it
  console.log("RSS feed generated:", feed);
  console.log("Output path:", outputPath);

  // Example: fs.writeFileSync(outputPath, feed, 'utf-8');
}

/**
 * Get RSS feed as response (for API endpoint)
 */
export async function getRSSFeedResponse(
  options: Partial<RSSFeedOptions> = {}
): Promise<Response> {
  const feed = await generateRSSFeed(options);

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml",
      "Cache-Control": "public, max-age=3600", // Cache for 1 hour
    },
  });
}

// ============================================================================
// ATOM FEED (alternative format)
// ============================================================================

/**
 * Generate Atom feed (alternative to RSS)
 */
export async function generateAtomFeed(
  options: Partial<RSSFeedOptions> = {}
): Promise<string> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Fetch published posts
  let posts: BlogPostWithRelations[] = [];
  try {
    const response = await getPosts(
      { status: "published" },
      { field: "published_at", direction: "desc" },
      { page: 1, per_page: opts.maxItems }
    );
    posts = response.data;
  } catch (error) {
    console.error("Failed to fetch blog posts for Atom feed:", error);
  }

  // Generate XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<feed xmlns="http://www.w3.org/2005/Atom">\n';

  // Feed metadata
  xml += `  <title>${escapeXml(opts.title)}</title>\n`;
  xml += `  <link href="${escapeXml(opts.baseUrl)}" />\n`;
  xml += `  <link href="${escapeXml(opts.baseUrl)}/atom.xml" rel="self" />\n`;
  xml += `  <updated>${new Date().toISOString()}</updated>\n`;
  xml += `  <id>${escapeXml(opts.baseUrl)}</id>\n`;

  // Entries
  posts.forEach((post) => {
    const postUrl = `${opts.baseUrl}/blog/${post.slug}`;
    const updated = post.updated_at || post.published_at || post.created_at;

    xml += "  <entry>\n";
    xml += `    <title>${escapeXml(post.title)}</title>\n`;
    xml += `    <link href="${escapeXml(postUrl)}" />\n`;
    xml += `    <id>${escapeXml(postUrl)}</id>\n`;
    xml += `    <updated>${new Date(updated).toISOString()}</updated>\n`;

    if (post.author?.full_name) {
      xml += "    <author>\n";
      xml += `      <name>${escapeXml(post.author.full_name)}</name>\n`;
      xml += "    </author>\n";
    }

    const summary =
      post.excerpt ||
      markdownToPlainText(post.content.substring(0, 300)) + "...";
    xml += `    <summary>${escapeXml(summary)}</summary>\n`;

    if (opts.includeFullContent) {
      xml += `    <content type="html"><![CDATA[${post.content}]]></content>\n`;
    }

    xml += "  </entry>\n";
  });

  xml += "</feed>";

  return xml;
}
