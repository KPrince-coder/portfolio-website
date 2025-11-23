# Auto-Save 409 Conflict Fix

**Issue:** Auto-save was creating duplicate posts with the same slug, causing 409 Conflict errors.

**Date:** November 1, 2025  
**Status:** ✅ FIXED

---

## Problem Analysis

### Error Message

```
POST https://...supabase.co/rest/v1/blog_posts?select=* 409 (Conflict)
Auto-save failed: Error: Failed to create post: Unknown error
```

### Root Causes

1. **Duplicate Slug Generation**
   - `generateSlug()` created the same slug for the same title
   - No uniqueness check before inserting
   - Database constraint rejected duplicate slugs

2. **Multiple Create Attempts**
   - Auto-save ran every 30 seconds
   - Each time it tried to CREATE a new post
   - Should have been UPDATE after first create
   - `postId` wasn't being tracked after creation

3. **State Management Issue**
   - `postId` was passed as prop but never updated
   - After creating post, subsequent saves still thought `postId` was undefined
   - Caused infinite loop of create attempts

---

## Solutions Implemented

### 1. **Unique Slug Generation** ✅

**File:** `src/services/blogService.ts`

**Before:**

```typescript
const slug = generateSlug(input.title);
// No uniqueness check
```

**After:**

```typescript
let slug = generateSlug(input.title);

// Check if slug exists and make it unique
const { data: existingPost } = await supabase
  .from("blog_posts")
  .select("slug")
  .eq("slug", slug)
  .single();

if (existingPost) {
  // Add timestamp to make slug unique
  slug = `${slug}-${Date.now()}`;
}
```

**Result:** Each post gets a unique slug, even with same title.

### 2. **Post ID State Management** ✅

**File:** `src/components/admin/blog/hooks/usePostForm.ts`

**Before:**

```typescript
const { postId } = options; // Prop, never updated

if (postId) {
  await updatePost({ ...postData, id: postId });
} else {
  const newPost = await createPost(postData);
  // postId still undefined!
}
```

**After:**

```typescript
const [postId, setPostId] = useState<string | undefined>(initialPostId);

if (postId) {
  await updatePost({ ...postData, id: postId });
} else {
  const newPost = await createPost(postData);
  setPostId(newPost.id); // ✅ Update state!
  window.history.replaceState(null, "", `/admin/blog/${newPost.id}/edit`);
}
```

**Result:** After first save, all subsequent saves are updates, not creates.

### 3. **Better Error Messages** ✅

**Enhanced error handling:**

```typescript
catch (error) {
  throw new Error(
    `Failed to create post: ${
      error instanceof Error ? error.message : "Unknown error"
    }`
  );
}
```

Now shows actual error message instead of "Unknown error".

---

## How It Works Now

### First Save (Create)

```
1. User types title: "My Post"
2. Auto-save triggers
3. Generate slug: "my-post"
4. Check if exists: No
5. Create post with slug "my-post"
6. Set postId state: "abc-123"
7. Update URL: /admin/blog/abc-123/edit
```

### Subsequent Saves (Update)

```
1. User continues editing
2. Auto-save triggers
3. postId exists: "abc-123"
4. Update post with id "abc-123"
5. No slug conflict!
```

### If Slug Exists

```
1. User types title: "My Post" (already exists)
2. Auto-save triggers
3. Generate slug: "my-post"
4. Check if exists: Yes
5. Make unique: "my-post-1699123456789"
6. Create post with unique slug
7. No conflict!
```

---

## Testing Checklist

- [x] Create new post - Works
- [x] Auto-save creates post once - Works
- [x] Auto-save updates after creation - Works
- [x] No 409 errors - Fixed
- [x] Unique slugs generated - Works
- [x] URL updates correctly - Works
- [x] Manual save works - Works
- [x] Publish works - Works
- [x] Edit existing post works - Works

---

## Benefits

1. **No More 409 Errors** - Unique slugs prevent conflicts
2. **Efficient Auto-Save** - Creates once, updates thereafter
3. **Better UX** - No error messages during editing
4. **Data Integrity** - Each post has unique slug
5. **Performance** - Fewer database operations

---

## Code Changes Summary

### Files Modified

1. **src/services/blogService.ts**
   - Added slug uniqueness check
   - Added timestamp suffix for duplicates

2. **src/components/admin/blog/hooks/usePostForm.ts**
   - Changed `postId` from prop to state
   - Update `postId` after creation
   - Fixed auto-save logic

### Lines Changed

- blogService.ts: +10 lines
- usePostForm.ts: +5 lines

---

## Result

✅ **Auto-save now works perfectly!**

- Creates post on first save
- Updates post on subsequent saves
- No duplicate slug errors
- No 409 conflicts
- Smooth editing experience

🎉 **Issue resolved!**
