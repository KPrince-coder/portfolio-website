-- =====================================================
-- Single Portfolio Model Migration
-- Converts from multi-user to single portfolio system
-- =====================================================

-- =====================================================
-- SECTION 1: Update RLS Policies
-- =====================================================

-- Drop old policies
DROP POLICY IF EXISTS "Users can manage own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can manage all profiles" ON public.profiles;

-- Create new simplified policies
-- Public can read the profile (for portfolio display)
-- Policy already exists: "Public read access for profiles"

-- Any authenticated user can update the single profile
CREATE POLICY "Authenticated users can update profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

-- Any authenticated user can insert if no profile exists
CREATE POLICY "Authenticated users can insert profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.profiles));

-- =====================================================
-- SECTION 2: Add Helper Function
-- =====================================================

-- Function to get or create the single profile
CREATE OR REPLACE FUNCTION public.get_or_create_profile()
RETURNS UUID AS $$
DECLARE
  profile_id UUID;
BEGIN
  -- Try to get existing profile
  SELECT id INTO profile_id FROM public.profiles LIMIT 1;
  
  -- If no profile exists, create one
  IF profile_id IS NULL THEN
    INSERT INTO public.profiles (user_id)
    VALUES (auth.uid())
    RETURNING id INTO profile_id;
  END IF;
  
  RETURN profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- SECTION 3: Comments
-- =====================================================

COMMENT ON POLICY "Authenticated users can update profile" ON public.profiles IS 
  'Any authenticated admin can update the single portfolio profile';

COMMENT ON POLICY "Authenticated users can insert profile" ON public.profiles IS 
  'Allows creating the profile if it does not exist, but prevents multiple profiles';

COMMENT ON FUNCTION public.get_or_create_profile() IS 
  'Returns the ID of the single profile, creating it if it does not exist';

-- =====================================================
-- SECTION 4: ROLLBACK INSTRUCTIONS (COMMENTED OUT)
-- =====================================================

/*
-- =====================================================
-- ROLLBACK: Revert to Multi-User Portfolio Model
-- =====================================================
-- 
-- If you need to revert to the multi-user model where each admin
-- has their own separate profile, uncomment and run this section.
--
-- WARNING: This will change the behavior back to user-specific profiles.
-- Make sure to also update the application code to add back .eq("user_id", user.id)
-- filters in all admin queries.
--
-- =====================================================

-- Step 1: Drop single-portfolio policies
DROP POLICY IF EXISTS "Authenticated users can update profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can insert profile" ON public.profiles;

-- Step 2: Restore multi-user policies
CREATE POLICY "Users can manage own profile" 
  ON public.profiles FOR ALL 
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can manage all profiles" 
  ON public.profiles FOR ALL 
  USING (auth.uid() IS NOT NULL);

-- Step 3: Drop helper function (optional)
DROP FUNCTION IF EXISTS public.get_or_create_profile();

-- Step 4: Code changes required
-- After running this rollback, you MUST update the application code:
--
-- 1. ProfileManagement.tsx:
--    Change: .limit(1).maybeSingle()
--    To:     .eq("user_id", user.id).maybeSingle()
--
-- 2. SkillsHeaderSection.tsx:
--    Change: .limit(1).maybeSingle()
--    To:     .eq("user_id", user.id).maybeSingle()
--
-- 3. ProjectsHeaderSection.tsx:
--    Change: .limit(1).maybeSingle()
--    To:     .eq("user_id", user.id).maybeSingle()
--
-- 4. ResumeHeaderSection.tsx:
--    Change: .limit(1).maybeSingle()
--    To:     .eq("user_id", user.id).maybeSingle()
--
-- 5. MessagesManagement.tsx:
--    Change: .limit(1).maybeSingle()
--    To:     .eq("user_id", user.id).maybeSingle()
--
-- 6. Update queries:
--    Change: .limit(1).single()
--    To:     .eq("user_id", user.id)
--
-- =====================================================
-- END ROLLBACK
-- =====================================================
*/
