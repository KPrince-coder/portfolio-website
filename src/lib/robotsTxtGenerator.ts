/**
 * Robots.txt Generator - Optimized Version
 *
 * Generates robots.txt file for SEO with:
 * - User-agent rules
 * - Sitemap location
 * - Crawl delay settings
 * - Disallow rules
 * - Multiple user-agent support
 * - Validation and error handling
 *
 * @module lib/robotsTxtGenerator
 */

import { SEO_CONFIG } from "@/config/seo.config";

// ============================================================================
// TYPES
// ============================================================================

export interface RobotsTxtOptions {
  baseUrl?: string;
  allowAll?: boolean;
  disallowPaths?: string[];
  allowPaths?: string[];
  crawlDelay?: number;
  sitemapPath?: string | string[];
  userAgents?: UserAgentRule[];
}

export interface UserAgentRule {
  userAgent: string;
  allow?: string[];
  disallow?: string[];
  crawlDelay?: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_OPTIONS: Required<
  Omit<RobotsTxtOptions, "userAgents" | "allowPaths">
> = {
  baseUrl: SEO_CONFIG.siteUrl,
  allowAll: true,
  disallowPaths: ["/admin", "/api"],
  crawlDelay: 0,
  sitemapPath: "/sitemap.xml",
};

// Common bot user agents
export const COMMON_BOTS = {
  GOOGLE: "Googlebot",
  BING: "Bingbot",
  YAHOO: "Slurp",
  DUCKDUCKGO: "DuckDuckBot",
  BAIDU: "Baiduspider",
  YANDEX: "YandexBot",
  ALL: "*",
} as const;

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate robots.txt options
 */
function validateOptions(options: Partial<RobotsTxtOptions>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate baseUrl
  if (options.baseUrl) {
    try {
      new URL(options.baseUrl);
    } catch {
      errors.push(`Invalid baseUrl: ${options.baseUrl}`);
    }
  }

  // Validate crawl delay
  if (options.crawlDelay !== undefined && options.crawlDelay < 0) {
    errors.push("Crawl delay must be non-negative");
  }

  // Validate paths
  const validatePaths = (paths: string[] | undefined, name: string) => {
    if (paths) {
      paths.forEach((path) => {
        if (!path.startsWith("/")) {
          errors.push(`${name} must start with /: ${path}`);
        }
      });
    }
  };

  validatePaths(options.disallowPaths, "Disallow path");
  validatePaths(options.allowPaths, "Allow path");

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

/**
 * Generate robots.txt content
 *
 * @param options - Configuration options
 * @returns Generated robots.txt content
 *
 * @example
 * ```typescript
 * // Basic usage
 * const robotsTxt = generateRobotsTxt();
 *
 * // Custom configuration
 * const robotsTxt = generateRobotsTxt({
 *   disallowPaths: ['/admin', '/api', '/private'],
 *   crawlDelay: 1,
 *   sitemapPath: ['/sitemap.xml', '/sitemap-blog.xml']
 * });
 *
 * // Multiple user agents
 * const robotsTxt = generateRobotsTxt({
 *   userAgents: [
 *     {
 *       userAgent: 'Googlebot',
 *       allow: ['/'],
 *       disallow: ['/admin']
 *     },
 *     {
 *       userAgent: 'BadBot',
 *       disallow: ['/']
 *     }
 *   ]
 * });
 * ```
 */
export function generateRobotsTxt(
  options: Partial<RobotsTxtOptions> = {}
): string {
  // Validate options
  const validation = validateOptions(options);
  if (!validation.valid) {
    console.warn("Invalid robots.txt options:", validation.errors);
  }

  const opts = { ...DEFAULT_OPTIONS, ...options };

  let content = "# Robots.txt\n";
  content += "# Generated automatically\n";
  content += `# Last updated: ${new Date().toISOString()}\n\n`;

  // Handle custom user agents
  if (options.userAgents && options.userAgents.length > 0) {
    options.userAgents.forEach((rule) => {
      content += `User-agent: ${rule.userAgent}\n`;

      // Allow rules
      if (rule.allow && rule.allow.length > 0) {
        rule.allow.forEach((path) => {
          content += `Allow: ${path}\n`;
        });
      }

      // Disallow rules
      if (rule.disallow && rule.disallow.length > 0) {
        rule.disallow.forEach((path) => {
          content += `Disallow: ${path}\n`;
        });
      }

      // Crawl delay
      if (rule.crawlDelay !== undefined && rule.crawlDelay > 0) {
        content += `Crawl-delay: ${rule.crawlDelay}\n`;
      }

      content += "\n";
    });
  } else {
    // Default user-agent rules
    content += "User-agent: *\n";

    // Allow rules (if specified)
    if (options.allowPaths && options.allowPaths.length > 0) {
      options.allowPaths.forEach((path) => {
        content += `Allow: ${path}\n`;
      });
    } else if (opts.allowAll) {
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
  }

  // Sitemap location(s)
  const sitemaps = Array.isArray(opts.sitemapPath)
    ? opts.sitemapPath
    : [opts.sitemapPath];

  sitemaps.forEach((sitemap) => {
    if (sitemap) {
      const sitemapUrl = sitemap.startsWith("http")
        ? sitemap
        : `${opts.baseUrl}${sitemap}`;
      content += `Sitemap: ${sitemapUrl}\n`;
    }
  });

  return content;
}

// ============================================================================
// PRESET CONFIGURATIONS
// ============================================================================

/**
 * Generate robots.txt for production (allow all)
 */
export function generateProductionRobotsTxt(
  customOptions: Partial<RobotsTxtOptions> = {}
): string {
  return generateRobotsTxt({
    allowAll: true,
    disallowPaths: ["/admin", "/api", "/_next", "/private"],
    crawlDelay: 0,
    sitemapPath: ["/sitemap.xml", "/sitemap-blog.xml"],
    ...customOptions,
  });
}

/**
 * Generate robots.txt for staging (disallow all)
 */
export function generateStagingRobotsTxt(
  customOptions: Partial<RobotsTxtOptions> = {}
): string {
  return generateRobotsTxt({
    allowAll: false,
    disallowPaths: ["/"],
    crawlDelay: 0,
    ...customOptions,
  });
}

/**
 * Generate robots.txt with specific bot rules
 */
export function generateRobotsTxtWithBotRules(
  allowedBots: string[] = [COMMON_BOTS.GOOGLE, COMMON_BOTS.BING],
  customOptions: Partial<RobotsTxtOptions> = {}
): string {
  const userAgents: UserAgentRule[] = [
    // Allowed bots
    ...allowedBots.map((bot) => ({
      userAgent: bot,
      allow: ["/"],
      disallow: ["/admin", "/api"],
    })),
    // Block all other bots
    {
      userAgent: "*",
      disallow: ["/"],
    },
  ];

  return generateRobotsTxt({
    userAgents,
    ...customOptions,
  });
}

// ============================================================================
// FILE GENERATION
// ============================================================================

/**
 * Generate robots.txt and save to file (for build-time generation)
 *
 * @param outputPath - Path to save the file
 * @param options - Configuration options
 *
 * @example
 * ```typescript
 * // In a build script
 * generateRobotsTxtFile('./public/robots.txt', {
 *   disallowPaths: ['/admin', '/api']
 * });
 * ```
 */
export async function generateRobotsTxtFile(
  outputPath: string,
  options: Partial<RobotsTxtOptions> = {}
): Promise<void> {
  const content = generateRobotsTxt(options);

  // For Node.js environment (build scripts)
  if (typeof window === "undefined") {
    try {
      const fs = await import("fs/promises");
      await fs.writeFile(outputPath, content, "utf-8");
      console.log(`✅ Robots.txt generated at: ${outputPath}`);
    } catch (error) {
      console.error("❌ Failed to write robots.txt:", error);
      throw error;
    }
  } else {
    console.warn("⚠️ File generation only available in Node.js environment");
  }
}

// ============================================================================
// HTTP RESPONSE
// ============================================================================

/**
 * Get robots.txt as HTTP response (for API endpoint)
 *
 * @param options - Configuration options
 * @returns Response object with robots.txt content
 *
 * @example
 * ```typescript
 * // In an API route (e.g., /api/robots.txt)
 * export async function GET() {
 *   return getRobotsTxtResponse({
 *     disallowPaths: ['/admin', '/api']
 *   });
 * }
 * ```
 */
export function getRobotsTxtResponse(
  options: Partial<RobotsTxtOptions> = {}
): Response {
  const content = generateRobotsTxt(options);

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400", // Cache for 24 hours
      "X-Robots-Tag": "noindex", // Don't index the robots.txt file itself
    },
  });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Parse existing robots.txt content
 */
export function parseRobotsTxt(content: string): {
  userAgents: Map<string, { allow: string[]; disallow: string[] }>;
  sitemaps: string[];
  crawlDelays: Map<string, number>;
} {
  const lines = content.split("\n");
  const userAgents = new Map<string, { allow: string[]; disallow: string[] }>();
  const sitemaps: string[] = [];
  const crawlDelays = new Map<string, number>();

  let currentUserAgent = "";

  lines.forEach((line) => {
    const trimmed = line.trim();

    // Skip comments and empty lines
    if (trimmed.startsWith("#") || trimmed === "") return;

    const [key, ...valueParts] = trimmed.split(":");
    const value = valueParts.join(":").trim();

    switch (key.toLowerCase()) {
      case "user-agent":
        currentUserAgent = value;
        if (!userAgents.has(currentUserAgent)) {
          userAgents.set(currentUserAgent, { allow: [], disallow: [] });
        }
        break;

      case "allow":
        if (currentUserAgent) {
          userAgents.get(currentUserAgent)?.allow.push(value);
        }
        break;

      case "disallow":
        if (currentUserAgent) {
          userAgents.get(currentUserAgent)?.disallow.push(value);
        }
        break;

      case "crawl-delay":
        if (currentUserAgent) {
          crawlDelays.set(currentUserAgent, parseInt(value, 10));
        }
        break;

      case "sitemap":
        sitemaps.push(value);
        break;
    }
  });

  return { userAgents, sitemaps, crawlDelays };
}

/**
 * Validate robots.txt content
 */
export function validateRobotsTxt(content: string): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const parsed = parseRobotsTxt(content);

    // Check if at least one user-agent is defined
    if (parsed.userAgents.size === 0) {
      warnings.push("No user-agent rules defined");
    }

    // Check if sitemap is defined
    if (parsed.sitemaps.length === 0) {
      warnings.push("No sitemap defined");
    }

    // Validate sitemap URLs
    parsed.sitemaps.forEach((sitemap) => {
      try {
        new URL(sitemap);
      } catch {
        errors.push(`Invalid sitemap URL: ${sitemap}`);
      }
    });

    // Check for common mistakes
    parsed.userAgents.forEach((rules, userAgent) => {
      if (rules.disallow.includes("/") && rules.allow.length > 0) {
        warnings.push(
          `User-agent "${userAgent}" has both "Disallow: /" and Allow rules - Allow rules may be ignored`
        );
      }
    });
  } catch (error) {
    errors.push(`Failed to parse robots.txt: ${error}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
