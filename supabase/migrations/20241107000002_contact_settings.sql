-- ============================================================================
-- Contact Settings Migration
-- Adds contact page configuration (response time, expectations)
-- Note: Email and social links are in profiles table
-- ============================================================================

-- Create contact_settings table
CREATE TABLE IF NOT EXISTS public.contact_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Header Section (for Contact Page)
  title TEXT DEFAULT 'Let''s Connect',
  description TEXT DEFAULT 'Ready to discuss your next AI project? I''m always excited to collaborate on innovative solutions that push the boundaries of what''s possible with data and artificial intelligence.',
  
  -- Response Information
  response_time TEXT DEFAULT 'Within 24 hours',
  
  -- What to Expect Section
  expectations JSONB DEFAULT '[
    {
      "text": "Detailed discussion about your project requirements",
      "color": "secondary"
    },
    {
      "text": "Technical feasibility assessment and recommendations",
      "color": "accent"
    },
    {
      "text": "Transparent timeline and cost estimates",
      "color": "success"
    },
    {
      "text": "Ongoing support and collaboration approach",
      "color": "warning"
    }
  ]'::jsonb,
  
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

CREATE INDEX idx_contact_settings_active ON public.contact_settings(is_active);

-- Ensure only one active contact settings
CREATE UNIQUE INDEX idx_contact_settings_single_active 
  ON public.contact_settings(is_active) 
  WHERE is_active = true;

-- ============================================================================
-- Insert Default Contact Settings
-- ============================================================================

INSERT INTO public.contact_settings (
  title,
  description,
  response_time,
  expectations,
  is_active
) VALUES (
  'Let''s Connect',
  'Ready to discuss your next AI project? I''m always excited to collaborate on innovative solutions that push the boundaries of what''s possible with data and artificial intelligence.',
  'Within 24 hours',
  '[
    {
      "text": "Detailed discussion about your project requirements",
      "color": "secondary"
    },
    {
      "text": "Technical feasibility assessment and recommendations",
      "color": "accent"
    },
    {
      "text": "Transparent timeline and cost estimates",
      "color": "success"
    },
    {
      "text": "Ongoing support and collaboration approach",
      "color": "warning"
    }
  ]'::jsonb,
  true
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================

ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view active contact settings (for public contact page)
CREATE POLICY "Anyone can view active contact settings"
  ON public.contact_settings
  FOR SELECT
  TO public
  USING (is_active = true);

-- Authenticated users can view all contact settings
CREATE POLICY "Authenticated users can view all contact settings"
  ON public.contact_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can manage contact settings
CREATE POLICY "Authenticated users can manage contact settings"
  ON public.contact_settings
  FOR ALL
  TO authenticated
  USING (true);

-- ============================================================================
-- Triggers
-- ============================================================================

CREATE TRIGGER update_contact_settings_updated_at
  BEFORE UPDATE ON public.contact_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Helper Function
-- ============================================================================

CREATE OR REPLACE FUNCTION get_active_contact_settings()
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  response_time TEXT,
  expectations JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cs.id,
    cs.title,
    cs.description,
    cs.response_time,
    cs.expectations
  FROM public.contact_settings cs
  WHERE cs.is_active = true
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE public.contact_settings IS 'Stores contact page configuration including title, description, response time and expectations. Email and social links are in profiles table.';
COMMENT ON COLUMN public.contact_settings.title IS 'Full title for contact section - last word will be highlighted (e.g., "Let''s Connect")';
COMMENT ON COLUMN public.contact_settings.description IS 'Description text displayed below title on contact page';
COMMENT ON COLUMN public.contact_settings.response_time IS 'Expected response time displayed on contact page';
COMMENT ON COLUMN public.contact_settings.expectations IS 'Array of expectation items with text and color properties';
COMMENT ON FUNCTION get_active_contact_settings IS 'Returns the active contact settings configuration';

