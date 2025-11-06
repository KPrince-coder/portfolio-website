# Email System Setup Guide

## Complete Setup Instructions

### Prerequisites

- ✅ Supabase project created
- ✅ Resend account created (<https://resend.com>)
- ✅ Supabase CLI installed (`npm install -g supabase`)

---

## Step 1: Configure Environment Variables

### 1.1 Client-Side (.env file)

Copy `.env.example` to `.env` and update with your values:

```bash
# Copy example file
cp .env.example .env
```

Update these values in `.env`:

```env
# Supabase Configuration (from Supabase Dashboard > Settings > API)
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SUPABASE_URL="https://your-project-id.supabase.co"

# Email Configuration
VITE_ADMIN_EMAIL="your-admin-email@example.com"
VITE_COMPANY_NAME="Your Company Name"
VITE_COMPANY_EMAIL="contact@yourdomain.com"
```

### 1.2 Server-Side (Supabase Secrets)

Set secrets for Edge Functions:

```bash
# Get your Resend API key from https://resend.com/api-keys
supabase secrets set RESEND_API_KEY=re_your_api_key_here

# Set the email address to send from (must be verified in Resend)
supabase secrets set FROM_EMAIL=noreply@yourdomain.com

# Set your admin panel URL
supabase secrets set ADMIN_URL=https://yourdomain.com/admin

# Set environment
supabase secrets set ENVIRONMENT=production
```

Verify secrets:

```bash
supabase secrets list
```

---

## Step 2: Apply Database Migrations

```bash
# Navigate to project root
cd /path/to/portfolio-website

# Apply migrations
supabase db push

# Verify tables created
supabase db diff
```

This creates:

- ✅ `contact_messages` table
- ✅ `email_templates` table
- ✅ `react_email_templates` table
- ✅ `email_logs` table
- ✅ `message_notifications` table
- ✅ `message_analytics` table
- ✅ `email_analytics` view
- ✅ Helper functions

---

## Step 3: Deploy Edge Functions

```bash
# Deploy notification function
supabase functions deploy send-message-notification

# Deploy reply function
supabase functions deploy send-reply

# Verify deployment
supabase functions list
```

---

## Step 4: Create Email Templates

Run this SQL in Supabase SQL Editor (Dashboard > SQL Editor):

```sql
-- ============================================================================
-- New Message Notification Template
-- ============================================================================
INSERT INTO email_templates (
  name,
  subject,
  html_content,
  text_content,
  template_type,
  is_active
) VALUES (
  'New Message Notification',
  'New Contact Message from {{sender_name}}',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Message</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Message</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #667eea;">
      <h2 style="margin-top: 0; color: #667eea; font-size: 18px;">Message Details</h2>
      <p style="margin: 10px 0;"><strong>From:</strong> {{sender_name}}</p>
      <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:{{sender_email}}" style="color: #667eea;">{{sender_email}}</a></p>
      <p style="margin: 10px 0;"><strong>Subject:</strong> {{subject}}</p>
      <p style="margin: 10px 0;"><strong>Priority:</strong> <span style="background: #ffd700; padding: 2px 8px; border-radius: 4px; font-size: 12px;">{{priority}}</span></p>
      <p style="margin: 10px 0;"><strong>Category:</strong> {{category}}</p>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="margin-top: 0; color: #333; font-size: 16px;">Message:</h3>
      <p style="white-space: pre-wrap; color: #666;">{{message}}</p>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="{{admin_url}}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">View in Admin Panel</a>
    </div>
    
    <p style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
      Received: {{created_at}}
    </p>
  </div>
</body>
</html>',
  'New Contact Message

From: {{sender_name}} ({{sender_email}})
Subject: {{subject}}
Priority: {{priority}}
Category: {{category}}

Message:
{{message}}

Received: {{created_at}}

View in Admin Panel: {{admin_url}}',
  'new_message_notification',
  true
);

-- ============================================================================
-- Reply to Sender Template
-- ============================================================================
INSERT INTO email_templates (
  name,
  subject,
  html_content,
  text_content,
  template_type,
  is_active
) VALUES (
  'Reply to Sender',
  'Re: {{original_subject}}',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reply from {{company_name}}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">{{company_name}}</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi {{sender_name}},</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; white-space: pre-wrap;">
      {{reply_content}}
    </div>
    
    <hr style="border: none; border-top: 2px solid #e0e0e0; margin: 30px 0;">
    
    <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea;">
      <p style="margin: 0 0 10px 0; font-weight: bold; color: #667eea;">Your original message:</p>
      <p style="margin: 0; color: #666; font-size: 14px; white-space: pre-wrap;">{{original_message}}</p>
    </div>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
      <p style="margin: 5px 0;">Best regards,</p>
      <p style="margin: 5px 0; font-weight: bold; color: #667eea;">{{admin_name}}</p>
      <p style="margin: 5px 0; color: #666;">{{company_name}}</p>
      <p style="margin: 5px 0; color: #666;"><a href="mailto:{{company_email}}" style="color: #667eea;">{{company_email}}</a></p>
    </div>
  </div>
</body>
</html>',
  'Hi {{sender_name}},

{{reply_content}}

---
Your original message:
{{original_message}}

Best regards,
{{admin_name}}
{{company_name}}
{{company_email}}',
  'reply_to_sender',
  true
);
```

---

## Step 5: Verify Setup

### 5.1 Check Database

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'contact_messages',
  'email_templates',
  'react_email_templates',
  'email_logs',
  'message_notifications',
  'message_analytics'
);

