# Database Migrations

This directory contains the database migration files for the portfolio CMS.

## Migration History

### 20241028000000_initial_schema.sql

**Date:** October 28, 2024  
**Description:** Initial database schema setup for the new Supabase project

This migration creates the complete database structure including:

#### Core Tables

- **profiles** - User profile information
- **skills** - Technical skills and proficiencies
- **projects** - Portfolio projects with full metadata
- **projects_categories** - Project categorization
- **project_analytics** - Project view tracking
- **blog_posts** - Blog content management
- **contact_messages** - Contact form submissions
- **message_notifications** - Email notification tracking
- **email_templates** - Customizable email templates
- **message_analytics** - Message response time tracking
- **site_settings** - General site configuration
- **brand_settings** - Branding and email settings

#### Features

- Row Level Security (RLS) policies for all tables
- Automatic timestamp updates via triggers
- Comprehensive indexing for performance
- Foreign key relationships with cascade deletes
- Initial seed data for skills, categories, and settings

## Applying Migrations

### Using Supabase CLI

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

## Rollback Strategy

If you need to rollback a migration:

1. Create a new migration that reverses the changes
2. Never delete or modify existing migration files
3. Document the rollback reason in the new migration

## Old Migrations

The `migrations_old` directory contains migrations from the previous Supabase project (kmsalrouzjnwejevtmdf). These are kept for reference but are not applied to the new database.

## Project Configuration

- **Project ID:** jcsghggucepqzmonlpeg
- **Project URL:** <https://jcsghggucepqzmonlpeg.supabase.co>
- **Region:** Configured in Supabase Dashboard

## Support

For issues with migrations:

1. Check Supabase logs in the dashboard
2. Verify your local Supabase CLI version
3. Ensure your project is properly linked
4. Review the migration file for syntax errors
