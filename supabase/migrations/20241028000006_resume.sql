-- =====================================================
-- Resume Migration
-- Manages work experiences, education, certifications, and resume stats
-- =====================================================

-- =====================================================
-- SECTION 1: Resume Work Experiences Table
-- =====================================================

CREATE TABLE public.resume_work_experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Information
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  employment_type TEXT, -- e.g., 'Full-time', 'Part-time', 'Contract', 'Freelance'
  
  -- Dates
  start_date DATE NOT NULL,
  end_date DATE, -- NULL means current position
  is_current BOOLEAN DEFAULT false,
  
  -- Description
  description TEXT,
  achievements TEXT[], -- Array of achievement bullet points
  
  -- Additional Details
  company_url TEXT,
  company_logo_url TEXT,
  
  -- Display
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- SECTION 2: Resume Education Table
-- =====================================================

CREATE TABLE public.resume_education (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Information
  degree TEXT NOT NULL,
  field_of_study TEXT,
  school TEXT NOT NULL,
  location TEXT,
  
  -- Dates
  start_date DATE,
  end_date DATE,
  
  -- Academic Details
  gpa TEXT, -- Stored as text to allow formats like "3.8/4.0" or "First Class Honours"
  grade TEXT, -- Alternative to GPA (e.g., "Distinction", "Honours")
  description TEXT,
  activities TEXT[], -- Array of activities, clubs, achievements
  
  -- Additional Details
  school_url TEXT,
  school_logo_url TEXT,
  
  -- Display
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- SECTION 3: Resume Certifications Table
-- =====================================================

CREATE TABLE public.resume_certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Information
  name TEXT NOT NULL,
  issuing_organization TEXT NOT NULL,
  
  -- Dates
  issue_date DATE,
  expiry_date DATE, -- NULL means no expiration
  does_not_expire BOOLEAN DEFAULT true,
  
  -- Verification
  credential_id TEXT,
  credential_url TEXT,
  
  -- Additional Details
  description TEXT,
  logo_url TEXT,
  
  -- Display
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- SECTION 4: Extend Profiles Table for Resume Stats
-- =====================================================

-- Add resume-related fields to profiles table
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS resume_title TEXT DEFAULT 'Professional Resume',
  ADD COLUMN IF NOT EXISTS resume_description TEXT,
  ADD COLUMN IF NOT EXISTS years_of_experience INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS projects_completed INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS technologies_mastered INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS show_resume_stats BOOLEAN DEFAULT true;

-- =====================================================
-- SECTION 5: Indexes
-- =====================================================

-- Resume Work Experiences Indexes
CREATE INDEX idx_resume_work_experiences_user_id ON public.resume_work_experiences(user_id);
CREATE INDEX idx_resume_work_experiences_display_order ON public.resume_work_experiences(display_order);
CREATE INDEX idx_resume_work_experiences_is_current ON public.resume_work_experiences(is_current);
CREATE INDEX idx_resume_work_experiences_start_date ON public.resume_work_experiences(start_date DESC);

-- Resume Education Indexes
CREATE INDEX idx_resume_education_user_id ON public.resume_education(user_id);
CREATE INDEX idx_resume_education_display_order ON public.resume_education(display_order);
CREATE INDEX idx_resume_education_end_date ON public.resume_education(end_date DESC);

-- Resume Certifications Indexes
CREATE INDEX idx_resume_certifications_user_id ON public.resume_certifications(user_id);
CREATE INDEX idx_resume_certifications_display_order ON public.resume_certifications(display_order);
CREATE INDEX idx_resume_certifications_issue_date ON public.resume_certifications(issue_date DESC);

-- =====================================================
-- SECTION 6: Triggers
-- =====================================================

CREATE TRIGGER update_resume_work_experiences_updated_at 
  BEFORE UPDATE ON public.resume_work_experiences 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resume_education_updated_at 
  BEFORE UPDATE ON public.resume_education 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resume_certifications_updated_at 
  BEFORE UPDATE ON public.resume_certifications 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- SECTION 7: Row Level Security (RLS)
-- =====================================================

-- Resume Work Experiences RLS
ALTER TABLE public.resume_work_experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read visible resume work experiences" 
  ON public.resume_work_experiences FOR SELECT 
  USING (is_visible = true);

CREATE POLICY "Users can manage own resume work experiences" 
  ON public.resume_work_experiences FOR ALL 
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can manage all resume work experiences" 
  ON public.resume_work_experiences FOR ALL 
  USING (auth.uid() IS NOT NULL);

-- Resume Education RLS
ALTER TABLE public.resume_education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read visible resume education" 
  ON public.resume_education FOR SELECT 
  USING (is_visible = true);

CREATE POLICY "Users can manage own resume education" 
  ON public.resume_education FOR ALL 
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can manage all resume education" 
  ON public.resume_education FOR ALL 
  USING (auth.uid() IS NOT NULL);

-- Resume Certifications RLS
ALTER TABLE public.resume_certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read visible resume certifications" 
  ON public.resume_certifications FOR SELECT 
  USING (is_visible = true);

CREATE POLICY "Users can manage own resume certifications" 
  ON public.resume_certifications FOR ALL 
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can manage all resume certifications" 
  ON public.resume_certifications FOR ALL 
  USING (auth.uid() IS NOT NULL);

-- =====================================================
-- SECTION 8: Comments
-- =====================================================

COMMENT ON TABLE public.resume_work_experiences IS 'Professional work experience and employment history for resume';
COMMENT ON COLUMN public.resume_work_experiences.is_current IS 'Indicates if this is the current position';
COMMENT ON COLUMN public.resume_work_experiences.achievements IS 'Array of achievement bullet points for this role';
COMMENT ON COLUMN public.resume_work_experiences.is_featured IS 'Highlight this experience in featured sections';

COMMENT ON TABLE public.resume_education IS 'Educational background and academic qualifications for resume';
COMMENT ON COLUMN public.resume_education.gpa IS 'GPA or grade (e.g., "3.8/4.0" or "First Class Honours")';
COMMENT ON COLUMN public.resume_education.activities IS 'Array of extracurricular activities and achievements';

COMMENT ON TABLE public.resume_certifications IS 'Professional certifications and credentials for resume';
COMMENT ON COLUMN public.resume_certifications.does_not_expire IS 'Indicates if certification has no expiration date';
COMMENT ON COLUMN public.resume_certifications.credential_url IS 'URL to verify the certification';

COMMENT ON COLUMN public.profiles.resume_title IS 'Title for the resume section';
COMMENT ON COLUMN public.profiles.resume_description IS 'Description text for the resume section';
COMMENT ON COLUMN public.profiles.years_of_experience IS 'Total years of professional experience';
COMMENT ON COLUMN public.profiles.projects_completed IS 'Total number of projects completed';
COMMENT ON COLUMN public.profiles.technologies_mastered IS 'Number of technologies mastered';
COMMENT ON COLUMN public.profiles.show_resume_stats IS 'Toggle to show/hide quick stats section';

-- =====================================================
-- SECTION 9: Seed Data
-- =====================================================

-- Insert sample resume work experiences
-- Note: Replace 'YOUR_USER_ID_HERE' with actual user_id from auth.users
/*
INSERT INTO public.resume_work_experiences (
  user_id,
  title,
  company,
  location,
  employment_type,
  start_date,
  end_date,
  is_current,
  description,
  achievements,
  display_order,
  is_visible
) VALUES 
(
  'YOUR_USER_ID_HERE',
  'Senior Data Engineer',
  'TechCorp AI',
  'San Francisco, CA',
  'Full-time',
  '2022-01-01',
  NULL,
  true,
  'Led the development of ML pipelines processing 100TB+ daily data, reducing processing time by 60% through optimized Apache Spark jobs.',
  ARRAY[
    'Built real-time streaming architecture using Kafka and Flink',
    'Implemented MLOps practices with Kubeflow and MLflow',
    'Mentored 3 junior engineers in data engineering best practices'
  ],
  1,
  true
),
(
  'YOUR_USER_ID_HERE',
  'Data Scientist',
  'DataFlow Solutions',
  'New York, NY',
  'Full-time',
  '2020-01-01',
  '2021-12-31',
  false,
  'Developed predictive models and data visualization dashboards that increased client revenue by 25% on average.',
  ARRAY[
    'Created automated reporting systems using Python and Power BI',
    'Designed A/B testing framework for product optimization',
    'Built recommendation engine serving 1M+ users daily'
  ],
  2,
  true
),
(
  'YOUR_USER_ID_HERE',
  'Frontend Developer',
  'WebTech Studio',
  'Remote',
  'Contract',
  '2019-01-01',
  '2019-12-31',
  false,
  'Built responsive web applications using React and modern JavaScript frameworks.',
  ARRAY[
    'Developed 10+ client applications with 99.9% uptime',
    'Optimized application performance reducing load times by 40%',
    'Collaborated with UX/UI teams on user-centered design'
  ],
  3,
  true
);

-- Insert sample resume education
INSERT INTO public.resume_education (
  user_id,
  degree,
  field_of_study,
  school,
  location,
  start_date,
  end_date,
  gpa,
  display_order,
  is_visible
) VALUES 
(
  'YOUR_USER_ID_HERE',
  'Master of Science in Data Science',
  'Data Science',
  'Stanford University',
  'Stanford, CA',
  '2017-09-01',
  '2019-06-01',
  '3.8/4.0',
  1,
  true
),
(
  'YOUR_USER_ID_HERE',
  'Bachelor of Science in Computer Science',
  'Computer Science',
  'UC Berkeley',
  'Berkeley, CA',
  '2013-09-01',
  '2017-06-01',
  '3.6/4.0',
  2,
  true
);

-- Insert sample resume certifications
INSERT INTO public.resume_certifications (
  user_id,
  name,
  issuing_organization,
  issue_date,
  does_not_expire,
  display_order,
  is_visible
) VALUES 
(
  'YOUR_USER_ID_HERE',
  'AWS Certified Solutions Architect - Professional',
  'Amazon Web Services',
  '2023-01-15',
  false,
  1,
  true
),
(
  'YOUR_USER_ID_HERE',
  'Google Cloud Professional Data Engineer',
  'Google Cloud',
  '2022-08-20',
  false,
  2,
  true
),
(
  'YOUR_USER_ID_HERE',
  'Certified Kubernetes Application Developer (CKAD)',
  'Cloud Native Computing Foundation',
  '2022-03-10',
  true,
  3,
  true
),
(
  'YOUR_USER_ID_HERE',
  'MongoDB Certified Developer Associate',
  'MongoDB Inc.',
  '2021-11-05',
  true,
  4,
  true
);

-- Update profiles with resume stats
UPDATE public.profiles 
SET 
  resume_title = 'Professional Resume',
  resume_description = 'A comprehensive overview of my professional journey in data engineering, AI, and software development',
  years_of_experience = 5,
  projects_completed = 50,
  technologies_mastered = 15,
  show_resume_stats = true
WHERE user_id = 'YOUR_USER_ID_HERE';
*/

-- =====================================================
-- SECTION 10: Helper Views
-- =====================================================

-- View for current resume work experience
CREATE OR REPLACE VIEW public.resume_current_work_experience AS
SELECT 
  rwe.*,
  EXTRACT(YEAR FROM AGE(COALESCE(rwe.end_date, CURRENT_DATE), rwe.start_date)) AS years_in_role
FROM public.resume_work_experiences rwe
WHERE rwe.is_current = true AND rwe.is_visible = true
ORDER BY rwe.start_date DESC;

-- View for resume work experiences with duration
CREATE OR REPLACE VIEW public.resume_work_experiences_with_duration AS
SELECT 
  rwe.*,
  CASE 
    WHEN rwe.end_date IS NULL THEN 
      TO_CHAR(rwe.start_date, 'Mon YYYY') || ' - Present'
    ELSE 
      TO_CHAR(rwe.start_date, 'Mon YYYY') || ' - ' || TO_CHAR(rwe.end_date, 'Mon YYYY')
  END AS period,
  EXTRACT(YEAR FROM AGE(COALESCE(rwe.end_date, CURRENT_DATE), rwe.start_date)) * 12 + 
  EXTRACT(MONTH FROM AGE(COALESCE(rwe.end_date, CURRENT_DATE), rwe.start_date)) AS months_duration
FROM public.resume_work_experiences rwe
WHERE rwe.is_visible = true
ORDER BY rwe.display_order ASC, rwe.start_date DESC;

-- View for resume education with period formatting
CREATE OR REPLACE VIEW public.resume_education_with_period AS
SELECT 
  e.*,
  CASE 
    WHEN e.start_date IS NOT NULL AND e.end_date IS NOT NULL THEN 
      TO_CHAR(e.start_date, 'YYYY') || ' - ' || TO_CHAR(e.end_date, 'YYYY')
    WHEN e.end_date IS NOT NULL THEN 
      TO_CHAR(e.end_date, 'YYYY')
    ELSE 
      'Present'
  END AS period
FROM public.resume_education e
WHERE e.is_visible = true
ORDER BY e.display_order ASC, e.end_date DESC NULLS FIRST;

-- View for active resume certifications (not expired)
CREATE OR REPLACE VIEW public.resume_active_certifications AS
SELECT 
  c.*,
  CASE 
    WHEN c.does_not_expire THEN true
    WHEN c.expiry_date IS NULL THEN true
    WHEN c.expiry_date > CURRENT_DATE THEN true
    ELSE false
  END AS is_active
FROM public.resume_certifications c
WHERE c.is_visible = true
  AND (
    c.does_not_expire = true 
    OR c.expiry_date IS NULL 
    OR c.expiry_date > CURRENT_DATE
  )
ORDER BY c.display_order ASC, c.issue_date DESC;

COMMENT ON VIEW public.resume_current_work_experience IS 'Shows only current work positions with calculated duration';
COMMENT ON VIEW public.resume_work_experiences_with_duration IS 'Resume work experiences with formatted period and duration in months';
COMMENT ON VIEW public.resume_education_with_period IS 'Resume education records with formatted period strings';
COMMENT ON VIEW public.resume_active_certifications IS 'Only shows active (non-expired) resume certifications';

-- =====================================================
-- END OF MIGRATION
-- =====================================================
