# CodePrince Brand Assets

## Logo Component

The `CodePrinceLogo` component provides a professional, scalable logo for the CodePrince brand.

### Usage

```tsx
import { CodePrinceLogo } from "@/components/brand";

// Default variant (icon + text)
<CodePrinceLogo size="md" />

// Responsive size (recommended for headers)
<CodePrinceLogo size="responsive" />

// Icon only
<CodePrinceLogo size="lg" variant="icon-only" />

// Text only
<CodePrinceLogo size="sm" variant="text-only" />

// Interactive logo (clickable)
<CodePrinceLogo 
  size="md" 
  interactive 
  onClick={() => navigate('/')} 
/>
```

### Props

- `size`: "sm" | "md" | "lg" | "xl" | "responsive" (default: "md")
- `variant`: "default" | "icon-only" | "text-only" (default: "default")
- `interactive`: boolean - Makes logo clickable with hover effects (default: false)
- `onClick`: () => void - Click handler (requires interactive: true)
- `className`: Additional CSS classes

### Sizes

- **sm**: 32x32px icon, small text (auto-upgraded to md for interactive elements)
- **md**: 48x48px icon, base text
- **lg**: 64x64px icon, large text
- **xl**: 96x96px icon, extra large text
- **responsive**: Scales from 32px → 64px based on screen size (mobile-first)

### Variants

- **default**: Shows icon + "CodePrince" text
- **icon-only**: Shows only the CP icon
- **text-only**: Shows only "CodePrince" text with gradient

## Favicon Generation

To generate favicon files:

1. Open `public/generate-favicons.html` in your browser
2. Click "Download All" to get all favicon sizes
3. Place the downloaded files in the `public/` directory

### Required Favicon Files

- `favicon-16x16.png` - Browser tab icon (small)
- `favicon-32x32.png` - Browser tab icon (standard)
- `apple-touch-icon.png` - iOS home screen icon (180x180)
- `android-chrome-192x192.png` - Android home screen icon
- `android-chrome-512x512.png` - Android splash screen
- `site.webmanifest` - PWA manifest (already created)

## Brand Colors

The logo uses the exact same gradient as your app's `bg-gradient-neural`:

- Vibrant Cyan: `#00D4FF` - hsl(191, 100%, 50%)
- Purple: `#9D4EDD` - hsl(270, 70%, 60%)
- Coral Accent: `#FF6B6B` - hsl(0, 100%, 70%)

This matches the gradient used in your Navigation logo and throughout the app's neural network theme.

## Design Notes

- The logo features a circular gradient background
- "CP" initials are rendered in white with a subtle gradient
- A small accent dot adds visual interest
- The design is modern, professional, and scalable
- Works well on both light and dark backgrounds
