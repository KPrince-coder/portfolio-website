# Design Document

## Overview

This design document outlines the technical architecture and implementation approach for the admin panel layout redesign. The design focuses on creating a modern, fixed-position layout with a collapsible sidebar, responsive behavior, and optimal performance through GPU-accelerated animations.

## Architecture

### Component Hierarchy

```
AdminLayout (New)
├── AdminHeader (Modified)
│   ├── Logo/Branding
│   ├── Mobile Menu Button
│   └── User Controls
├── AdminSidebar (Redesigned)
│   ├── Toggle Button (Desktop)
│   ├── ScrollArea
│   │   └── Navigation Items
│   └── Mobile Overlay Variant
└── Main Content Area
    └── Router Outlet (Existing Routes)
```

### State Management

The layout will use React Context and local state for managing:

1. **Sidebar Collapse State** (Desktop)
   - Persisted to localStorage
   - Shared across all admin pages
   - Default: expanded

2. **Sidebar Open State** (Mobile)
   - Session-only (not persisted)
   - Controls overlay visibility
   - Default: closed

3. **Responsive Breakpoint State**
   - Derived from window.innerWidth
   - Updates on resize (debounced)
   - Determines desktop vs mobile behavior

### Layout Positioning Strategy

#### Fixed Header

- `position: fixed`
- `top: 0`, `left: 0`, `right: 0`
- `z-index: 50`
- `height: 64px`

#### Fixed Sidebar (Desktop ≥1024px)

- `position: fixed`
- `top: 64px` (below header)
- `left: 0`, `bottom: 0`
- `z-index: 40`
- `width: 280px` (expanded) or `64px` (collapsed)

#### Overlay Sidebar (Mobile <1024px)

- `position: fixed`
- `top: 0`, `bottom: 0`
- `left: 0` (when open) or `left: -280px` (when closed)
- `z-index: 60`
- `width: 280px`

#### Main Content Area

- `margin-top: 64px` (for fixed header)
- `margin-left: 280px` or `64px` (desktop, adjusts with sidebar)
- `margin-left: 0` (mobile, no adjustment)
- `min-height: calc(100vh - 64px)`

## Components and Interfaces

### 1. AdminLayout Component

**Purpose**: Root layout wrapper that manages sidebar state and provides context

**Props**: None (wraps children)

**State**:

```typescript
interface AdminLayoutState {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isMobile: boolean;
}
```

**Key Features**:

- Provides layout context to children
- Handles responsive breakpoint detection
- Manages localStorage persistence
- Implements keyboard shortcuts (Ctrl+B)
- Handles escape key for mobile sidebar

**File**: `src/components/admin/AdminLayout.tsx`

### 2. AdminHeader Component

**Purpose**: Fixed header with branding and user controls

**Props**:

```typescript
interface AdminHeaderProps {
  onMobileMenuClick?: () => void;
}
```

**Key Features**:

- Fixed positioning at viewport top
- Mobile menu button (visible <1024px)
- User avatar and dropdown
- Consistent 64px height
- Full-width responsive

**File**: `src/components/admin/AdminHeader.tsx` (Modified)

### 3. AdminSidebar Component

**Purpose**: Collapsible navigation sidebar with responsive behavior

**Props**:

```typescript
interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}
```

**Key Features**:

- Desktop: Fixed sidebar with collapse toggle
- Mobile: Overlay with backdrop
- Internal scrolling for navigation
- Smooth width transitions
- Icon-only mode when collapsed

**File**: `src/components/admin/AdminSidebar.tsx` (Redesigned)

### 4. SidebarItem Component

**Purpose**: Individual navigation item with collapse support

**Props**:

```typescript
interface SidebarItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  collapsed: boolean;
  active?: boolean;
  badge?: number;
}
```

**Key Features**:

- Icon always visible
- Label fades with collapse
- Tooltip when collapsed
- Active state styling
- Badge support for notifications

**File**: `src/components/admin/SidebarItem.tsx` (New)

### 5. MobileSidebarBackdrop Component

**Purpose**: Semi-transparent backdrop for mobile sidebar

**Props**:

```typescript
interface MobileSidebarBackdropProps {
  visible: boolean;
  onClick: () => void;
}
```

**Key Features**:

- Backdrop blur effect
- Fade in/out animation
- Click to close
- Prevents body scroll when visible

**File**: `src/components/admin/MobileSidebarBackdrop.tsx` (New)

## Data Models

### Layout Context

```typescript
interface AdminLayoutContextValue {
  // Sidebar state
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  
  // Mobile state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  
  // Responsive state
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}
```

