/**
 * OG Image Generation Edge Function
 *
 * Generates dynamic Open Graph images using Satori and Resvg
 * Supports customizable templates, colors, and layouts
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Import for image generation
const satori = (await import("npm:satori@0.10.9")).default;
const { Resvg } = await import("npm:@resvg/resvg-js@2.4.1");

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ============================================================================
// TYPES
// ============================================================================

interface OGImageSettings {
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
  layout: "centered" | "left" | "right" | "split";
  title_font_size: number;
  subtitle_font_size: number;
  show_pattern: boolean;
  pattern_type: "dots" | "grid" | "waves" | "none";
  width: number;
  height: number;
}

// ============================================================================
// PATTERN GENERATORS
// ============================================================================

function generateDotsPattern(color: string) {
  return {
    type: "div",
    props: {
      style: {
        position: "absolute",
        inset: 0,
        backgroundImage: `radial-gradient(circle, ${color}22 1px, transparent 1px)`,
        backgroundSize: "30px 30px",
        opacity: 0.5,
      },
    },
  };
}

function generateGridPattern(color: string) {
  return {
    type: "div",
    props: {
      style: {
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(${color}22 1px, transparent 1px),
          linear-gradient(90deg, ${color}22 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px",
        opacity: 0.3,
      },
    },
  };
}

// ============================================================================
// TEMPLATE GENERATOR
// ============================================================================

function generateOGImageTemplate(
  settings: OGImageSettings,
  customTitle?: string,
  customSubtitle?: string
) {
  const title = customTitle || settings.title;
  const subtitle = customSubtitle || settings.subtitle;

  const children: any[] = [];

  // Add pattern if enabled
  if (settings.show_pattern && settings.pattern_type !== "none") {
    if (settings.pattern_type === "dots") {
      children.push(generateDotsPattern(settings.accent_color));
    } else if (settings.pattern_type === "grid") {
      children.push(generateGridPattern(settings.accent_color));
    }
  }

  // Content container
  const contentStyle: any = {
    display: "flex",
    flexDirection: "column",
    alignItems:
      settings.layout === "left"
        ? "flex-start"
        : settings.layout === "right"
          ? "flex-end"
          : "center",
    justifyContent: "center",
    padding: "80px",
    zIndex: 10,
    position: "relative",
  };

  const contentChildren: any[] = [];

  // Logo
  if (settings.show_logo && settings.logo_text) {
    contentChildren.push({
      type: "div",
      props: {
        style: {
          fontSize: 32,
          fontWeight: "bold",
          color: settings.accent_color,
          marginBottom: 40,
          display: "flex",
          alignItems: "center",
        },
        children: settings.logo_text,
      },
    });
  }

  // Title
  contentChildren.push({
    type: "div",
    props: {
      style: {
        fontSize: settings.title_font_size,
        fontWeight: "bold",
        color: settings.title_color,
        lineHeight: 1.2,
        textAlign:
          settings.layout === "left"
            ? "left"
            : settings.layout === "right"
              ? "right"
              : "center",
        maxWidth: "90%",
      },
      children: title,
    },
  });

  // Subtitle
  contentChildren.push({
    type: "div",
    props: {
      style: {
        fontSize: settings.subtitle_font_size,
        color: settings.subtitle_color,
        marginTop: 30,
        lineHeight: 1.4,
        textAlign:
          settings.layout === "left"
            ? "left"
            : settings.layout === "right"
              ? "right"
              : "center",
        maxWidth: "80%",
      },
      children: subtitle,
    },
  });

  // Tagline
  if (settings.tagline) {
    contentChildren.push({
      type: "div",
      props: {
        style: {
          fontSize: 24,
          color: settings.title_color,
          opacity: 0.7,
          marginTop: 20,
          textAlign:
            settings.layout === "left"
              ? "left"
              : settings.layout === "right"
                ? "right"
                : "center",
          maxWidth: "70%",
        },
        children: settings.tagline,
      },
    });
  }

  children.push({
    type: "div",
    props: {
      style: contentStyle,
      children: contentChildren,
    },
  });

  return {
    type: "div",
    props: {
      style: {
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: settings.background_color,
        backgroundImage: `linear-gradient(135deg, ${settings.background_gradient_start} 0%, ${settings.background_gradient_end} 100%)`,
        position: "relative",
      },
      children,
    },
  };
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Parse URL parameters
    const url = new URL(req.url);
    const customTitle = url.searchParams.get("title");
    const customSubtitle = url.searchParams.get("subtitle");

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch OG image settings
    const { data: settings, error } = await supabase
      .from("og_image_settings")
      .select("*")
      .eq("is_active", true)
      .single();

    if (error || !settings) {
      throw new Error("Failed to fetch OG image settings");
    }

    // Generate SVG using Satori
    const svg = await satori(
      generateOGImageTemplate(settings, customTitle, customSubtitle),
      {
        width: settings.width,
        height: settings.height,
        fonts: [
          {
            name: "Inter",
            data: await fetch(
              "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff"
            ).then((res) => res.arrayBuffer()),
            weight: 400,
            style: "normal",
          },
          {
            name: "Inter",
            data: await fetch(
              "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff"
            ).then((res) => res.arrayBuffer()),
            weight: 700,
            style: "normal",
          },
        ],
      }
    );

    // Convert SVG to PNG using Resvg
    const resvg = new Resvg(svg, {
      fitTo: {
        mode: "width",
        value: settings.width,
      },
    });

    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    // Return PNG image
    return new Response(pngBuffer, {
      headers: {
        ...corsHeaders,
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("OG Image generation error:", error);

    return new Response(
      JSON.stringify({
        error: error.message || "Failed to generate OG image",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
