# Database Migrations

This directory contains the database migration files for the portfolio CMS.

## Migration Strategy

We're using a **modular migration approach** where each major feature has its own migration file. This makes it easier to:

- Understand what each migration does
- Apply migrations incrementally
- Rollback specific features if needed
- Maintain and update individual features

## Migration History

### 20241028000001_profiles.sql

**Date:** October 28, 2024  
**Status:** ✅ Ready to apply  
**Description:** Profiles management including hero section, about section, and resume

**Creates:**

- `profiles` table with comprehensive user information
- Hero section fields (title, subtitle, tagline)
- About section fields (title, description, highlights array)
- Resume management (URL, filename, update timestamp)
- Social links (GitHub, LinkedIn, Twitter, website, email, phone)
- RLS policies for public read and authenticated write
- Automatic timestamp updates via trigger
- Utility function for timestamp updates

**Features:**

- Support for PDF resume upload or external link
- Array field for about section highlights
- Complete social media integration
- Public portfolio display with private admin editing

### Upcoming Migrations (Not Yet Created)

- **skills.sql** - Technical skills and proficiencies
- **projects.sql** - Portfolio projects management
- **blog.sql** - Blog posts and content
- **contact.sql** - Contact form and messaging system
- **settings.sql** - Site configuration and branding

## Applying Migrations

### Using Supabase CLI (Recommended)

1. **Link to your project:**

   ```bash
   supabase link --project-ref jcsghggucepqzmonlpeg
   ```

2. **Apply all migrations:**

   ```bash
   supabase db push
   ```

3. **Check migration status:**

   ```bash
   supabase migration list
   ```

### Manual Application

If you prefer to apply migrations manually through the Supabase Dashboard:

1. Go to <https://supabase.com/dashboard/project/jcsghggucepqzmonlpeg>
2. Navigate to SQL Editor
3. Copy the contents of the migration file
4. Execute the SQL

## Step-by-Step Migration Process

We're applying migrations one at a time to ensure everything works correctly:

### Step 1: Profiles Migration (Current)

1. Review `20241028000001_profiles.sql`
2. Apply the migration
3. Verify table creation in Supabase Dashboard
4. Test by adding profile data
5. Confirm RLS policies work correctly

### Step 2: Skills Migration (Next)

- Will be created after profiles is confirmed working

### Step 3: Projects Migration

- Will be created after skills is confirmed working

### Step 4: Blog Migration

- Will be created after projects is confirmed working

### Step 5: Contact Migration

- Will be created after blog is confirmed working

### Step 6: Settings Migration

- Will be created after contact is confirmed working

## Creating New Migrations

When you need to make schema changes:

```bash
supabase migration new <migration_name>
```

This will create a new timestamped migration file in this directory.

## Best Practices

1. **Never modify existing migrations** - Always create new ones
2. **Test migrations locally first** - Use `supabase db reset` to test
3. **Keep migrations atomic** - One logical change per migration
4. **Document changes** - Add comments explaining complex changes
5. **Backup before applying** - Always backup production data first
6. **Apply incrementally** - One migration at a time, verify each one

## Rollback Strategy

If you need to rollback a migration:

1. Create a new migration that reverses the changes
2. Never delete or modify existing migration files
3. Document the rollback reason in the new migration

Example rollback migration:

```sql
-- Rollback profiles migration
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column CASCADE;
```

## Old Migrations

The `migrations_old` directory contains migrations from the previous Supabase project (kmsalrouzjnwejevtmdf). These are kept for reference but are not applied to the new database.

## Project Configuration

- **Project ID:** jcsghggucepqzmonlpeg
- **Project URL:** <https://jcsghggucepqzmonlpeg.supabase.co>
- **Region:** Configured in Supabase Dashboard

## Verifying Migrations

After applying each migration, verify:

1. **Table Creation:**
   - Check Table Editor in Supabase Dashboard
   - Verify all columns exist with correct types

2. **RLS Policies:**
   - Check Database > Policies
   - Test public read access
   - Test authenticated write access

3. **Triggers:**
   - Check Database > Triggers
   - Verify updated_at trigger works

4. **Indexes:**
   - Check Database > Indexes
   - Verify performance indexes exist

## Support

For issues with migrations:

1. Check Supabase logs in the dashboard
2. Verify your local Supabase CLI version
3. Ensure your project is properly linked
4. Review the migration file for syntax errors
5. Check for conflicting table names
6. Verify RLS policies aren't blocking operations

## Current Status

- ✅ Configuration files updated
- ✅ Old migrations archived
- ✅ Profiles migration created
- ⏳ Profiles migration pending application
- ⏳ Skills migration pending creation
- ⏳ Projects migration pending creation
- ⏳ Blog migration pending creation
- ⏳ Contact migration pending creation
- ⏳ Settings migration pending creation
