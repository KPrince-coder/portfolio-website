# Blog System Setup Guide

**Migration File:** `supabase/migrations/20241031000001_blog_system.sql`  
**Date:** October 31, 2025  
**Tasks Completed:** 1.1, 1.2, 1.3, 1.4

---

## ✅ Tasks Completed

### Task 1.1: Database Migration ✅

- 7 tables created with proper relationships
- 1 enum type for post status
- 15+ performance indexes
- Full-text search capability

### Task 1.2: Row Level Security (RLS) ✅

- 20+ security policies implemented
- Public read access for published content
- Author-only access for drafts
- Secure image upload policies

### Task 1.3: Storage Bucket Setup ✅

- Storage policies defined for `blog-images` bucket
- Public read, authenticated write
- Owner-only update/delete

### Task 1.4: Functions & Triggers ✅

- 10 database functions created
- 10 triggers for automation
- Helper functions for queries

---

## 📦 What's Included

### Database Tables (7)

1. **blog_categories** - Topic organization
   - name, slug, description, color, icon
   - display_order for sorting

2. **blog_tags** - Keyword tagging
   - name, slug, usage_count
   - Auto-tracked usage

3. **blog_posts** - Main content
   - title, slug, content, excerpt
   - status workflow (draft/published/scheduled/archived)
   - view_count, read_time_minutes
   - featured_image, is_featured

4. **blog_post_categories** - Junction table
   - Links posts to categories

5. **blog_post_tags** - Junction table
   - Links posts to tags

6. **blog_seo_metadata** - SEO optimization
   - meta_title, meta_description
   - og_image, keywords
   - canonical_url, robots_meta

7. **blog_images** - Image management
   - Multiple sizes (thumbnail, medium, large, webp)
   - Optimization tracking
   - Compression ratios

### Functions (10)

1. **generate_slug(text)** - Create URL-friendly slugs
2. **calculate_read_time(text)** - Estimate reading time
3. **update_updated_at_column()** - Auto-update timestamps
4. **increment_tag_usage()** - Track tag usage
5. **decrement_tag_usage()** - Track tag usage
6. **auto_generate_slug()** - Auto-generate from title
7. **auto_calculate_read_time()** - Auto-calculate on save
8. **set_published_at()** - Set publish timestamp
9. **increment_post_view_count(uuid)** - Track views
10. **get_post_with_relations(text)** - Fetch post with categories/tags/SEO
11. **search_blog_posts(text)** - Full-text search

### Triggers (10)

- Auto-update `updated_at` on all tables (5 triggers)
- Auto-generate slugs for posts
- Auto-calculate read time
- Auto-set published_at
- Auto-update tag usage counts (2 triggers)

### RLS Policies (20+)

**Categories & Tags:**

- Public read
- Authenticated create/update/delete

**Posts:**

- Public read published posts
- Authors read all their posts
- Authors create/update/delete their posts

**Images:**

- Public read
- Authenticated upload
- Owner update/delete

**SEO Metadata:**

- Public read for published posts
- Authors manage their post SEO

---

## 🚀 Installation Steps

### Step 1: Apply Migration

#### Option A: Supabase CLI (Recommended)

```bash
# Reset database (applies all migrations)
supabase db reset

# Or apply specific migration
supabase migration up
```

#### Option B: Supabase Dashboard

1. Go to SQL Editor in Supabase Dashboard
2. Open `supabase/migrations/20241031000001_blog_system.sql`
3. Copy entire file content
4. Paste into SQL Editor
5. Click "Run"

### Step 2: Create Storage Bucket

#### Via Supabase Dashboard (Easiest)

1. Go to **Storage** in Supabase Dashboard
2. Click **New Bucket**
3. Name: `blog-images`
4. Public: **Yes** ✅
5. File size limit: `52428800` (50MB)
6. Allowed MIME types: `image/jpeg, image/png, image/webp, image/gif`
7. Click **Create Bucket**

#### Via SQL (Alternative)

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);
```

### Step 3: Verify Installation

#### Check Tables

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'blog_%'
ORDER BY table_name;

-- Should return 7 tables:
-- blog_categories
-- blog_images
-- blog_post_categories
-- blog_post_tags
-- blog_posts
-- blog_seo_metadata
-- blog_tags
```

#### Check Functions

```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%blog%' OR routine_name LIKE '%slug%'
ORDER BY routine_name;

-- Should return 10+ functions
```

#### Check RLS Policies

```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename LIKE 'blog_%'
ORDER BY tablename, policyname;

-- Should return 20+ policies
```

#### Check Initial Data

```sql
-- Should have 5 categories
SELECT COUNT(*) FROM blog_categories;

-- Should have 10 tags
SELECT COUNT(*) FROM blog_tags;
```

#### Check Storage Bucket

```sql
SELECT * FROM storage.buckets WHERE id = 'blog-images';

-- Should return 1 row with public = true
```

---

## 🧪 Testing

### Test 1: Create a Test Post

