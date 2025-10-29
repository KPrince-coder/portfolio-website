-- =====================================================
-- Skills Migration
-- Manages skills, skill categories, and learning goals
-- =====================================================

-- =====================================================
-- SECTION 1: Skill Categories Table
-- =====================================================

CREATE TABLE public.skill_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  icon TEXT NOT NULL, -- Lucide icon name
  display_order INTEGER NOT NULL DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- SECTION 2: Skills Table
-- =====================================================

CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.skill_categories(id) ON DELETE CASCADE,
  
  -- Skill Information
  name TEXT NOT NULL,
  proficiency INTEGER NOT NULL CHECK (proficiency >= 0 AND proficiency <= 100),
  description TEXT,
  icon TEXT NOT NULL, -- Lucide icon name
  color TEXT NOT NULL DEFAULT 'text-secondary', -- Tailwind color class
  
  -- Display
  display_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(category_id, name)
);

-- =====================================================
-- SECTION 3: Learning Goals Table (Optional)
-- =====================================================

CREATE TABLE public.learning_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Goal Information
  title TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('learning', 'exploring', 'researching')),
  color TEXT NOT NULL DEFAULT 'text-secondary', -- Tailwind color class
  
  -- Display
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- SECTION 4: Indexes
-- =====================================================

CREATE INDEX idx_skills_category_id ON public.skills(category_id);
CREATE INDEX idx_skills_proficiency ON public.skills(proficiency DESC);
CREATE INDEX idx_skills_featured ON public.skills(is_featured) WHERE is_featured = true;
CREATE INDEX idx_skill_categories_order ON public.skill_categories(display_order);
CREATE INDEX idx_skills_order ON public.skills(display_order);
CREATE INDEX idx_learning_goals_active ON public.learning_goals(is_active) WHERE is_active = true;

-- =====================================================
-- SECTION 5: Triggers
-- =====================================================

CREATE TRIGGER update_skill_categories_updated_at 
  BEFORE UPDATE ON public.skill_categories 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_skills_updated_at 
  BEFORE UPDATE ON public.skills 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_learning_goals_updated_at 
  BEFORE UPDATE ON public.learning_goals 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- SECTION 6: Row Level Security (RLS)
-- =====================================================

ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_goals ENABLE ROW LEVEL SECURITY;

-- Public can read all skills data
CREATE POLICY "Public read access for skill_categories" 
  ON public.skill_categories FOR SELECT USING (true);

CREATE POLICY "Public read access for skills" 
  ON public.skills FOR SELECT USING (true);

CREATE POLICY "Public read access for learning_goals" 
  ON public.learning_goals FOR SELECT USING (true);

-- Authenticated users can manage all skills data
CREATE POLICY "Authenticated users can manage skill_categories" 
  ON public.skill_categories FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage skills" 
  ON public.skills FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage learning_goals" 
  ON public.learning_goals FOR ALL USING (auth.uid() IS NOT NULL);

-- =====================================================
-- SECTION 7: Comments
-- =====================================================

COMMENT ON TABLE public.skill_categories IS 'Categories for organizing skills (e.g., AI & ML, Data Engineering, Frontend)';
COMMENT ON TABLE public.skills IS 'Individual skills with proficiency levels and descriptions';
COMMENT ON TABLE public.learning_goals IS 'Current learning goals and areas of exploration';

COMMENT ON COLUMN public.skills.proficiency IS 'Proficiency level from 0-100';
COMMENT ON COLUMN public.skills.is_featured IS 'Whether to highlight this skill prominently';
COMMENT ON COLUMN public.learning_goals.status IS 'Current status: learning, exploring, or researching';

-- =====================================================
-- SECTION 8: Seed Data
-- =====================================================

-- Insert skill categories
INSERT INTO public.skill_categories (name, label, icon, display_order) VALUES
  ('all', 'All Skills', 'Zap', 0),
  ('ai', 'AI & ML', 'Brain', 1),
  ('data', 'Data Engineering', 'Database', 2),
  ('frontend', 'Frontend', 'Code', 3),
  ('mobile', 'Mobile', 'Smartphone', 4)
ON CONFLICT (name) DO NOTHING;

