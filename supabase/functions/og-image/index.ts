/**
 * OG Image Generation Edge Function (TypeScript)
 *
 * Generates dynamic Open Graph images using Satori and Resvg
 * Supports customizable templates, colors, and layouts
 */

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.0";

// Satori & Resvg (no official .d.ts, so we use `any` with safety)
// Import for image generation
const satori = (await import("npm:satori@0.18.3")).default as any;

// Use resvg-wasm instead of resvg-js for Edge Functions compatibilit
const { initWasm, Resvg } = await import(
  "https://esm.sh/@resvg/resvg-wasm@2.6.2"
);

// Initialize WASM
await initWasm(
  fetch("https://unpkg.com/@resvg/resvg-wasm@2.6.2/index_bg.wasm")
);

// CORS headers
const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ============================================================================
// Types
// ============================================================================

interface OGSettings {
  title: string;
  subtitle: string;
  background_color: string;
  background_gradient_start: string;
  background_gradient_end: string;
  accent_color: string;
  title_color: string;
  subtitle_color: string;
  title_font_size: number;
  subtitle_font_size: number;
  layout: "left" | "center" | "right" | "split";
  show_pattern: boolean;
  pattern_type: "dots" | "grid" | "waves" | "none";
  show_logo: boolean;
  logo_text?: string;
  tagline?: string;
  width: number;
  height: number;
}

interface BrandIdentity {
  logo_text?: string;
  logo_icon?: string;
}

interface VNode {
  type: string;
  props: {
    style?: Record<string, any>;
    children?: string | VNode | VNode[];
  };
}

// ============================================================================
// PATTERN GENERATORS
// ============================================================================

function generateDotsPattern(color: string): VNode {
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

function generateGridPattern(color: string): VNode {
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
  settings: OGSettings,
  customTitle?: string | null,
  customSubtitle?: string | null
): VNode {
  const title = customTitle || settings.title;
  const subtitle = customSubtitle || settings.subtitle;
  const children: VNode[] = [];

  // Add pattern if enabled
  if (settings.show_pattern && settings.pattern_type !== "none") {
    if (settings.pattern_type === "dots") {
      children.push(generateDotsPattern(settings.accent_color));
    } else if (settings.pattern_type === "grid") {
      children.push(generateGridPattern(settings.accent_color));
    }
  }

  // Content container
  const contentStyle: Record<string, any> = {
    display: "flex",
    flexDirection: "column",
    alignItems:
      settings.layout === "left"
        ? "flex-start"
        : settings.layout === "right"
          ? "flex-end"
          : "center",
    justifyContent: "center",
    padding: 80,
    position: "relative",
    // zIndex removed: Satori does NOT support z-index
  };

  const contentChildren: VNode[] = [];

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

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Parse URL parameters
    const url = new URL(req.url);
    const customTitle = url.searchParams.get("title");
    const customSubtitle = url.searchParams.get("subtitle");

    // Initialize Supabase client (use service role for server-side access)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch OG image settings
    const { data: settings, error } = await supabase
      .from("og_image_settings")
      .select("*")
      .eq("is_active", true)
      .single<OGSettings>();

    if (error || !settings) {
      throw new Error("Failed to fetch OG image settings: " + error?.message);
    }

    // Fetch brand identity if logo is enabled and no custom logo text
    if (settings.show_logo && !settings.logo_text) {
      const { data: brand } = await supabase
        .from("brand_identity")
        .select("logo_text, logo_icon")
        .eq("is_active", true)
        .single<BrandIdentity>();

      // Use brand identity logo text if available
      if (brand?.logo_text) {
        settings.logo_text = brand.logo_text;
      }
    }

    // Load fonts (Inter Latin 400 & 700)
    const fontNormal = await fetch(
      "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7W0s.ttf"
    ).then((res) => res.arrayBuffer());

    const fontBold = await fetch(
      "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMa0pb7W0s.ttf"
    ).then((res) => res.arrayBuffer());

    // Generate SVG using Satori
    const svg: string = await satori(
      generateOGImageTemplate(settings, customTitle, customSubtitle),
      {
        width: settings.width,
        height: settings.height,
        fonts: [
          {
            name: "Inter",
            data: fontNormal,
            weight: 400,
            style: "normal",
          },
          {
            name: "Inter",
            data: fontBold,
            weight: 700,
            style: "normal",
          },
        ],
      }
    );

    // Convert SVG to PNG using Resvg WASM
    const resvg = new Resvg(svg);
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
        error:
          error instanceof Error
            ? error.message
            : "Unknown error!\nFailed to generate OG image",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
