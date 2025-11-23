-- ============================================================================
-- Contact Settings Cleanup Migration
-- Removes unused columns: messages_title and title_highlight
-- ============================================================================

-- ============================================================================
-- SECTION 1: Drop Unused Columns
-- ============================================================================

-- Drop messages_title column if it exists
ALTER TABLE public.contact_settings 
DROP COLUMN IF EXISTS messages_title;

-- Drop title_highlight column if it exists (replaced by single title field)
ALTER TABLE public.contact_settings 
DROP COLUMN IF EXISTS title_highlight;

-- ============================================================================
-- SECTION 2: Update Comments
-- ============================================================================

COMMENT ON COLUMN public.contact_settings.title IS 'Full title for contact section - last word will be highlighted on frontend (e.g., "Let''s Connect")';
COMMENT ON COLUMN public.contact_settings.description IS 'Description text displayed below title on contact page';

-- ============================================================================
-- SECTION 3: Recreate Function Without Removed Columns
-- ============================================================================

-- Drop the existing function first (required to change return type)
DROP FUNCTION IF EXISTS get_active_contact_settings();

-- Recreate the function with the correct columns
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

COMMENT ON FUNCTION get_active_contact_settings IS 'Returns the active contact settings configuration';

-- ============================================================================
-- NOTES
-- ============================================================================

-- This migration cleans up columns that were added but are no longer needed:
-- 1. messages_title - Admin messages list uses static title, no DB field needed
-- 2. title_highlight - Replaced by splitTitle() function on frontend
--
-- The contact_settings table now stores a single 'title' field that is
-- automatically split on the frontend to highlight the last word.