-- Get category IDs for reference
DO $$
DECLARE
  ai_cat_id UUID;
  data_cat_id UUID;
  frontend_cat_id UUID;
  mobile_cat_id UUID;
BEGIN
  SELECT id INTO ai_cat_id FROM public.skill_categories WHERE name = 'ai';
  SELECT id INTO data_cat_id FROM public.skill_categories WHERE name = 'data';
  SELECT id INTO frontend_cat_id FROM public.skill_categories WHERE name = 'frontend';
  SELECT id INTO mobile_cat_id FROM public.skill_categories WHERE name = 'mobile';

  -- Insert AI & ML skills
  INSERT INTO public.skills (category_id, name, proficiency, description, icon, color, display_order, is_featured) VALUES
    (ai_cat_id, 'TensorFlow', 95, 'Deep learning models and neural networks', 'Brain', 'text-secondary', 1, true),
    (ai_cat_id, 'PyTorch', 90, 'Research-focused ML and computer vision', 'Brain', 'text-accent', 2, true),
    (ai_cat_id, 'Scikit-learn', 88, 'Classical ML algorithms and preprocessing', 'BarChart3', 'text-success', 3, false)
  ON CONFLICT (category_id, name) DO NOTHING;

  -- Insert Data Engineering skills
  INSERT INTO public.skills (category_id, name, proficiency, description, icon, color, display_order, is_featured) VALUES
    (data_cat_id, 'Apache Spark', 92, 'Large-scale data processing and analytics', 'Zap', 'text-secondary', 1, true),
    (data_cat_id, 'PostgreSQL', 85, 'Advanced SQL and database optimization', 'Database', 'text-accent', 2, false),
    (data_cat_id, 'Apache Kafka', 80, 'Real-time data streaming and messaging', 'Cpu', 'text-warning', 3, false),
    (data_cat_id, 'AWS', 90, 'Cloud infrastructure and ML services', 'Cloud', 'text-warning', 4, true)
  ON CONFLICT (category_id, name) DO NOTHING;

  -- Insert Frontend skills
  INSERT INTO public.skills (category_id, name, proficiency, description, icon, color, display_order, is_featured) VALUES
    (frontend_cat_id, 'React', 93, 'Modern UI development and state management', 'Code', 'text-secondary', 1, true),
    (frontend_cat_id, 'TypeScript', 87, 'Type-safe JavaScript development', 'Shield', 'text-accent', 2, true),
    (frontend_cat_id, 'Next.js', 85, 'Full-stack React applications', 'GitBranch', 'text-success', 3, false)
  ON CONFLICT (category_id, name) DO NOTHING;

  -- Insert Mobile skills
  INSERT INTO public.skills (category_id, name, proficiency, description, icon, color, display_order, is_featured) VALUES
    (mobile_cat_id, 'React Native', 82, 'Cross-platform mobile development', 'Smartphone', 'text-secondary', 1, false),
    (mobile_cat_id, 'Flutter', 78, 'Beautiful native mobile apps', 'Smartphone', 'text-accent', 2, false)
  ON CONFLICT (category_id, name) DO NOTHING;
END $$;

-- Insert learning goals
INSERT INTO public.learning_goals (title, status, color, display_order, is_active) VALUES
  ('Currently learning: JAX & MLX', 'learning', 'text-secondary', 1, true),
  ('Exploring: Rust for ML', 'exploring', 'text-accent', 2, true),
  ('Researching: Edge AI', 'researching', 'text-success', 3, true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- SECTION 9: Helper Views (Optional)
-- =====================================================

-- View to get skills with category information
CREATE OR REPLACE VIEW public.skills_with_categories AS
SELECT 
  s.id,
  s.name,
  s.proficiency,
  s.description,
  s.icon,
  s.color,
  s.display_order,
  s.is_featured,
  s.created_at,
  s.updated_at,
  c.name as category_name,
  c.label as category_label,
  c.icon as category_icon
FROM public.skills s
JOIN public.skill_categories c ON s.category_id = c.id
ORDER BY s.display_order, s.proficiency DESC;

COMMENT ON VIEW public.skills_with_categories IS 'Skills joined with their category information for easier querying';

