/**
 * Footer Module Constants
 */

import type { FooterLink, FooterLayout, FooterBackgroundStyle } from "./types";

export const DEFAULT_COPYRIGHT_TEXT =
  "© {year} {company}. All rights reserved.";
export const DEFAULT_COMPANY_NAME = "Your Company";
export const DEFAULT_TAGLINE = "Crafted with ❤️ using React, TypeScript & AI.";

export const DEFAULT_LINKS: FooterLink[] = [
  { label: "Privacy Policy", url: "/privacy", is_active: false },
  { label: "Terms of Service", url: "/terms", is_active: false },
  { label: "Contact", url: "#contact", is_active: true },
];

export const LAYOUT_OPTIONS: Array<{
  value: FooterLayout;
  label: string;
  description?: string;
}> = [
  {
    value: "left",
    label: "Left Aligned",
    description: "Content aligned to the left",
  },
  { value: "center", label: "Center Aligned", description: "Content centered" },
  {
    value: "right",
    label: "Right Aligned",
    description: "Content aligned to the right",
  },
  {
    value: "split",
    label: "Split Layout",
    description: "Copyright left, links right",
  },
];

export const BACKGROUND_STYLES: Array<{
  value: FooterBackgroundStyle;
  label: string;
}> = [
  { value: "subtle", label: "Subtle" },
  { value: "solid", label: "Solid" },
  { value: "gradient", label: "Gradient" },
  { value: "transparent", label: "Transparent" },
];
