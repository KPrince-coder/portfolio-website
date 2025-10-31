-- ============================================================================
-- Blog System Migration
-- Created: October 31, 2025
-- Description: Complete blog system with posts, categories, tags, SEO, and image management
-- Reference: docs/BLOG_FEATURE_ANALYSIS.md
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUMS
-- ============================================================================

-- Post status enum
CREATE TYPE blog_post_status AS ENUM ('draft', 'published', 'scheduled', 'archived');

-- ============================================================================
-- TABLES
-- ============================================================================

-- 1. Blog Categories Table
-- Broad topics for organizing posts
CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#3B82F6', -- Hex color for UI (default blue)
  icon TEXT, -- Icon name (e.g., 'code', 'design', 'business')
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Blog Tags Table
-- Specific keywords for discovery
CREATE TABLE blog_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  usage_count INTEGER DEFAULT 0, -- How many posts use this tag
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Blog Posts Table
-- Main content table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT, -- Short description (150-300 chars)
  content TEXT NOT NULL, -- Markdown or HTML content
  featured_image TEXT, -- URL to featured/cover image
  status blog_post_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ, -- When post went live
  scheduled_for TIMESTAMPTZ, -- Future publish date
  view_count INTEGER DEFAULT 0,
  read_time_minutes INTEGER, -- Auto-calculated reading time
  comments_enabled BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false, -- Pin to homepage
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_published_at CHECK (
    (status = 'published' AND published_at IS NOT NULL) OR 
    (status != 'published')
  ),
  CONSTRAINT valid_scheduled_for CHECK (
    (status = 'scheduled' AND scheduled_for IS NOT NULL) OR 
    (status != 'scheduled')
  )
);

-- 4. Blog Post Categories Junction Table
-- Many-to-many relationship between posts and categories
CREATE TABLE blog_post_categories (
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES blog_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  PRIMARY KEY (post_id, category_id)
);

-- 5. Blog Post Tags Junction Table
-- Many-to-many relationship between posts and tags
CREATE TABLE blog_post_tags (
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES blog_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  PRIMARY KEY (post_id, tag_id)
);

