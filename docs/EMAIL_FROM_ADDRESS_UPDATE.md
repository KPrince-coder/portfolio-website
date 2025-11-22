# Email From Address Update Guide

## Current Configuration

The email system uses `hello@mail.codeprince.qzz.io` as the from address.

## What Needs to Be Updated

### 1. Supabase Edge Function Secrets

The Edge Functions (`send-message-notification` and `send-reply`) use the `FROM_EMAIL` environment variable.

**Update via Supabase CLI:**

```bash
supabase secrets set FROM_EMAIL=hello@mail.codeprince.qzz.io
```

**Or via Supabase Dashboard:**

1. Go to: <https://supabase.com/dashboard/project/jcsghggucepqzmonlpeg/settings/functions>
2. Click on "Edge Functions" → "Secrets"
3. Add or update: `FROM_EMAIL` = `hello@mail.codeprince.qzz.io`

### 2. Resend Configuration

Make sure the email address is verified in Resend:

1. Go to: <https://resend.com/domains>
2. Add domain: `mail.codeprince.qzz.io`
3. Add DNS records to your domain provider
4. Verify the domain

**DNS Records Required:**

- SPF: `v=spf1 include:_spf.resend.com ~all`
- DKIM: (provided by Resend)
- DMARC: `v=DMARC1; p=none;`

### 3. Client-Side Configuration (.env)

Update your `.env` file:

```env
# Admin email to receive notifications
VITE_ADMIN_EMAIL="contact@codeprince.qzz.io"

# Company information
VITE_COMPANY_NAME="CodePrince"
VITE_COMPANY_EMAIL="contact@codeprince.qzz.io"
```

## Current Default Values

If `FROM_EMAIL` is not set, the system defaults to:

- `onboarding@resend.dev` (Resend's default)

## Email Flow

### New Message Notification

- **From**: `CodePrince <hello@mail.codeprince.qzz.io>`
- **To**: Admin email (from settings or `VITE_ADMIN_EMAIL`)
- **Reply-To**: Not set (replies go to from address)

### Reply to Sender

- **From**: `Support Team <hello@mail.codeprince.qzz.io>`
- **To**: Original message sender
- **Reply-To**: `contact@codeprince.qzz.io` (company email)

## Testing

After updating the secrets, test the email functions:

```bash
# Test notification
curl -X POST https://jcsghggucepqzmonlpeg.supabase.co/functions/v1/send-message-notification \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message_id": "test-uuid"}'

# Test reply
curl -X POST https://jcsghggucepqzmonlpeg.supabase.co/functions/v1/send-reply \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message_id": "test-uuid", "reply_content": "Test reply"}'
```

## Verification Checklist

- [ ] Domain added to Resend
- [ ] DNS records configured
- [ ] Domain verified in Resend
- [ ] `FROM_EMAIL` secret updated in Supabase
- [ ] `.env` file updated with company email
- [ ] Edge Functions redeployed (if needed)
- [ ] Test emails sent successfully
- [ ] Emails appear from correct address
- [ ] Reply-to address works correctly

## Notes

- The from address (`hello@mail.codeprince.qzz.io`) is used for sending
- The reply-to address (`contact@codeprince.qzz.io`) is where replies go
- Both addresses should be on verified domains in Resend
- Edge Functions automatically pick up secret changes (no redeploy needed)
