# CodePrince Brand Assets

## Logo Component

The `CodePrinceLogo` component provides a professional, scalable logo for the CodePrince brand.

### Usage

```tsx
import { CodePrinceLogo } from "@/components/brand";

// Default variant (icon + text)
<CodePrinceLogo size="md" />

// Icon only
<CodePrinceLogo size="lg" variant="icon-only" />

// Text only
<CodePrinceLogo size="sm" variant="text-only" />
```

### Props

- `size`: "sm" | "md" | "lg" | "xl" (default: "md")
- `variant`: "default" | "icon-only" | "text-only" (default: "default")
- `className`: Additional CSS classes

### Sizes

- **sm**: 32x32px icon, small text
- **md**: 48x48px icon, base text
- **lg**: 64x64px icon, large text
- **xl**: 96x96px icon, extra large text

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

The logo uses a neural network inspired gradient:

- Deep Navy: `#0A2540` (Primary)
- Vibrant Cyan: `#00D4FF` (Secondary)
- Coral Accent: `#FF6B6B` (Accent)

These colors match your app's cyberpunk theme and CSS variables.

## Design Notes

- The logo features a circular gradient background
- "CP" initials are rendered in white with a subtle gradient
- A small accent dot adds visual interest
- The design is modern, professional, and scalable
- Works well on both light and dark backgrounds
