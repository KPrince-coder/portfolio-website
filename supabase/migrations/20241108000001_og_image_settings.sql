-- ============================================================================
-- OG Image Settings Migration
-- Stores configuration for dynamic Open Graph image generation
-- ============================================================================

-- Create og_image_settings table
CREATE TABLE IF NOT EXISTS public.og_image_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Template Configuration
  template_name TEXT NOT NULL DEFAULT 'default',
  
  -- Content
  title TEXT DEFAULT 'Portfolio',
  subtitle TEXT DEFAULT 'Full Stack Developer & AI Engineer',
  tagline TEXT,
  
  -- Branding
  show_logo BOOLEAN DEFAULT true,
  logo_text TEXT,
  
  -- Colors (hex codes)
  background_color TEXT DEFAULT '#0F0F23',
  background_gradient_start TEXT DEFAULT '#0A2540',
  background_gradient_end TEXT DEFAULT '#0F0F23',
  title_color TEXT DEFAULT '#FFFFFF',
  subtitle_color TEXT DEFAULT '#00D4FF',
  accent_color TEXT DEFAULT '#FF6B6B',
  
  -- Layout
  layout TEXT DEFAULT 'centered' CHECK (layout IN ('centered', 'left', 'right', 'split')),
  
  -- Typography
  title_font_size INTEGER DEFAULT 80,
  subtitle_font_size INTEGER DEFAULT 40,
  
  -- Image Dimensions
  width INTEGER DEFAULT 1200,
  height INTEGER DEFAULT 630,
  
  -- Pattern/Decoration
  show_pattern BOOLEAN DEFAULT true,
  pattern_type TEXT DEFAULT 'dots' CHECK (pattern_type IN ('dots', 'grid', 'waves', 'none')),
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- ============================================================================
-- Indexes
-- ============================================================================

CREATE INDEX idx_og_image_settings_active ON public.og_image_settings(is_active);

-- Ensure only one active OG image settings
CREATE UNIQUE INDEX idx_og_image_settings_single_active 
  ON public.og_image_settings(is_active) 
  WHERE is_active = true;

-- ============================================================================
-- Insert Default OG Image Settings
-- ============================================================================

INSERT INTO public.og_image_settings (
  template_name,
  title,
  subtitle,
  tagline,
  show_logo,
  logo_text,
  background_color,
  background_gradient_start,
  background_gradient_end,
  title_color,
  subtitle_color,
  accent_color,
  layout,
  title_font_size,
  subtitle_font_size,
  show_pattern,
  pattern_type,
  is_active
) VALUES (
  'default',
  'Portfolio',
  'Full Stack Developer & AI Engineer',
  'Building intelligent systems with modern technology',
  true,
  NULL, -- Will use brand_identity.logo_text automatically
  '#0F0F23',
  '#0A2540',
  '#0F0F23',
  '#FFFFFF',
  '#00D4FF',
  '#FF6B6B',
  'centered',
  80,
  40,
  true,
  'dots',
  true
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================

ALTER TABLE public.og_image_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view active OG image settings (for public OG image generation)
CREATE POLICY "Anyone can view active og image settings"
  ON public.og_image_settings
  FOR SELECT
  TO public
  USING (is_active = true);

-- Authenticated users can view all OG image settings
CREATE POLICY "Authenticated users can view all og image settings"
  ON public.og_image_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can manage OG image settings
CREATE POLICY "Authenticated users can manage og image settings"
  ON public.og_image_settings
  FOR ALL
  TO authenticated
  USING (true);

-- ============================================================================
-- Triggers
-- ============================================================================

CREATE TRIGGER update_og_image_settings_updated_at
  BEFORE UPDATE ON public.og_image_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Helper Function
-- ============================================================================

CREATE OR REPLACE FUNCTION get_active_og_image_settings()
RETURNS TABLE (
  id UUID,
  template_name TEXT,
  title TEXT,
  subtitle TEXT,
  tagline TEXT,
  show_logo BOOLEAN,
  logo_text TEXT,
  background_color TEXT,
  background_gradient_start TEXT,
  background_gradient_end TEXT,
  title_color TEXT,
  subtitle_color TEXT,
  accent_color TEXT,
  layout TEXT,
  title_font_size INTEGER,
  subtitle_font_size INTEGER,
  show_pattern BOOLEAN,
  pattern_type TEXT,
  width INTEGER,
  height INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ogs.id,
    ogs.template_name,
    ogs.title,
    ogs.subtitle,
    ogs.tagline,
    ogs.show_logo,
    ogs.logo_text,
    ogs.background_color,
    ogs.background_gradient_start,
    ogs.background_gradient_end,
    ogs.title_color,
    ogs.subtitle_color,
    ogs.accent_color,
    ogs.layout,
    ogs.title_font_size,
    ogs.subtitle_font_size,
    ogs.show_pattern,
    ogs.pattern_type,
    ogs.width,
    ogs.height
  FROM public.og_image_settings ogs
  WHERE ogs.is_active = true
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE public.og_image_settings IS 'Stores configuration for dynamic Open Graph image generation';
COMMENT ON COLUMN public.og_image_settings.template_name IS 'Name of the OG image template';
COMMENT ON COLUMN public.og_image_settings.layout IS 'Layout style: centered, left, right, or split';
COMMENT ON COLUMN public.og_image_settings.pattern_type IS 'Background pattern: dots, grid, waves, or none';
COMMENT ON FUNCTION get_active_og_image_settings IS 'Returns the active OG image settings configuration';
