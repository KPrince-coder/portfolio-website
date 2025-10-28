-- =====================================================
-- Profiles Extended Migration
-- Adds Professional Journey, Impact Metrics, and Philosophy fields
-- =====================================================

-- Add new columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS philosophy_quote TEXT,
ADD COLUMN IF NOT EXISTS philosophy_author TEXT,
ADD COLUMN IF NOT EXISTS experiences JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS impact_metrics JSONB DEFAULT '[]';

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.philosophy_quote IS 'Personal philosophy or mission statement quote';
COMMENT ON COLUMN public.profiles.philosophy_author IS 'Author attribution for philosophy quote (usually the user''s name)';
COMMENT ON COLUMN public.profiles.experiences IS 'Array of professional experiences/timeline entries. Each entry should have: year, title, company, description, icon, color';
COMMENT ON COLUMN public.profiles.impact_metrics IS 'Array of achievement metrics. Each entry should have: label, value';

-- =====================================================
-- SECTION: Example Seed Data (Commented Out)
-- =====================================================

-- Example seed data based on current frontend
-- Uncomment and customize with your actual data when ready

/*
UPDATE public.profiles
SET 
  -- Professional Journey / Experience Timeline
  experiences = '[
    {
      "year": "2024",
      "title": "Senior AI Engineer",
      "company": "TechFlow AI",
      "description": "Leading development of large-scale machine learning pipelines processing 10TB+ daily data",
      "icon": "Brain",
      "color": "text-secondary"
    },
    {
      "year": "2022",
      "title": "Data Engineering Lead",
      "company": "DataCorp Solutions",
      "description": "Built real-time analytics platforms serving 1M+ users with 99.9% uptime",
      "icon": "Database",
      "color": "text-accent"
    },
    {
      "year": "2020",
      "title": "Full-Stack Developer",
      "company": "InnovateX",
      "description": "Developed AI-powered mobile applications with advanced computer vision capabilities",
      "icon": "Smartphone",
      "color": "text-success"
    },
    {
      "year": "2019",
      "title": "Software Engineer",
      "company": "StartupHub",
      "description": "Created scalable web applications using React, Node.js, and cloud technologies",
      "icon": "Code",
      "color": "text-warning"
    }
  ]'::jsonb,
  
  -- Impact Metrics / Achievements
  impact_metrics = '[
    {
      "label": "AI Models Deployed",
      "value": "50+"
    },
    {
      "label": "Data Processed (TB)",
      "value": "100+"
    },
    {
      "label": "Projects Completed",
      "value": "75+"
    },
    {
      "label": "Years Experience",
      "value": "5+"
    }
  ]'::jsonb,
  
  -- Philosophy Quote
  philosophy_quote = 'The future belongs to those who can seamlessly blend human creativity with artificial intelligence. I strive to create systems that don''t just process data, but augment human potential.',
  philosophy_author = 'Alex Neural'

WHERE user_id = 'YOUR_USER_ID_HERE'; -- Replace with actual user_id from auth.users
*/

-- =====================================================
-- SECTION: Data Structure Documentation
-- =====================================================

-- Structure for experiences array:
-- Each experience object should contain:
-- {
--   "year": "YYYY",                    // Year or date range (e.g., "2024" or "2022-2024")
--   "title": "Job Title",              // Position/role title
--   "company": "Company Name",         // Organization name
--   "description": "Description...",   // Brief description of role and achievements
--   "icon": "IconName",                // Lucide icon name (Brain, Database, Smartphone, Code, etc.)
--   "color": "text-colorname"          // Tailwind color class (text-secondary, text-accent, etc.)
-- }

-- Available icon options: Brain, Database, Smartphone, Code, Briefcase, Award, Star, Zap, etc.
-- Available color options: text-secondary, text-accent, text-success, text-warning, text-neural

-- Structure for impact_metrics array:
-- Each metric object should contain:
-- {
--   "label": "Metric Name",            // Description of the metric
--   "value": "Number/Value"            // The metric value (can include +, K, M suffixes)
-- }

-- Philosophy fields:
-- philosophy_quote: Your personal philosophy, mission statement, or professional motto
-- philosophy_author: Attribution (typically your name or professional title)
