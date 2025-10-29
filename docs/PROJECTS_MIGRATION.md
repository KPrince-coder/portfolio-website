# Projects Migration Documentation

**File:** `supabase/migrations/20241028000005_projects.sql`  
**Date:** October 29, 2025  
**Status:** ✅ Ready to apply

## Overview

Comprehensive database schema for managing portfolio projects with categories, technologies, and rich metadata.

## Database Schema

### Tables Created

#### 1. project_categories

Organizes projects into categories (Web Apps, Mobile, AI/ML, etc.)

**Columns:**

- `id` - UUID primary key
- `name` - Unique category identifier
- `label` - Display name
- `icon` - Lucide icon name
- `color` - Tailwind color class
- `description` - Category description
- `display_order` - Sort order
- `is_active` - Enable/disable category
- `created_at`, `updated_at` - Timestamps

#### 2. projects

Main projects table with full project details

**Columns:**

- `id` - UUID primary key
- `category_id` - Foreign key to project_categories
- `title` - Project name
- `slug` - URL-friendly identifier
- `description` - Short description
- `long_description` - Detailed description
- `image_url` - Project screenshot/image
- `demo_url` - Live demo link
- `github_url` - Repository link
- `technologies` - Array of tech names (simple approach)
- `tags` - Array of tags for filtering
- `status` - completed | in-progress | planned | archived
- `stars`, `forks`, `views` - Metrics
- `is_featured` - Feature prominently
- `display_order` - Sort order
- `start_date`, `end_date` - Project timeline
- `created_at`, `updated_at` - Timestamps

#### 3. technologies

Reusable technology/tool definitions

**Columns:**

- `id` - UUID primary key
- `name` - Unique tech identifier
- `label` - Display name
- `icon` - Lucide icon name
- `color` - Tailwind color class
- `category` - frontend | backend | database | devops | ai-ml
- `display_order` - Sort order
- `is_active` - Enable/disable
- `created_at`, `updated_at` - Timestamps

#### 4. project_technologies

Many-to-many relationship between projects and technologies

**Columns:**

- `project_id` - Foreign key to projects
- `technology_id` - Foreign key to technologies
- `created_at` - Timestamp

### Views Created

#### projects_with_categories

Projects joined with category information for easy querying

#### projects_with_tech_count

Projects with count of associated technologies

### Functions Created

#### get_featured_projects(limit_count)

Returns featured projects ordered by display_order

#### get_projects_by_category(category_name)

Returns projects filtered by category

#### search_projects(search_term)

Search projects by title, description, or tags

## Storage

### Bucket: project-images

- **Purpose:** Store project screenshots and images
- **Size Limit:** 10MB per file
- **Allowed Types:** JPEG, PNG, WebP, GIF
- **Public:** Yes (for portfolio display)

## Seed Data

### Default Categories

1. **Web Applications** - Full-stack web apps
2. **Mobile Apps** - iOS and Android apps
3. **AI & Machine Learning** - AI/ML projects
4. **Data Engineering** - Data pipelines and analytics
5. **DevOps & Cloud** - Infrastructure and deployment
6. **Open Source** - OSS contributions and libraries

### Common Technologies

- **Frontend:** React, Vue, Angular, Next.js, TypeScript
- **Backend:** Node.js, Python, Django, FastAPI, Express
- **Database:** PostgreSQL, MongoDB, Redis, Supabase
- **AI/ML:** TensorFlow, PyTorch, Scikit-learn
- **DevOps:** Docker, Kubernetes, AWS, Vercel

## Security (RLS Policies)

### Public Access

- ✅ Read all project categories
- ✅ Read all projects
- ✅ Read all technologies
- ✅ Read project-technology relationships
- ✅ View project images

### Authenticated Access

- ✅ Full CRUD on all tables
- ✅ Upload/update/delete project images

## Indexes

Performance indexes on:

- Category names and display order
- Project slugs, status, featured flag
- Technology names and categories
- Junction table foreign keys
- Created dates for sorting

## Usage Examples

### Query Featured Projects

```sql
SELECT * FROM get_featured_projects(6);
```

### Query Projects by Category

```sql
SELECT * FROM get_projects_by_category('web');
```

### Search Projects

```sql
SELECT * FROM search_projects('react');
```

### Get Project with Technologies

```sql
SELECT 
  p.*,
  array_agg(t.label) as tech_stack
FROM projects p
LEFT JOIN project_technologies pt ON p.id = pt.project_id
LEFT JOIN technologies t ON pt.technology_id = t.id
WHERE p.slug = 'my-project'
GROUP BY p.id;
```

## Two Approaches for Technologies

The migration supports **two approaches** for managing technologies:

### Approach 1: Simple Array (Default)

Store technology names directly in the `projects.technologies` array:

```sql
UPDATE projects 
SET technologies = ARRAY['React', 'Node.js', 'PostgreSQL']
WHERE slug = 'my-project';
```

**Pros:** Simple, fast queries, easy to implement  
**Cons:** No metadata (icons, colors), harder to manage

### Approach 2: Relational (Advanced)

Use the `technologies` table and `project_technologies` junction:

```sql
-- Insert technologies
INSERT INTO project_technologies (project_id, technology_id)
SELECT 
  (SELECT id FROM projects WHERE slug = 'my-project'),
  id
FROM technologies
WHERE name IN ('react', 'nodejs', 'postgresql');
```

**Pros:** Rich metadata, reusable, better filtering  
**Cons:** More complex queries, additional tables

**Recommendation:** Start with Approach 1, migrate to Approach 2 if needed.

## Migration Steps

### 1. Apply Migration

```bash
supabase db push
```

### 2. Verify Tables

Check Supabase Dashboard > Table Editor:

- ✅ project_categories
- ✅ projects
- ✅ technologies
- ✅ project_technologies

### 3. Verify Storage

Check Supabase Dashboard > Storage:

- ✅ project-images bucket exists
- ✅ Public access enabled

### 4. Test Seed Data

```sql
SELECT * FROM project_categories ORDER BY display_order;
SELECT * FROM technologies ORDER BY category, display_order;
```

### 5. Test Functions

```sql
SELECT * FROM get_featured_projects(3);
SELECT * FROM get_projects_by_category('web');
SELECT * FROM search_projects('test');
```

## Integration with Frontend

### Expected Data Structure

```typescript
interface Project {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  description: string;
  long_description?: string;
  image_url?: string;
  demo_url?: string;
  github_url?: string;
  technologies: string[];
  tags?: string[];
  status: 'completed' | 'in-progress' | 'planned' | 'archived';
  stars?: number;
  forks?: number;
  views?: number;
  is_featured: boolean;
  display_order: number;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  // From view
  category_name?: string;
  category_label?: string;
  category_icon?: string;
  category_color?: string;
}
```

### Sample Query

```typescript
const { data: projects } = await supabase
  .from('projects_with_categories')
  .select('*')
  .eq('is_featured', true)
  .order('display_order', { ascending: true })
  .limit(6);
```

## Best Practices

### 1. Slugs

- Use kebab-case: `my-awesome-project`
- Keep them short and descriptive
- Never change after creation (breaks URLs)

### 2. Images

- Optimize before upload (< 500KB recommended)
- Use WebP format for best compression
- Provide alt text in description

### 3. Technologies

- Use consistent naming (lowercase)
- Limit to 5-8 key technologies per project
- Order by importance

### 4. Status

- `completed` - Finished and deployed
- `in-progress` - Actively working on
- `planned` - Future project
- `archived` - No longer maintained

### 5. Featured Projects

- Limit to 6-8 featured projects
- Use display_order to control sequence
- Feature your best work

## Maintenance

### Adding New Categories

```sql
INSERT INTO project_categories (name, label, icon, color, display_order)
VALUES ('iot', 'IoT & Hardware', 'Cpu', 'text-warning', 7);
```

### Adding New Technologies

```sql
INSERT INTO technologies (name, label, icon, color, category)
VALUES ('rust', 'Rust', 'Code', 'text-[#CE422B]', 'backend');
```

### Updating Project Metrics

```sql
UPDATE projects 
SET stars = 150, forks = 25, views = 1000
WHERE slug = 'my-project';
```

## Troubleshooting

### Issue: Duplicate slug error

**Solution:** Slugs must be unique. Choose a different slug.

### Issue: Category not found

**Solution:** Ensure category exists in project_categories table.

### Issue: Image upload fails

**Solution:** Check file size (< 10MB) and format (JPEG/PNG/WebP/GIF).

### Issue: RLS blocking queries

**Solution:** Verify RLS policies are applied correctly.

## Next Steps

After applying this migration:

1. ✅ Create admin UI for project management
2. ✅ Create frontend project showcase component
3. ✅ Implement project filtering and search
4. ✅ Add project detail pages
5. ✅ Integrate with GitHub API for live metrics

## Related Files

- Migration: `supabase/migrations/20241028000005_projects.sql`
- Documentation: `docs/PROJECTS_MIGRATION.md`
- README: `supabase/migrations/README.md`

## Conclusion

This migration provides a complete, production-ready schema for managing portfolio projects with rich metadata, categorization, and technology tracking. It supports both simple and advanced use cases while maintaining performance and security.

Ready to showcase your amazing projects! 🚀