-- 6. Blog SEO Metadata Table
-- SEO optimization data for each post
CREATE TABLE blog_seo_metadata (
  post_id UUID PRIMARY KEY REFERENCES blog_posts(id) ON DELETE CASCADE,
  meta_title TEXT, -- Custom SEO title (defaults to post title)
  meta_description TEXT, -- Custom SEO description (defaults to excerpt)
  og_image TEXT, -- Social media preview image (defaults to featured_image)
  keywords TEXT[], -- SEO keywords array
  canonical_url TEXT, -- For cross-posting (prevent duplicate content)
  robots_meta TEXT DEFAULT 'index,follow', -- index/noindex, follow/nofollow
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Blog Images Table
-- Image management with automatic optimization tracking
CREATE TABLE blog_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES blog_posts(id) ON DELETE SET NULL, -- Nullable for reusable images
  original_url TEXT NOT NULL, -- Original source (local or external)
  storage_path TEXT NOT NULL, -- Path in Supabase Storage
  optimized_url TEXT NOT NULL, -- Main optimized image URL
  thumbnail_url TEXT, -- Small preview (300px width)
  medium_url TEXT, -- Medium size (800px width)
  large_url TEXT, -- Large size (1200px width)
  webp_url TEXT, -- WebP version for modern browsers
  alt_text TEXT, -- Accessibility description
  caption TEXT, -- Optional image caption
  width INTEGER, -- Original width in pixels
  height INTEGER, -- Original height in pixels
  file_size INTEGER, -- Original size in bytes
  optimized_size INTEGER, -- Optimized size in bytes
  format TEXT, -- jpg, png, webp, gif, etc.
  compression_ratio DECIMAL(5,2), -- Optimization percentage (e.g., 0.85 = 85%)
  is_featured BOOLEAN DEFAULT false, -- Is this the post's featured image
  uploaded_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Blog Posts Indexes
CREATE INDEX idx_blog_posts_user_id ON blog_posts(user_id);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX idx_blog_posts_view_count ON blog_posts(view_count DESC);
CREATE INDEX idx_blog_posts_is_featured ON blog_posts(is_featured) WHERE is_featured = true;
CREATE INDEX idx_blog_posts_scheduled_for ON blog_posts(scheduled_for) WHERE status = 'scheduled';

-- Full-text search index for posts
CREATE INDEX idx_blog_posts_search ON blog_posts USING gin(to_tsvector('english', title || ' ' || COALESCE(excerpt, '') || ' ' || content));

-- Categories Indexes
CREATE INDEX idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX idx_blog_categories_display_order ON blog_categories(display_order);

-- Tags Indexes
CREATE INDEX idx_blog_tags_slug ON blog_tags(slug);
CREATE INDEX idx_blog_tags_usage_count ON blog_tags(usage_count DESC);
CREATE INDEX idx_blog_tags_name ON blog_tags(name);

-- Junction Tables Indexes
CREATE INDEX idx_blog_post_categories_post_id ON blog_post_categories(post_id);
CREATE INDEX idx_blog_post_categories_category_id ON blog_post_categories(category_id);
CREATE INDEX idx_blog_post_tags_post_id ON blog_post_tags(post_id);
CREATE INDEX idx_blog_post_tags_tag_id ON blog_post_tags(tag_id);

-- Images Indexes
CREATE INDEX idx_blog_images_post_id ON blog_images(post_id);
CREATE INDEX idx_blog_images_uploaded_by ON blog_images(uploaded_by);
CREATE INDEX idx_blog_images_is_featured ON blog_images(is_featured) WHERE is_featured = true;

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function: Generate URL-friendly slug from text
CREATE OR REPLACE FUNCTION generate_slug(text_input TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(text_input, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function: Calculate reading time from content
CREATE OR REPLACE FUNCTION calculate_read_time(content_text TEXT)
RETURNS INTEGER AS $$
DECLARE
  word_count INTEGER;
  words_per_minute INTEGER := 200; -- Average reading speed
BEGIN
  -- Count words (split by whitespace)
  word_count := array_length(regexp_split_to_array(content_text, '\s+'), 1);
  
  -- Calculate minutes, minimum 1 minute
  RETURN GREATEST(1, CEIL(word_count::DECIMAL / words_per_minute));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Increment tag usage count
CREATE OR REPLACE FUNCTION increment_tag_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE blog_tags
  SET usage_count = usage_count + 1
  WHERE id = NEW.tag_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Decrement tag usage count
CREATE OR REPLACE FUNCTION decrement_tag_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE blog_tags
  SET usage_count = GREATEST(0, usage_count - 1)
  WHERE id = OLD.tag_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Function: Auto-generate slug if not provided
CREATE OR REPLACE FUNCTION auto_generate_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
BEGIN
  -- Only generate if slug is null or empty
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    base_slug := generate_slug(NEW.title);
    final_slug := base_slug;
    
    -- Check for uniqueness and append number if needed
    WHILE EXISTS (SELECT 1 FROM blog_posts WHERE slug = final_slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID)) LOOP
      final_slug := base_slug || '-' || counter;
      counter := counter + 1;
    END LOOP;
    
    NEW.slug := final_slug;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Auto-calculate read time
CREATE OR REPLACE FUNCTION auto_calculate_read_time()
RETURNS TRIGGER AS $$
BEGIN
  NEW.read_time_minutes := calculate_read_time(NEW.content);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Set published_at when status changes to published
CREATE OR REPLACE FUNCTION set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  -- If status is changing to published and published_at is null
  IF NEW.status = 'published' AND OLD.status != 'published' AND NEW.published_at IS NULL THEN
    NEW.published_at := NOW();
  END IF;
  
  -- If status is changing from published, clear published_at
  IF NEW.status != 'published' AND OLD.status = 'published' THEN
    NEW.published_at := NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at timestamp triggers
CREATE TRIGGER update_blog_categories_updated_at
  BEFORE UPDATE ON blog_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_tags_updated_at
  BEFORE UPDATE ON blog_tags
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_seo_metadata_updated_at
  BEFORE UPDATE ON blog_seo_metadata
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_images_updated_at
  BEFORE UPDATE ON blog_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate slug trigger
CREATE TRIGGER auto_generate_blog_post_slug
  BEFORE INSERT OR UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_slug();

-- Auto-calculate read time trigger
CREATE TRIGGER auto_calculate_blog_post_read_time
  BEFORE INSERT OR UPDATE ON blog_posts
  FOR EACH ROW
  WHEN (NEW.content IS NOT NULL)
  EXECUTE FUNCTION auto_calculate_read_time();

-- Set published_at trigger
CREATE TRIGGER set_blog_post_published_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION set_published_at();

-- Tag usage count triggers
CREATE TRIGGER increment_tag_usage_on_insert
  AFTER INSERT ON blog_post_tags
  FOR EACH ROW
  EXECUTE FUNCTION increment_tag_usage();

CREATE TRIGGER decrement_tag_usage_on_delete
  AFTER DELETE ON blog_post_tags
  FOR EACH ROW
  EXECUTE FUNCTION decrement_tag_usage();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_seo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_images ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES - Blog Categories
-- ============================================================================

-- Public can view all categories
CREATE POLICY "Public can view categories"
  ON blog_categories FOR SELECT
  USING (true);

-- Authenticated users can create categories (admin only in app logic)
CREATE POLICY "Authenticated users can create categories"
  ON blog_categories FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update categories (admin only in app logic)
CREATE POLICY "Authenticated users can update categories"
  ON blog_categories FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Authenticated users can delete categories (admin only in app logic)
CREATE POLICY "Authenticated users can delete categories"
  ON blog_categories FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- RLS POLICIES - Blog Tags
-- ============================================================================

-- Public can view all tags
CREATE POLICY "Public can view tags"
  ON blog_tags FOR SELECT
  USING (true);

-- Authenticated users can create tags
CREATE POLICY "Authenticated users can create tags"
  ON blog_tags FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update tags (admin only in app logic)
CREATE POLICY "Authenticated users can update tags"
  ON blog_tags FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Authenticated users can delete tags (admin only in app logic)
CREATE POLICY "Authenticated users can delete tags"
  ON blog_tags FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- RLS POLICIES - Blog Posts
-- ============================================================================

-- Public can view published posts
CREATE POLICY "Public can view published posts"
  ON blog_posts FOR SELECT
  USING (status = 'published');

-- Authors can view their own posts (all statuses)
CREATE POLICY "Authors can view own posts"
  ON blog_posts FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can create posts
CREATE POLICY "Authenticated users can create posts"
  ON blog_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Authors can update their own posts
CREATE POLICY "Authors can update own posts"
  ON blog_posts FOR UPDATE
  USING (auth.uid() = user_id);

-- Authors can delete their own posts
CREATE POLICY "Authors can delete own posts"
  ON blog_posts FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES - Blog Post Categories Junction
-- ============================================================================

-- Public can view post-category relationships for published posts
CREATE POLICY "Public can view post categories"
  ON blog_post_categories FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blog_posts
      WHERE blog_posts.id = blog_post_categories.post_id
      AND (blog_posts.status = 'published' OR blog_posts.user_id = auth.uid())
    )
  );

