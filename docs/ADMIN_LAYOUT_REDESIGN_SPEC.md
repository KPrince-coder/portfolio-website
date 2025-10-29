# Admin Layout Redesign Specification

## Overview

Complete redesign of the admin panel layout with modern, innovative features including fixed header, collapsible sidebar, and mobile-first responsive design.

## Requirements

### 1. Fixed Header

- Header stays at top of viewport (doesn't scroll)
- `position: fixed` with `top: 0`
- Full width with proper z-index
- Consistent height across all screens

### 2. Fixed Sidebar

- Full height from header to bottom
- `position: fixed` on desktop
- Internal scrolling for navigation items
- Smooth collapse/expand animations
- Width: 280px expanded, 64px collapsed

### 3. Collapsible Sidebar

**Desktop (≥1024px):**

- Toggle button in sidebar
- Smooth width transition (300ms)
- Icons remain visible when collapsed
- Labels hide/show with fade
- Content area adjusts with sidebar

**Mobile (<1024px):**

- Default: Collapsed (hidden)
- Opens as overlay (doesn't push content)
- Backdrop blur effect
- Swipe to close gesture
- Close on outside click

### 4. Layout Structure

```
┌─────────────────────────────────────┐
│         Fixed Header                │ ← Fixed, z-index: 50
├──────┬──────────────────────────────┤
│      │                              │
│ Side │    Main Content Area         │
│ bar  │    (Scrollable)              │
│      │                              │
│ Fix  │                              │
│ ed   │                              │
│      │                              │
└──────┴──────────────────────────────┘
```

### 5. Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1023px
- Desktop: ≥ 1024px

### 6. Color Consistency

- Use existing theme variables
- Neural gradient for active states
- Consistent hover/focus states
- Smooth transitions (200-300ms)

### 7. Performance Optimizations

- CSS transforms for animations (GPU accelerated)
- `will-change` for animated properties
- Lazy load sidebar content
- Debounced resize handlers
- Memoized components

### 8. SEO Considerations

- Semantic HTML (nav, header, main, aside)
- Proper ARIA labels
- Skip to content link
- Keyboard navigation
- Screen reader announcements

## Implementation Plan

### Phase 1: Layout Structure

1. Create new AdminLayout component
2. Implement fixed header
3. Implement fixed sidebar container
4. Add main content area with proper spacing

### Phase 2: Sidebar Functionality

1. Add collapse/expand state management
2. Implement toggle button
3. Add smooth animations
4. Handle responsive behavior

### Phase 3: Mobile Optimization

1. Implement overlay sidebar
2. Add backdrop
3. Add touch gestures
4. Handle outside clicks

### Phase 4: Polish & Testing

1. Add loading states
2. Test all breakpoints
3. Verify accessibility
4. Performance audit

## Technical Details

### State Management

```typescript
const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
const [sidebarOpen, setS idebarOpen] = useState(false); // Mobile only
```

### CSS Classes

- `.admin-layout` - Main container
- `.admin-header` - Fixed header
- `.admin-sidebar` - Fixed sidebar
- `.admin-sidebar--collapsed` - Collapsed state
- `.admin-sidebar--mobile` - Mobile overlay
- `.admin-content` - Main content area

### Animations

- Sidebar width: `transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1)`
- Opacity: `transition: opacity 200ms ease-in-out`
- Transform: `transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1)`

## Files to Modify

1. `src/pages/Admin.tsx` - Main layout structure
2. `src/components/admin/AdminHeader.tsx` - Fixed positioning
3. `src/components/admin/AdminSidebar.tsx` - Collapsible functionality
4. Create: `src/components/admin/AdminLayout.tsx` - New layout wrapper

## Success Criteria

- ✅ Header doesn't scroll with content
- ✅ Sidebar is full height and scrollable
- ✅ Smooth collapse/expand animations
- ✅ Mobile overlay works perfectly
- ✅ No layout shifts or jank
- ✅ Consistent colors throughout
- ✅ Accessible keyboard navigation
- ✅ Performance score > 90
