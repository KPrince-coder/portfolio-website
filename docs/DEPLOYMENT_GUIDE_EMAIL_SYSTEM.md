# Email System Deployment Guide

## Quick Start

### Prerequisites

1. **Supabase Project** - Active project with CLI access
2. **Resend Account** - API key from resend.com
3. **Supabase CLI** - Installed globally

```bash
npm install -g supabase
```

### Step 1: Run Database Migration

```bash
# Navigate to project root
cd /path/to/portfolio-website

# Push migration to Supabase
supabase db push

# Or apply specific migration
supabase migration up 20241106000002
```

This creates:

- `react_email_templates` table
- `email_logs` table
- Enhanced `message_notifications` table
- Enhanced `message_analytics` table
- `email_analytics` view
- Helper functions

### Step 2: Set Environment Variables

```bash
# Set Resend API key
supabase secrets set RESEND_API_KEY=re_your_api_key_here

# Set from email (optional, defaults to onboarding@resend.dev)
supabase secrets set FROM_EMAIL=noreply@yourdomain.com

# Set admin URL (optional)
supabase secrets set ADMIN_URL=https://yourdomain.com/admin

# Set environment (optional, defaults to production)
supabase secrets set ENVIRONMENT=production
```

### Step 3: Deploy Edge Functions

```bash
# Deploy notification function
supabase functions deploy send-message-notification

# Deploy reply function
supabase functions deploy send-reply

# Verify deployment
supabase functions list
```

### Step 4: Test Functions

#### Test Notification Function

```bash
# Get your anon key from Supabase dashboard
export SUPABASE_ANON_KEY=your_anon_key_here
export SUPABASE_URL=https://your-project.supabase.co

# Create a test message first (or use existing message ID)
curl -X POST "$SUPABASE_URL/functions/v1/send-message-notification" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "message_id": "your-message-uuid-here",
    "admin_email": "admin@example.com"
  }'
```

Expected response:

```json
{
  "success": true,
  "email_id": "resend-email-id",
  "message": "Notification sent successfully",
  "duration_ms": 1234
}
```

#### Test Reply Function

```bash
curl -X POST "$SUPABASE_URL/functions/v1/send-reply" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type": application/json" \
  -d '{
    "message_id": "your-message-uuid-here",
    "reply_content": "Thank you for your message! We will get back to you soon.",
    "admin_name": "John Doe"
  }'
```

Expected response:

```json
{
  "success": true,
  "email_id": "resend-email-id",
  "message": "Reply sent successfully",
  "response_time_hours": 2,
  "duration_ms": 1456
}
```

### Step 5: Create Email Templates

You need to create email templates in the database:

```sql
-- New Message Notification Template
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
  '<html>
    <body>
      <h1>New Contact Message</h1>
      <p><strong>From:</strong> {{sender_name}} ({{sender_email}})</p>
      <p><strong>Subject:</strong> {{subject}}</p>
      <p><strong>Priority:</strong> {{priority}}</p>
      <p><strong>Message:</strong></p>
      <p>{{message}}</p>
      <p><strong>Received:</strong> {{created_at}}</p>
      <p><a href="{{admin_url}}">View in Admin Panel</a></p>
    </body>
  </html>',
  'From: {{sender_name}} ({{sender_email}})
Subject: {{subject}}
Priority: {{priority}}

Message:
{{message}}

Received: {{created_at}}
View in Admin Panel: {{admin_url}}',
  'new_message_notification',
  true
);

-- Reply to Sender Template
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
  '<html>
    <body>
      <p>Hi {{sender_name}},</p>
      <p>{{reply_content}}</p>
      <hr>
      <p><strong>Your original message:</strong></p>
      <p>{{original_message}}</p>
      <p>Best regards,<br>{{admin_name}}</p>
    </body>
  </html>',
  'Hi {{sender_name}},

{{reply_content}}

---
Your original message:
{{original_message}}

Best regards,
{{admin_name}}',
  'reply_to_sender',
  true
);
```

### Step 6: Verify Installation

Check that everything is working:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'react_email_templates',
  'email_logs',
  'message_notifications',
  'message_analytics'
);

-- Check email templates
SELECT name, template_type, is_active 
FROM email_templates;

-- Check email logs (after sending test emails)
SELECT 
  email_type,
  status,
  to_email,
  subject,
  created_at
FROM email_logs
ORDER BY created_at DESC
LIMIT 10;

-- Check email statistics
SELECT * FROM get_email_statistics(7); -- Last 7 days
```

## Troubleshooting

### Function Deployment Issues

```bash
# Check function logs
supabase functions logs send-message-notification
supabase functions logs send-reply

# Redeploy with verbose output
supabase functions deploy send-message-notification --debug
```

### Email Not Sending

1. **Check Resend API Key**

   ```bash
   supabase secrets list
   ```

2. **Check Function Logs**

   ```bash
   supabase functions logs send-message-notification --tail
   ```

3. **Verify Template Exists**

   ```sql
   SELECT * FROM email_templates 
   WHERE template_type = 'new_message_notification' 
   AND is_active = true;
   ```

4. **Check Rate Limiting**
   - Wait 1 minute and try again
   - Rate limits: 10 notifications/min, 5 replies/min per message

### Database Migration Issues

```bash
# Check migration status
supabase migration list

# Rollback if needed
supabase migration down

# Reapply
supabase db push
```

## Monitoring

### View Email Logs

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
LIMIT 20;

-- Failed emails
SELECT * FROM email_logs
WHERE status IN ('failed', 'bounced')
ORDER BY created_at DESC;

-- Email statistics by type
SELECT * FROM email_analytics;
```

### Performance Metrics

```sql
-- Average delivery time
SELECT 
  email_type,
  AVG(EXTRACT(EPOCH FROM (delivered_at - sent_at))) as avg_delivery_seconds
FROM email_logs
WHERE delivered_at IS NOT NULL
GROUP BY email_type;

-- Success rate
SELECT 
  email_type,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'delivered') as delivered,
  ROUND(
    COUNT(*) FILTER (WHERE status = 'delivered')::NUMERIC / COUNT(*) * 100,
    2
  ) as success_rate
FROM email_logs
GROUP BY email_type;
```

## Security Checklist

- [ ] Resend API key set as secret (not in code)
- [ ] RLS policies enabled on all tables
- [ ] Service role key not exposed to client
- [ ] Rate limiting configured
- [ ] Email validation enabled
- [ ] Error messages don't expose sensitive data
- [ ] CORS headers properly configured

## Next Steps

1. **Setup Resend Webhooks** (for delivery tracking)
2. **Create React Email Templates** (for better email design)
3. **Add Auto-Reply System** (for instant responses)
4. **Setup Monitoring Alerts** (for failed emails)
5. **Configure Custom Domain** (for branded emails)

## Support

- **Supabase Docs**: <https://supabase.com/docs>
- **Resend Docs**: <https://resend.com/docs>
- **Edge Functions**: <https://supabase.com/docs/guides/functions>

---

**Last Updated**: 2025-11-06
**Version**: 1.0.0
