# Form Data Sanitization Pattern

**Date:** October 29, 2025  
**Status:** ✅ Applied to SkillForm, ⏳ Needs application to other forms  
**Priority:** 🔴 HIGH - Prevents database errors

## Summary

A critical data sanitization pattern was added to `SkillForm.tsx` to convert empty strings to `null` for UUID fields before saving. This prevents PostgreSQL errors when empty strings are passed to UUID columns.

---

## The Problem

### Database Error

When a form field for a UUID column (like `category_id`) is left empty or cleared, it sends an empty string `""` to the database. PostgreSQL UUID columns cannot accept empty strings, causing this error:

```
invalid input syntax for type uuid: ""
```

### Root Cause

HTML `<select>` and `<input>` elements return empty strings `""` when no value is selected, but PostgreSQL expects `null` for optional UUID fields.

---

## The Solution

### Data Sanitization Before Save

Convert empty strings to `null` for UUID fields before sending to the database:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSaving(true);

  try {
    // Sanitize data: convert empty strings to null for UUID fields
    const sanitizedData = {
      ...formData,
      category_id: formData.category_id || null,
    };

    const result = await onSave(sanitizedData);
    
    // ... rest of the code
  }
};
```

### Why This Works

- `formData.category_id || null` converts `""` (falsy) to `null`
- PostgreSQL accepts `null` for optional UUID columns
- Valid UUIDs (truthy strings) pass through unchanged

---

## Forms That Need This Fix

### ✅ Already Fixed

1. **SkillForm.tsx** - `category_id` field

### ⏳ Needs Fixing

2. **LearningGoalForm.tsx** - No UUID fields (✅ OK as-is)
3. **ProjectForm.tsx** - `category_id` field
4. **WorkExperienceForm.tsx** - Already has sanitization for `end_date`
5. **EducationForm.tsx** - Needs checking
6. **CertificationForm.tsx** - Needs checking
7. **ProjectCategoryForm.tsx** - No UUID fields (✅ OK as-is)
8. **TechnologyForm.tsx** - No UUID fields (✅ OK as-is)

---

## Implementation Guide

### Step 1: Identify UUID Fields

Check your database schema or TypeScript types to find UUID fields:

```typescript
// Example from types.ts
interface Skill {
  id: string;              // UUID (auto-generated, not in form)
  category_id: string;     // UUID (user input) ⚠️ NEEDS SANITIZATION
  name: string;            // TEXT (no sanitization needed)
  // ...
}
```

### Step 2: Add Sanitization

For each UUID field that users can input, add sanitization:

```typescript
const sanitizedData = {
  ...formData,
  category_id: formData.category_id || null,
  // Add more UUID fields as needed
};
```

### Step 3: Use Sanitized Data

Pass the sanitized data to `onSave`:

```typescript
const result = await onSave(sanitizedData);
```

---

## Complete Example: ProjectForm.tsx

### Before (Has Bug)

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSaving(true);

  try {
    const dataToSave = {
      ...formData,
      technologies: selectedTechs,
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-"),
    };

    // ❌ Bug: category_id might be empty string
    const result = await onSave(dataToSave);
    
    // ...
  }
};
```

### After (Fixed)

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSaving(true);

  try {
    // ✅ Sanitize UUID fields
    const sanitizedData = {
      ...formData,
      category_id: formData.category_id || null,
      technologies: selectedTechs,
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-"),
    };

    const result = await onSave(sanitizedData);
    
    // ...
  }
};
```

---

## Date Fields Sanitization

Date fields also need sanitization, but for a different reason:

```typescript
const sanitizedData = {
  ...formData,
  start_date: formData.start_date || null,
  end_date: formData.end_date || null,
};
```

**Why:** Empty date strings `""` should be `null` in the database, not empty strings.

---

## Best Practices

### 1. Sanitize at Form Level

Always sanitize data in the form component before calling `onSave`:

```typescript
// ✅ Good: Sanitize in form
const sanitizedData = { ...formData, category_id: formData.category_id || null };
const result = await onSave(sanitizedData);

// ❌ Bad: Rely on hook to sanitize
const result = await onSave(formData); // Hook might not know which fields need sanitization
```

### 2. Document Sanitized Fields

Add a comment explaining which fields are sanitized and why:

```typescript
// Sanitize data: convert empty strings to null for UUID and date fields
const sanitizedData = {
  ...formData,
  category_id: formData.category_id || null,  // UUID field
  end_date: formData.end_date || null,        // Optional date field
};
```

### 3. Create a Helper Function (Optional)

For forms with many UUID fields, create a helper:

```typescript
const sanitizeUUIDs = <T extends Record<string, any>>(
  data: T,
  uuidFields: (keyof T)[]
): T => {
  const sanitized = { ...data };
  uuidFields.forEach((field) => {
    if (sanitized[field] === "") {
      sanitized[field] = null as any;
    }
  });
  return sanitized;
};

