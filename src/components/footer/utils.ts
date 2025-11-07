/**
 * Footer Module Utilities
 */

import type { FooterLink, FooterSettings } from "./types";
import { DEFAULT_COPYRIGHT_TEXT, DEFAULT_COMPANY_NAME } from "./constants";

/**
 * Parse JSON links from database to FooterLink array
 */
export function parseFooterLinks(links: any): FooterLink[] {
  if (!links) return [];

  try {
    if (typeof links === "string") {
      return JSON.parse(links);
    }
    if (Array.isArray(links)) {
      return links;
    }
    return [];
  } catch (error) {
    console.error("Failed to parse footer links:", error);
    return [];
  }
}

/**
 * Format copyright text with variable replacement
 */
export function formatCopyrightText(
  copyrightText: string,
  companyName: string,
  fallbackCompanyName?: string
): string {
  const year = new Date().getFullYear().toString();
  const company = companyName || fallbackCompanyName || DEFAULT_COMPANY_NAME;

  return copyrightText.replace("{year}", year).replace("{company}", company);
}

/**
 * Get active links from settings
 */
export function getActiveLinks(settings: FooterSettings | null): FooterLink[] {
  if (!settings?.links) return [];
  return settings.links.filter((link) => link.is_active);
}

/**
 * Validate footer link
 */
export function isValidLink(link: FooterLink): boolean {
  return Boolean(link.label && link.url);
}
