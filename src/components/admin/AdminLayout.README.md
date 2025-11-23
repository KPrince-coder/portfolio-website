# AdminLayout Component

## Overview

The `AdminLayout` component is a comprehensive layout wrapper for the admin panel that provides:

- **State Management**: Centralized sidebar and responsive state management
- **Responsive Design**: Automatic detection of mobile, tablet, and desktop breakpoints
- **Keyboard Shortcuts**: Built-in keyboard navigation support
- **LocalStorage Persistence**: Remembers user's sidebar preferences
- **Context API**: Easy access to layout state from any child component

## Features

### 1. Sidebar State Management

#### Desktop Sidebar (≥1024px)

- Collapsible sidebar with smooth transitions
- Persists collapsed state to localStorage
- Width: 280px (expanded) / 64px (collapsed)

#### Mobile Sidebar (<1024px)

- Overlay sidebar that slides in from left
- Semi-transparent backdrop
- Session-only state (not persisted)

### 2. Responsive Breakpoint Detection

The component automatically detects and provides three breakpoint states:

- **isMobile**: `width < 640px`
- **isTablet**: `640px ≤ width < 1024px`
- **isDesktop**: `width ≥ 1024px`

Breakpoint detection is debounced (150ms) for optimal performance.

### 3. Keyboard Shortcuts

- **Ctrl+B** (or Cmd+B on Mac): Toggle sidebar collapse state
- **Escape**: Close mobile sidebar overlay

### 4. LocalStorage Persistence

The sidebar collapsed state is automatically saved to localStorage with the key `admin-sidebar-collapsed`. This ensures user preferences persist across sessions.

Error handling is built-in to gracefully handle localStorage unavailability.

## Usage

### Basic Setup

Wrap your admin panel content with the `AdminLayout` component:

```tsx
import { AdminLayout } from "@/components/admin";

function AdminPanel() {
  return (
    <AdminLayout>
      <AdminHeader />
      <AdminSidebar />
      <main>
        {/* Your admin content */}
      </main>
    </AdminLayout>
  );
}
```

### Accessing Layout State

Use the `useAdminLayout` hook to access layout state from any child component:

```tsx
import { useAdminLayout } from "@/components/admin";

function MyComponent() {
  const {
    // Sidebar state
    sidebarCollapsed,
    setSidebarCollapsed,
    toggleSidebar,
    
    // Mobile state
    sidebarOpen,
    setSidebarOpen,
    openMobileSidebar,
    closeMobileSidebar,
    
    // Responsive state
    isMobile,
    isTablet,
    isDesktop,
  } = useAdminLayout();

  return (
    <div>
      {isMobile ? (
        <button onClick={openMobileSidebar}>Open Menu</button>
      ) : (
        <button onClick={toggleSidebar}>
          {sidebarCollapsed ? "Expand" : "Collapse"}
        </button>
      )}
    </div>
  );
}
```

## API Reference

### AdminLayout Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| children | ReactNode | Yes | Child components to render |

### useAdminLayout Hook

Returns an object with the following properties:

#### Sidebar State

| Property | Type | Description |
|----------|------|-------------|
| sidebarCollapsed | boolean | Current collapsed state (desktop) |
| setSidebarCollapsed | (collapsed: boolean) => void | Set collapsed state and persist to localStorage |
| toggleSidebar | () => void | Toggle between collapsed and expanded |

#### Mobile State

| Property | Type | Description |
|----------|------|-------------|
| sidebarOpen | boolean | Current open state (mobile overlay) |
| setSidebarOpen | (open: boolean) => void | Set mobile sidebar open state |
| openMobileSidebar | () => void | Open mobile sidebar overlay |
| closeMobileSidebar | () => void | Close mobile sidebar overlay |

#### Responsive State

| Property | Type | Description |
|----------|------|-------------|
| isMobile | boolean | True if viewport width < 640px |
| isTablet | boolean | True if 640px ≤ viewport width < 1024px |
| isDesktop | boolean | True if viewport width ≥ 1024px |

