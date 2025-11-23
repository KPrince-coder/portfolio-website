# Brand Identity System Setup Guide

## Overview

The Brand Identity system allows you to manage your portfolio's logo, colors, and SEO settings from the admin panel. This keeps branding separate from profile data while maintaining consistency across the site.

## What's Included

### Database

- **brand_identity table**: Stores logo, icon, colors, and SEO settings
- **Default values**: Matches current "DataFlow" branding with Brain icon

### Admin Interface

- **Brand Management**: New tab in admin panel
- **Logo Configuration**: Change logo text, icon, and color
- **Color Scheme**: Manage primary, secondary, accent, and email colors
- **SEO Settings**: Meta title, description, keywords, and favicon
- **Live Preview**: See changes before saving

### Integration

- **Navigation**: Logo dynamically loads from brand_identity
- **Email Templates**: Use brand colors and footer text
- **Profiles**: Contact info and social links remain in profiles table (no duplication)

## Setup Instructions

### 1. Run the Migration

```bash
# Apply the brand_identity migration
supabase db push
```

This will:

- Create the `brand_identity` table
- Insert default branding (DataFlow, Brain icon, #667eea colors)
- Set up RLS policies for public access

### 2. Regenerate Supabase Types

```bash
# Generate TypeScript types
npm run types
```

This updates the Supabase client types to include the new `brand_identity` table.

### 3. Access Brand Management

1. Log into admin panel: `/admin`
2. Click on the **Brand** tab in the sidebar
3. Customize your branding:
   - Logo text and icon
   - Color scheme
   - SEO settings
4. Click **Save Changes**

## Data Structure

### Brand Identity Table

```sql
CREATE TABLE brand_identity (
  id UUID PRIMARY KEY,
  
  -- Logo & Icon
  logo_text TEXT NOT NULL DEFAULT 'DataFlow',
  logo_icon TEXT NOT NULL DEFAULT 'Brain',
  logo_icon_color TEXT DEFAULT '#667eea',
  
  -- Colors
  primary_color TEXT DEFAULT '#667eea',
  secondary_color TEXT DEFAULT '#764ba2',
  accent_color TEXT DEFAULT '#10b981',
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  favicon_url TEXT,
  
  -- Email Branding
  email_header_color TEXT DEFAULT '#667eea',
  email_footer_text TEXT DEFAULT 'Thank you for your interest',
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### What's NOT in Brand Identity

These fields remain in the `profiles` table:

- `email` - Contact email
- `phone` - Contact phone
- `website_url` - Personal website
- `github_url` - GitHub profile
- `linkedin_url` - LinkedIn profile
- `twitter_url` - Twitter profile
- `hero_title` - Portfolio name/title
- `hero_subtitle` - Professional tagline

## Key Features

### 1. Logo Management

- Choose from 1000+ Lucide icons
- Customize icon color
- Set logo text (displayed in navigation)

### 2. Color Scheme

- Primary color: Main brand color
- Secondary color: Gradients and accents
- Accent color: CTAs and highlights
- Email header color: Email template branding

### 3. SEO Settings

- Meta title and description
- Keywords (comma-separated)
- Favicon URL

### 4. Live Preview

- See logo in navigation
- Preview email template styling
- View color palette

## Usage in Code

### Frontend (React)

```typescript
import { usePublicBrandIdentity } from "@/hooks/useBrandIdentity";

function MyComponent() {
  const { brandIdentity, loading } = usePublicBrandIdentity();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div style={{ color: brandIdentity?.primary_color }}>
      {brandIdentity?.logo_text}
    </div>
  );
}
```

### Admin Panel

```typescript
import { useBrandIdentity } from "@/hooks/useBrandIdentity";

function AdminComponent() {
  const { brandIdentity, updateBrandIdentity } = useBrandIdentity();
  
  const handleSave = async () => {
    await updateBrandIdentity({
      logo_text: "New Name",
      primary_color: "#ff0000",
    });
  };
}
```

### Email Configuration

```typescript
import { getEmailConfigWithBrand } from "@/config/email.config";

const config = await getEmailConfigWithBrand();
// config.companyName - from brand_identity.logo_text
// config.companyEmail - from profiles.email
// config.footerText - from brand_identity.email_footer_text
```

## Migration Details

### File Location

`supabase/migrations/20241107000001_brand_identity.sql`

### What It Does

1. Creates `brand_identity` table
2. Inserts default branding matching current site
3. Sets up RLS policies (public read, authenticated write)
4. Creates helper function `get_active_brand_identity()`
5. Ensures only one active brand identity at a time

### Default Values

- Logo: "DataFlow" with Brain icon (#667eea)
- Colors: Purple gradient (#667eea → #764ba2) with green accent (#10b981)
- Email: Purple header with "Thank you for your interest" footer

## Troubleshooting

### TypeScript Errors

If you see "brand_identity does not exist" errors:

```bash
npm run types
```

### No Brand Identity Found

The migration creates a default entry. If missing:

1. Check migration ran successfully: `supabase db push`
2. Verify in database: `SELECT * FROM brand_identity;`
3. The hook will auto-create if missing

### Changes Not Appearing

1. Hard refresh browser (Ctrl+Shift+R)
2. Check browser console for errors
3. Verify RLS policies allow public read access

## Future Enhancements

Potential additions:

- Multiple brand themes (light/dark mode)
- Brand presets/templates
- Logo image upload (currently icon-based)
- Custom font selection
- Advanced gradient controls

## Notes

- Only one active brand identity allowed at a time
- Changes are immediate (no caching)
- Public users can read active brand identity
- Admin users can create/update brand identities
- Contact info stays in profiles to avoid duplication
- Email templates pull from both brand_identity and profiles