// Usage
const sanitizedData = sanitizeUUIDs(formData, ['category_id', 'parent_id']);
```

---

## Testing Checklist

After applying the fix, test these scenarios:

### Test 1: Create with Empty UUID Field

1. Open form to create new item
2. Leave UUID field (e.g., category) empty
3. Submit form
4. ✅ Should save successfully with `null` value

### Test 2: Create with Selected UUID Field

1. Open form to create new item
2. Select a value for UUID field
3. Submit form
4. ✅ Should save successfully with selected UUID

### Test 3: Edit and Clear UUID Field

1. Open form to edit existing item
2. Clear the UUID field (set to empty)
3. Submit form
4. ✅ Should save successfully with `null` value

### Test 4: Edit and Change UUID Field

1. Open form to edit existing item
2. Change the UUID field to different value
3. Submit form
4. ✅ Should save successfully with new UUID

---

## Database Schema Considerations

### Optional vs Required UUID Fields

**Optional (nullable):**

```sql
CREATE TABLE skills (
  id UUID PRIMARY KEY,
  category_id UUID REFERENCES skill_categories(id),  -- nullable
  name TEXT NOT NULL
);
```

- Can be `null`
- Needs sanitization: `category_id: formData.category_id || null`

**Required (not null):**

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES project_categories(id),  -- not null
  title TEXT NOT NULL
);
```

- Cannot be `null`
- Should use form validation to prevent empty submission
- Still sanitize to catch edge cases

---

## Form Validation

Combine sanitization with validation for required fields:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validate required UUID fields
  if (!formData.category_id) {
    toast({
      variant: "destructive",
      title: "Validation Error",
      description: "Please select a category",
    });
    return;
  }

  setSaving(true);

  try {
    // Sanitize optional UUID fields
    const sanitizedData = {
      ...formData,
      category_id: formData.category_id || null,  // Still sanitize for safety
      parent_id: formData.parent_id || null,      // Optional field
    };

    const result = await onSave(sanitizedData);
    // ...
  }
};
```

---

## Common Mistakes

### ❌ Mistake 1: Sanitizing in Hook Instead of Form

```typescript
// ❌ Bad: Hook doesn't know which fields need sanitization
export const useSkills = () => {
  const createSkill = async (data: SkillFormData) => {
    // Hook receives already-invalid data
    const { error } = await db.from('skills').insert(data);
  };
};
```

### ✅ Correct: Sanitize in Form

```typescript
// ✅ Good: Form sanitizes before calling hook
const handleSubmit = async () => {
  const sanitizedData = {
    ...formData,
    category_id: formData.category_id || null,
  };
  await createSkill(sanitizedData);
};
```

### ❌ Mistake 2: Only Sanitizing on Create

```typescript
// ❌ Bad: Only sanitizes for create, not update
if (skill) {
  result = await onSave(skill.id, formData);  // Bug: not sanitized
} else {
  const sanitizedData = { ...formData, category_id: formData.category_id || null };
  result = await onSave(sanitizedData);
}
```

### ✅ Correct: Always Sanitize

```typescript
// ✅ Good: Sanitize for both create and update
const sanitizedData = {
  ...formData,
  category_id: formData.category_id || null,
};

if (skill) {
  result = await onSave(skill.id, sanitizedData);
} else {
  result = await onSave(sanitizedData);
}
```

---

## Performance Impact

### Negligible

- Sanitization is a simple object spread and null coalescing
- Happens once per form submission
- No noticeable performance impact

### Memory

- Creates one additional object (`sanitizedData`)
- Garbage collected immediately after submission
- No memory concerns

---

## TypeScript Considerations

### Type Safety

The sanitization maintains type safety:

```typescript
interface SkillFormData {
  category_id: string;  // Form expects string
  name: string;
}

// Sanitized data has same type
const sanitizedData: SkillFormData = {
  ...formData,
  category_id: formData.category_id || null,  // null is valid for database
};
```

### Strict Null Checks

If using strict null checks, you might need to adjust types:

```typescript
interface SkillFormData {
  category_id: string | null;  // Allow null in type
  name: string;
}
```

---

## Summary

### What Was Fixed

✅ **SkillForm.tsx** - Added `category_id` sanitization

### What Needs Fixing

⏳ **ProjectForm.tsx** - Add `category_id` sanitization  
⏳ **EducationForm.tsx** - Check for UUID fields  
⏳ **CertificationForm.tsx** - Check for UUID fields

### Expected Impact

- **Zero database errors** from empty UUID strings
- **Better user experience** - forms work reliably
- **Consistent behavior** across all forms
- **No performance impact**

### Implementation Priority

🔴 **HIGH** - Apply to all forms with UUID fields immediately

---

## Next Steps

1. ✅ Document the pattern (this file)
2. ⏳ Apply to ProjectForm.tsx
3. ⏳ Check EducationForm.tsx
4. ⏳ Check CertificationForm.tsx
5. ⏳ Test all forms thoroughly
6. ⏳ Update form component documentation

---

## Related Files

- `src/components/admin/skills/SkillForm.tsx` - ✅ Fixed
- `src/components/admin/projects/ProjectForm.tsx` - ⏳ Needs fix
- `src/components/admin/resume/WorkExperienceForm.tsx` - ✅ Has date sanitization
- `src/components/admin/resume/EducationForm.tsx` - ⏳ Needs checking
- `docs/SKILLS_MANAGEMENT_REVIEW.md` - Related optimization docs

---

## Conclusion

This simple sanitization pattern prevents a common database error and should be applied consistently across all forms with UUID or date fields. It's a best practice that improves reliability with minimal code changes.

**Remember:** Always sanitize user input before sending to the database! 🛡️