-- Check email templates
SELECT name, template_type, is_active 
FROM email_templates;
```

### 5.2 Check Edge Functions

```bash
# View function logs
supabase functions logs send-message-notification
supabase functions logs send-reply
```

### 5.3 Test Contact Form

1. Go to your website's contact page
2. Fill out and submit the form
3. Check that:
   - Message appears in database
   - Admin receives notification email
   - No errors in console

### 5.4 Test Reply Function

1. Go to admin panel → Messages
2. Click on a message
3. Click "Reply" button
4. Write and send a reply
5. Check that:
   - Reply email is sent
   - Message status updated to "replied"
   - Email log created in database

---

## Step 6: Monitor Email Logs

```sql
-- Recent emails
SELECT 
  email_type,
  status,
  to_email,
  subject,
  sent_at,
  error_message
FROM email_logs
ORDER BY created_at DESC
LIMIT 10;

-- Email statistics (last 7 days)
SELECT * FROM get_email_statistics(7);

-- Email analytics by type
SELECT * FROM email_analytics;

-- Failed emails
SELECT * 
FROM email_logs
WHERE status IN ('failed', 'bounced')
ORDER BY created_at DESC;
```

---

## Troubleshooting

### Issue: Emails not sending

**Check:**

1. Resend API key is set correctly
2. FROM_EMAIL is verified in Resend
3. Edge function logs for errors
4. Email templates exist and are active

```bash
# Check secrets
supabase secrets list

# Check function logs
supabase functions logs send-message-notification --tail

# Check templates
supabase db execute "SELECT * FROM email_templates WHERE is_active = true"
```

### Issue: TypeScript errors

**Solution:**

```bash
# Regenerate Supabase types
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

### Issue: Rate limiting

**Solution:**
Wait 1 minute and try again. Rate limits:

- Notifications: 10 per minute per message
- Replies: 5 per minute per message

---

## Configuration Summary

### Client-Side (.env)

- ✅ VITE_SUPABASE_URL
- ✅ VITE_SUPABASE_PUBLISHABLE_KEY
- ✅ VITE_ADMIN_EMAIL
- ✅ VITE_COMPANY_NAME
- ✅ VITE_COMPANY_EMAIL

### Server-Side (Supabase Secrets)

- ✅ RESEND_API_KEY
- ✅ FROM_EMAIL
- ✅ ADMIN_URL
- ✅ ENVIRONMENT

### Database

- ✅ Migrations applied
- ✅ Email templates created
- ✅ RLS policies enabled

### Edge Functions

- ✅ send-message-notification deployed
- ✅ send-reply deployed

---

## Next Steps

1. **Customize Email Templates** - Update HTML/CSS in email_templates table
2. **Setup Resend Webhooks** - Track delivery, opens, clicks
3. **Add Auto-Reply** - Implement automatic acknowledgment
4. **Monitor Analytics** - Review email statistics regularly
5. **Phase 2: React Email** - Implement component-based templates

---

**Setup Complete!** 🎉

Your email system is now fully configured and ready to use.