-- Authors can manage categories for their own posts
CREATE POLICY "Authors can manage own post categories"
  ON blog_post_categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM blog_posts
      WHERE blog_posts.id = blog_post_categories.post_id
      AND blog_posts.user_id = auth.uid()
    )
  );

-- ============================================================================
-- RLS POLICIES - Blog Post Tags Junction
-- ============================================================================

-- Public can view post-tag relationships for published posts
CREATE POLICY "Public can view post tags"
  ON blog_post_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blog_posts
      WHERE blog_posts.id = blog_post_tags.post_id
      AND (blog_posts.status = 'published' OR blog_posts.user_id = auth.uid())
    )
  );

-- Authors can manage tags for their own posts
CREATE POLICY "Authors can manage own post tags"
  ON blog_post_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM blog_posts
      WHERE blog_posts.id = blog_post_tags.post_id
      AND blog_posts.user_id = auth.uid()
    )
  );

-- ============================================================================
-- RLS POLICIES - Blog SEO Metadata
-- ============================================================================

-- Public can view SEO metadata for published posts
CREATE POLICY "Public can view SEO metadata"
  ON blog_seo_metadata FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blog_posts
      WHERE blog_posts.id = blog_seo_metadata.post_id
      AND (blog_posts.status = 'published' OR blog_posts.user_id = auth.uid())
    )
  );