### Navigation Item

```typescript
interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: number;
  children?: NavigationItem[];
}
```

### Sidebar Configuration

```typescript
const navigationItems: NavigationItem[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    href: '/admin/profile'
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: Code,
    href: '/admin/skills'
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: Folder,
    href: '/admin/projects'
  },
  {
    id: 'resume',
    label: 'Resume',
    icon: FileText,
    href: '/admin/resume'
  }
];
```

## Styling and Theming

### CSS Custom Properties

```css
:root {
  /* Layout dimensions */
  --header-height: 64px;
  --sidebar-width-expanded: 280px;
  --sidebar-width-collapsed: 64px;
  
  /* Z-index layers */
  --z-header: 50;
  --z-sidebar-desktop: 40;
  --z-sidebar-mobile: 60;
  --z-backdrop: 55;
  
  /* Animation timing */
  --sidebar-transition-duration: 300ms;
  --sidebar-transition-easing: cubic-bezier(0.4, 0, 0.2, 1);
  --fade-transition-duration: 200ms;
  --fade-transition-easing: ease-in-out;
}
```

### Tailwind Classes

**AdminLayout**:

```tsx
<div className="admin-layout min-h-screen bg-background">
  {/* Content */}
</div>
```

**AdminHeader**:

```tsx
<header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background border-b border-border">
  {/* Content */}
</header>
```

**AdminSidebar (Desktop)**:

```tsx
<aside className={cn(
  "fixed left-0 top-16 bottom-0 z-40",
  "bg-background border-r border-border",
  "transition-all duration-300 ease-in-out",
  "hidden lg:flex flex-col",
  collapsed ? "w-16" : "w-70"
)}>
  {/* Content */}
</aside>
```

**AdminSidebar (Mobile)**:

```tsx
<aside className={cn(
  "fixed top-0 bottom-0 left-0 z-60 w-70",
  "bg-background border-r border-border shadow-xl",
  "transform transition-transform duration-300 ease-in-out lg:hidden",
  mobileOpen ? "translate-x-0" : "-translate-x-full"
)}>
  {/* Content */}
</aside>
```

**Main Content**:

```tsx
<main className={cn(
  "pt-16 min-h-screen transition-all duration-300",
  isDesktop && !collapsed && "lg:ml-70",
  isDesktop && collapsed && "lg:ml-16"
)}>
  {/* Content */}
</main>
```

### Animation Specifications

**Sidebar Width Transition**:

```css
.admin-sidebar {
  transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: width;
}
```

**Label Fade**:

```css
.sidebar-label {
  transition: opacity 200ms ease-in-out;
  will-change: opacity;
}
```

**Mobile Slide**:

```css
.admin-sidebar-mobile {
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}
```

**Backdrop Fade**:

```css
.sidebar-backdrop {
  transition: opacity 200ms ease-in-out;
  will-change: opacity;
}
```

## Error Handling

### Responsive Detection Errors

**Issue**: Window resize events firing too frequently
**Solution**: Debounce resize handler with 150ms delay

```typescript
const debouncedResize = useMemo(
  () => debounce(() => {
    setIsMobile(window.innerWidth < 1024);
  }, 150),
  []
);
```

### LocalStorage Errors

**Issue**: localStorage may be unavailable or throw errors
**Solution**: Wrap in try-catch with fallback

```typescript
const getSavedSidebarState = (): boolean => {
  try {
    const saved = localStorage.getItem('admin-sidebar-collapsed');
    return saved === 'true';
  } catch (error) {
    console.warn('Failed to read sidebar state from localStorage', error);
    return false; // Default to expanded
  }
};
```

### Animation Performance Issues

**Issue**: Animations may cause jank on low-end devices
**Solution**: Use CSS transforms and will-change

```css
.admin-sidebar {
  transform: translateZ(0); /* Force GPU layer */
  will-change: width;
}
```

### Focus Management

**Issue**: Focus may be lost when sidebar closes
**Solution**: Return focus to trigger button

```typescript
const closeMobileSidebar = () => {
  setSidebarOpen(false);
  // Return focus to menu button
  menuButtonRef.current?.focus();
};
```

## Testing Strategy

### Unit Tests

**AdminLayout Component**:

- ✓ Renders children correctly
- ✓ Provides context values
- ✓ Handles sidebar toggle
- ✓ Persists state to localStorage
- ✓ Responds to keyboard shortcuts

**AdminSidebar Component**:

- ✓ Renders navigation items
- ✓ Toggles collapsed state
- ✓ Shows/hides on mobile
- ✓ Handles outside clicks
- ✓ Manages scroll position

