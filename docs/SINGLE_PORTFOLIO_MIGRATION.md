# Single Portfolio Model Migration

## Overview

Converted from multi-user portfolio system to single portfolio model where all authenticated admins manage the same portfolio data.

## Changes Made

### 1. Database Migration

**File:** `supabase/migrations/20241201000001_single_portfolio_model.sql`

- Updated RLS policies to allow any authenticated user to manage the profile
- Removed user-specific policies
- Added helper function `get_or_create_profile()` for easy profile access
- Prevents multiple profiles from being created

### 2. Code Updates

Removed `user_id` filters from all admin queries:

**Updated Files:**

- `src/components/admin/profile/ProfileManagement.tsx`
- `src/components/admin/skills/sections/SkillsHeaderSection.tsx`
- `src/components/admin/projects/sections/ProjectsHeaderSection.tsx`
- `src/components/admin/resume/sections/ResumeHeaderSection.tsx`
- `src/components/admin/messages/MessagesManagement.tsx`

**Changes:**

- Replaced `.eq("user_id", user.id)` with `.limit(1)`
- All queries now fetch the single shared profile
- Updates target the profile by `id` instead of `user_id`

## How It Works Now

### Before (Multi-User)

```typescript
// Each admin had their own profile
const { data } = await supabase
  .from("profiles")
  .select("*")
  .eq("user_id", user.id)  // ❌ User-specific
  .single();
```

### After (Single Portfolio)

```typescript
// All admins share one profile
const { data } = await supabase
  .from("profiles")
  .select("*")
  .limit(1)  // ✅ Get the single profile
  .maybeSingle();
```

## Benefits

1. **Simplified Logic** - No user_id tracking needed
2. **True Portfolio** - One portfolio, multiple admins can manage it
3. **No Confusion** - Public site always shows the same data
4. **Easier Collaboration** - Multiple people can help manage the portfolio
5. **No 406 Errors** - Queries work regardless of which admin is logged in

## Migration Steps

1. **Apply Database Migration:**

   ```bash
   npx supabase db push
   ```

2. **Verify:**
   - Log in to admin panel
   - Check that profile data loads correctly
   - Make an edit and verify it saves
   - Log in with a different admin account
   - Verify you see the SAME data

## Security

- **Public Access:** Anyone can READ the profile (for portfolio display)
- **Admin Access:** Any authenticated user can UPDATE the profile
- **Single Profile:** Only ONE profile can exist (enforced by policy)

## Notes

- The `user_id` field still exists in the database for backwards compatibility
- When creating a new profile, it uses the current user's ID
- All subsequent queries ignore `user_id` and just get the first/only profile
- This is perfect for a personal portfolio with multiple admin helpers

## Rollback

If you need to revert to multi-user model:

1. Restore the old RLS policies
2. Add back `.eq("user_id", user.id)` to all queries
3. Each admin will have their own separate profile again
