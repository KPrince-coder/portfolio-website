-- =====================================================
-- Projects Migration
-- Manages project portfolio, categories, and technologies
-- =====================================================

-- =====================================================
-- SECTION 1: Add Projects Section Title and Description to Profiles
-- =====================================================

-- Add projects section title and description to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS projects_title TEXT DEFAULT 'Featured Projects',
ADD COLUMN IF NOT EXISTS projects_description TEXT DEFAULT 'A showcase of my work spanning web applications, AI/ML systems, and data engineering solutions. Each project represents a unique challenge solved with modern technologies and best practices.';

COMMENT ON COLUMN public.profiles.projects_title IS 'Title for the projects section (e.g., "Featured Projects", "My Work")';
COMMENT ON COLUMN public.profiles.projects_description IS 'Description text displayed at the top of the projects section';

-- =====================================================
-- SECTION 2: Project Categories Table
-- =====================================================

-- Project categories for organizing projects
CREATE TABLE public.project_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Folder',
  color TEXT NOT NULL DEFAULT 'text-secondary',
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- SECTION 3: Projects Table
-- =====================================================

-- Main projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.project_categories(id) ON DELETE CASCADE,
  
  -- Basic Information
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  long_description TEXT,
  
  -- Media
  image_url TEXT,
  demo_url TEXT,
  github_url TEXT,
  
  -- Metadata
  technologies TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'in-progress', 'planned', 'archived')),
  
  -- Metrics
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  
  -- Display
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  
  -- Dates
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- SECTION 4: Project Technologies Table (Optional)
-- =====================================================

-- Separate table for technologies/tech stack
CREATE TABLE public.technologies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Code',
  color TEXT NOT NULL DEFAULT 'text-primary',
  category TEXT, -- e.g., 'frontend', 'backend', 'database', 'devops'
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- SECTION 5: Project-Technology Junction Table
-- =====================================================

