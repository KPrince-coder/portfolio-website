# Profiles Migration Guide

This guide will walk you through applying the profiles migration step by step.

## What This Migration Does

The profiles migration creates the foundation for your portfolio's hero section, about section, and resume functionality.

### Database Objects Created

1. **Function:** `update_updated_at_column()` - Automatically updates timestamps
2. **Table:** `profiles` - Stores all profile information
3. **Storage Buckets:**
   - `avatars` - For profile pictures (5MB limit, images only)
   - `resumes` - For PDF resumes (10MB limit, PDFs only)
4. **Indexes:** For user_id and email lookups
5. **Trigger:** Automatically updates `updated_at` on profile changes
6. **RLS Policies:**
   - Table policies for profile data access
   - Storage policies for file uploads/downloads

### Profile Fields

#### Personal Information

- `full_name` - Your full name
- `bio` - Short biography
- `avatar_url` - Profile picture URL
- `location` - Your location

#### Hero Section

- `hero_title` - Main title (e.g., "Alex Neural")
- `hero_subtitle` - Your role (e.g., "Data & AI Engineer")
- `hero_tagline` - Additional tagline

#### About Section

- `about_title` - Section title (e.g., "About Me")
- `about_description` - Main description text
- `about_highlights` - Array of key achievements/highlights

#### Resume

- `resume_url` - URL to your PDF resume (Supabase Storage or external)
- `resume_file_name` - Original filename
- `resume_updated_at` - When resume was last updated

#### Social Links

- `website_url` - Personal website
- `github_url` - GitHub profile
- `linkedin_url` - LinkedIn profile
- `twitter_url` - Twitter/X profile
- `email` - Contact email
- `phone` - Contact phone

## Prerequisites

Before applying this migration:

- [x] Supabase project created (jcsghggucepqzmonlpeg)
- [x] Configuration files updated (.env, config.toml, client.ts)
- [ ] Supabase CLI installed
- [ ] Project linked to Supabase CLI

## Step-by-Step Application

### Step 1: Verify Configuration

Check that your configuration files are correct:

```bash
# Check .env
cat .env

# Should show:
# VITE_SUPABASE_PROJECT_ID="jcsghggucepqzmonlpeg"
# VITE_SUPABASE_URL="https://jcsghggucepqzmonlpeg.supabase.co"
```

### Step 2: Link Supabase Project

```bash
supabase link --project-ref jcsghggucepqzmonlpeg
```

You'll be prompted to enter your database password. Get it from:
<https://supabase.com/dashboard/project/jcsghggucepqzmonlpeg/settings/database>

### Step 3: Review Migration File

Open and review: `supabase/migrations/20241028000001_profiles.sql`

Make sure you understand what will be created.

### Step 4: Apply Migration

```bash
supabase db push
```

Expected output:

```
Applying migration 20241028000001_profiles.sql...
Finished supabase db push.
```

### Step 5: Verify in Supabase Dashboard

Go to: <https://supabase.com/dashboard/project/jcsghggucepqzmonlpeg>

#### Check Table Editor

1. Navigate to Table Editor
2. Find `profiles` table
3. Verify all columns exist:
   - id, user_id
   - full_name, bio, avatar_url, location
   - hero_title, hero_subtitle, hero_tagline
   - about_title, about_description, about_highlights
   - resume_url, resume_file_name, resume_updated_at
   - website_url, github_url, linkedin_url, twitter_url, email, phone
   - created_at, updated_at

#### Check RLS Policies

1. Navigate to Database > Policies
2. Find `profiles` table
3. Verify policies exist:
   - "Public read access for profiles"
   - "Users can manage own profile"
   - "Authenticated users can manage all profiles"

#### Check Triggers

1. Navigate to Database > Triggers
2. Find `update_profiles_updated_at` trigger
3. Verify it's enabled

#### Check Functions

1. Navigate to Database > Functions
2. Find `update_updated_at_column` function
3. Verify it exists

#### Check Storage Buckets

1. Navigate to Storage
2. Verify `avatars` bucket exists
3. Verify `resumes` bucket exists
4. Check bucket settings:
   - Both should be public
   - avatars: 5MB limit, images only
   - resumes: 10MB limit, PDFs only

#### Check Storage Policies

1. Navigate to Storage (click on a bucket, then Policies tab)
2. For `avatars` bucket, verify policies exist:
   - "Public can view avatars"
   - "Authenticated users can upload avatars"
   - "Authenticated users can update avatars"
   - "Authenticated users can delete avatars"
3. For `resumes` bucket, verify policies exist:
   - "Public can view resumes"
   - "Authenticated users can upload resumes"
   - "Authenticated users can update resumes"
   - "Authenticated users can delete resumes"

### Step 6: Add Your Profile Data

You have two options:

#### Option A: Through Supabase Dashboard

1. Go to Table Editor > profiles
2. Click "Insert row"
3. Fill in your information:
   - user_id: (Get from Authentication > Users)
   - full_name: Your name
   - hero_title: Your hero title
   - hero_subtitle: Your role
   - about_description: Your about text
   - etc.

#### Option B: Through SQL Editor

1. Go to SQL Editor
2. Run this query (customize with your data):

```sql
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
  'YOUR_USER_ID', -- Get from Authentication > Users
  'Your Name',
  'Your Name',
  'Your Role',
  'Your Tagline',
  'About Me',
  'Your about description here...',
  ARRAY[
    'Achievement 1',
    'Achievement 2',
    'Achievement 3'
  ],
  'Your bio',
  'Your Location',
  'your@email.com',
  'https://github.com/yourusername',
  'https://linkedin.com/in/yourusername',
  'https://twitter.com/yourusername',
  'https://yourwebsite.com'
);
```

### Step 7: Test RLS Policies

