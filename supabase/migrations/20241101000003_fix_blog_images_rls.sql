-- =====================================================
-- Fix Blog Images RLS Policies for Profile-Based User IDs
-- The blog_images.uploaded_by references profiles.id, not auth.users.id
-- We need to join through profiles table to check auth.uid()
-- =====================================================

-- =====================================================
-- Drop existing blog_images RLS policies
-- =====================================================

DROP POLICY IF EXISTS "Authenticated users can upload images" ON blog_images;
DROP POLICY IF EXISTS "Users can update own images" ON blog_images;
DROP POLICY IF EXISTS "Users can delete own images" ON blog_images;

-- =====================================================
-- Create new blog_images RLS policies with profile join
-- =====================================================

-- Authenticated users can upload images (uploaded_by must match their profile.id)
CREATE POLICY "Authenticated users can upload images"
  ON blog_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = blog_images.uploaded_by
      AND profiles.user_id = auth.uid()
    )
  );

-- Users can update their own uploaded images
CREATE POLICY "Users can update own images"
  ON blog_images FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = blog_images.uploaded_by
      AND profiles.user_id = auth.uid()
    )
  );

-- Users can delete their own uploaded images
CREATE POLICY "Users can delete own images"
  ON blog_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = blog_images.uploaded_by
      AND profiles.user_id = auth.uid()
    )
  );

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- ✅ Fixed RLS policies to properly handle profile-based user IDs
-- ✅ All policies now join through profiles table to check auth.uid()
-- ✅ Maintains security while allowing proper access control
