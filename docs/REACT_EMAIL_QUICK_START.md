# React Email Quick Start Guide

## Overview

This guide will help you build and deploy React Email templates to your database.

## Prerequisites

- ✅ React Email installed (`@react-email/components`, `@react-email/render`)
- ✅ Email templates created in `emails/` folder
- ✅ Supabase project configured
- ✅ Environment variables set

## Step 1: Set Environment Variables

Make sure you have these in your `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

And for the build script, you need the service role key:

```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Note**: Get the service role key from Supabase Dashboard > Settings > API

## Step 2: Build Email Templates

Run the build script to render templates and store them in the database:

```bash
npm run emails:build
```

This will:

1. Render each React Email template to HTML and text
2. Store them in the `email_templates` table
3. Set metadata (variables, required fields, etc.)

Expected output:

```
🚀 Building email templates...

📧 Building: New Message Notification
   ✓ Rendered HTML (5234 chars)
   ✓ Rendered Text (892 chars)
   ✓ Stored in database (ID: uuid-here)

📧 Building: Reply to Sender
   ✓ Rendered HTML (4123 chars)
   ✓ Rendered Text (756 chars)
   ✓ Stored in database (ID: uuid-here)

📧 Building: Auto Reply
   ✓ Rendered HTML (3456 chars)
   ✓ Rendered Text (623 chars)
   ✓ Stored in database (ID: uuid-here)

✅ Email templates built successfully!
🎉 Done!
```

## Step 3: Verify Templates

Check that templates were stored correctly:

```sql
-- View all templates
SELECT 
  name,
  template_type,
  is_active,
  LENGTH(html_content) as html_size,
  LENGTH(text_content) as text_size
FROM email_templates
ORDER BY created_at DESC;
```

## Step 4: Test Templates (Optional)

### Preview in Development

Start the React Email dev server:

```bash
npm run emails:dev
```

Then open <http://localhost:3000> to preview all templates with hot reload.

### Send Test Email

Use the Supabase Edge Functions to send a test:

```bash
# Test notification
curl -X POST https://your-project.supabase.co/functions/v1/send-message-notification \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "message_id": "test-message-id",
    "admin_email": "your-email@example.com"
  }'
```

## Step 5: Update Templates

When you make changes to templates:

1. Edit the template file in `emails/templates/`
2. Run `npm run emails:build` to rebuild
3. Templates will be updated in the database (upserted by name)

## Troubleshooting

### Build Script Fails

**Error**: "Missing environment variables"

**Solution**: Make sure `VITE_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set

```bash
# Check environment variables
echo $VITE_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY
```

### Templates Not Showing

**Error**: Templates not appearing in database

**Solution**: Check database connection and table exists

```sql
-- Check if table exists
SELECT * FROM information_schema.tables 
WHERE table_name = 'email_templates';

-- Check RLS policies
SELECT * FROM pg_policies 
WHERE tablename = 'email_templates';
```

### Preview Server Not Starting

**Error**: `email dev` command not found

**Solution**: Install React Email CLI globally

```bash
npm install -g @react-email/cli
```

Or use npx:

```bash
npx @react-email/cli dev
```

## Template Variables

### Available Variables by Template

**New Message Notification**:

- `{{sender_name}}` - Name of sender
- `{{sender_email}}` - Email of sender
- `{{subject}}` - Message subject
- `{{message}}` - Message content
- `{{priority}}` - Priority level
- `{{category}}` - Message category
- `{{created_at}}` - Timestamp
- `{{admin_url}}` - Admin panel URL
- `{{message_id}}` - Message ID
- `{{company_name}}` - Your company name

**Reply to Sender**:

- `{{sender_name}}` - Name of sender
- `{{reply_content}}` - Your reply (HTML)
- `{{original_message}}` - Original message
- `{{original_subject}}` - Original subject
- `{{admin_name}}` - Your name
- `{{company_name}}` - Your company name
- `{{company_email}}` - Your email

**Auto Reply**:

- `{{sender_name}}` - Name of sender
- `{{subject}}` - Message subject
- `{{admin_name}}` - Support team name
- `{{company_name}}` - Your company name
- `{{expected_response_time}}` - Response time

## Best Practices

### 1. Test Before Deploying

Always test templates in preview mode before building:

```bash
npm run emails:dev
```

### 2. Use Sample Data

Templates include sample data for testing. Update in `scripts/build-emails.ts`:

```typescript
sampleProps: {
  senderName: "John Doe",
  senderEmail: "john@example.com",
  // ... your test data
}
```

### 3. Version Control

Templates are in version control, so you can:

- Track changes over time
- Rollback if needed
- Review changes in PRs

### 4. Rebuild After Changes

Always rebuild after editing templates:

```bash
npm run emails:build
```

### 5. Keep Components Reusable

Use the base components for consistency:

- `EmailLayout` - Wrapper
- `EmailHeader` - Header
- `EmailFooter` - Footer
- `EmailButton` - Buttons
- `EmailSection` - Sections

## Next Steps

1. ✅ Build templates (`npm run emails:build`)
2. ✅ Verify in database
3. ✅ Test with Edge Functions
4. ✅ Deploy to production
5. 📋 Add preview system (optional)
6. 📋 Add auto-reply (optional)

---

**Quick Reference**:

- Build: `npm run emails:build`
- Preview: `npm run emails:dev`
- Templates: `emails/templates/`
- Components: `emails/components/`
- Build Script: `scripts/build-emails.ts`
