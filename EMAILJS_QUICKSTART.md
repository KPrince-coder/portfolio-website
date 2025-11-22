# 🚀 EmailJS Quick Start - November 2025

## ✅ What's Been Done

Your portfolio now uses **EmailJS** instead of Resend for all email functionality:

- ✅ **Modern Implementation** (November 2025)
- ✅ **Security**: Rate limiting, input sanitization, XSS protection
- ✅ **Performance**: Non-blocking, parallel sending, retry logic
- ✅ **Features**: Notification, auto-reply, manual replies

## 📋 Setup Checklist (15 minutes)

### 1. Create EmailJS Account

- Go to: <https://dashboard.emailjs.com/sign-up>
- Sign up with your Gmail
- Verify email

### 2. Connect Gmail

- Dashboard → Email Services → Add New Service
- Choose Gmail → Connect Account
- Copy **Service ID**

### 3. Create 2 Templates (Free Tier)

See `EMAILJS_TEMPLATES.md` for detailed template HTML.

**Required Templates**:

- `template_notification` - New message notification (to you) ✅ REQUIRED
- `template_autoreply` - Auto-reply (to sender) ⚠️ OPTIONAL

**Manual Reply**: Uses `mailto:` link (no template needed!) 🎉

### 4. Get API Keys

- Dashboard → Account → General
- Copy **Public Key**

### 5. Update .env File

```env
# Required
VITE_EMAILJS_PUBLIC_KEY="your_public_key_here"
VITE_EMAILJS_SERVICE_ID="service_abc123"
VITE_EMAILJS_TEMPLATE_NOTIFICATION="template_notification"
VITE_EMAILJS_TEMPLATE_AUTO_REPLY="template_autoreply"  # Dual-purpose: auto-reply + manual reply
VITE_ADMIN_EMAIL="contact@codeprince.qzz.io"
```

### 6. Restart Dev Server

```bash
npm run dev
```

### 7. Test

1. Submit contact form
2. Check your Gmail for notification
3. Check sender's email for auto-reply

## 🎯 Features

| Feature | Status | Description |
|---------|--------|-------------|
| **Notification** | ✅ | You receive email when form submitted |
| **Auto-reply** | ✅ | Sender gets instant acknowledgment |
| **Manual Reply** | ✅ | Reply from admin panel |
| **Rate Limiting** | ✅ | 3 emails/minute per user |
| **Security** | ✅ | XSS protection, sanitization |
| **Performance** | ✅ | Non-blocking, parallel sending |

## 📁 New Files Created

- `src/config/emailjs.config.ts` - Configuration
- `src/services/emailjs.service.ts` - Email service with security
- `docs/EMAILJS_SETUP_GUIDE.md` - Detailed setup guide

## 🔄 Files Updated

- `src/components/contact/hooks/useContactForm.ts` - Uses EmailJS
- `src/components/admin/messages/MessagesManagement.tsx` - Uses EmailJS for replies
- `src/App.tsx` - Initializes EmailJS
- `.env.example` - EmailJS configuration

## 🗑️ Old Files (Can be removed later)

These files are no longer needed but kept for reference:

- `src/services/emailService.ts` - Old Resend service
- `supabase/functions/send-message-notification/` - Old Edge Function
- `supabase/functions/send-reply/` - Old Edge Function
- `emails/` folder - React Email templates (not used with EmailJS)

## 🔒 Security Features

✅ **Rate Limiting** - Prevents spam (3 emails/min)
✅ **Input Sanitization** - Removes malicious code
✅ **Headless Browser Blocking** - Stops bots
✅ **Retry Logic** - Handles temporary failures
✅ **Error Handling** - Graceful degradation

## 📊 Performance

- **Non-blocking**: Form submits instantly
- **Parallel**: Notification + auto-reply sent together
- **Monitoring**: Tracks send duration
- **Retry**: Exponential backoff on failure

## 🆘 Troubleshooting

**Emails not sending?**

1. Check browser console for errors
2. Verify `.env` variables are set
3. Restart dev server
4. Check EmailJS dashboard quota

**Rate limit errors?**

- Wait 1 minute between submissions

**Template variables not working?**

- Check variable names match exactly (case-sensitive)
- Preview templates in EmailJS dashboard

## 📚 Documentation

- **Setup Guide**: `docs/EMAILJS_SETUP_GUIDE.md`
- **EmailJS Dashboard**: <https://dashboard.emailjs.com>
- **EmailJS Docs**: <https://www.emailjs.com/docs/>

## ✅ Next Steps

1. Complete EmailJS setup (15 min)
2. Test contact form
3. Verify emails arrive
4. (Optional) Remove old Resend files

## 🎉 Benefits

- ✅ **No domain verification** needed
- ✅ **No bouncing** issues (uses Gmail)
- ✅ **Instant setup** (15 minutes)
- ✅ **Free tier** (200 emails/month)
- ✅ **Reliable** delivery
- ✅ **Modern** implementation (Nov 2025)

---

**Need help?** Check `docs/EMAILJS_SETUP_GUIDE.md` for detailed instructions.
