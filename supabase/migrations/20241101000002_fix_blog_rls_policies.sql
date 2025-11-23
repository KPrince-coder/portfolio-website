-- =====================================================
-- Fix Blog RLS Policies for Profile-Based User IDs
-- The blog_posts.user_id references profiles.id, not auth.users.id
-- We need to join through profiles table to check auth.uid()
-- =====================================================

-- =====================================================
-- Drop existing blog_posts RLS policies
-- =====================================================

DROP POLICY IF EXISTS "Authors can view own posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can update own posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can delete own posts" ON blog_posts;

-- =====================================================
-- Create new blog_posts RLS policies with profile join
-- =====================================================

-- Authors can view their own posts (all statuses)
CREATE POLICY "Authors can view own posts"
  ON blog_posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = blog_posts.user_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Authenticated users can create posts (user_id must match their profile.id)
CREATE POLICY "Authenticated users can create posts"
  ON blog_posts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = blog_posts.user_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Authors can update their own posts
CREATE POLICY "Authors can update own posts"
  ON blog_posts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = blog_posts.user_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Authors can delete their own posts
CREATE POLICY "Authors can delete own posts"
  ON blog_posts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = blog_posts.user_id
      AND profiles.user_id = auth.uid()
    )
  );

-- =====================================================
-- Fix blog_post_categories RLS policies
-- =====================================================

DROP POLICY IF EXISTS "Authors can manage own post categories" ON blog_post_categories;

CREATE POLICY "Authors can manage own post categories"
  ON blog_post_categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM blog_posts
      JOIN profiles ON profiles.id = blog_posts.user_id
      WHERE blog_posts.id = blog_post_categories.post_id
      AND profiles.user_id = auth.uid()
    )
  );

-- =====================================================
-- Fix blog_post_tags RLS policies
-- =====================================================

DROP POLICY IF EXISTS "Authors can manage own post tags" ON blog_post_tags;

CREATE POLICY "Authors can manage own post tags"
  ON blog_post_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM blog_posts
      JOIN profiles ON profiles.id = blog_posts.user_id
      WHERE blog_posts.id = blog_post_tags.post_id
      AND profiles.user_id = auth.uid()
    )
  );

-- =====================================================
-- Fix blog_seo_metadata RLS policies
-- =====================================================

DROP POLICY IF EXISTS "Authors can manage own SEO metadata" ON blog_seo_metadata;

CREATE POLICY "Authors can manage own SEO metadata"
  ON blog_seo_metadata FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM blog_posts
      JOIN profiles ON profiles.id = blog_posts.user_id
      WHERE blog_posts.id = blog_seo_metadata.post_id
      AND profiles.user_id = auth.uid()
    )
  );

-- =====================================================
-- Fix public view policies to include profile join
-- =====================================================

DROP POLICY IF EXISTS "Public can view post categories" ON blog_post_categories;
DROP POLICY IF EXISTS "Public can view post tags" ON blog_post_tags;
DROP POLICY IF EXISTS "Public can view SEO metadata" ON blog_seo_metadata;

CREATE POLICY "Public can view post categories"
  ON blog_post_categories FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blog_posts
      LEFT JOIN profiles ON profiles.id = blog_posts.user_id
      WHERE blog_posts.id = blog_post_categories.post_id
      AND (blog_posts.status = 'published' OR profiles.user_id = auth.uid())
    )
  );

CREATE POLICY "Public can view post tags"
  ON blog_post_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blog_posts
      LEFT JOIN profiles ON profiles.id = blog_posts.user_id
      WHERE blog_posts.id = blog_post_tags.post_id
      AND (blog_posts.status = 'published' OR profiles.user_id = auth.uid())
    )
  );

CREATE POLICY "Public can view SEO metadata"
  ON blog_seo_metadata FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blog_posts
      LEFT JOIN profiles ON profiles.id = blog_posts.user_id
      WHERE blog_posts.id = blog_seo_metadata.post_id
      AND (blog_posts.status = 'published' OR profiles.user_id = auth.uid())
    )
  );

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- ✅ Fixed RLS policies to properly handle profile-based user IDs
-- ✅ All policies now join through profiles table to check auth.uid()
-- ✅ Maintains security while allowing proper access control
