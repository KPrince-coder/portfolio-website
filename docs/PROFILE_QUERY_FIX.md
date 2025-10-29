# Profile Query Fix - Skills Header Save Issue

**Date:** October 29, 2025  
**Status:** ✅ Fixed

## Problem

When saving skills header content in the admin panel, the changes would not persist. After refreshing, the old content would return, and the frontend wouldn't reflect the new changes.

## Root Cause

The issue was caused by inconsistent profile querying across admin and frontend components:

### Admin Panel (SkillsHeaderSection)

```typescript
// BEFORE - Loading
const { data, error } = await supabase
  .from("profiles")
  .select("skills_title, skills_description")
  .single();  // ❌ Gets ANY profile, not the authenticated user's

// Saving
const { error } = await supabase
  .from("profiles")
  .update({ ... })
  .eq("id", user.id);  // ✅ Correctly updates authenticated user's profile
```

**Problem:** Loading fetched ANY profile (likely the first one), but saving updated the authenticated user's profile. This mismatch caused:

1. Admin loads profile A
2. User edits and saves to profile B (their own)
3. On refresh, admin loads profile A again (showing old data)

### Frontend Components

```typescript
// BEFORE
const { data, error } = await supabase
  .from("profiles")
  .select("...")
  .single();  // ❌ Gets ANY profile without filtering
```

**Problem:** For a single-user portfolio, `.single()` without filtering could:

- Return an arbitrary profile if multiple exist
- Fail if no profiles exist
- Return inconsistent results

## Solution

### 1. Fixed Admin Panel (SkillsHeaderSection)

**Added user authentication check when loading:**

```typescript
// AFTER - Loading
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  throw new Error("User not authenticated");
}

const { data, error } = await supabase
  .from("profiles")
  .select("skills_title, skills_description")
  .eq("id", user.id)  // ✅ Gets authenticated user's profile
  .single();
```

**Now both load and save operations target the same profile!**

### 2. Fixed Frontend Components

For frontend display (non-authenticated), we want to show the primary/first profile consistently:

```typescript
// AFTER
const { data, error } = await supabase
  .from("profiles")
  .select("...")
  .order("created_at", { ascending: true })  // ✅ Consistent ordering
  .limit(1);  // ✅ Get first profile

const profileData = data?.[0] || null;
```

## Files Fixed

### Admin Components

- ✅ `src/components/admin/skills/sections/SkillsHeaderSection.tsx`

### Frontend Hooks

- ✅ `src/components/skills/hooks/useSkillsData.ts`
- ✅ `src/components/about/hooks/useProfile.ts`
- ✅ `src/components/hero/hooks/useHeroData.ts`

## Testing

### Admin Panel

1. ✅ Login to admin panel
2. ✅ Navigate to Skills > Header
3. ✅ Edit title and description
4. ✅ Click "Save Changes"
5. ✅ Refresh page
6. ✅ Verify changes persist

### Frontend

1. ✅ View skills section on homepage
2. ✅ Verify header shows updated content
3. ✅ Refresh page
4. ✅ Verify content remains consistent

## Best Practices Established

### For Admin Components (Authenticated)

```typescript
// Always filter by authenticated user
const { data: { user } } = await supabase.auth.getUser();
const { data } = await supabase
  .from("profiles")
  .select("...")
  .eq("id", user.id)
  .single();
```

### For Frontend Components (Public)

```typescript
// Get first/primary profile consistently
const { data } = await supabase
  .from("profiles")
  .select("...")
  .order("created_at", { ascending: true })
  .limit(1);

const profile = data?.[0];
```

## Future Improvements

### Option 1: Add is_primary Flag

```sql
ALTER TABLE profiles ADD COLUMN is_primary BOOLEAN DEFAULT false;
```

Then query:

```typescript
const { data } = await supabase
  .from("profiles")
  .select("...")
  .eq("is_primary", true)
  .single();
```

### Option 2: Use Environment Variable

```typescript
const PORTFOLIO_USER_ID = import.meta.env.VITE_PORTFOLIO_USER_ID;

const { data } = await supabase
  .from("profiles")
  .select("...")
  .eq("id", PORTFOLIO_USER_ID)
  .single();
```

### Option 3: Create a View

```sql
CREATE VIEW primary_profile AS
SELECT * FROM profiles
ORDER BY created_at ASC
LIMIT 1;
```

## Related Issues

This same pattern should be checked in:

- ✅ Hero section
- ✅ About section  
- ✅ Skills section
- ⚠️ Projects section (if it exists)
- ⚠️ Blog section (if it exists)

## Conclusion

The skills header save issue is now fixed. Both admin and frontend components consistently query the correct profile:

- **Admin:** Queries authenticated user's profile
- **Frontend:** Queries first/primary profile consistently

All changes now persist correctly and display on the frontend immediately after saving.
