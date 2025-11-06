# Email Templates Architecture

## Current State (Phase 1)

### Active Table: `email_templates`

**Used by**: Supabase Edge Functions (send-message-notification, send-reply)

**Structure**:

```sql
- id (UUID)
- name (TEXT)
- subject (TEXT)
- html_content (TEXT)
- text_content (TEXT)
- template_type (TEXT)
- is_active (BOOLEAN)
- variables (JSONB)
- created_at, updated_at
```

**Features**:

- Simple HTML templates with `{{variable}}` placeholders
- Easy to create and manage
- Works with current Edge Functions
- Managed through EmailTemplateForm component

**Current Templates Needed**:

1. `new_message_notification` - Admin notification when message received
2. `reply_to_sender` - Reply email to message sender
3. `auto_reply` - Automatic acknowledgment (future)

---

## Future State (Phase 2)

### Prepared Table: `react_email_templates`

**Will be used by**: React Email integration (Phase 2)

**Structure**:

```sql
- id (UUID)
- name (TEXT)
- component_name (TEXT)
- props_schema (JSONB)
- html_template (TEXT) - cached render
- template_type (TEXT)
- version (INTEGER)
- is_active (BOOLEAN)
- is_default (BOOLEAN)
- available_variables (JSONB)
- preview_props (JSONB)
- created_at, updated_at
```

**Features**:

- React component-based templates
- Type-safe props with JSON schema
- Preview functionality
- Version control
- Cached HTML for performance

---

## Recommendation: Keep Both

### Why Keep Both Tables?

1. **Backward Compatibility**
   - Current system works with `email_templates`
   - No breaking changes needed
   - Smooth transition to React Email

2. **Gradual Migration**
   - Can test React Email templates alongside old ones
   - Easy rollback if needed
   - No downtime during migration

3. **Different Use Cases**
   - `email_templates`: Simple, quick templates
   - `react_email_templates`: Complex, component-based templates

4. **Future Flexibility**
   - Can support both systems
   - Users can choose template type
   - Gradual deprecation of old system

### Migration Path (When Ready for Phase 2)

```sql
-- Step 1: Create React Email templates
INSERT INTO react_email_templates (...)
SELECT ... FROM email_templates;

-- Step 2: Update Edge Functions to check both tables
-- Prefer react_email_templates, fallback to email_templates

-- Step 3: Gradually migrate users to new templates

-- Step 4: Eventually deprecate email_templates (optional)
```

---

## Alternative: Consolidate Now

If you prefer a simpler approach, we can:

### Option A: Remove `react_email_templates` from migration

**Pros**:

- Simpler database schema
- One source of truth
- Less confusion

**Cons**:

- Need to modify migration later for Phase 2
- More work when implementing React Email
- Potential breaking changes

### Option B: Merge tables into one

Add React Email fields to `email_templates`:

```sql
ALTER TABLE email_templates ADD COLUMN component_name TEXT;
ALTER TABLE email_templates ADD COLUMN props_schema JSONB;
ALTER TABLE email_templates ADD COLUMN version INTEGER DEFAULT 1;
-- etc.
```

**Pros**:

- Single table for all templates
- Simpler queries
- Easier to understand

**Cons**:

- Mixing two different template systems
- Nullable fields for simple templates
- Less clear separation of concerns

---

## Current Recommendation

**Keep both tables as designed** because:

1. ✅ No conflicts - they serve different purposes
2. ✅ Clean separation of concerns
3. ✅ Easy to understand which system is active
4. ✅ Smooth migration path to Phase 2
5. ✅ No breaking changes needed
6. ✅ Can run both systems in parallel during transition

The `react_email_templates` table is essentially "prepared infrastructure" for Phase 2. It doesn't hurt to have it there, and it makes Phase 2 implementation much smoother.

---

## What to Do Now

### For Phase 1 Deployment

1. **Deploy both migrations** as-is
2. **Create templates in `email_templates`** (see DEPLOYMENT_GUIDE)
3. **Edge Functions use `email_templates`** (already configured)
4. **Ignore `react_email_templates`** for now (it's empty and unused)

### For Phase 2 (Future)

1. Install React Email components
2. Create template components
3. Store metadata in `react_email_templates`
4. Update Edge Functions to check both tables
5. Gradually migrate to new system

---

## Summary

**Current Active**: `email_templates` ✅
**Future Ready**: `react_email_templates` 📋
**Recommendation**: Keep both ✅

The architecture is sound and provides flexibility for future enhancements without breaking current functionality.