```sql
-- Insert test post
INSERT INTO blog_posts (
  user_id,
  title,
  content,
  status
) VALUES (
  auth.uid(), -- Your user ID
  'My First Blog Post',
  'This is the content of my first blog post. It has enough words to calculate a reading time.',
  'draft'
);

-- Verify slug was auto-generated
SELECT id, title, slug, read_time_minutes FROM blog_posts;

-- Should show:
-- slug: 'my-first-blog-post'
-- read_time_minutes: 1 (calculated automatically)
```

### Test 2: Test Slug Generation

```sql
-- Test slug generation function
SELECT generate_slug('Hello World! This is a Test.');
-- Returns: 'hello-world-this-is-a-test'

-- Test read time calculation
SELECT calculate_read_time('Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' || repeat('word ', 200));
-- Returns: 1 (minute)
```

### Test 3: Test RLS Policies

```sql
-- As anonymous user, should only see published posts
SELECT COUNT(*) FROM blog_posts;
-- Returns: 0 (no published posts yet)

-- As authenticated user, should see own posts
SELECT COUNT(*) FROM blog_posts WHERE user_id = auth.uid();
-- Returns: 1 (your draft post)
```

### Test 4: Test Tag Usage Counter

```sql
-- Create a tag
INSERT INTO blog_tags (name, slug) VALUES ('test-tag', 'test-tag');

-- Link tag to post
INSERT INTO blog_post_tags (post_id, tag_id)
SELECT p.id, t.id
FROM blog_posts p, blog_tags t
WHERE p.title = 'My First Blog Post'
AND t.slug = 'test-tag';

-- Check usage count (should be 1)
SELECT name, usage_count FROM blog_tags WHERE slug = 'test-tag';
```

### Test 5: Test View Counter

```sql
-- Get a post ID
SELECT id FROM blog_posts LIMIT 1;

-- Increment view count
SELECT increment_post_view_count('YOUR-POST-ID-HERE');

-- Check view count
SELECT title, view_count FROM blog_posts;
-- Should show view_count = 1
```

### Test 6: Test Full-Text Search

```sql
-- Publish the test post first
UPDATE blog_posts 
SET status = 'published', published_at = NOW()
WHERE title = 'My First Blog Post';

-- Search for posts
SELECT title, slug, rank 
FROM search_blog_posts('first blog');
-- Should return your post with a rank score
```

---

## 🔧 Troubleshooting

### Issue: Migration fails with "relation already exists"

**Solution:** Drop existing tables first or use `CREATE TABLE IF NOT EXISTS`

### Issue: RLS policies block all access

**Solution:** Check if RLS is enabled and policies are correct

```sql
-- Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'blog_%';

-- Disable RLS temporarily for testing (NOT for production)
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;
```

### Issue: Storage bucket not found

**Solution:** Create bucket via Dashboard or SQL

### Issue: Can't upload images

**Solution:** Check storage policies

```sql
-- List storage policies
SELECT * FROM pg_policies WHERE tablename = 'objects';
```

### Issue: Slug not auto-generating

**Solution:** Check trigger is active

```sql
-- List triggers
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'blog_posts';
```

---

## 📊 Database Schema Diagram

```
blog_categories
├── id (PK)
├── name
├── slug (unique)
└── ...

blog_tags
├── id (PK)
├── name
├── slug (unique)
└── usage_count

blog_posts
├── id (PK)
├── user_id (FK → profiles)
├── title
├── slug (unique, auto-generated)
├── content
├── status (enum)
├── published_at
└── ...

blog_post_categories (junction)
├── post_id (FK → blog_posts)
└── category_id (FK → blog_categories)

blog_post_tags (junction)
├── post_id (FK → blog_posts)
└── tag_id (FK → blog_tags)

blog_seo_metadata
├── post_id (PK, FK → blog_posts)
├── meta_title
├── meta_description
└── ...

blog_images
├── id (PK)
├── post_id (FK → blog_posts, nullable)
├── uploaded_by (FK → profiles)
├── optimized_url
├── thumbnail_url
├── medium_url
├── large_url
└── ...
```

---

## 🎯 Next Steps

After successful installation:

1. ✅ **Tasks 1.1-1.4 Complete** - Database ready
2. ⏭️ **Task 2** - Create image optimization service
3. ⏭️ **Task 3** - Create blog post service
4. ⏭️ **Task 4** - Create categories & tags service
5. ⏭️ **Task 5** - Create SEO service
6. ⏭️ **Task 6+** - Build admin UI

---

## 📚 Reference Files

- **Feature Analysis:** `docs/BLOG_FEATURE_ANALYSIS.md`
- **Implementation Tasks:** `docs/BLOG_IMPLEMENTATION_TASKS.md`
- **Migration Summary:** `docs/BLOG_MIGRATION_SUMMARY.md`
- **Migration File:** `supabase/migrations/20241031000001_blog_system.sql`

---

**Database setup complete! Ready to build services and UI.** 🚀
