# Resume Component

Professional resume section displaying work experience, education, and certifications with data fetched from the database.

## Features

- **Dynamic Data Loading**: Fetches resume data from Supabase
- **SEO Optimized**: Semantic HTML with proper heading hierarchy and ARIA labels
- **Performance Optimized**:
  - Skeleton loading states
  - Parallel data fetching
  - Minimal re-renders
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliant
- **Type Safe**: Full TypeScript support

## Structure

```
resume/
├── hooks/
│   └── useResumeData.ts       # Custom hook for data fetching
├── Resume.tsx                  # Main component
├── ResumeSkeleton.tsx          # Loading skeleton
├── types.ts                    # TypeScript definitions
├── utils.ts                    # Utility functions
├── index.ts                    # Barrel export
└── README.md                   # This file
```

## Usage

```tsx
import { Resume } from "@/components/resume";

function Page() {
  return <Resume />;
}
```

## Data Flow

1. Component mounts → `useResumeData` hook fetches data
2. Shows `ResumeSkeleton` while loading
3. Displays resume data when loaded
4. Shows error message if fetch fails

## SEO Features

- Semantic HTML5 elements (`<section>`, `<article>`, `<time>`)
- Proper heading hierarchy (h2, h3)
- ARIA labels for icons
- Structured data ready
- External links with `rel="noopener noreferrer"`

## Performance Optimizations

- Parallel API calls using `Promise.all()`
- Minimum 300ms skeleton display for smooth UX
- Only visible items fetched (`is_visible = true`)
- Memoized utility functions
- Optimized re-renders

## Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Screen reader friendly
- Color contrast compliance
- Focus indicators

## Database Tables

- `resume_work_experiences` - Work history
- `resume_education` - Academic background
- `resume_certifications` - Professional credentials
- `profiles` - Resume metadata and stats

## Utility Functions

### `formatPeriod(startDate, endDate, isCurrent)`

Formats date range for work experience (e.g., "Jan 2022 - Present")

### `formatEducationPeriod(startDate, endDate)`

Formats education period showing years only (e.g., "2017 - 2021")

### `formatCertificationDate(date)`

Formats certification dates (e.g., "Jan 2023")

### `isCertificationExpired(expiryDate, doesNotExpire)`

Checks if a certification has expired

## Customization

The component respects the following database settings:

- `show_resume_stats` - Toggle quick stats visibility
- `resume_title` - Custom section title
- `resume_description` - Custom section description
- `resume_url` - PDF download link
- `is_visible` - Show/hide individual items

## Error Handling

- Graceful error display
- Console logging for debugging
- Fallback UI for missing data
- Network error recovery

## Future Enhancements

- [ ] Add filtering by category
- [ ] Add search functionality
- [ ] Add print stylesheet
- [ ] Add JSON-LD structured data
- [ ] Add timeline visualization
- [ ] Add export to different formats
