# EmailJS Setup Guide

**November 2025 - Modern Implementation**

## 🚀 Complete Setup (15 minutes)

### Step 1: Create EmailJS Account (2 minutes)

1. Go to <https://dashboard.emailjs.com/sign-up>
2. Sign up with your Gmail account
3. Verify your email address

### Step 2: Connect Email Service (3 minutes)

1. Go to **Email Services** → **Add New Service**
2. Choose **Gmail** (or your preferred email provider)
3. Click **Connect Account**
4. Authorize EmailJS to send emails from your Gmail
5. Copy the **Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Templates (8 minutes)

Create 3 templates in EmailJS dashboard:

#### Template 1: New Message Notification (to you)

**Template ID**: `template_notification`

**Subject**: `New Contact Message from {{from_name}}`

**Content**:

```html
<h2>New Contact Message</h2>

<p><strong>From:</strong> {{from_name}}</p>
<p><strong>Email:</strong> <a href="mailto:{{from_email}}">{{from_email}}</a></p>
<p><strong>Subject:</strong> {{subject}}</p>
<p><strong>Priority:</strong> {{priority}}</p>

<h3>Message:</h3>
<p>{{message}}</p>

<p><strong>Received:</strong> {{received_at}}</p>

<p><a href="{{admin_url}}" style="background:#00D4FF;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">View in Admin Panel</a></p>

<hr>
<p style="color:#666;font-size:12px;">© 2025 CodePrince. All rights reserved.</p>
```

**Variables to add**:

- `from_name`
- `from_email`
- `subject`
- `message`
- `priority`
- `received_at`
- `admin_url`

---

#### Template 2: Auto Reply (to sender)

**Template ID**: `template_autoreply`

**Subject**: `Thank you for contacting CodePrince`

**Content**:

```html
<h2>Message Received!</h2>

<p>Hi {{to_name}},</p>

<p>Thank you for reaching out! I've received your message regarding "<strong>{{original_subject}}</strong>" and wanted to let you know that I'll get back to you as soon as possible.</p>

<p>I typically respond within <strong>24 hours</strong>. I appreciate your patience and look forward to connecting with you.</p>

<h3>What happens next?</h3>
<ul>
  <li>I'll review your message carefully</li>
  <li>I'll respond within 24 hours</li>
  <li>You'll receive a personalized reply to your inquiry</li>
</ul>

<p>In the meantime, feel free to explore my website or check out my latest projects.</p>

<p>Best regards,<br>
<strong>Prince Kyeremeh</strong><br>
CodePrince</p>

<hr>
<p style="color:#666;font-size:12px;">© 2025 CodePrince. All rights reserved.</p>
```

**Variables to add**:

- `to_name`
- `original_subject`

---

#### Template 3: Manual Reply (from admin panel)

**Template ID**: `template_reply`

**Subject**: `Re: {{original_subject}}`

**Content**:

```html
<p>Hi {{to_name}},</p>

<div>{{reply_content}}</div>

<hr style="margin:30px 0;border:none;border-top:1px solid #eee;">

<p style="color:#666;font-size:14px;font-style:italic;"><strong>Your original message:</strong></p>
<p style="color:#666;font-size:14px;font-style:italic;">{{original_message}}</p>

<p style="margin-top:30px;">Best regards,<br>
<strong>{{from_name}}</strong><br>
CodePrince<br>
<a href="mailto:contact@codeprince.qzz.io">contact@codeprince.qzz.io</a></p>

<hr>
<p style="color:#666;font-size:12px;">© 2025 CodePrince. All rights reserved.</p>
```

**Variables to add**:

- `to_name`
- `original_subject`
- `original_message`
- `reply_content`
- `from_name`

### Step 4: Get API Keys (2 minutes)

1. Go to **Account** → **General**
2. Copy your **Public Key** (e.g., `abc123xyz`)
3. This is safe to use in frontend code

### Step 5: Update Environment Variables

Add to your `.env` file:

```env
# EmailJS Configuration
VITE_EMAILJS_PUBLIC_KEY="your_public_key_here"
VITE_EMAILJS_SERVICE_ID="service_abc123"
VITE_EMAILJS_TEMPLATE_NOTIFICATION="template_notification"
VITE_EMAILJS_TEMPLATE_AUTO_REPLY="template_autoreply"
VITE_EMAILJS_TEMPLATE_MANUAL_REPLY="template_reply"
VITE_ADMIN_EMAIL="contact@codeprince.qzz.io"
```

### Step 6: Test the System

1. **Restart your dev server**: `npm run dev`
2. **Submit a test message** through your contact form
3. **Check your Gmail** for:
   - Notification email (to you)
   - Auto-reply confirmation (to sender)

## 🔒 Security Features

✅ **Rate Limiting** - 3 emails per minute per user
✅ **Input Sanitization** - XSS protection
✅ **Headless Browser Blocking** - Prevents bot abuse
✅ **Retry Logic** - Automatic retry on failure
✅ **Error Handling** - Graceful degradation

## 📊 Performance Features

✅ **Non-blocking** - Emails don't slow down form submission
✅ **Parallel Sending** - Notification + auto-reply sent simultaneously
✅ **Performance Monitoring** - Tracks email send duration
✅ **Exponential Backoff** - Smart retry timing

## 🎯 Features

| Feature | Status |
|---------|--------|
| **Notification to Admin** | ✅ Working |
| **Auto-reply to Sender** | ✅ Working |
| **Manual Reply from Admin** | ✅ Working |
| **Message Storage** | ✅ Working (Supabase) |
| **Admin Panel** | ✅ Working |
| **Rate Limiting** | ✅ Working |
| **Spam Protection** | ✅ Working |

## 🆚 Why EmailJS vs Resend?

| Feature | EmailJS | Resend |
|---------|---------|--------|
| **Setup Time** | 15 min | 30+ min |
| **Domain Verification** | ❌ Not needed | ✅ Required |
| **Free Tier** | 200/month | 100/month |
| **Deliverability** | ⭐⭐⭐⭐⭐ (Gmail) | ⭐⭐⭐⭐ (Custom domain) |
| **Bouncing Issues** | ❌ None | ✅ Common |
| **Frontend Only** | ✅ Yes | ❌ No (needs backend) |

## 🐛 Troubleshooting

### Emails not sending?

1. Check browser console for errors
2. Verify all environment variables are set
3. Check EmailJS dashboard for quota limits
4. Ensure Gmail account is connected

### Rate limit errors?

- Wait 1 minute between submissions
- Rate limit: 3 emails per minute per user

### Template variables not working?

- Ensure variable names match exactly (case-sensitive)
- Check EmailJS dashboard template preview

## 📚 Resources

- EmailJS Dashboard: <https://dashboard.emailjs.com>
- EmailJS Docs: <https://www.emailjs.com/docs/>
- Support: <https://www.emailjs.com/docs/faq/>

## ✅ Checklist

- [ ] EmailJS account created
- [ ] Gmail connected
- [ ] 3 templates created
- [ ] API keys copied
- [ ] Environment variables updated
- [ ] Dev server restarted
- [ ] Test email sent successfully
- [ ] Notification received
- [ ] Auto-reply received

## 🎉 You're Done

Your contact form now sends emails reliably using Gmail through EmailJS!
