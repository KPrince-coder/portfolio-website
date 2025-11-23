# Auto-Reply System Verification

## System Overview

The auto-reply system works as follows:

1. **User submits contact form** → Message saved to `contact_messages` table
2. **Frontend calls** `sendNotificationEmail()` → Invokes `send-message-notification` Edge Function
3. **Edge Function sends email** to admin using Resend API
4. **Email logged** in `email_logs` table

## Current Configuration

### ✅ What's Working

1. **Edge Functions Deployed**
   - `send-message-notification` - Sends notification to admin
   - `send-reply` - Sends reply to message sender

2. **Secrets Configured**
   - `FROM_EMAIL` = `hello@mail.codeprince.qzz.io`
   - `RESEND_API_KEY` = (configured)
   - `ADMIN_URL` = (configured)

3. **Frontend Integration**
   - Contact form calls `sendNotificationEmail()` after message submission
   - Email service properly invokes Edge Functions

### ⚠️ Requirements for Auto-Reply to Work

#### 1. Resend Domain Verification

**Status**: Needs verification

**Action Required**:

1. Go to <https://resend.com/domains>
2. Add domain: `mail.codeprince.qzz.io`
3. Add these DNS records to your domain provider:

```
Type: TXT
Name: mail.codeprince.qzz.io
Value: v=spf1 include:_spf.resend.com ~all

Type: TXT  
Name: resend._domainkey.mail.codeprince.qzz.io
Value: [Provided by Resend after adding domain]

Type: TXT
Name: _dmarc.mail.codeprince.qzz.io
Value: v=DMARC1; p=none;
```

4. Wait for verification (usually 5-10 minutes)

#### 2. Email Templates

**Status**: Check if templates exist

**Action Required**:

```sql
-- Check if templates exist
SELECT id, name, template_type, is_active 
FROM react_email_templates 
WHERE template_type IN ('new_message_notification', 'reply_to_sender');
```

If templates don't exist, they need to be created in the admin panel:

- Go to Admin → Messages → Email Templates
- Create template for "New Message Notification"
- Create template for "Reply to Sender"

#### 3. Brand Settings

**Status**: Check if configured

**Action Required**:

```sql
-- Check brand settings
SELECT setting_key, setting_value 
FROM brand_settings 
WHERE setting_key IN ('email_branding', 'notification_settings');
```

## Testing the Auto-Reply

### Test 1: Submit Contact Form

1. Go to your portfolio website
2. Fill out the contact form
3. Submit the form
4. Check browser console for any errors

**Expected Result**:

- Form submits successfully
- Success toast appears
- Message saved to database
- Notification email sent to admin

### Test 2: Check Email Logs

```sql
-- Check recent email logs
SELECT 
  id,
  email_type,
  to_email,
  subject,
  status,
  sent_at,
  created_at
FROM email_logs
ORDER BY created_at DESC
LIMIT 10;
```

### Test 3: Manual Edge Function Test

```bash
# Test notification function
curl -X POST https://jcsghggucepqzmonlpeg.supabase.co/functions/v1/send-message-notification \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "message_id": "YOUR_MESSAGE_ID",
    "admin_email": "contact@codeprince.qzz.io"
  }'
```

## Troubleshooting

### Issue: No email received

**Check**:

1. Resend domain verified?
2. Email templates exist and are active?
3. Check Supabase Edge Function logs
4. Check Resend dashboard for delivery status

### Issue: Email goes to spam

**Fix**:

1. Verify SPF, DKIM, and DMARC records
2. Use a custom domain (not @resend.dev)
3. Add proper email headers
4. Warm up the domain by sending gradually

### Issue: Edge Function error

**Check**:

1. Supabase function logs: <https://supabase.com/dashboard/project/jcsghggucepqzmonlpeg/functions>
2. Verify all secrets are set: `supabase secrets list`
3. Check if message exists in database
4. Verify Resend API key is valid

## Email Flow Diagram

```
User Submits Form
       ↓
Save to contact_messages table
       ↓
Call sendNotificationEmail()
       ↓
Invoke send-message-notification Edge Function
       ↓
Fetch message from database
       ↓
Fetch email template
       ↓
Render template with variables
       ↓
Send via Resend API
       ↓
Log to email_logs table
       ↓
Create notification record
       ↓
Return success response
```

## Next Steps

1. **Verify Resend Domain**
   - Add `mail.codeprince.qzz.io` to Resend
   - Configure DNS records
   - Wait for verification

2. **Test Email Sending**
   - Submit a test contact form
   - Check if email arrives
   - Verify email content and formatting

3. **Monitor Email Logs**
   - Check admin panel for email logs
   - Monitor Resend dashboard
   - Track delivery rates

4. **Configure Auto-Reply Template** (Optional)
   - Create "auto_reply" template type
   - Send automatic acknowledgment to sender
   - Requires additional Edge Function or trigger

## Status Checklist

- [x] Edge Functions deployed
- [x] Secrets configured
- [x] Frontend integration complete
- [ ] Resend domain verified
- [ ] Email templates created
- [ ] Test email sent successfully
- [ ] Email received by admin
- [ ] Email logs working
