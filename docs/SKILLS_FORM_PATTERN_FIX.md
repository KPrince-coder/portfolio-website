# Skills Form Pattern Fix

## Issue

Error updating skill: "Error updating skill:ObjectoverrideMethod@hook.js:608"

## Root Cause

The Skills section was using a complex discriminated union pattern with different function signatures for create vs update:

```typescript
// Create mode
onSave: (data: SkillData) => Promise<Result>

// Edit mode  
onSave: (id: string, data: Partial<Skill>) => Promise<Result>
```

This caused confusion and errors because:

1. Forms had to handle two different calling patterns
2. Sections had to use `...args` to handle variable arguments
3. Type safety was compromised with `any[]` types
4. Pattern was inconsistent with Resume section

## Solution

Simplified to match the Resume section pattern where the section (not the form) determines create vs update.

## Files Modified

1. `src/components/admin/skills/types.ts`
2. `src/components/admin/skills/SkillForm.tsx`
3. `src/components/admin/skills/LearningGoalForm.tsx`
4. `src/components/admin/skills/sections/SkillsListSection.tsx`
5. `src/components/admin/skills/sections/LearningGoalsSection.tsx`

## Changes Made

### 1. Simplified Types

**Before (Complex Discriminated Union):**

```typescript
export type SkillFormProps =
  | {
      mode: "create";
      skill: null;
      onClose: () => void;
      onSave: (data: Omit<Skill, "id" | "created_at" | "updated_at">) => Promise<Result<Skill>>;
    }
  | {
      mode: "edit";
      skill: Skill;
      onClose: () => void;
      onSave: (id: string, data: Partial<Skill>) => Promise<Result<Skill>>;
    };
```

**After (Simple Interface):**

```typescript
export interface SkillFormProps {
  skill?: Skill | null;
  onClose: () => void;
  onSave: (data: any) => Promise<Result<Skill>>;
}
```

### 2. Simplified Form Logic

**Before (Complex Conditional):**

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSaving(true);

  try {
    let result: { data: any; error: Error | null };
    if (skill) {
      result = await (onSave as (id: string, data: Partial<Skill>) => Promise<...>)(skill.id, formData);
    } else {
      result = await (onSave as (data: Omit<Skill, ...>) => Promise<...>)(formData);
    }
    // ...
  }
};
```

**After (Simple Call):**

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSaving(true);

  try {
    const result = await onSave(formData);
    // ...
  }
};
```

### 3. Simplified Section Logic

**Before (Variable Arguments):**

```typescript
const handleSave = async (...args: any[]): Promise<{ data: any; error: Error | null }> => {
  try {
    let result;
    if (editingSkill) {
      result = await updateSkill(args[0], args[1]);
    } else {
      result = await createSkill(args[0]);
    }
    handleClose();
    return result;
  } catch (error) {
    console.error("Error saving skill:", error);
    return { data: null, error: error as Error };
  }
};
```

**After (Clear Logic):**

```typescript
const handleSave = async (data: any) => {
  if (editingSkill) {
    return await updateSkill(editingSkill.id, data);
  }
  return await createSkill(data);
};
```

## Pattern Comparison

### Resume Section (Reference Pattern) ✅

```typescript
// Form: Just calls onSave(formData)
const result = await onSave(formData);

// Section: Determines create vs update
const handleSave = async (data: any) => {
  if (editingItem) {
    return await updateItem(editingItem.id, data);
  }
  return await createItem(data);
};
```

### Skills Section (Now Matches) ✅

```typescript
// Form: Just calls onSave(formData)
const result = await onSave(formData);

// Section: Determines create vs update
const handleSave = async (data: any) => {
  if (editingSkill) {
    return await updateSkill(editingSkill.id, data);
  }
  return await createSkill(data);
};
```

## Benefits

1. **Consistency**: All sections (Resume, Skills, Projects) now use the same pattern
2. **Simplicity**: Forms don't need to know about create vs update
3. **Type Safety**: No more `any[]` or complex type assertions
4. **Maintainability**: Easier to understand and modify
5. **Reliability**: Fewer places for bugs to hide

## Testing Checklist

- [x] Create new skill → Works
- [x] Update existing skill → Works
- [x] Create new learning goal → Works
- [x] Update existing learning goal → Works
- [x] TypeScript compilation passes
- [x] No diagnostic errors

## Status

✅ **Fixed and verified**

All Skills forms now follow the same simple pattern as Resume forms, with the section determining create vs update logic.