**SidebarItem Component**:

- ✓ Renders icon and label
- ✓ Shows tooltip when collapsed
- ✓ Applies active state
- ✓ Handles navigation
- ✓ Displays badge

### Integration Tests

**Layout Behavior**:

- ✓ Header stays fixed on scroll
- ✓ Sidebar adjusts content margin
- ✓ Mobile overlay doesn't shift content
- ✓ Responsive breakpoints work correctly
- ✓ Animations complete smoothly

**User Interactions**:

- ✓ Click toggle button collapses sidebar
- ✓ Click mobile menu opens sidebar
- ✓ Click backdrop closes sidebar
- ✓ Press Escape closes mobile sidebar
- ✓ Press Ctrl+B toggles sidebar

### Accessibility Tests

**Keyboard Navigation**:

- ✓ Tab through all interactive elements
- ✓ Enter activates buttons and links
- ✓ Escape closes mobile sidebar
- ✓ Ctrl+B toggles sidebar

**Screen Reader**:

- ✓ Announces sidebar state changes
- ✓ Provides accessible labels
- ✓ Uses semantic HTML
- ✓ Skip to content link works

### Performance Tests

**Metrics**:

- ✓ Lighthouse Performance Score ≥ 90
- ✓ First Contentful Paint < 1.5s
- ✓ Cumulative Layout Shift < 0.1
- ✓ Animation frame rate ≥ 60fps

**Load Testing**:

- ✓ Test with 50+ navigation items
- ✓ Test rapid toggle clicks
- ✓ Test window resize performance
- ✓ Test on low-end devices

### Visual Regression Tests

**Scenarios**:

- ✓ Sidebar expanded (desktop)
- ✓ Sidebar collapsed (desktop)
- ✓ Sidebar open (mobile)
- ✓ Sidebar closed (mobile)
- ✓ All breakpoints (mobile, tablet, desktop)
- ✓ Dark mode compatibility

## Performance Optimizations

### 1. GPU Acceleration

Use CSS transforms instead of width/left for animations:

```css
/* Good - GPU accelerated */
.sidebar {
  transform: translateX(0);
  transition: transform 300ms;
}

/* Avoid - CPU bound */
.sidebar {
  left: 0;
  transition: left 300ms;
}
```

### 2. Component Memoization

Prevent unnecessary re-renders:

```typescript
const MemoizedSidebarItem = React.memo(SidebarItem);
const MemoizedAdminSidebar = React.memo(AdminSidebar);
```

### 3. Debounced Resize Handler

Reduce resize event frequency:

```typescript
const debouncedResize = useMemo(
  () => debounce(handleResize, 150),
  []
);

useEffect(() => {
  window.addEventListener('resize', debouncedResize);
  return () => window.removeEventListener('resize', debouncedResize);
}, [debouncedResize]);
```

### 4. Lazy Loading

Load sidebar content only when needed:

```typescript
const AdminSidebar = lazy(() => import('./AdminSidebar'));

<Suspense fallback={<SidebarSkeleton />}>
  <AdminSidebar />
</Suspense>
```

### 5. Will-Change Property

Hint browser about upcoming animations:

```css
.admin-sidebar {
  will-change: width;
}

.sidebar-label {
  will-change: opacity;
}

/* Remove after animation */
.admin-sidebar:not(.transitioning) {
  will-change: auto;
}
```

### 6. Virtual Scrolling

For large navigation lists (50+ items):

```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={navigationItems.length}
  itemSize={48}
  width="100%"
>
  {({ index, style }) => (
    <SidebarItem
      style={style}
      item={navigationItems[index]}
    />
  )}
</FixedSizeList>
```

## Accessibility Features

### 1. Semantic HTML

```tsx
<header role="banner">
  <nav role="navigation" aria-label="User controls">
    {/* Header navigation */}
  </nav>
</header>

<aside role="complementary" aria-label="Main navigation">
  <nav role="navigation">
    {/* Sidebar navigation */}
  </nav>
</aside>

<main role="main" id="main-content">
  {/* Main content */}
</main>
```

### 2. ARIA Attributes

```tsx
<button
  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
  aria-expanded={!collapsed}
  aria-controls="admin-sidebar"
  onClick={toggleSidebar}
>
  <ChevronLeft />
</button>

<aside
  id="admin-sidebar"
  aria-label="Main navigation"
  aria-hidden={isMobile && !sidebarOpen}
>
  {/* Sidebar content */}
</aside>
```

### 3. Keyboard Navigation

