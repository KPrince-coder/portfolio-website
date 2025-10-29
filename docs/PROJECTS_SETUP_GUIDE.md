# Projects Setup Guide

## Quick Start

To use the projects feature, you need to run the database migration first.

### Prerequisites

- Supabase CLI installed
- Local Supabase instance running

### Setup Steps

#### 1. Start Supabase (if not already running)

```bash
npx supabase start
```

#### 2. Run Database Migrations

**Option A: Reset all migrations (recommended for development)**

```bash
npx supabase db reset
```

**Option B: Apply specific migration**

```bash
npx supabase db push
```

#### 3. Verify Migration

Check that the following tables exist:

- `project_categories`
- `projects`
- `technologies`
- `project_technologies`

And the view:

- `projects_with_categories`

### Seed Data

The migration includes seed data:

- 6 project categories
- 23 technologies
- 3 sample projects

### Troubleshooting

#### Error: "column projects.sort_order does not exist"

This means the migration hasn't been run yet. Follow steps 1-2 above.

#### Error: "relation projects_with_categories does not exist"

The view wasn't created. Run:

```bash
npx supabase db reset
```

#### Error: "permission denied"

Make sure you're authenticated:

```bash
npx supabase login
```

### Testing

After migration, you should be able to:

1. **View Projects** - Navigate to the projects section on the frontend
2. **Admin Panel** - Go to Admin > Projects to manage:
   - Projects Header
   - Project Categories
   - Projects List
   - Technologies

### Migration File

Location: `supabase/migrations/20241028000005_projects.sql`

This migration creates:

- Database tables with proper indexes
- Row Level Security policies
- Storage bucket for project images
- Helper views and functions
- Seed data

### Next Steps

1. Run the migration
2. Access the admin panel
3. Add your own projects
4. Customize categories and technologies
5. Upload project images

### Related Documentation

- [Projects Migration](./PROJECTS_MIGRATION.md)
- [Projects Admin Implementation](./PROJECTS_ADMIN_IMPLEMENTATION_SUMMARY.md)
- [Supabase Migrations](../supabase/migrations/README.md)
