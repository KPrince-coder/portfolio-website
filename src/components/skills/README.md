# Skills Component

A modular, data-driven skills showcase component with backend integration.

## Structure

```
skills/
├── Skills.tsx                 # Main component orchestrating all parts
├── SkillsHeader.tsx          # Section title and description
├── CategoryFilter.tsx        # Category filter buttons
├── SkillCard.tsx             # Individual skill card
├── SkillsGrid.tsx            # Grid layout for skills
├── LearningGoalsCard.tsx     # Learning goals display
├── SkillsSkeleton.tsx        # Loading skeleton
├── types.ts                  # TypeScript interfaces
├── hooks/
│   └── useSkillsData.ts      # Data fetching hook
├── index.ts                  # Barrel exports
└── README.md                 # This file
```

## Components

### Skills (Main)

The orchestrator component that brings everything together.

- Manages active category state
- Filters skills based on category
- Handles loading states
- Composes all sub-components

### SkillsHeader

Displays the section title and description from the database.

- Customizable via admin panel
- Falls back to defaults

### CategoryFilter

Interactive category filter buttons.

- Dynamic icon rendering
- Active state styling
- Neural glow effects

### SkillCard

Individual skill display with:

- Icon and name
- Proficiency percentage
- Description
- Animated proficiency bar
- Neural network visualization

### SkillsGrid

Responsive grid layout for skill cards.

- 1 column on mobile
- 2 columns on tablet
- 3 columns on desktop

### LearningGoalsCard

Displays active learning goals with:

- Status indicators (learning, exploring, researching)
- Color-coded labels
- Animated pulse effects
- Only shows if goals exist

### SkillsSkeleton

Professional loading state matching the actual layout.

## Data Flow

1. `useSkillsData` hook fetches data from Supabase:
   - Profile skills metadata (title, description)
   - Skill categories
   - Skills with category info
   - Active learning goals

2. Data is passed down through props to child components

3. Category filtering happens in the main component using `useMemo`

## Usage

```tsx
import Skills from "@/components/skills";

function HomePage() {
  return (
    <div>
      <Skills />
    </div>
  );
}
```

## Features

- ✅ Backend integration with Supabase
- ✅ Skeleton loading states
- ✅ Dynamic icon rendering (300+ icons)
- ✅ Category filtering
- ✅ Responsive design
- ✅ Smooth animations
- ✅ Learning goals integration
- ✅ Modular architecture
- ✅ TypeScript support
- ✅ DRY principles

## Customization

All content is customizable via the admin panel:

- Section title and description
- Categories (name, label, icon, order)
- Skills (name, proficiency, description, icon, color, category)
- Learning goals (title, status, color)

## Best Practices

- Each component has a single responsibility
- Reusable components with clear props
- Type-safe with TypeScript
- Efficient rendering with useMemo
- Proper loading states
- Error handling in data fetching
- Clean separation of concerns
