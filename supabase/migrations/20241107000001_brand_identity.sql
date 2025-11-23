-- ============================================================================
-- Brand Identity Migration
-- Creates table for portfolio branding (logo, icon, colors, SEO)
-- Note: Contact info and social links are stored in profiles table
-- ============================================================================

-- Create brand_identity table
CREATE TABLE IF NOT EXISTS public.brand_identity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Logo & Icon (for navigation and branding)
  logo_text TEXT NOT NULL DEFAULT 'DataFlow',
  logo_icon TEXT NOT NULL DEFAULT 'Brain', -- Lucide icon name
  logo_icon_color TEXT DEFAULT '#667eea',
  
  -- Color Scheme
  primary_color TEXT DEFAULT '#667eea',
  secondary_color TEXT DEFAULT '#764ba2',
  accent_color TEXT DEFAULT '#10b981',
  
  -- SEO Settings
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  favicon_url TEXT,
  
  -- Email Branding
  email_header_color TEXT DEFAULT '#667eea',
  email_footer_text TEXT DEFAULT 'Thank you for your interest',
  
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

CREATE INDEX idx_brand_identity_active ON public.brand_identity(is_active);

-- Ensure only one active brand identity
CREATE UNIQUE INDEX idx_brand_identity_single_active 
  ON public.brand_identity(is_active) 
  WHERE is_active = true;

-- ============================================================================
-- Insert Default Brand Identity (matching current Navigation component)
-- ============================================================================

INSERT INTO public.brand_identity (
  logo_text,
  logo_icon,
  logo_icon_color,
  primary_color,
  secondary_color,
  accent_color,
  email_header_color,
  email_footer_text,
  meta_title,
  meta_description,
  is_active
) VALUES (
  'DataFlow',
  'Brain',
  '#667eea',
  '#667eea',
  '#764ba2',
  '#10b981',
  '#667eea',
  'Thank you for your interest',
  'DataFlow - Data & AI Engineer Portfolio',
  'Portfolio showcasing data engineering and AI projects',
  true
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================

ALTER TABLE public.brand_identity ENABLE ROW LEVEL SECURITY;

-- Anyone can view active brand identity (for public portfolio display)
CREATE POLICY "Anyone can view active brand identity"
  ON public.brand_identity
  FOR SELECT
  TO public
  USING (is_active = true);

-- Authenticated users can view all brand identities
CREATE POLICY "Authenticated users can view all brand identities"
  ON public.brand_identity
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can manage brand identity
CREATE POLICY "Authenticated users can manage brand identity"
  ON public.brand_identity
  FOR ALL
  TO authenticated
  USING (true);

-- ============================================================================
-- Triggers
-- ============================================================================

CREATE TRIGGER update_brand_identity_updated_at
  BEFORE UPDATE ON public.brand_identity
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Helper Function to get active brand identity
-- ============================================================================

CREATE OR REPLACE FUNCTION get_active_brand_identity()
RETURNS TABLE (
  id UUID,
  logo_text TEXT,
  logo_icon TEXT,
  logo_icon_color TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  accent_color TEXT,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  favicon_url TEXT,
  email_header_color TEXT,
  email_footer_text TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bi.id,
    bi.logo_text,
    bi.logo_icon,
    bi.logo_icon_color,
    bi.primary_color,
    bi.secondary_color,
    bi.accent_color,
    bi.meta_title,
    bi.meta_description,
    bi.meta_keywords,
    bi.favicon_url,
    bi.email_header_color,
    bi.email_footer_text
  FROM public.brand_identity bi
  WHERE bi.is_active = true
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE public.brand_identity IS 'Stores portfolio branding including logo, icon, colors, and SEO settings. Contact info and social links are in profiles table.';
COMMENT ON COLUMN public.brand_identity.logo_text IS 'Text displayed next to logo in navigation (e.g., "DataFlow")';
COMMENT ON COLUMN public.brand_identity.logo_icon IS 'Lucide icon name for the logo (e.g., "Brain", "Code", "Zap")';
COMMENT ON COLUMN public.brand_identity.logo_icon_color IS 'Hex color code for the logo icon';
COMMENT ON COLUMN public.brand_identity.primary_color IS 'Primary brand color used throughout the site';
COMMENT ON COLUMN public.brand_identity.secondary_color IS 'Secondary brand color for gradients and accents';
COMMENT ON COLUMN public.brand_identity.accent_color IS 'Accent color for CTAs and highlights';
COMMENT ON COLUMN public.brand_identity.email_header_color IS 'Background color for email template headers';
COMMENT ON COLUMN public.brand_identity.email_footer_text IS 'Footer text displayed in email templates';
COMMENT ON FUNCTION get_active_brand_identity IS 'Returns the active brand identity configuration for public use';

