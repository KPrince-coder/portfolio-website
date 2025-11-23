# Hero Component Module

This folder contains the modular, refactored Hero section following DRY principles and best practices.

## Structure

```
hero/
├── Hero.tsx                     # Main orchestrator component
├── HeroBackground.tsx           # Background image and animated elements
├── HeroSkeleton.tsx             # Loading skeleton state
├── SocialLinks.tsx              # Social media icon links
├── ScrollIndicator.tsx          # Animated scroll indicator
├── types.ts                     # TypeScript interfaces
├── hooks/
│   ├── useHeroData.ts           # Custom hook for hero data fetching
│   └── useTypewriter.ts         # Custom hook for typewriter effect
└── index.ts                     # Public exports
```

## Key Features

- **Modular Design**: Each component has a single responsibility
- **DRY Principle**: Reusable components and utilities
- **Performance**: Memoized components and custom hooks
- **Dynamic Content**: All content fetched from backend (Supabase)
- **Accessibility**: Proper ARIA attributes and semantic HTML
- **Type Safety**: Full TypeScript support with shared types
- **Loading States**: Skeleton loader that mirrors actual content
- **Animations**: Smooth typewriter effect and floating background elements

## Usage

```tsx
import Hero from "@/components/hero";

// In your page component
<Hero />
```

## Component Responsibilities

### Hero.tsx

Main component that:

- Fetches hero data using `useHeroData` hook
- Orchestrates all sub-components
- Manages loading states and animations
- Implements typewriter effect for subtitle

### HeroBackground.tsx

Renders:

- Background image with overlay
- Animated floating gradient elements
- Backdrop blur effect

### SocialLinks.tsx

Displays:

- GitHub, LinkedIn, Twitter, Website, Email links
- Only shows links that have URLs configured
- Icon buttons with hover effects
- Opens links in new tabs with proper security

### ScrollIndicator.tsx

Shows:

- Animated scroll indicator at bottom
- Mouse scroll animation
- "Scroll" text label

### HeroSkeleton.tsx

Provides:

- Loading state that mirrors actual layout
- Smooth skeleton animations
- Accessibility attributes

## Hooks

### useHeroData

Custom hook that:

- Fetches hero data from Supabase profiles table
- Manages loading and error states
- Provides refetch functionality
- Returns typed hero data

Fields fetched:

- `full_name` - Person's full name
- `hero_title` - Main hero title
- `hero_subtitle` - Subtitle with role/tagline
- `hero_tagline` - Longer description text
- `avatar_url` - Profile image URL
- `github_url` - GitHub profile link
- `linkedin_url` - LinkedIn profile link
- `email` - Email address
- `website_url` - Personal website link
- `twitter_url` - Twitter profile link

### useTypewriter

Custom hook that:

- Creates typewriter animation effect
- Configurable typing speed and delay
- Returns displayed text and completion status
- Automatically handles cleanup

Parameters:

- `text` - The text to type out
- `speed` - Typing speed in ms (default: 80)
- `delay` - Initial delay before typing (default: 1000)

## Database Schema

The hero section uses the following fields from the `profiles` table:

```sql
-- Hero Section Fields
hero_title TEXT,        -- Main title (e.g., "Alex Neural")
hero_subtitle TEXT,     -- Subtitle/role (e.g., "Data & AI Engineer")
hero_tagline TEXT,      -- Additional description/tagline

-- Personal Information
full_name TEXT,         -- Full name (fallback for hero_title)
avatar_url TEXT,        -- Profile image URL

-- Social Links
github_url TEXT,
linkedin_url TEXT,
twitter_url TEXT,
website_url TEXT,
email TEXT
```

## Best Practices Applied

1. **Single Responsibility**: Each component does one thing well
2. **Composition**: Small, composable components
3. **Memoization**: React.memo for performance
4. **Custom Hooks**: Separate data fetching and animation logic
5. **Type Safety**: Shared TypeScript interfaces
6. **Accessibility**: ARIA attributes and semantic HTML
7. **Performance**: Lazy animations, memoized values
8. **Fallbacks**: Graceful degradation with default values
9. **Security**: Proper rel attributes for external links

## Customization

### Changing Typewriter Speed

```tsx
// In useTypewriter hook call
const { displayedText } = useTypewriter(heroSubtitle, 100, 500);
// speed: 100ms, delay: 500ms
```

### Adding More Social Links

Edit `SocialLinks.tsx` and add to the links array:

```tsx
{
  icon: YourIcon,
  url: yourUrl,
  label: "Your Label",
}
```

### Modifying Background Animation

Edit `HeroBackground.tsx` to change:

- Number of floating elements
- Animation duration
- Colors and gradients
- Positioning
