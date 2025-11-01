/**
 * Robots.txt Generator
 *
 * Generates robots.txt file for SEO with:
 * - User-agent rules
 * - Sitemap location
 * - Crawl delay settings
 * - Disallow rules
 *
 * @module lib/robotsTxtGenerator
 */

// ============================================================================
// TYPES
// ============================================================================

interface RobotsTxtOptions {
  baseUrl: string;
  allowAll?: boolean;
  disallowPaths?: string[];
  crawlDelay?: number;
  sitemapPath?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_OPTIONS: Required<RobotsTxtOptions> = {
  baseUrl: "https://yourdomain.com",
  allowAll: true,
  disallowPaths: ["/admin", "/api"],
  crawlDelay: 0,
  sitemapPath: "/sitemap.xml",
};

// ============================================================================
// MAIN FUNCTION
// ============================================================================

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(
  options: Partial<RobotsTxtOptions> = {}
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  let content = "# Robots.txt\n";
  content += "# Generated automatically\n\n";

  // User-agent rules
  content += "User-agent: *\n";

  if (opts.allowAll) {
    content += "Allow: /\n";
  }

  // Disallow paths
  if (opts.disallowPaths.length > 0) {
    opts.disallowPaths.forEach((path) => {
      content += `Disallow: ${path}\n`;
    });
  }

  // Crawl delay
  if (opts.crawlDelay > 0) {
    content += `Crawl-delay: ${opts.crawlDelay}\n`;
  }

  content += "\n";

  // Sitemap location
  if (opts.sitemapPath) {
    const sitemapUrl = `${opts.baseUrl}${opts.sitemapPath}`;
    content += `Sitemap: ${sitemapUrl}\n`;
  }

  return content;
}

/**
 * Generate robots.txt and save to file (for build-time generation)
 */
export function generateRobotsTxtFile(
  outputPath: string,
  options: Partial<RobotsTxtOptions> = {}
): void {
  const content = generateRobotsTxt(options);

  // In a real implementation, you would write to file system
  // For now, we'll just log it
  console.log("Robots.txt generated:", content);
  console.log("Output path:", outputPath);

  // Example: fs.writeFileSync(outputPath, content, 'utf-8');
}

/**
 * Get robots.txt as response (for API endpoint)
 */
export function getRobotsTxtResponse(
  options: Partial<RobotsTxtOptions> = {}
): Response {
  const content = generateRobotsTxt(options);

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400", // Cache for 24 hours
    },
  });
}