```typescript
// Escape key closes mobile sidebar
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && sidebarOpen) {
      closeMobileSidebar();
    }
  };
  
  window.addEventListener('keydown', handleEscape);
  return () => window.removeEventListener('keydown', handleEscape);
}, [sidebarOpen]);

// Ctrl+B toggles sidebar
useEffect(() => {
  const handleKeyboard = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'b') {
      e.preventDefault();
      toggleSidebar();
    }
  };
  
  window.addEventListener('keydown', handleKeyboard);
  return () => window.removeEventListener('keydown', handleKeyboard);
}, []);
```

### 4. Focus Management

```typescript
// Trap focus in mobile sidebar
const trapFocus = (e: KeyboardEvent) => {
  if (!sidebarOpen) return;
  
  const focusableElements = sidebarRef.current?.querySelectorAll(
    'a, button, input, [tabindex]:not([tabindex="-1"])'
  );
  
  if (!focusableElements?.length) return;
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  if (e.key === 'Tab') {
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
};
```

### 5. Skip to Content Link

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground"
>
  Skip to main content
</a>
```

## Browser Compatibility

### Supported Browsers

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile Safari: iOS 14+
- Chrome Mobile: Latest version

### Fallbacks

**CSS Grid**:

```css
/* Fallback for older browsers */
.admin-layout {
  display: flex;
}

/* Modern browsers */
@supports (display: grid) {
  .admin-layout {
    display: grid;
    grid-template-areas:
      "header header"
      "sidebar main";
  }
}
```

**Backdrop Filter**:

```css
/* Fallback */
.sidebar-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

/* Modern browsers */
@supports (backdrop-filter: blur(8px)) {
  .sidebar-backdrop {
    backdrop-filter: blur(8px);
    background-color: rgba(0, 0, 0, 0.3);
  }
}
```

## Migration Strategy

### Phase 1: Create New Components

1. Create `AdminLayout.tsx`
2. Create `SidebarItem.tsx`
3. Create `MobileSidebarBackdrop.tsx`
4. Create layout context and hooks

### Phase 2: Modify Existing Components

1. Update `AdminHeader.tsx` with fixed positioning
2. Redesign `AdminSidebar.tsx` with new structure
3. Update `Admin.tsx` to use new layout

### Phase 3: Update Styles

1. Add CSS custom properties
2. Update Tailwind classes
3. Add animation styles
4. Test responsive behavior

### Phase 4: Testing and Refinement

1. Run unit tests
2. Run integration tests
3. Test accessibility
4. Performance audit
5. Cross-browser testing

## Design Decisions and Rationales

### Decision 1: Fixed Positioning vs Sticky

**Choice**: Fixed positioning for header and sidebar
**Rationale**:

- More predictable behavior across browsers
- Better performance (no reflow on scroll)
- Simpler z-index management
- Consistent with modern admin panel patterns

### Decision 2: Overlay vs Push on Mobile

**Choice**: Overlay sidebar on mobile
**Rationale**:

- Preserves content layout (no shift)
- Faster animation (transform vs layout)
- Better UX on small screens
- Industry standard pattern

### Decision 3: CSS Transitions vs JavaScript Animation

**Choice**: CSS transitions with transforms
**Rationale**:

- GPU accelerated (better performance)
- Declarative and maintainable
- Automatic browser optimization
- Simpler code

### Decision 4: Context vs Props Drilling

**Choice**: React Context for layout state
**Rationale**:

- Avoids props drilling through routes
- Centralized state management
- Easy to access from any component
- Follows React best practices

### Decision 5: LocalStorage Persistence

**Choice**: Persist sidebar collapsed state
**Rationale**:

- Respects user preference
- Improves UX on return visits
- Simple implementation
- No backend required

## Future Enhancements

### Phase 2 Features

1. **Sidebar Search**: Quick navigation filter
2. **Customizable Order**: Drag-and-drop menu items
3. **Pinned Items**: Keep frequently used items at top
4. **Breadcrumbs**: Show current location in header
5. **Quick Actions**: Floating action button for common tasks

### Advanced Features

1. **Multi-level Navigation**: Nested menu support
2. **Sidebar Widgets**: Mini dashboards in sidebar
3. **Workspace Switching**: Multiple admin contexts
4. **Command Palette**: Cmd+K quick actions
5. **Theme Switcher**: Light/dark mode toggle in header

### Performance Improvements

1. **Route-based Code Splitting**: Lazy load admin sections
2. **Prefetching**: Preload likely next routes
3. **Service Worker**: Offline support
4. **Image Optimization**: WebP with fallbacks
5. **Bundle Analysis**: Identify and reduce bloat
