/**
 * Footer Module Constants
 */

import type { FooterLink } from "./types";

export const DEFAULT_COPYRIGHT_TEXT =
  "© {year} {company}. All rights reserved.";
export const DEFAULT_COMPANY_NAME = "Your Company";
export const DEFAULT_TAGLINE = "Crafted with ❤️ using React, TypeScript & AI.";

export const DEFAULT_LINKS: FooterLink[] = [
  { label: "Privacy Policy", url: "/privacy", is_active: false },
  { label: "Terms of Service", url: "/terms", is_active: false },
  { label: "Contact", url: "#contact", is_active: true },
];

export const LAYOUT_OPTIONS = [
  { value: "left", label: "Left Aligned" },
  { value: "center", label: "Center Aligned" },
  { value: "right", label: "Right Aligned" },
  { value: "split", label: "Split Layout" },
] as const;

export const BACKGROUND_STYLES = [
  { value: "subtle", label: "Subtle" },
  { value: "solid", label: "Solid" },
  { value: "gradient", label: "Gradient" },
  { value: "transparent", label: "Transparent" },
] as const;
