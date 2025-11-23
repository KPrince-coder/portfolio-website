# Resume User ID Fix

## Issue

Error creating work experience (and other resume items):

```
null value in column "user_id" of relation "resume_work_experiences" violates not-null constraint
```

## Root Cause

The resume tables (`resume_work_experiences`, `resume_education`, `resume_certifications`) all have a `user_id` column that references `auth.users(id)` with a NOT NULL constraint.

When creating new records, the hooks were not including the `user_id` field, causing the database constraint violation.

## Solution

Updated all three resume hooks to get the current user's ID from Supabase auth and include it when creating new records.

## Files Modified

1. `src/components/admin/resume/hooks/useWorkExperiences.ts`
2. `src/components/admin/resume/hooks/useEducation.ts`
3. `src/components/admin/resume/hooks/useCertifications.ts`

## Changes Made

### Pattern Applied to All Three Hooks

**Before:**

```typescript
const createItem = async (data: FormData) => {
  try {
    const { data: newItem, error } = await db
      .from("table_name")
      .insert([data])  // ❌ Missing user_id
      .select()
      .single();
    // ...
  }
};
```

**After:**

```typescript
const createItem = async (data: FormData) => {
  try {
    // Get the current user's ID
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data: newItem, error } = await db
      .from("table_name")
      .insert([{ ...data, user_id: user.id }])  // ✅ Includes user_id
      .select()
      .single();
    // ...
  }
};
```

## Why This Was Needed

### Database Schema

The resume tables are designed to be multi-user, with each record belonging to a specific user:

```sql
CREATE TABLE public.resume_work_experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- other fields...
);
```

### RLS Policies

The Row Level Security policies filter data by `user_id`:

```sql
CREATE POLICY "Users can view own work experiences"
  ON public.resume_work_experiences FOR SELECT
  USING (auth.uid() = user_id);
```

## Comparison with Other Sections

### Skills Section

- Skills tables do NOT have `user_id`
- Skills are global/shared across the application
- No user-specific filtering needed

### Projects Section  

- Projects tables do NOT have `user_id`
- Projects are global/shared
- No user-specific filtering needed

### Resume Section

- Resume tables HAVE `user_id`
- Resume data is user-specific
- Each user has their own resume data
- Requires user authentication

## Testing Checklist

- [x] WorkExperience create includes user_id
- [x] Education create includes user_id
- [x] Certification create includes user_id
- [x] User authentication check added
- [x] Error handling for unauthenticated users
- [x] TypeScript compilation passes
- [x] No diagnostic errors

## Security Benefits

1. **Data Isolation**: Each user can only see/edit their own resume data
2. **Cascade Delete**: When a user is deleted, their resume data is automatically removed
3. **Authentication Required**: Cannot create resume items without being logged in
4. **RLS Protection**: Database-level security ensures data privacy

## Status

✅ **Fixed and verified**

All resume hooks now properly include `user_id` when creating new records, ensuring database constraints are satisfied and data is properly associated with the authenticated user.
