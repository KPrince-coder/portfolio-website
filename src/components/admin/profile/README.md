# Profile Management Components

This folder contains all components related to profile management in the admin panel.

## Structure

```
admin/profile/
├── hooks/                    # Custom hooks
│   ├── useProfile.ts        # Profile data management hook
│   └── index.ts            # Hook exports
├── sections/                 # Section components
│   ├── PersonalInfoSection.tsx
│   ├── HeroSection.tsx
│   ├── AboutSection.tsx
│   ├── PhilosophySection.tsx
│   ├── SocialLinksSection.tsx
│   ├── ExperienceSection.tsx
│   ├── ImpactMetricsSection.tsx
│   ├── ResumeSection.tsx
│   └── index.ts            # Section exports
├── types.ts                 # TypeScript type definitions
├── index.ts                 # Main exports
├── ProfileManagement.tsx    # Main profile management component
└── README.md               # This file
```

## Components

### ProfileManagement

Main container component that orchestrates all profile sections using tabs.

**Features:**

- Tab-based navigation between sections
- Centralized profile data management
- Loading and error states

### Section Components

Each section handles a specific aspect of the profile:

- **PersonalInfoSection** - Basic personal information and avatar
- **HeroSection** - Hero section content (title, subtitle, tagline)
- **AboutSection** - About section with highlights
- **PhilosophySection** - Personal philosophy/mission statement
- **SocialLinksSection** - Social media and website links
- **ExperienceSection** - Professional experience timeline
- **ImpactMetricsSection** - Achievement metrics
- **ResumeSection** - Resume upload and management

## Types

All TypeScript interfaces are centralized in `types.ts`:

### Database Entities

- `Profile` - Main profile data structure
- `Experience` - Professional experience entry
- `ImpactMetric` - Achievement metric

### Form Data Types

- `ProfileFormData` - Profile update data
- `HeroFormData` - Hero section data
- `AboutFormData` - About section data
- `PhilosophyFormData` - Philosophy section data
- `ExperienceFormData` - Experience entry data
- `ImpactMetricFormData` - Impact metric data

### Component Props

- `ProfileManagementProps`
- `PersonalInfoSectionProps`
- `HeroSectionProps`
- `AboutSectionProps`
- `PhilosophySectionProps`
- `SocialLinksSectionProps`
- `ExperienceSectionProps`
- `ImpactMetricsSectionProps`
- `ResumeSectionProps`

## Hooks

### useProfile

Custom hook for managing profile data with Supabase.

**Returns:**

- `profile` - Current profile data
- `loading` - Loading state
- `error` - Error state
- `updateProfile` - Function to update profile
- `refetch` - Function to reload profile data

**Usage:**

```tsx
import { useProfile } from "./hooks/useProfile";

function MyComponent() {
  const { profile, loading, updateProfile } = useProfile();
  
  if (loading) return <div>Loading...</div>;
  
  return <div>{profile?.full_name}</div>;
}
```

## Usage

### Importing Components

```tsx
import { ProfileManagement } from "@/components/admin/profile";
```

### Importing Types

```tsx
import type { Profile, Experience } from "@/components/admin/profile";
```

### Importing Hooks

```tsx
import { useProfile } from "@/components/admin/profile";
```

## Data Flow

1. **ProfileManagement** uses `useProfile` hook to fetch profile data
2. Profile data is passed down to section components as props
3. Section components handle their own form state
4. Updates are sent back through callback props
5. `useProfile` hook handles the Supabase update

## Best Practices

1. **Type Safety** - Always use the centralized types from `types.ts`
2. **Prop Drilling** - Section components receive only the data they need
3. **Form State** - Each section manages its own form state
4. **Error Handling** - Use toast notifications for user feedback
5. **Loading States** - Show appropriate loading indicators during operations

## Related Documentation

- [Supabase Migrations](../../../../supabase/migrations/README.md)
- [Admin Components](../README.md)
- [UI Components](../../ui/README.md)
