-- Drop existing policies to recreate
DROP POLICY IF EXISTS "Public read published projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can manage projects" ON public.projects;
DROP POLICY IF EXISTS "Public can view analytics for published projects" ON public.project_analytics;
DROP POLICY IF EXISTS "Authenticated users can manage project analytics" ON public.project_analytics;
DROP POLICY IF EXISTS "Public read assets for published projects" ON public.project_assets;
DROP POLICY IF EXISTS "Authenticated users can manage project assets" ON public.project_assets;
-- Add missing columns to projects table if they don't exist
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'projects'
        AND column_name = 'description'
) THEN
ALTER TABLE public.projects
ADD COLUMN description JSONB NOT NULL DEFAULT '{}';
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'projects'
        AND column_name = 'excerpt'
) THEN
ALTER TABLE public.projects
ADD COLUMN excerpt TEXT;
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'projects'
        AND column_name = 'start_date'
) THEN
ALTER TABLE public.projects
ADD COLUMN start_date DATE;
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'projects'
        AND column_name = 'end_date'
) THEN
ALTER TABLE public.projects
ADD COLUMN end_date DATE;
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'projects'
        AND column_name = 'duration'
) THEN
ALTER TABLE public.projects
ADD COLUMN duration INTEGER;
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'projects'
        AND column_name = 'technologies'
) THEN
ALTER TABLE public.projects
ADD COLUMN technologies TEXT [] DEFAULT '{}';
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'projects'
        AND column_name = 'assets'
) THEN
ALTER TABLE public.projects
ADD COLUMN assets TEXT [] DEFAULT '{}';
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'projects'
        AND column_name = 'seo_title'
) THEN
ALTER TABLE public.projects
ADD COLUMN seo_title TEXT;
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'projects'
        AND column_name = 'seo_description'
) THEN
ALTER TABLE public.projects
ADD COLUMN seo_description TEXT;
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'projects'
        AND column_name = 'author_id'
) THEN
ALTER TABLE public.projects
ADD COLUMN author_id UUID;
END IF;
END $$;
-- Create project_analytics table if not exists
CREATE TABLE IF NOT EXISTS public.project_analytics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    view_count INTEGER NOT NULL DEFAULT 0,
    last_viewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(project_id)
);
-- Create project_assets table if not exists
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
-- Create indexes
CREATE INDEX IF NOT EXISTS idx_projects_technologies ON public.projects USING GIN(technologies);
CREATE INDEX IF NOT EXISTS idx_project_analytics_project_id ON public.project_analytics(project_id);
CREATE INDEX IF NOT EXISTS idx_project_assets_project_id ON public.project_assets(project_id);
-- Enable RLS on new tables
ALTER TABLE public.project_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_assets ENABLE ROW LEVEL SECURITY;
-- Recreate RLS Policies for projects
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