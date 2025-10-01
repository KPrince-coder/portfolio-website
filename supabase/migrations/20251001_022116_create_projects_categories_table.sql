CREATE TABLE public.projects_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
CREATE TRIGGER update_projects_categories_updated_at BEFORE
UPDATE ON public.projects_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
INSERT INTO public.projects_categories (name, slug, icon)
VALUES ('AI/ML', 'ai-ml', 'Brain'),
    ('Mobile/AI', 'mobile-ai', 'Smartphone'),
    (
        'Data Engineering',
        'data-engineering',
        'Database'
    ),
    (
        'Frontend Development',
        'frontend-development',
        'Play'
    ),
    (
        'Backend Development',
        'backend-development',
        'Database'
    ),
    ('DevOps', 'devops', 'TrendingUp') ON CONFLICT (slug) DO NOTHING;