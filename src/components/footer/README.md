# Footer Module

Complete CMS-managed footer system with modular architecture.

## Architecture

```
footer/
├── Footer.tsx                    # Main footer component
├── FooterSocialLinks.tsx         # Social media links
├── FooterLinks.tsx               # Custom navigation links
├── FooterCopyright.tsx           # Copyright and tagline
├── BackToTopButton.tsx           # Scroll to top button
├── hooks/
│   ├── useFooterSettings.ts      # Footer settings management
│   └── useSocialLinks.ts         # Social links from profiles
├── types.ts                      # TypeScript types
├── constants.ts                  # Default values and options
├── utils.ts                      # Utility functions
└── index.ts                      # Public API exports
```

## Features

- **CMS-Managed**: All content editable through admin interface
- **Social Links**: Automatically fetched from profiles table
- **Custom Links**: Add unlimited custom navigation links
- **Layout Options**: Left, center, right, or split layouts
- **Back to Top**: Optional smooth scroll button
- **Variable Replacement**: Dynamic copyright text with {year} and {company}
- **Type-Safe**: Full TypeScript support

## Usage

### Frontend

```tsx
import { Footer } from "@/components/footer";

function App() {
  return (
    <div>
      {/* Your content */}
      <Footer />
    </div>
  );
}
```

### Admin

```tsx
import { FooterManagement } from "@/components/admin/footer";

function AdminPanel() {
  return <FooterManagement />;
}
```

### Custom Hook Usage

```tsx
import { useFooterSettings, useSocialLinks } from "@/components/footer";

function CustomFooter() {
  const { settings, loading, saveSettings } = useFooterSettings();
  const { socialLinks } = useSocialLinks();

  // Your custom implementation
}
```

## Database Schema

Footer settings are stored in the `footer_settings` table:

- `copyright_text`: Copyright text with variable support
- `company_name`: Company name for variable replacement
- `tagline`: Optional tagline text
- `show_tagline`: Toggle tagline visibility
- `show_social_links`: Toggle social links visibility
- `links`: JSON array of custom links
- `layout`: Layout alignment (left/center/right/split)
- `show_back_to_top`: Toggle back to top button
- `background_style`: Background styling option

Social links are fetched from the `profiles` table:

- `email`
- `github_url`
- `linkedin_url`
- `twitter_url`
- `website_url`

## Components

### Footer

Main component that orchestrates all footer sections.

### FooterSocialLinks

Displays social media icons with links from profiles table.

### FooterLinks

Renders custom navigation links (filtered to show only active links).

### FooterCopyright

Shows copyright text with optional tagline.

### BackToTopButton

Smooth scroll to top button (conditionally rendered).

## Hooks

### useFooterSettings

Manages footer settings CRUD operations.

**Returns:**

- `settings`: Current footer settings
- `loading`: Loading state
- `saving`: Saving state
- `error`: Error message if any
- `updateSettings`: Update settings locally
- `saveSettings`: Save settings to database
- `addLink`: Add new custom link
- `removeLink`: Remove link by index
- `updateLink`: Update link field

### useSocialLinks

Fetches social media links from profiles table.

**Returns:**

- `socialLinks`: Social media URLs
- `loading`: Loading state

## Utilities

### formatCopyrightText

Replaces variables in copyright text:

- `{year}` → Current year
- `{company}` → Company name

### parseFooterLinks

Safely parses JSON links from database.

### getActiveLinks

Filters links to show only active ones.

## Best Practices

1. **Modular Components**: Each section is a separate component for reusability
2. **Type Safety**: Full TypeScript coverage with proper types
3. **Error Handling**: Graceful fallbacks for missing data
4. **Performance**: Optimized with proper memoization
5. **Accessibility**: ARIA labels and semantic HTML
6. **Responsive**: Mobile-first design approach

## Migration from Old Footer

The old Footer.tsx has been replaced with this modular system. All imports should work seamlessly:

```tsx
// Old way (still works)
import { Footer } from "@/components/Footer";

// New way (recommended)
import { Footer } from "@/components/footer";
```
