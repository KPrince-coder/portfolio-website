# Projects Component

Frontend component for displaying portfolio projects on the main website.

## Structure

```
projects/
├── hooks/
│   └── useProjectsData.ts      # Data fetching hook
├── CategoryFilter.tsx           # Category filter buttons
├── ProjectCard.tsx              # Individual project card
├── ProjectDetailModal.tsx       # Project detail modal dialog
├── ProjectsGrid.tsx             # Grid layout for projects
├── Projects.tsx                 # Main component
├── ProjectsSkeleton.tsx         # Loading skeleton
├── types.ts                     # TypeScript definitions
├── utils.ts                     # Utility functions
├── index.ts                     # Exports
└── README.md                    # This file
```

## Features

- ✅ Responsive grid layout
- ✅ Category filtering
- ✅ Featured project highlighting
- ✅ Project status badges
- ✅ Technology tags
- ✅ Demo and GitHub links
- ✅ Project metrics (stars, forks, views)
- ✅ **Interactive project detail modal**
- ✅ **SEO-friendly with semantic HTML and ARIA labels**
- ✅ **Keyboard navigation and accessibility support**
- ✅ Loading skeleton
- ✅ Reusable SectionHeader component
- ✅ Optimized data fetching
- ✅ Grouped by category display

## Usage

```tsx
import { Projects } from "@/components/projects";

function HomePage() {
  return (
    <div>
      <Projects />
    </div>
  );
}
```

## Components

### Projects

Main component that orchestrates the entire projects section.

### ProjectCard

Displays individual project with:

- Image with hover effect
- Featured badge
- Category badge
- Title and description
- Status badge
- Technology tags
- Demo/GitHub buttons
- Metrics (stars, forks, views)
- **Clickable to open detail modal**

### ProjectDetailModal

Comprehensive project detail view with:

- Full-screen hero image
- Complete project description
- All technologies used
- Project tags
- Timeline (start/end dates)
- Metrics (stars, forks, views)
- Direct links to demo and source code
- Semantic HTML with ARIA labels
- Keyboard navigation (ESC to close)
- Smooth animations
- Mobile-responsive design
- Performance optimized with lazy loading

### ProjectsGrid

Responsive grid that groups projects by category.

### CategoryFilter

Filter buttons for switching between categories.

### ProjectsSkeleton

Loading state with animated skeletons.

## Data Flow

1. `useProjectsData` hook fetches all data in parallel
2. Data includes projects, categories, technologies, and profile info
3. Projects component filters based on active category
4. ProjectsGrid groups and displays filtered projects
5. Each ProjectCard renders individual project details
6. **Clicking a project card opens ProjectDetailModal with full details**
7. **Modal displays long_description, tags, dates, and all metadata**

## Styling

- Uses Tailwind CSS utility classes
- Follows design system with neural theme
- Responsive breakpoints: mobile, tablet, desktop
- Smooth transitions and hover effects
- Card-based layout with shadows
- **Modal with glassmorphism effects and backdrop blur**
- **Scroll area for long content**
- **Optimized for touch and mouse interactions**

## Integration

This component integrates with:

- Supabase database (projects, categories, technologies tables)
- Profile data for section title/description
- UI components (Card, Badge, Button)
- Reusable SectionHeader component

## Related

- Admin: `/src/components/admin/projects/` - Admin management
- Database: `/supabase/migrations/20241028000005_projects.sql` - Schema
- UI: `/src/components/ui/section-header.tsx` - Reusable header