-- Authors can manage SEO metadata for their own posts
CREATE POLICY "Authors can manage own SEO metadata"
  ON blog_seo_metadata FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM blog_posts
      WHERE blog_posts.id = blog_seo_metadata.post_id
      AND blog_posts.user_id = auth.uid()
    )
  );

-- ============================================================================
-- RLS POLICIES - Blog Images
-- ============================================================================

-- Public can view all images (they're in public storage anyway)
CREATE POLICY "Public can view images"
  ON blog_images FOR SELECT
  USING (true);

-- Authenticated users can upload images
CREATE POLICY "Authenticated users can upload images"
  ON blog_images FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by);

-- Users can update their own uploaded images
CREATE POLICY "Users can update own images"
  ON blog_images FOR UPDATE
  USING (auth.uid() = uploaded_by);

-- Users can delete their own uploaded images
CREATE POLICY "Users can delete own images"
  ON blog_images FOR DELETE
  USING (auth.uid() = uploaded_by);

-- ============================================================================
-- INITIAL DATA (Optional)
-- ============================================================================

-- Insert default categories
INSERT INTO blog_categories (name, slug, description, color, icon, display_order) VALUES
  ('Web Development', 'web-development', 'Articles about web development, frameworks, and best practices', '#3B82F6', 'code', 1),
  ('Design', 'design', 'UI/UX design, visual design, and design systems', '#8B5CF6', 'palette', 2),
  ('Career', 'career', 'Career advice, job hunting, and professional growth', '#10B981', 'briefcase', 3),
  ('Tutorial', 'tutorial', 'Step-by-step guides and tutorials', '#F59E0B', 'book-open', 4),
  ('Opinion', 'opinion', 'Personal thoughts and opinions on tech topics', '#EF4444', 'message-circle', 5);

-- Insert common tags
INSERT INTO blog_tags (name, slug) VALUES
  ('JavaScript', 'javascript'),
  ('TypeScript', 'typescript'),
  ('React', 'react'),
  ('Node.js', 'nodejs'),
  ('CSS', 'css'),
  ('HTML', 'html'),
  ('Performance', 'performance'),
  ('Accessibility', 'accessibility'),
  ('SEO', 'seo'),
  ('Best Practices', 'best-practices');

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE blog_categories IS 'Blog post categories for broad topic organization';
COMMENT ON TABLE blog_tags IS 'Blog post tags for specific keyword tagging';
COMMENT ON TABLE blog_posts IS 'Main blog posts table with content and metadata';
COMMENT ON TABLE blog_post_categories IS 'Many-to-many relationship between posts and categories';
COMMENT ON TABLE blog_post_tags IS 'Many-to-many relationship between posts and tags';
COMMENT ON TABLE blog_seo_metadata IS 'SEO optimization metadata for blog posts';
COMMENT ON TABLE blog_images IS 'Image management with automatic optimization tracking';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Migration completed successfully
-- Next steps:
-- 1. Create Supabase Storage bucket 'blog-images' via dashboard or API
-- 2. Set bucket to public access
-- 3. Configure storage policies for blog-images bucket
-- 4. Test all tables and policies
-- 5. Begin implementing blog services and UI
