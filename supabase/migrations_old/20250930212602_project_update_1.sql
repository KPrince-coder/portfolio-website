-- Drop existing trigger if needed to recreate
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
-- Create projects table with all fields (using IF NOT EXISTS to avoid duplication)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description JSONB NOT NULL DEFAULT '{}',
    excerpt TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    duration INTEGER,
    technologies TEXT [] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    featured_image TEXT,
    assets TEXT [] DEFAULT '{}',
    github_url TEXT,
    demo_url TEXT,
    seo_title TEXT,
    seo_description TEXT,
    author_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Create project_analytics table
CREATE TABLE IF NOT EXISTS public.project_analytics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    view_count INTEGER NOT NULL DEFAULT 0,
    last_viewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(project_id)
);
-- Create project_assets table
CREATE TABLE IF NOT EXISTS public.project_assets (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (
        file_type IN ('image', 'pdf', 'video', 'document')
    ),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Recreate trigger for updated_at on projects
CREATE TRIGGER update_projects_updated_at BEFORE
UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_technologies ON public.projects USING GIN(technologies);
CREATE INDEX IF NOT EXISTS idx_project_analytics_project_id ON public.project_analytics(project_id);
CREATE INDEX IF NOT EXISTS idx_project_assets_project_id ON public.project_assets(project_id);
-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_assets ENABLE ROW LEVEL SECURITY;
-- RLS Policies for projects
CREATE POLICY "Public read published projects" ON public.projects FOR
SELECT USING (status = 'published');
CREATE POLICY "Authenticated users can manage projects" ON public.projects FOR ALL USING (auth.uid() IS NOT NULL);
-- RLS Policies for project_analytics
CREATE POLICY "Public can view analytics for published projects" ON public.project_analytics FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.projects
            WHERE projects.id = project_analytics.project_id
                AND projects.status = 'published'
        )
    );
CREATE POLICY "Authenticated users can manage project analytics" ON public.project_analytics FOR ALL USING (auth.uid() IS NOT NULL);
-- RLS Policies for project_assets
CREATE POLICY "Public read assets for published projects" ON public.project_assets FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.projects
            WHERE projects.id = project_assets.project_id
                AND projects.status = 'published'
        )
    );
CREATE POLICY "Authenticated users can manage project assets" ON public.project_assets FOR ALL USING (auth.uid() IS NOT NULL);