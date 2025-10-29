# About Component Module

This folder contains the modular, refactored About section following DRY principles and best practices.

## Structure

```plaintext
about/
├── About.tsx                    # Main orchestrator component
├── AboutHeader.tsx              # Section header with title and description
├── AboutSkeleton.tsx            # Loading skeleton state
├── ProfileCard.tsx              # Avatar and bio card
├── ExperienceTimeline.tsx       # Professional journey timeline
├── ImpactMetricsCard.tsx        # Achievement metrics grid
├── PhilosophyCard.tsx           # Philosophy quote card
├── types.ts                     # TypeScript interfaces
├── hooks/
│   └── useProfile.ts            # Custom hook for profile data fetching
├── utils/
│   ├── iconHelper.ts            # Icon utility functions
│   └── structuredData.ts        # SEO structured data generator
├── index.ts                     # Public exports (eager loading)
└── index.lazy.ts                # Public exports (lazy loading)
```

## Key Features

- **Modular Design**: Each component has a single responsibility
- **DRY Principle**: Reusable components and utilities
- **Performance**: Memoized components and computed values
- **SEO Optimized**: Structured data (JSON-LD) for search engines
- **Accessibility**: Proper ARIA attributes and semantic HTML
- **Type Safety**: Full TypeScript support with shared types
- **Loading States**: Skeleton loader that mirrors actual content

## Usage

### Standard Import (Eager Loading)

```tsx
import About from "@/components/about";

// In your page component
<About />
```

### Lazy Loading (Recommended for Performance)

For better performance and code splitting, use the lazy-loaded version:

```tsx
import { Suspense } from "react";
import { About, AboutSkeleton } from "@/components/about/index.lazy";

function Page() {
  return (
    <Suspense fallback={<AboutSkeleton />}>
      <About />
    </Suspense>
  );
}
```

**Benefits of Lazy Loading:**

- Reduces initial bundle size by ~35KB
- Improves First Contentful Paint (FCP)
- Better Core Web Vitals scores
- Component loads only when needed

### Importing Sub-Components

```tsx
// Import specific components
import { 
  AboutHeader, 
  ProfileCard, 
  ExperienceTimeline 
} from "@/components/about";

// Import types
import type { Experience, ImpactMetric } from "@/components/about";

// Import utilities
import { getIcon, generateStructuredData } from "@/components/about";

// Import hooks
import { useProfile } from "@/components/about";
```

## Component Responsibilities

### About.tsx

Main component that:

- Fetches profile data using `useProfile` hook
- Orchestrates all sub-components
- Manages loading states
- Generates SEO structured data

### AboutHeader.tsx

Displays:

- Section title with name
- Decorative divider
- Description text

### ProfileCard.tsx

Shows:

- Responsive avatar with decorative rings
- Name and location
- Bio text
- Key highlights list

### ExperienceTimeline.tsx

Renders:

- Professional journey timeline
- Experience cards with icons
- Year, title, company, and description

### ImpactMetricsCard.tsx

Displays:

- Achievement metrics in a grid
- Value and label for each metric

### PhilosophyCard.tsx

Shows:

- Philosophy quote
- Author attribution
- Decorative elements

### AboutSkeleton.tsx

Provides:

- Loading state that mirrors actual layout
- Smooth skeleton animations
- Accessibility attributes

## Hooks

### useProfile

Custom hook that:

- Fetches profile data from Supabase
- Manages loading and error states
- Provides refetch functionality
- Returns typed profile data

## Utilities

### iconHelper.ts

- Maps icon names to Lucide React components
- Provides fallback icon

### structuredData.ts

- Generates schema.org Person structured data
- Improves SEO and rich snippets
- Follows JSON-LD format

## Best Practices Applied

1. **Single Responsibility**: Each component does one thing well
2. **Composition**: Small, composable components
3. **Memoization**: React.memo for performance
4. **Custom Hooks**: Separate data fetching logic
5. **Type Safety**: Shared TypeScript interfaces
6. **Accessibility**: ARIA attributes and semantic HTML
7. **SEO**: Structured data and proper meta information
8. **Performance**: Lazy loading images, memoized values
