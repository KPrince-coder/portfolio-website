/**
 * OG Image Types
 *
 * Type definitions for Open Graph image generation
 */

export type OGImageLayout = "centered" | "left" | "right" | "split";
export type OGImagePattern = "dots" | "grid" | "waves" | "none";

export interface OGImageSettings {
  id: string;
  template_name: string;
  title: string;
  subtitle: string;
  tagline?: string;
  show_logo: boolean;
  logo_text?: string;
  background_color: string;
  background_gradient_start: string;
  background_gradient_end: string;
  title_color: string;
  subtitle_color: string;
  accent_color: string;
  layout: OGImageLayout;
  title_font_size: number;
  subtitle_font_size: number;
  show_pattern: boolean;
  pattern_type: OGImagePattern;
  width: number;
  height: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OGImageFormData {
  template_name: string;
  title: string;
  subtitle: string;
  tagline?: string;
  show_logo: boolean;
  logo_text?: string;
  background_color: string;
  background_gradient_start: string;
  background_gradient_end: string;
  title_color: string;
  subtitle_color: string;
  accent_color: string;
  layout: OGImageLayout;
  title_font_size: number;
  subtitle_font_size: number;
  show_pattern: boolean;
  pattern_type: OGImagePattern;
}
