-- ============================================================================
-- Footer Settings Migration
-- Adds footer configuration (copyright, social links, custom text)
-- ============================================================================

-- Create footer_settings table
CREATE TABLE IF NOT EXISTS public.footer_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Copyright Section
  copyright_text TEXT DEFAULT '© {year} {company}. All rights reserved.',
  company_name TEXT DEFAULT 'Your Company',
  tagline TEXT DEFAULT 'Crafted with ❤️ using React, TypeScript & AI.',
  show_tagline BOOLEAN DEFAULT true,
  
  -- Social Links (optional - can also use profile social links)
  show_social_links BOOLEAN DEFAULT true,
  
  -- Custom Links
  links JSONB DEFAULT '[
    {
      "label": "Privacy Policy",
      "url": "/privacy",
      "is_active": false
    },
    {
      "label": "Terms of Service",
      "url": "/terms",
      "is_active": false
    }
  ]'::jsonb,
  
  -- Layout Options
  layout TEXT DEFAULT 'center' CHECK (layout IN ('left', 'center', 'right', 'split')),
  show_back_to_top BOOLEAN DEFAULT true,
  
  -- Styling
  background_style TEXT DEFAULT 'subtle' CHECK (background_style IN ('subtle', 'solid', 'gradient', 'transparent')),
  
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

CREATE INDEX idx_footer_settings_active ON public.footer_settings(is_active);

-- Ensure only one active footer settings
CREATE UNIQUE INDEX idx_footer_settings_single_active 
  ON public.footer_settings(is_active) 
  WHERE is_active = true;

-- ============================================================================
-- Insert Default Footer Settings
-- ============================================================================

INSERT INTO public.footer_settings (
  copyright_text,
  company_name,
  tagline,
  show_tagline,
  show_social_links,
  links,
  layout,
  show_back_to_top,
  background_style,
  is_active
) VALUES (
  '© {year} {company}. All rights reserved.',
  'Your Company',
  'Crafted with ❤️ using React, TypeScript & AI.',
  true,
  true,
  '[
    {
      "label": "Privacy Policy",
      "url": "/privacy",
      "is_active": false
    },
    {
      "label": "Terms of Service",
      "url": "/terms",
      "is_active": false
    },
    {
      "label": "Contact",
      "url": "#contact",
      "is_active": true
    }
  ]'::jsonb,
  'center',
  true,
  'subtle',
  true
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================

ALTER TABLE public.footer_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view active footer settings (for public site)
CREATE POLICY "Anyone can view active footer settings"
  ON public.footer_settings
  FOR SELECT
  TO public
  USING (is_active = true);

-- Authenticated users can view all footer settings
CREATE POLICY "Authenticated users can view all footer settings"
  ON public.footer_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can manage footer settings
CREATE POLICY "Authenticated users can manage footer settings"
  ON public.footer_settings
  FOR ALL
  TO authenticated
  USING (true);

-- ============================================================================
-- Triggers
-- ============================================================================

CREATE TRIGGER update_footer_settings_updated_at
  BEFORE UPDATE ON public.footer_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Helper Function
-- ============================================================================

CREATE OR REPLACE FUNCTION get_active_footer_settings()
RETURNS TABLE (
  id UUID,
  copyright_text TEXT,
  company_name TEXT,
  tagline TEXT,
  show_tagline BOOLEAN,
  show_social_links BOOLEAN,
  links JSONB,
  layout TEXT,
  show_back_to_top BOOLEAN,
  background_style TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fs.id,
    fs.copyright_text,
    fs.company_name,
    fs.tagline,
    fs.show_tagline,
    fs.show_social_links,
    fs.links,
    fs.layout,
    fs.show_back_to_top,
    fs.background_style
  FROM public.footer_settings fs
  WHERE fs.is_active = true
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE public.footer_settings IS 'Stores footer configuration including copyright, links, and layout options';
COMMENT ON COLUMN public.footer_settings.copyright_text IS 'Copyright text with variables: {year}, {company}';
COMMENT ON COLUMN public.footer_settings.company_name IS 'Company/person name for copyright';
COMMENT ON COLUMN public.footer_settings.tagline IS 'Tagline or custom text displayed in footer';
COMMENT ON COLUMN public.footer_settings.show_tagline IS 'Whether to display the tagline';
COMMENT ON COLUMN public.footer_settings.show_social_links IS 'Whether to display social media links from profile';
COMMENT ON COLUMN public.footer_settings.links IS 'Array of custom footer links with label, url, and is_active';
COMMENT ON COLUMN public.footer_settings.layout IS 'Footer layout: left, center, right, or split';
COMMENT ON COLUMN public.footer_settings.show_back_to_top IS 'Whether to show back to top button';
COMMENT ON COLUMN public.footer_settings.background_style IS 'Footer background style';
COMMENT ON FUNCTION get_active_footer_settings IS 'Returns the active footer settings configuration';
