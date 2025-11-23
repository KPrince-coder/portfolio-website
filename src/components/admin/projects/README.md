# Projects Management Components

This folder contains all components related to projects management in the admin panel.

## Structure

```
admin/projects/
├── hooks/                    # Custom hooks
│   ├── useProjects.ts       # Projects data management
│   ├── useProjectCategories.ts # Categories management
│   ├── useTechnologies.ts   # Technologies management
│   └── index.ts            # Hook exports
├── sections/                 # Section components
│   ├── ProjectsHeaderSection.tsx
│   ├── ProjectsCategoriesSection.tsx
│   ├── ProjectsListSection.tsx
│   ├── TechnologiesSection.tsx
│   └── index.ts            # Section exports
├── types.ts                 # TypeScript type definitions
├── index.ts                 # Main exports
├── ProjectsManagement.tsx   # Main projects management component
├── ProjectsManagementRouter.tsx # Sub-tab router
├── ProjectForm.tsx          # Project form component
├── ProjectsList.tsx         # Projects list component
├── ProjectCategoryForm.tsx  # Category form component
├── TechnologyForm.tsx       # Technology form component
└── README.md               # This file
```

## Components

### ProjectsManagement

Main container component that orchestrates all projects sections using tabs.

**Features:**

- Tab-based navigation between sections
- Centralized projects data management
- Loading and error states

### Section Components

Each section handles a specific aspect of projects management:

- **ProjectsHeaderSection** - Projects section title and description
- **ProjectsCategoriesSection** - Manage project categories
- **ProjectsListSection** - Main projects CRUD operations
- **TechnologiesSection** - Manage technologies/tech stack

## Types

All TypeScript interfaces are centralized in `types.ts`:

### Database Entities

- `ProjectCategory` - Project category data structure
- `Project` - Main project data structure
- `Technology` - Technology/tool data structure
- `ProjectTechnology` - Project-technology relationship
- `ProjectWithCategory` - Project with joined category data
- `ProjectWithTechCount` - Project with technology count

### Form Data Types

- `ProjectCategoryFormData` - Category form data
- `ProjectFormData` - Project form data
- `TechnologyFormData` - Technology form data
- `ProjectsHeaderFormData` - Header section data

### Component Props

- `ProjectsManagementProps`
- `ProjectsManagementRouterProps`
- `ProjectsHeaderSectionProps`
- `ProjectsCategoriesSectionProps`
- `ProjectsListSectionProps`
- `TechnologiesSectionProps`
- `ProjectsListProps`
- `ProjectFormProps`
- `ProjectCategoryFormProps`
- `TechnologyFormProps`

### Hook Return Types

- `UseProjectsReturn`
- `UseProjectCategoriesReturn`
- `UseTechnologiesReturn`

## Hooks

### useProjects

Custom hook for managing projects data with Supabase.

**Returns:**

- `projects` - Array of projects with category data
- `loading` - Loading state
- `error` - Error state
- `createProject` - Function to create project
- `updateProject` - Function to update project
- `deleteProject` - Function to delete project
- `toggleFeatured` - Function to toggle featured status
- `uploadImage` - Function to upload project image
- `refetch` - Function to reload projects data

### useProjectCategories

Custom hook for managing project categories.

**Returns:**

- `categories` - Array of project categories
- `loading` - Loading state
- `error` - Error state
- `createCategory` - Function to create category
- `updateCategory` - Function to update category
- `deleteCategory` - Function to delete category
- `reorderCategories` - Function to reorder categories
- `refetch` - Function to reload categories

### useTechnologies

Custom hook for managing technologies.

**Returns:**

- `technologies` - Array of technologies
- `loading` - Loading state
- `error` - Error state
- `createTechnology` - Function to create technology
- `updateTechnology` - Function to update technology
- `deleteTechnology` - Function to delete technology
- `refetch` - Function to reload technologies

## Usage

### Importing Components

```tsx
import { ProjectsManagement } from "@/components/admin/projects";
```

### Importing Types

```tsx
import type { Project, ProjectCategory } from "@/components/admin/projects";
```

### Importing Hooks

```tsx
import { useProjects } from "@/components/admin/projects";
```

## Data Flow

1. **ProjectsManagement** uses custom hooks to fetch data
2. Data is passed down to section components as needed
3. Section components handle their own form state
4. Updates are sent through hook functions
5. Hooks handle Supabase operations and state updates

## Database Integration

### Tables

- `project_categories` - Project categories
- `projects` - Main projects data
- `technologies` - Available technologies
- `project_technologies` - Project-technology relationships
- `profiles` - Projects section title/description

### Storage

- `project-images` - Project screenshots and images

### Views

- `projects_with_categories` - Projects with category info
- `projects_with_tech_count` - Projects with tech count

### Functions

- `get_featured_projects()` - Get featured projects
- `get_projects_by_category()` - Filter by category
- `search_projects()` - Search functionality

## Best Practices

1. **Type Safety** - Always use the centralized types from `types.ts`
2. **Hook Usage** - Use appropriate hooks for data operations
3. **Form State** - Each section manages its own form state
4. **Error Handling** - Use toast notifications for user feedback
5. **Loading States** - Show appropriate loading indicators
6. **Image Upload** - Use the uploadImage function from useProjects
7. **Validation** - Validate forms before submission
8. **Optimistic Updates** - Update UI before API response when appropriate

## Sub-Tabs

The projects management uses 4 sub-tabs:

1. **Header** (`projects-header`) - Section title and description
2. **Categories** (`projects-categories`) - Manage project categories
3. **Projects** (`projects-list`) - Main projects management
4. **Technologies** (`projects-technologies`) - Manage tech stack

## Related Documentation

- [Projects Migration](../../../../docs/PROJECTS_MIGRATION.md)
- [Projects Implementation Plan](../../../../docs/PROJECTS_ADMIN_IMPLEMENTATION_PLAN.md)
- [Supabase Migrations](../../../../supabase/migrations/README.md)
- [Admin Components](../README.md)
- [UI Components](../../ui/README.md)

## Status

- ✅ Phase 1: Folder Structure & Types - Complete
- ✅ Phase 2: Custom Hooks - Complete
- ⏳ Phase 3: Section Components - Pending
- ⏳ Phase 4: Main Components - Pending
- ⏳ Phase 5: AdminSidebar Integration - Pending
- ⏳ Phase 6: Admin Index Integration - Pending
- ⏳ Phase 7: Testing & Validation - Pending