## Implementation Details

### Debounced Resize Handler

The component uses a custom debounce utility to limit resize event frequency:

```typescript
const handleResize = debounce(() => {
  setWindowWidth(window.innerWidth);
}, 150);
```

This ensures optimal performance during window resizing.

### LocalStorage Error Handling

All localStorage operations are wrapped in try-catch blocks:

```typescript
const getSavedSidebarState = (): boolean => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "true";
  } catch (error) {
    console.warn("Failed to read sidebar state from localStorage:", error);
    return false; // Default to expanded
  }
};
```

### Auto-close Mobile Sidebar

When the viewport switches from mobile to desktop, the mobile sidebar automatically closes:

```typescript
useEffect(() => {
  if (isDesktop && sidebarOpen) {
    setSidebarOpen(false);
  }
}, [isDesktop, sidebarOpen]);
```

### SSR Safety

The component includes checks for server-side rendering compatibility:

```typescript
if (typeof window !== "undefined") {
  return window.innerWidth;
}
return BREAKPOINTS.tablet; // Default to desktop for SSR
```

## Performance Considerations

1. **Memoization**: Context value is memoized to prevent unnecessary re-renders
2. **Debouncing**: Resize events are debounced to 150ms
3. **Efficient State Updates**: Only necessary state changes trigger re-renders
4. **Event Cleanup**: All event listeners are properly cleaned up

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (with polyfills for matchMedia if needed)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Requirements Satisfied

This component satisfies the following requirements from the spec:

- **3.1**: Desktop sidebar toggle functionality
- **3.2**: Smooth transitions between collapsed/expanded states
- **4.1**: Mobile overlay sidebar behavior
- **5.4**: Responsive layout adjustments
- **7.3**: Debounced resize handler for performance
- **8.6**: Keyboard shortcuts for accessibility

## Future Enhancements

Potential improvements for future iterations:

1. **Animation Callbacks**: Add callbacks for animation start/end events
2. **Custom Breakpoints**: Allow customization of breakpoint values
3. **Sidebar Position**: Support for right-side sidebar
4. **Multiple Sidebars**: Support for dual sidebars (left + right)
5. **Gesture Support**: Touch gestures for mobile sidebar (swipe to open/close)

## Troubleshooting

### Context Error

**Error**: "useAdminLayout must be used within AdminLayoutProvider"

**Solution**: Ensure the component using `useAdminLayout` is a child of `AdminLayout`:

```tsx
// ❌ Wrong
function App() {
  const layout = useAdminLayout(); // Error!
  return <AdminLayout>...</AdminLayout>;
}

// ✅ Correct
function App() {
  return (
    <AdminLayout>
      <MyComponent /> {/* Can use useAdminLayout here */}
    </AdminLayout>
  );
}
```

### LocalStorage Not Persisting

**Issue**: Sidebar state not persisting across sessions

**Possible Causes**:

1. Browser in private/incognito mode
2. LocalStorage disabled by browser settings
3. Storage quota exceeded

**Solution**: The component handles these gracefully and falls back to default state (expanded).

### Keyboard Shortcuts Not Working

**Issue**: Ctrl+B or Escape not working

**Possible Causes**:

1. Another component is preventing event propagation
2. Input field has focus and is capturing the event

**Solution**: Ensure keyboard events can bubble up to the window level.

## Related Components

- **AdminHeader**: Fixed header component (Task 2)
- **AdminSidebar**: Collapsible sidebar component (Task 3)
- **SidebarItem**: Individual navigation items (Task 4)
- **MobileSidebarBackdrop**: Backdrop overlay (Task 5)

## Testing

Comprehensive tests will be added in Task 11. Key test scenarios:

1. State management (collapse/expand, open/close)
2. Keyboard shortcuts (Ctrl+B, Escape)
3. LocalStorage persistence
4. Responsive breakpoint detection
5. Context provider functionality
6. Auto-close on desktop switch
