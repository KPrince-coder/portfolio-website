-- =====================================================
-- Skills Extended Migration
-- Adds skills section metadata to profiles and enhances skill categories
-- =====================================================

-- =====================================================
-- SECTION 1: Add Skills Section Fields to Profiles
-- =====================================================

-- Add skills section title and description to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS skills_title TEXT DEFAULT 'Technical Expertise',
ADD COLUMN IF NOT EXISTS skills_description TEXT DEFAULT 'A comprehensive toolkit for building intelligent systems, from data pipelines to user interfaces. Each skill represents hundreds of hours of hands-on experience and continuous learning.';

COMMENT ON COLUMN public.profiles.skills_title IS 'Title for the skills section (e.g., "Technical Expertise", "My Skills")';
COMMENT ON COLUMN public.profiles.skills_description IS 'Description text displayed at the top of the skills section';

-- =====================================================
-- SECTION 2: Enhance Skill Categories Table
-- =====================================================

-- Add new columns to skill_categories if they don't exist
ALTER TABLE public.skill_categories 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

COMMENT ON COLUMN public.skill_categories.description IS 'Optional description for the category';
COMMENT ON COLUMN public.skill_categories.is_active IS 'Whether this category is active and should be displayed';

-- Add index for active categories
CREATE INDEX IF NOT EXISTS idx_skill_categories_active 
ON public.skill_categories(is_active) WHERE is_active = true;

-- =====================================================
-- SECTION 3: Update Existing Data
-- =====================================================

-- Update existing categories to be active
UPDATE public.skill_categories 
SET is_active = true 
WHERE is_active IS NULL;

-- Add descriptions to existing categories (optional - customize as needed)
UPDATE public.skill_categories 
SET description = CASE 
  WHEN name = 'ai' THEN 'Machine Learning, Deep Learning, and AI frameworks'
  WHEN name = 'data' THEN 'Data Engineering, Databases, and Big Data technologies'
  WHEN name = 'frontend' THEN 'Modern web development and UI frameworks'
  WHEN name = 'mobile' THEN 'Cross-platform mobile application development'
  WHEN name = 'all' THEN 'All skills across all categories'
  ELSE NULL
END
WHERE description IS NULL;

-- =====================================================
-- SECTION 4: Create Skills Section Settings View
-- =====================================================

-- View to easily get skills section settings
CREATE OR REPLACE VIEW public.skills_section_settings AS
SELECT 
  id,
  skills_title,
  skills_description,
  updated_at
FROM public.profiles
WHERE skills_title IS NOT NULL OR skills_description IS NOT NULL;

COMMENT ON VIEW public.skills_section_settings IS 'Quick access to skills section title and description settings';

-- =====================================================
-- SECTION 5: Add RLS Policies for New Columns
-- =====================================================

-- The existing RLS policies on profiles table already cover the new columns
-- No additional policies needed as they inherit from the table policies

-- =====================================================
-- SECTION 6: Create Helper Function
-- =====================================================

-- Function to get active skill categories count
CREATE OR REPLACE FUNCTION public.get_active_categories_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM public.skill_categories WHERE is_active = true AND name != 'all');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_active_categories_count IS 'Returns the count of active skill categories (excluding "all")';

-- =====================================================
-- SECTION 7: Update Seed Data (Optional)
-- =====================================================

-- Update the profiles table with default skills section data if no profile exists
-- This is optional and can be customized based on your needs
DO $$
BEGIN
  -- Only update if there's at least one profile and skills_title is NULL
  UPDATE public.profiles
  SET 
    skills_title = 'Technical Expertise',
    skills_description = 'A comprehensive toolkit for building intelligent systems, from data pipelines to user interfaces. Each skill represents hundreds of hours of hands-on experience and continuous learning.'
  WHERE skills_title IS NULL;
END $$;

-- =====================================================
-- SECTION 8: Validation Constraints (Optional)
-- =====================================================

-- Add check constraint to ensure skills_title is not empty if set
ALTER TABLE public.profiles
ADD CONSTRAINT IF NOT EXISTS check_skills_title_not_empty 
CHECK (skills_title IS NULL OR length(trim(skills_title)) > 0);

-- Add check constraint to ensure skills_description is not empty if set
ALTER TABLE public.profiles
ADD CONSTRAINT IF NOT EXISTS check_skills_description_not_empty 
CHECK (skills_description IS NULL OR length(trim(skills_description)) > 0);

COMMENT ON CONSTRAINT check_skills_title_not_empty ON public.profiles IS 'Ensures skills title is not empty string';
COMMENT ON CONSTRAINT check_skills_description_not_empty ON public.profiles IS 'Ensures skills description is not empty string';

