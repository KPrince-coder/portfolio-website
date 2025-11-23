# OG Image - Brand Identity Integration

## Overview

The OG image system now automatically integrates with Brand Identity settings, eliminating duplicate data entry and ensuring consistent branding.

## How It Works

### Automatic Logo Integration

1. **Enable Logo**: Toggle "Show logo" in OG Image settings
2. **Auto-Fetch**: System automatically fetches `logo_text` from `brand_identity` table
3. **Display**: Logo appears in generated OG images
4. **Sync**: Updates automatically when brand identity changes

### Data Flow

```
brand_identity.logo_text → OG Image → Generated Image
```

### Override Option

You can still override the logo text in OG Image settings if needed:

- Leave `logo_text` empty → Uses brand identity logo
- Set custom `logo_text` → Uses custom value

## Implementation Details

### Edge Function

```typescript
// Fetch brand identity if logo is enabled and no custom logo text
if (settings.show_logo && !settings.logo_text) {
  const { data: brand } = await supabase
    .from("brand_identity")
    .select("logo_text, logo_icon")
    .eq("is_active", true)
    .single();

  if (brand?.logo_text) {
    settings.logo_text = brand.logo_text;
  }
}
```

### Admin Interface

- Shows current brand logo being used
- Alert displays: "Using logo from Brand Identity: [Logo Text]"
- Input field for optional override
- Helpful placeholder text
- Clear instructions

## Benefits

### Single Source of Truth

- ✅ Brand logo defined once in Brand Identity
- ✅ Automatically used in OG images
- ✅ No duplicate data entry
- ✅ Consistent across portfolio

### Automatic Updates

- ✅ Change brand logo once
- ✅ OG images update automatically
- ✅ No manual sync needed
- ✅ Always consistent

### Flexibility

- ✅ Can override when needed
- ✅ Clear indication of source
- ✅ Easy to manage
- ✅ Fallback to custom text

## Usage Examples

### Example 1: Using Brand Logo

```
Brand Identity:
  logo_text: "DataFlow"
  
OG Image Settings:
  show_logo: true
  logo_text: NULL
  
Result: OG image displays "DataFlow"
```

### Example 2: Custom Override

```
Brand Identity:
  logo_text: "DataFlow"
  
OG Image Settings:
  show_logo: true
  logo_text: "Custom Portfolio"
  
Result: OG image displays "Custom Portfolio"
```

### Example 3: Logo Disabled

```
Brand Identity:
  logo_text: "DataFlow"
  
OG Image Settings:
  show_logo: false
  logo_text: NULL
  
Result: OG image displays no logo
```

## Admin Interface

### Visual Indicators

When logo is enabled, the admin shows:

```
✓ Show logo

ℹ️ Using logo from Brand Identity: DataFlow

Logo Text Override (optional)
[                                    ]
Leave empty to automatically use logo from Brand Identity settings
```

### User Experience

1. Toggle "Show logo" on
2. See current brand logo in alert
3. Optionally override with custom text
4. Preview updates in real-time
5. Save changes

## Database Schema

### brand_identity Table

```sql
logo_text TEXT  -- Source of truth for logo
logo_icon TEXT  -- Icon name (future use)
```

### og_image_settings Table

```sql
show_logo BOOLEAN      -- Enable/disable logo
logo_text TEXT         -- Optional override (NULL = use brand)
```

## Migration Changes

### Default Value

```sql
logo_text NULL  -- Will use brand_identity.logo_text automatically
```

Previously hardcoded "DataFlow", now uses brand identity automatically.

## Testing

### Test Cases

1. **Brand logo only**
   - Set brand logo in Brand Identity
   - Leave OG logo text empty
   - Verify OG image shows brand logo

2. **Custom override**
   - Set brand logo in Brand Identity
   - Set custom text in OG settings
   - Verify OG image shows custom text

3. **Logo disabled**
   - Disable show_logo
   - Verify OG image has no logo

4. **Brand update**
   - Change brand logo
   - Verify OG image updates automatically

## Best Practices

1. **Use Brand Identity**: Let OG images use brand logo automatically
2. **Override Sparingly**: Only override for special cases
3. **Keep Consistent**: Maintain brand consistency across portfolio
4. **Test Changes**: Preview OG images after brand updates

## Troubleshooting

### Logo Not Showing

1. Check Brand Identity has `logo_text` set
2. Verify `show_logo` is enabled in OG settings
3. Ensure `logo_text` is NULL in OG settings (not empty string)
4. Check Edge Function logs

### Wrong Logo Showing

1. Check if custom override is set in OG settings
2. Clear `logo_text` field to use brand logo
3. Refresh preview

### Logo Not Updating

1. Verify brand identity is marked as active
2. Check Edge Function is fetching latest data
3. Clear cache and regenerate image

## Future Enhancements

- [ ] Use `logo_icon` for icon display
- [ ] Support multiple brand identities
- [ ] Logo color from brand settings
- [ ] Logo size customization
- [ ] Logo position options

## Related Documentation

- [OG Image System Guide](./OG_IMAGE_SYSTEM_GUIDE.md)
- [Brand Identity Documentation](./BRAND_IDENTITY.md)
- [OG Image Complete](./OG_IMAGE_COMPLETE.md)

---

**Status**: ✅ Implemented
**Version**: 1.1.0
**Date**: 2024-11-08