-- Many-to-many relationship between projects and technologies
CREATE TABLE public.project_technologies (
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  technology_id UUID NOT NULL REFERENCES public.technologies(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, technology_id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- SECTION 6: Indexes
-- =====================================================

-- Project Categories Indexes
CREATE INDEX idx_project_categories_name ON public.project_categories(name);
CREATE INDEX idx_project_categories_display_order ON public.project_categories(display_order);
CREATE INDEX idx_project_categories_is_active ON public.project_categories(is_active);

-- Projects Indexes
CREATE INDEX idx_projects_category_id ON public.projects(category_id);
CREATE INDEX idx_projects_slug ON public.projects(slug);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_is_featured ON public.projects(is_featured);
CREATE INDEX idx_projects_display_order ON public.projects(display_order);
CREATE INDEX idx_projects_created_at ON public.projects(created_at DESC);

-- Technologies Indexes
CREATE INDEX idx_technologies_name ON public.technologies(name);
CREATE INDEX idx_technologies_category ON public.technologies(category);
CREATE INDEX idx_technologies_is_active ON public.technologies(is_active);

-- Project Technologies Indexes
CREATE INDEX idx_project_technologies_project_id ON public.project_technologies(project_id);
CREATE INDEX idx_project_technologies_technology_id ON public.project_technologies(technology_id);

-- =====================================================
-- SECTION 7: Triggers
-- =====================================================

-- Auto-update updated_at timestamp for project_categories
CREATE TRIGGER update_project_categories_updated_at 
  BEFORE UPDATE ON public.project_categories 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-update updated_at timestamp for projects
CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON public.projects 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-update updated_at timestamp for technologies
CREATE TRIGGER update_technologies_updated_at 
  BEFORE UPDATE ON public.technologies 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- SECTION 8: Row Level Security (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE public.project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_technologies ENABLE ROW LEVEL SECURITY;

-- Public can read all projects data
CREATE POLICY "Public read access for project_categories" 
  ON public.project_categories FOR SELECT USING (true);

CREATE POLICY "Public read access for projects" 
  ON public.projects FOR SELECT USING (true);

CREATE POLICY "Public read access for technologies" 
  ON public.technologies FOR SELECT USING (true);

CREATE POLICY "Public read access for project_technologies" 
  ON public.project_technologies FOR SELECT USING (true);

-- Authenticated users can manage all projects data
CREATE POLICY "Authenticated users can manage project_categories" 
  ON public.project_categories FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage projects" 
  ON public.projects FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage technologies" 
  ON public.technologies FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage project_technologies" 
  ON public.project_technologies FOR ALL USING (auth.uid() IS NOT NULL);

-- =====================================================
-- SECTION 9: Comments
-- =====================================================

COMMENT ON TABLE public.project_categories IS 'Categories for organizing projects (e.g., Web Apps, Mobile Apps, AI/ML)';
COMMENT ON TABLE public.projects IS 'Portfolio projects with details, links, and metadata';
COMMENT ON TABLE public.technologies IS 'Technologies and tools used in projects';
COMMENT ON TABLE public.project_technologies IS 'Many-to-many relationship between projects and technologies';

COMMENT ON COLUMN public.projects.slug IS 'URL-friendly identifier for the project';
COMMENT ON COLUMN public.projects.status IS 'Project status: completed, in-progress, planned, or archived';
COMMENT ON COLUMN public.projects.is_featured IS 'Whether to feature this project prominently';
COMMENT ON COLUMN public.projects.technologies IS 'Array of technology names (simple approach)';
COMMENT ON COLUMN public.projects.tags IS 'Array of tags for filtering and search';

-- =====================================================
-- SECTION 10: Storage Bucket for Project Images
-- =====================================================

-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images',
  true, -- Public bucket so images can be displayed
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SECTION 11: Storage Policies
-- =====================================================

-- Allow public to view project images
CREATE POLICY "Public can view project images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');

-- Allow authenticated users to upload project images
CREATE POLICY "Authenticated users can upload project images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'project-images' 
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to update project images
CREATE POLICY "Authenticated users can update project images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'project-images' 
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete project images
CREATE POLICY "Authenticated users can delete project images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'project-images' 
    AND auth.role() = 'authenticated'
  );

-- =====================================================
-- SECTION 12: Seed Data
-- =====================================================

-- Insert default project categories
INSERT INTO public.project_categories (name, label, icon, color, description, display_order) VALUES
  ('web', 'Web Applications', 'Globe', 'text-secondary', 'Full-stack web applications and websites', 1),
  ('mobile', 'Mobile Apps', 'Smartphone', 'text-accent', 'iOS and Android mobile applications', 2),
  ('ai-ml', 'AI & Machine Learning', 'Brain', 'text-neural', 'Artificial intelligence and machine learning projects', 3),
  ('data', 'Data Engineering', 'Database', 'text-success', 'Data pipelines, analytics, and visualization', 4),
  ('devops', 'DevOps & Cloud', 'Cloud', 'text-warning', 'Infrastructure, deployment, and cloud solutions', 5),
  ('open-source', 'Open Source', 'Package', 'text-primary', 'Open source contributions and libraries', 6)
ON CONFLICT (name) DO NOTHING;

-- Insert common technologies
INSERT INTO public.technologies (name, label, icon, color, category, display_order) VALUES
  -- Frontend
  ('react', 'React', 'Code', 'text-secondary', 'frontend', 1),
  ('vue', 'Vue.js', 'Code', 'text-accent', 'frontend', 2),
  ('angular', 'Angular', 'Code', 'text-success', 'frontend', 3),
  ('nextjs', 'Next.js', 'Code', 'text-neural', 'frontend', 4),
  ('typescript', 'TypeScript', 'Code', 'text-secondary', 'frontend', 5),
  
  -- Backend
  ('nodejs', 'Node.js', 'Server', 'text-success', 'backend', 10),
  ('python', 'Python', 'Code', 'text-secondary', 'backend', 11),
  ('django', 'Django', 'Server', 'text-accent', 'backend', 12),
  ('fastapi', 'FastAPI', 'Zap', 'text-neural', 'backend', 13),
  ('express', 'Express', 'Server', 'text-warning', 'backend', 14),
  
  -- Database
  ('postgresql', 'PostgreSQL', 'Database', 'text-secondary', 'database', 20),
  ('mongodb', 'MongoDB', 'Database', 'text-success', 'database', 21),
  ('redis', 'Redis', 'Database', 'text-accent', 'database', 22),
  ('supabase', 'Supabase', 'Database', 'text-neural', 'database', 23),
  
  -- AI/ML
  ('tensorflow', 'TensorFlow', 'Brain', 'text-warning', 'ai-ml', 30),
  ('pytorch', 'PyTorch', 'Brain', 'text-accent', 'ai-ml', 31),
  ('scikit-learn', 'Scikit-learn', 'Brain', 'text-success', 'ai-ml', 32),
  
  -- DevOps
  ('docker', 'Docker', 'Box', 'text-secondary', 'devops', 40),
  ('kubernetes', 'Kubernetes', 'Cloud', 'text-neural', 'devops', 41),
  ('aws', 'AWS', 'Cloud', 'text-warning', 'devops', 42),
  ('vercel', 'Vercel', 'Zap', 'text-accent', 'devops', 43)
ON CONFLICT (name) DO NOTHING;

-- -- Insert sample projects (optional - for testing/demo purposes)
-- -- Note: These will only insert if categories exist
-- DO $
-- DECLARE
--   web_category_id UUID;
--   ai_category_id UUID;
--   data_category_id UUID;
-- BEGIN
--   -- Get category IDs
--   SELECT id INTO web_category_id FROM public.project_categories WHERE name = 'web' LIMIT 1;
--   SELECT id INTO ai_category_id FROM public.project_categories WHERE name = 'ai-ml' LIMIT 1;
--   SELECT id INTO data_category_id FROM public.project_categories WHERE name = 'data' LIMIT 1;
  
--   -- Insert sample projects if categories exist
--   IF web_category_id IS NOT NULL THEN
--     INSERT INTO public.projects (
--       category_id, title, slug, description, long_description,
--       status, is_featured, display_order, tags
--     ) VALUES (
--       web_category_id,
--       'Portfolio Website',
--       'portfolio-website',
--       'A modern, responsive portfolio website built with React and TypeScript',
--       'This portfolio website showcases my work and skills using cutting-edge web technologies. Features include dark mode, smooth animations, and a fully responsive design that works seamlessly across all devices.',
--       'completed',
--       true,
--       1,
--       ARRAY['react', 'typescript', 'tailwind']
--     ) ON CONFLICT (slug) DO NOTHING;
--   END IF;
  
--   IF ai_category_id IS NOT NULL THEN
--     INSERT INTO public.projects (
--       category_id, title, slug, description, long_description,
--       status, is_featured, display_order, tags
--     ) VALUES (
--       ai_category_id,
--       'AI Chat Assistant',
--       'ai-chat-assistant',
--       'An intelligent chatbot powered by machine learning and natural language processing',
--       'Built using state-of-the-art language models, this chat assistant can understand context, maintain conversations, and provide helpful responses across various topics.',
--       'in-progress',
--       true,
--       2,
--       ARRAY['python', 'tensorflow', 'nlp']
--     ) ON CONFLICT (slug) DO NOTHING;
--   END IF;
  
--   IF data_category_id IS NOT NULL THEN
--     INSERT INTO public.projects (
--       category_id, title, slug, description, long_description,
--       status, is_featured, display_order, tags
--     ) VALUES (
--       data_category_id,
--       'Data Analytics Dashboard',
--       'data-analytics-dashboard',
--       'Real-time data visualization and analytics platform',
--       'A comprehensive dashboard for visualizing complex datasets with interactive charts, real-time updates, and customizable views. Processes millions of data points efficiently.',
--       'completed',
--       false,
--       3,
--       ARRAY['python', 'postgresql', 'visualization']
--     ) ON CONFLICT (slug) DO NOTHING;
--   END IF;
-- END $;

-- =====================================================
-- SECTION 13: Helper Views
-- =====================================================

-- View for projects with category information
CREATE OR REPLACE VIEW public.projects_with_categories AS
SELECT 
  p.*,
  pc.name as category_name,
  pc.label as category_label,
  pc.icon as category_icon,
  pc.color as category_color
FROM public.projects p
LEFT JOIN public.project_categories pc ON p.category_id = pc.id;

COMMENT ON VIEW public.projects_with_categories IS 'Projects joined with their category information';

-- View for projects with technology count
CREATE OR REPLACE VIEW public.projects_with_tech_count AS
SELECT 
  p.*,
  COUNT(pt.technology_id) as technology_count
FROM public.projects p
LEFT JOIN public.project_technologies pt ON p.id = pt.project_id
GROUP BY p.id;

COMMENT ON VIEW public.projects_with_tech_count IS 'Projects with count of associated technologies';

-- =====================================================
-- SECTION 14: Helper Functions
-- =====================================================

-- Function to get featured projects
CREATE OR REPLACE FUNCTION public.get_featured_projects(limit_count INTEGER DEFAULT 6)
RETURNS SETOF public.projects_with_categories AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.projects_with_categories
  WHERE is_featured = true
  ORDER BY display_order ASC, created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_featured_projects IS 'Returns featured projects ordered by display_order';

-- Function to get projects by category
CREATE OR REPLACE FUNCTION public.get_projects_by_category(category_name TEXT)
RETURNS SETOF public.projects_with_categories AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.projects_with_categories
  WHERE category_name = $1
  ORDER BY display_order ASC, created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_projects_by_category IS 'Returns projects filtered by category name';

-- Function to search projects
CREATE OR REPLACE FUNCTION public.search_projects(search_term TEXT)
RETURNS SETOF public.projects_with_categories AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.projects_with_categories
  WHERE 
    title ILIKE '%' || search_term || '%' OR
    description ILIKE '%' || search_term || '%' OR
    search_term = ANY(tags)
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.search_projects IS 'Search projects by title, description, or tags';

