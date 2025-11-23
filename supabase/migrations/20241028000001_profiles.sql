-- =====================================================
-- Profiles Migration
-- Manages user profiles, hero section, about section, and resume
-- =====================================================

-- =====================================================
-- SECTION 1: Core Utility Function
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- =====================================================
-- SECTION 2: Profiles Table
-- =====================================================

-- Main profiles table for user information, hero, and about sections
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Personal Information
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  
  -- Hero Section
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_tagline TEXT,
  
  -- About Section
  about_title TEXT,
  about_description TEXT,
  about_highlights TEXT[], -- Array of key highlights/achievements
  
  -- Resume
  resume_url TEXT, -- URL to uploaded PDF resume
  resume_file_name TEXT,
  resume_updated_at TIMESTAMP WITH TIME ZONE,
  
  -- Social Links
  website_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  email TEXT,
  phone TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id)
);

-- =====================================================
-- SECTION 3: Indexes
-- =====================================================

CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- =====================================================
-- SECTION 4: Triggers
-- =====================================================

CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- SECTION 5: Row Level Security (RLS)
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Public can read all profiles (for portfolio display)
CREATE POLICY "Public read access for profiles" 
  ON public.profiles FOR SELECT USING (true);

-- Users can manage their own profile
CREATE POLICY "Users can manage own profile" 
  ON public.profiles FOR ALL USING (auth.uid() = user_id);

-- Authenticated users (admin) can manage all profiles
CREATE POLICY "Authenticated users can manage all profiles" 
  ON public.profiles FOR ALL USING (auth.uid() IS NOT NULL);

-- =====================================================
-- SECTION 6: Comments
-- =====================================================

COMMENT ON TABLE public.profiles IS 'User profiles including hero section, about section, and resume information';
COMMENT ON COLUMN public.profiles.hero_title IS 'Main title displayed in hero section (e.g., "Alex Neural")';
COMMENT ON COLUMN public.profiles.hero_subtitle IS 'Subtitle/role displayed in hero section (e.g., "Data & AI Engineer")';
COMMENT ON COLUMN public.profiles.hero_tagline IS 'Additional tagline for hero section';
COMMENT ON COLUMN public.profiles.about_title IS 'Title for about section';
COMMENT ON COLUMN public.profiles.about_description IS 'Main description text for about section';
COMMENT ON COLUMN public.profiles.about_highlights IS 'Array of key highlights or achievements to display';
COMMENT ON COLUMN public.profiles.resume_url IS 'URL to uploaded PDF resume file (can be Supabase Storage URL or external link)';
COMMENT ON COLUMN public.profiles.resume_file_name IS 'Original filename of the uploaded resume';
COMMENT ON COLUMN public.profiles.resume_updated_at IS 'Timestamp when resume was last updated';

-- =====================================================
-- SECTION 7: Storage Buckets for File Uploads
-- =====================================================

-- Create storage bucket for avatar images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true, -- Public bucket so avatars can be displayed
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for resume PDFs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  true, -- Public bucket so resumes can be downloaded
  10485760, -- 10MB limit
  ARRAY['application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SECTION 8: Storage Policies
-- =====================================================

-- Avatars bucket policies
-- Allow public to read/download avatars
CREATE POLICY "Public can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Allow authenticated users to upload avatars
CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to update their own avatars
CREATE POLICY "Authenticated users can update avatars"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete avatars
CREATE POLICY "Authenticated users can delete avatars"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
  );

-- Resumes bucket policies
-- Allow public to read/download resumes
CREATE POLICY "Public can view resumes"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'resumes');

-- Allow authenticated users to upload resumes
CREATE POLICY "Authenticated users can upload resumes"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'resumes' 
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to update resumes
CREATE POLICY "Authenticated users can update resumes"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'resumes' 
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete resumes
CREATE POLICY "Authenticated users can delete resumes"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'resumes' 
    AND auth.role() = 'authenticated'
  );

-- =====================================================
-- SECTION 9: Helper Comments for Storage Usage
-- =====================================================

-- After uploading files, the URLs will be in this format:
-- Avatar URL: https://jcsghggucepqzmonlpeg.supabase.co/storage/v1/object/public/avatars/filename.jpg
-- Resume URL: https://jcsghggucepqzmonlpeg.supabase.co/storage/v1/object/public/resumes/filename.pdf

-- To upload files programmatically:
-- const { data, error } = await supabase.storage
--   .from('avatars')
--   .upload('user-id/avatar.jpg', file);

-- To get public URL:
-- const { data } = supabase.storage
--   .from('avatars')
--   .getPublicUrl('user-id/avatar.jpg');

-- =====================================================
-- SECTION 10: Initial Seed Data (Optional)
-- =====================================================

-- Insert a default profile (you can customize this later)
-- Note: This will only work if you have a user in auth.users
-- You can remove this section if you prefer to add data manually

-- Example seed data (commented out - uncomment and customize as needed):
/*
INSERT INTO public.profiles (
  user_id,
  full_name,
  hero_title,
  hero_subtitle,
  hero_tagline,
  about_title,
  about_description,
  about_highlights,
  bio,
  location,
  email,
  github_url,
  linkedin_url,
  twitter_url,
  website_url
) VALUES (
  'YOUR_USER_ID_HERE', -- Replace with actual user_id from auth.users
  'Alex Neural',
  'Alex Neural',
  'Data & AI Engineer',
  'Crafting Intelligent Systems',
  'About Me',
  'Passionate data and AI engineer with expertise in building scalable machine learning systems and intelligent applications. Specialized in neural networks, data pipelines, and full-stack development.',
  ARRAY[
    'Built ML systems processing 10TB+ daily data',
    'Developed AI-powered mobile applications',
    'Expert in TensorFlow, PyTorch, and Apache Spark',
    'Full-stack developer with React and Node.js'
  ],
  'Data & AI Engineer specializing in machine learning, neural networks, and scalable intelligent systems.',
  'San Francisco, CA',
  'alex@neuralportfolio.dev',
  'https://github.com/alexneural',
  'https://linkedin.com/in/alexneural',
  'https://twitter.com/alexneural',
  'https://neuralportfolio.dev'
) ON CONFLICT (user_id) DO NOTHING;
*/