#### Test Public Read Access

1. Open your application (not logged in)
2. Profile data should be visible on the homepage
3. Hero section should display correctly
4. About section should display correctly

#### Test Authenticated Write Access

1. Log in to your admin panel
2. Try to edit profile information
3. Changes should save successfully

### Step 8: Upload Avatar (Optional)

The migration automatically creates an `avatars` storage bucket.

#### Upload Avatar Image

1. Go to Storage in Supabase Dashboard
2. Find the `avatars` bucket (already created by migration)
3. Upload your profile picture (JPG, PNG, WebP, or GIF - max 5MB)
4. Copy the public URL
5. Update your profile:

```sql
UPDATE public.profiles
SET avatar_url = 'https://jcsghggucepqzmonlpeg.supabase.co/storage/v1/object/public/avatars/your-avatar.jpg'
WHERE user_id = 'YOUR_USER_ID';
```

**Programmatic Upload (in your app):**

```typescript
// Upload avatar
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.jpg`, file);

// Get public URL
const { data: urlData } = supabase.storage
  .from('avatars')
  .getPublicUrl(`${userId}/avatar.jpg`);

// Update profile
await supabase
  .from('profiles')
  .update({ avatar_url: urlData.publicUrl })
  .eq('user_id', userId);
```

### Step 9: Add Resume (Optional)

The migration automatically creates a `resumes` storage bucket.

You have two options for resume:

#### Option A: Upload to Supabase Storage

1. Go to Storage in Supabase Dashboard
2. Find the `resumes` bucket (already created by migration)
3. Upload your PDF resume (max 10MB)
4. Copy the public URL
5. Update your profile:

```sql
UPDATE public.profiles
SET 
  resume_url = 'https://jcsghggucepqzmonlpeg.supabase.co/storage/v1/object/public/resumes/your-resume.pdf',
  resume_file_name = 'your-resume.pdf',
  resume_updated_at = now()
WHERE user_id = 'YOUR_USER_ID';
```

**Programmatic Upload (in your app):**

```typescript
// Upload resume
const { data, error } = await supabase.storage
  .from('resumes')
  .upload(`${userId}/resume.pdf`, file);

// Get public URL
const { data: urlData } = supabase.storage
  .from('resumes')
  .getPublicUrl(`${userId}/resume.pdf`);

// Update profile
await supabase
  .from('profiles')
  .update({ 
    resume_url: urlData.publicUrl,
    resume_file_name: file.name,
    resume_updated_at: new Date().toISOString()
  })
  .eq('user_id', userId);
```

#### Option B: Use External Link

If your resume is hosted elsewhere (Google Drive, Dropbox, etc.):

```sql
UPDATE public.profiles
SET 
  resume_url = 'https://your-external-link.com/resume.pdf',
  resume_file_name = 'resume.pdf',
  resume_updated_at = now()
WHERE user_id = 'YOUR_USER_ID';
```

### Step 10: Verify Storage Buckets

Check that storage buckets were created:

1. Go to Storage in Supabase Dashboard
2. Verify `avatars` bucket exists:
   - Public: Yes
   - File size limit: 5MB
   - Allowed types: Images (JPEG, PNG, WebP, GIF)
3. Verify `resumes` bucket exists:
   - Public: Yes
   - File size limit: 10MB
   - Allowed types: PDF only

### Step 11: Generate TypeScript Types

Update your TypeScript types to include the new profiles table:

```bash
supabase gen types typescript --project-id jcsghggucepqzmonlpeg > src/integrations/supabase/types.ts
```

### Step 12: Test in Your Application

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Check that:
   - Hero section displays your data
   - About section displays your data
   - Resume link works (if added)
   - Social links work
   - No console errors

## Troubleshooting

### Issue: Migration fails with "relation already exists"

**Solution:** The table might already exist. Check Table Editor and drop it if needed:

```sql
DROP TABLE IF EXISTS public.profiles CASCADE;
```

Then reapply the migration.

### Issue: RLS policies blocking queries

**Solution:**

1. Check you're authenticated when trying to write
2. Verify the user_id matches the authenticated user
3. Check policy conditions in Database > Policies

### Issue: Can't see profile data in application

**Solution:**

1. Verify data exists in Table Editor
2. Check browser console for errors
3. Verify RLS policies allow public read
4. Check your Supabase client connection

### Issue: Trigger not updating updated_at

**Solution:**

1. Verify trigger exists in Database > Triggers
2. Check trigger is enabled
3. Try manually updating a row to test

## Next Steps

After successfully applying and testing the profiles migration:

1. ✅ Profiles migration complete
2. ⏭️ Ready for skills migration (wait for instruction)
3. ⏭️ Projects migration (after skills)
4. ⏭️ Blog migration (after projects)
5. ⏭️ Contact migration (after blog)
6. ⏭️ Settings migration (after contact)

## Rollback

If you need to rollback this migration:

```sql
-- Remove profiles table and related objects
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column CASCADE;
```

## Support

If you encounter issues:

1. Check Supabase Dashboard logs
2. Review the migration file for syntax errors
3. Verify your project is properly linked
4. Check RLS policies aren't blocking operations
5. Ensure you have a user in auth.users table

## Checklist

- [ ] Configuration verified
- [ ] Project linked
- [ ] Migration file reviewed
- [ ] Migration applied successfully
- [ ] Table exists in dashboard
- [ ] RLS policies created
- [ ] Triggers created
- [ ] Functions created
- [ ] Profile data added
- [ ] Resume added (optional)
- [ ] TypeScript types generated
- [ ] Application tested
- [ ] No errors in console
- [ ] Hero section displays correctly
- [ ] About section displays correctly
- [ ] Social links work
- [ ] Resume link works (if added)

Once all items are checked, you're ready for the next migration! ✅
