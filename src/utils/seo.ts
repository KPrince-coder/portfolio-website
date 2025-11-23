/**
 * SEO Utilities
 *
 * Dynamic meta tag management for SEO and social sharing
 */

import { SEO_CONFIG } from "@/config/seo.config";

interface MetaTagConfig {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

/**
 * Get OG Image URL from Supabase Edge Function
 */
export function getOGImageUrl(title?: string, subtitle?: string): string {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    console.warn("VITE_SUPABASE_URL not configured, using default OG image");
    return SEO_CONFIG.defaultImage;
  }

  const baseUrl = `${supabaseUrl}/functions/v1/og-image`;
  const params = new URLSearchParams();

  if (title) params.append("title", title);
  if (subtitle) params.append("subtitle", subtitle);

  return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
}

/**
 * Update meta tags dynamically
 */
export function updateMetaTags(config: MetaTagConfig): void {
  const {
    title = "CodePrince - Full Stack Developer & AI Engineer",
    description = "Portfolio showcasing full-stack development, AI/ML projects, and modern web applications by Prince Kyeremeh.",
    image = getOGImageUrl("CodePrince", "Full Stack Developer & AI Engineer"),
    url = SEO_CONFIG.siteUrl,
    type = "website",
  } = config;

  // Update document title
  document.title = title;

  // Update or create meta tags
  updateMetaTag("property", "og:title", title);
  updateMetaTag("property", "og:description", description);
  updateMetaTag("property", "og:image", image);
  updateMetaTag("property", "og:url", url);
  updateMetaTag("property", "og:type", type);

  updateMetaTag("property", "twitter:title", title);
  updateMetaTag("property", "twitter:description", description);
  updateMetaTag("property", "twitter:image", image);
  updateMetaTag("property", "twitter:url", url);

  updateMetaTag("name", "description", description);
}

/**
 * Update or create a meta tag
 */
function updateMetaTag(
  attribute: "name" | "property",
  key: string,
  value: string
): void {
  let element = document.querySelector(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", value);
}

/**
 * Update preconnect links dynamically
 */
export function updatePreconnectLinks(): void {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) return;

  const hostname = new URL(supabaseUrl).origin;

  // Update or create preconnect link
  let preconnect = document.querySelector(
    `link[rel="preconnect"][href*="supabase"]`
  );
  if (!preconnect) {
    preconnect = document.createElement("link");
    preconnect.setAttribute("rel", "preconnect");
    document.head.appendChild(preconnect);
  }
  preconnect.setAttribute("href", hostname);

  // Update or create dns-prefetch link
  let dnsPrefetch = document.querySelector(
    `link[rel="dns-prefetch"][href*="supabase"]`
  );
  if (!dnsPrefetch) {
    dnsPrefetch = document.createElement("link");
    dnsPrefetch.setAttribute("rel", "dns-prefetch");
    document.head.appendChild(dnsPrefetch);
  }
  dnsPrefetch.setAttribute("href", hostname);
}
