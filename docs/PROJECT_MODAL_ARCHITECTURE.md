# Project Detail Modal - Architecture

## Component Hierarchy

```
Projects (Main Container)
├── State Management
│   ├── selectedProject: ProjectWithCategory | null
│   ├── isModalOpen: boolean
│   └── activeCategory: string
│
├── SectionHeader
│   ├── title
│   └── description
│
├── CategoryFilter
│   └── Filter buttons
│
├── ProjectsGrid
│   └── ProjectCard (multiple)
│       ├── onClick → handleProjectClick
│       ├── Image
│       ├── Badges
│       ├── Description
│       ├── Technologies
│       └── Action Buttons (Demo/GitHub)
│
└── ProjectDetailModal
    ├── Dialog (from shadcn/ui)
    ├── Hero Image Section
    ├── Header Section
    │   ├── Badges
    │   ├── Title
    │   └── Description
    ├── Action Buttons
    ├── About Section
    ├── Technologies Section
    ├── Tags Section
    └── Metrics & Timeline Section
```

## Data Flow

```
1. User clicks ProjectCard
   ↓
2. handleProjectClick(project) called
   ↓
3. setSelectedProject(project)
   setIsModalOpen(true)
   ↓
4. ProjectDetailModal receives:
   - project: selectedProject
   - open: isModalOpen
   - onOpenChange: handleModalClose
   ↓
5. Modal renders with project data
   ↓
6. User closes modal (ESC/backdrop/X)
   ↓
7. handleModalClose(false) called
   ↓
8. setIsModalOpen(false)
   setTimeout → setSelectedProject(null)
```

## State Management

### Projects Component State

```typescript
const [selectedProject, setSelectedProject] = 
  useState<ProjectWithCategory | null>(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [activeCategory, setActiveCategory] = useState("all");
```

### Event Handlers

```typescript
// Open modal with project
const handleProjectClick = (project: ProjectWithCategory) => {
  setSelectedProject(project);
  setIsModalOpen(true);
};

// Close modal with animation delay
const handleModalClose = (open: boolean) => {
  setIsModalOpen(open);
  if (!open) {
    setTimeout(() => setSelectedProject(null), 200);
  }
};
```

## Click Detection Logic

### ProjectCard Click Handler

```typescript
const handleCardClick = (e: React.MouseEvent) => {
  // Don't trigger modal if clicking on links/buttons
  const target = e.target as HTMLElement;
  if (target.closest('a, button')) {
    return; // Let link/button handle the click
  }
  onProjectClick?.(project); // Open modal
};
```

This ensures:

- ✅ Clicking card background → Opens modal
- ✅ Clicking Demo button → Opens demo URL
- ✅ Clicking GitHub button → Opens GitHub URL
- ✅ Clicking anywhere else on card → Opens modal

## Props Flow

### ProjectCard Props

```typescript
interface ProjectCardProps {
  project: ProjectWithCategory;
  onProjectClick?: (project: ProjectWithCategory) => void;
}
```

### ProjectsGrid Props

```typescript
interface ProjectsGridProps {
  projects: ProjectWithCategory[];
  onProjectClick?: (project: ProjectWithCategory) => void;
}
```

### ProjectDetailModal Props

```typescript
interface ProjectDetailModalProps {
  project: ProjectWithCategory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
```

## Rendering Logic

### Conditional Rendering in Modal

```typescript
// Only render if project exists
if (!project) return null;

// Only show sections with data
{project.long_description && (
  <section>...</section>
)}

{project.technologies?.length > 0 && (
  <section>...</section>
)}

{project.tags?.length > 0 && (
  <section>...</section>
)}

{(hasMetrics || hasDates) && (
  <section>...</section>
)}
```

## Performance Optimizations

### 1. Lazy State Cleanup

```typescript
if (!open) {
  // Delay clearing for smooth animation
  setTimeout(() => setSelectedProject(null), 200);
}
```

### 2. Conditional Rendering

- Modal content only renders when `open === true`
- Sections only render when data exists
- Images use `loading="lazy"`

### 3. Memoization

```typescript
const filteredProjects = useMemo(() => {
  if (activeCategory === "all") return data.projects;
  return data.projects.filter(
    (project) => project.category_id === activeCategory
  );
}, [data.projects, activeCategory]);
```

### 4. Event Delegation

- Single click handler on card
- Checks target to prevent modal on link clicks
- Efficient event handling

## Accessibility Architecture

### Semantic Structure

```html
<Dialog> <!-- role="dialog" -->
  <DialogContent aria-describedby="project-description">
    <section aria-labelledby="project-details-heading">
      <h3 id="project-details-heading">About This Project</h3>
      ...
    </section>
    <section aria-labelledby="technologies-heading">
      <h3 id="technologies-heading">Technologies Used</h3>
      ...
    </section>
  </DialogContent>
</Dialog>
```

### ARIA Labels

- `aria-label` on interactive elements
- `aria-describedby` for descriptions
- `aria-labelledby` for section headings
- `role="article"` on project cards

### Keyboard Navigation

- Tab: Navigate between elements
- ESC: Close modal
- Enter/Space: Activate buttons
- Arrow keys: Scroll content

## Type Safety

### Type Definitions

```typescript
// Base types from database
type Project = Database["public"]["Tables"]["projects"]["Row"];
type ProjectCategory = Database["public"]["Tables"]["project_categories"]["Row"];

// Extended type with category info
interface ProjectWithCategory extends Project {
  category_name: string;
  category_label: string;
  category_icon: string;
  category_color: string;
}

// Component props
interface ProjectDetailModalProps {
  project: ProjectWithCategory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
```

## Error Handling

### Null Checks

```typescript
if (!project) return null; // Guard clause

{project.image_url && ( // Conditional rendering
  <img src={project.image_url} alt={project.title} />
)}

{project.technologies?.length > 0 && ( // Optional chaining
  <div>...</div>
)}
```

### Fallbacks

```typescript
const fullTitle = data.profileData?.projects_title || "Featured Projects";
const description = data.profileData?.projects_description || "Default description";
```

## Styling Architecture

### Tailwind Classes

- Responsive: `md:`, `lg:` breakpoints
- States: `hover:`, `group-hover:`
- Animations: `transition-all`, `duration-300`
- Theme: `neural`, `accent`, `success`, etc.

### Custom Classes

- `card-neural`: Neural theme card styling
- `neural-glow`: Glowing button effect

### Layout

- Flexbox for button groups
- Grid for metrics/timeline
- ScrollArea for long content
- Max heights for viewport constraints

## Integration Points

### Database

- Reads from `projects` table
- Uses `projects_with_categories` view
- Accesses all project fields

### UI Components

- Dialog (shadcn/ui)
- ScrollArea (shadcn/ui)
- Badge (shadcn/ui)
- Button (shadcn/ui)
- Separator (shadcn/ui)

### Utilities

- `formatDate()` - Date formatting
- `splitTitle()` - Title parsing
- `groupProjectsByCategory()` - Data grouping

## Testing Strategy

### Unit Tests (Potential)

- Click handler logic
- Date formatting
- Conditional rendering
- State management

### Integration Tests (Potential)

- Modal open/close flow
- Click detection
- Keyboard navigation
- Data display

### E2E Tests (Potential)

- User clicks card → Modal opens
- User clicks ESC → Modal closes
- User clicks link → Opens URL
- User scrolls → Content scrolls

## Deployment Checklist

✅ TypeScript compilation passes
✅ No linting errors
✅ All imports resolved
✅ Props properly typed
✅ Accessibility features implemented
✅ Performance optimized
✅ Documentation complete
✅ Browser compatibility verified
