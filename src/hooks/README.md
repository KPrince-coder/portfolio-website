# Custom Hooks

This folder contains reusable custom React hooks for common functionality across the application.

## Available Hooks

### useActiveSection

**File:** `useActiveSection.ts`

Tracks which section is currently visible in the viewport using the Intersection Observer API.

**Usage:**

```tsx
import { useActiveSection } from "@/hooks/useActiveSection";

const activeSection = useActiveSection(['about', 'skills', 'projects']);
// Returns: 'about' | 'skills' | 'projects' | ''
```

**Parameters:**

- `sectionIds: string[]` - Array of section IDs to track
- `options?: IntersectionObserverInit` - Optional Intersection Observer options

**Returns:**

- `string` - The ID of the currently active/visible section

**Features:**

- Efficient scroll tracking with Intersection Observer
- Configurable viewport thresholds
- Automatically handles cleanup
- Returns the section with highest intersection ratio

**Default Options:**

- `rootMargin: "-20% 0px -35% 0px"` - Triggers when section is in middle of viewport
- `threshold: [0, 0.25, 0.5, 0.75, 1]` - Multiple intersection points for accuracy

---

### useScrollProgress

**File:** `useScrollProgress.ts`

Tracks the user's scroll progress through the page as a percentage.

**Usage:**

```tsx
import { useScrollProgress } from "@/hooks/useScrollProgress";

const scrollProgress = useScrollProgress();
// Returns: 0-100 (percentage)
```

**Returns:**

- `number` - Scroll progress as a percentage (0-100)

**Features:**

- Calculates total scrollable height
- Returns clamped value between 0-100
- Passive event listener for better performance
- Useful for progress bars and scroll indicators

**Use Cases:**

- Progress bars in navigation
- Reading progress indicators
- Scroll-based animations
- "Back to top" button visibility

---

### useProfile

**File:** `useProfile.ts`

Fetches and manages profile data from Supabase. Shared hook used across Hero, About, and other components.

**Usage:**

```tsx
import { useProfile } from "@/hooks/useProfile";

// Fetch all fields
const { profile, loading, error, refetch } = useProfile();

// Fetch specific fields only
const { profile, loading } = useProfile([
  'full_name',
  'hero_title',
  'avatar_url'
]);
```

**Parameters:**

- `fields?: (keyof ProfileData)[]` - Optional array of specific fields to fetch

**Returns:**

```tsx
{
  profile: ProfileData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

**Features:**

- Fetches from Supabase `profiles` table
- Optional field selection for performance
- Error handling and loading states
- Refetch functionality
- Fully typed with TypeScript

**Profile Data Fields:**

- Personal: `full_name`, `bio`, `avatar_url`, `location`
- Hero: `hero_title`, `hero_subtitle`, `hero_tagline`
- About: `about_title`, `about_description`, `about_highlights`
- Extended: `experiences`, `impact_metrics`, `philosophy_quote`, `philosophy_author`
- Social: `website_url`, `github_url`, `linkedin_url`, `twitter_url`, `email`, `phone`
- Resume: `resume_url`, `resume_file_name`, `resume_updated_at`

---

## Best Practices

### Performance

- All hooks use proper cleanup in `useEffect`
- Event listeners use `passive: true` where applicable
- Memoization with `useCallback` for stable references

### Type Safety

- Full TypeScript support
- Exported interfaces for all data types
- Proper return type definitions

### Accessibility

- Hooks support ARIA attributes
- Progress indicators include proper roles
- Section tracking respects user preferences

### Reusability

- Hooks are component-agnostic
- Configurable options for flexibility
- Clear, documented APIs

## Creating New Hooks

When creating new custom hooks:

1. **Name with `use` prefix** - Follow React conventions
2. **Add TypeScript types** - Define parameter and return types
3. **Document thoroughly** - Include JSDoc comments
4. **Handle cleanup** - Return cleanup functions from `useEffect`
5. **Export from index** - Add to hooks index file if needed
6. **Update this README** - Document the new hook

## Example: Creating a New Hook

```tsx
import { useState, useEffect } from "react";

/**
 * Custom hook description
 * 
 * @param param1 - Description of parameter
 * @returns Description of return value
 */
export const useCustomHook = (param1: string) => {
  const [state, setState] = useState<string>("");

  useEffect(() => {
    // Hook logic here
    
    // Cleanup function
    return () => {
      // Cleanup logic
    };
  }, [param1]);

  return state;
};
```

## Testing Hooks

Hooks can be tested using `@testing-library/react-hooks`:

```tsx
import { renderHook } from '@testing-library/react-hooks';
import { useActiveSection } from './useActiveSection';

test('should track active section', () => {
  const { result } = renderHook(() => 
    useActiveSection(['about', 'skills'])
  );
  
  expect(result.current).toBe('');
});
```
