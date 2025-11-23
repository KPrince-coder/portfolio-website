# Projects Admin Implementation Plan

**Date:** October 29, 2025  
**Status:** 📋 Planning

## Overview

Refactor the Projects admin section to follow the same pattern as Skills admin with sub-tabs, proper folder structure, and full integration with the database.

## Current State

- ✅ Database migration created (`20241028000005_projects.sql`)
- ✅ Projects title/description added to profiles table
- ⚠️ ProjectsManagement component exists but needs refactoring
- ❌ No sub-tabs structure
- ❌ No sections folder
- ❌ No hooks folder
- ❌ No types.ts file
- ❌ No integration with new database schema

## Target Structure

Following the `admin/skills` pattern:

```
src/components/admin/projects/
├── hooks/
│   ├── useProjects.ts
│   ├── useProjectCategories.ts
│   ├── useTechnologies.ts
│   └── index.ts
├── sections/
│   ├── ProjectsHeaderSection.tsx
│   ├── ProjectsCategoriesSection.tsx
│   ├── ProjectsListSection.tsx
│   ├── TechnologiesSection.tsx
│   └── index.ts
├── types.ts
├── ProjectsManagement.tsx
├── ProjectsManagementRouter.tsx
├── ProjectForm.tsx
├── ProjectsList.tsx
├── ProjectCategoryForm.tsx
├── TechnologyForm.tsx
├── README.md
└── index.ts
```

## Sub-Tabs Structure

### 1. Projects Header

- Manage `projects_title` and `projects_description`
- Similar to SkillsHeaderSection
- Saves to profiles table

### 2. Categories

- Manage project categories (Web, Mobile, AI/ML, etc.)
- CRUD operations on `project_categories` table
- Icon and color picker

### 3. Projects List

- Main projects management
- CRUD operations on `projects` table
- Filter by category, status, featured
- Image upload support

### 4. Technologies

- Manage technologies/tech stack
- CRUD operations on `technologies` table
- Optional: manage project-technology relationships

## Implementation Steps

### Phase 1: Folder Structure & Types ✅ TODO

1. Create folder structure:

   ```
   mkdir src/components/admin/projects/hooks
   mkdir src/components/admin/projects/sections
   ```

2. Create `types.ts` with all interfaces:
   - Database entities (Project, ProjectCategory, Technology)
   - Form data types
   - Component props
   - View types (ProjectWithCategory)

3. Create `hooks/index.ts` for exports

4. Create `sections/index.ts` for exports

### Phase 2: Custom Hooks ✅ TODO

1. **useProjects.ts**
   - Fetch projects with categories
   - Create, update, delete projects
   - Upload project images
   - Filter and search

2. **useProjectCategories.ts**
   - Fetch categories
   - Create, update, delete categories
   - Reorder categories

3. **useTechnologies.ts**
   - Fetch technologies
   - Create, update, delete technologies
   - Manage project-technology relationships

### Phase 3: Section Components ✅ TODO

1. **ProjectsHeaderSection.tsx**
   - Form for projects_title and projects_description
   - Save to profiles table
   - Similar to SkillsHeaderSection

2. **ProjectsCategoriesSection.tsx**
   - List of categories with CRUD
   - Category form (inline or modal)
   - Icon and color picker
   - Drag-and-drop reordering

3. **ProjectsListSection.tsx**
   - Projects list with filters
   - Project form (inline or modal)
   - Image upload
   - Status management
   - Featured toggle

4. **TechnologiesSection.tsx**
   - Technologies list with CRUD
   - Technology form
   - Category grouping

### Phase 4: Main Components ✅ TODO

1. **ProjectsManagementRouter.tsx**
   - Route to different sections based on activeSubTab
   - Similar to SkillsManagementRouter

2. **ProjectsManagement.tsx**
   - Main container with tabs
   - State management
   - Similar to SkillsManagement

3. **ProjectForm.tsx**
   - Comprehensive project form
   - Image upload
   - Technology selection
   - Category selection
   - Status and featured toggles

4. **ProjectsList.tsx**
   - Display projects in cards/list
   - Edit and delete actions
   - Filter controls

### Phase 5: AdminSidebar Integration ✅ TODO

Update `AdminSidebar.tsx` to add projects sub-tabs:

```typescript
const projectsSubTabs = [
  { id: "projects-header", label: "Projects Header", icon: FileText },
  { id: "projects-categories", label: "Categories", icon: Folder },
  { id: "projects-list", label: "Projects", icon: Briefcase },
  { id: "projects-technologies", label: "Technologies", icon: Code },
];
```

### Phase 6: Admin Index Integration ✅ TODO

Update `src/components/admin/index.tsx` to handle projects sub-tabs routing.

### Phase 7: Testing & Validation ✅ TODO

1. Test all CRUD operations
2. Test image uploads
3. Test filters and search
4. Test category management
5. Test technology management
6. Verify RLS policies work
7. Test with multiple users

## Database Integration Points

### Tables to Integrate

1. **profiles** - projects_title, projects_description
2. **project_categories** - Categories management
3. **projects** - Main projects data
4. **technologies** - Tech stack (optional)
5. **project_technologies** - Many-to-many (optional)

### Storage Integration

- **Bucket:** project-images
- **Upload:** Project screenshots/images
- **Size Limit:** 10MB
- **Formats:** JPEG, PNG, WebP, GIF

## Key Features to Implement

### Projects Header Section

- ✅ Title and description fields
- ✅ Save to profiles table
- ✅ Preview display

### Categories Section

- ✅ List all categories
- ✅ Add/Edit/Delete categories
- ✅ Icon picker
- ✅ Color picker
- ✅ Reorder categories
- ✅ Active/inactive toggle

### Projects List Section

- ✅ Display all projects
- ✅ Filter by category
- ✅ Filter by status
- ✅ Filter by featured
- ✅ Search functionality
- ✅ Add new project
- ✅ Edit project
- ✅ Delete project
- ✅ Image upload
- ✅ Technology selection
- ✅ Featured toggle
- ✅ Status dropdown

### Technologies Section

- ✅ List all technologies
- ✅ Add/Edit/Delete technologies
- ✅ Icon picker
- ✅ Color picker
- ✅ Category grouping
- ✅ Active/inactive toggle

## Form Fields

### Project Form

- Title (required)
- Slug (auto-generated from title)
- Category (dropdown)
- Description (textarea)
- Long Description (rich text/markdown)
- Image (file upload)
- Demo URL
- GitHub URL
- Technologies (multi-select or array input)
- Tags (array input)
- Status (dropdown: completed, in-progress, planned, archived)
- Featured (checkbox)
- Start Date
- End Date
- Display Order

### Category Form

- Name (required, unique)
- Label (required)
- Icon (icon picker)
- Color (color picker)
- Description
- Display Order
- Active (checkbox)

### Technology Form

- Name (required, unique)
- Label (required)
- Icon (icon picker)
- Color (color picker)
- Category (dropdown: frontend, backend, database, devops, ai-ml)
- Display Order
- Active (checkbox)

## Color Scheme

Use project's consistent colors:

- `text-secondary` - Blue
- `text-accent` - Pink/Magenta
- `text-neural` - Cyan
- `text-success` - Green
- `text-warning` - Yellow/Orange
- `text-primary` - Default

## Best Practices

1. **Follow Skills Pattern** - Use SkillsManagement as reference
2. **Type Safety** - All types in types.ts
3. **Hooks** - Separate hooks for each entity
4. **Sections** - One section per sub-tab
5. **Error Handling** - Toast notifications
6. **Loading States** - Skeleton loaders
7. **Validation** - Form validation
8. **Optimistic Updates** - Update UI before API response
9. **Memoization** - Use useMemo and useCallback
10. **Accessibility** - ARIA labels and keyboard navigation

## Migration Checklist

Before starting implementation:

- [ ] Apply projects migration (`supabase db push`)
- [ ] Verify tables created
- [ ] Verify storage bucket created
- [ ] Test RLS policies
- [ ] Seed categories and technologies
- [ ] Test helper functions

## Timeline Estimate

- **Phase 1:** 30 minutes (Structure & Types)
- **Phase 2:** 2 hours (Custom Hooks)
- **Phase 3:** 4 hours (Section Components)
- **Phase 4:** 3 hours (Main Components)
- **Phase 5:** 30 minutes (Sidebar Integration)
- **Phase 6:** 30 minutes (Index Integration)
- **Phase 7:** 2 hours (Testing)

**Total:** ~12-13 hours

## Next Steps

1. Apply the database migration
2. Create the folder structure
3. Start with types.ts
4. Implement hooks one by one
5. Build sections following skills pattern
6. Integrate with AdminSidebar
7. Test thoroughly

## References

- Skills Admin: `src/components/admin/skills/`
- Skills Migration: `supabase/migrations/20241028000003_skills.sql`
- Projects Migration: `supabase/migrations/20241028000005_projects.sql`
- AdminSidebar: `src/components/admin/AdminSidebar.tsx`

## Notes

- This is a comprehensive refactoring
- Follow the skills pattern exactly
- Test each phase before moving to the next
- Keep components small and focused
- Use TypeScript strictly
- Document as you go

Ready to build a professional projects management system! 🚀
