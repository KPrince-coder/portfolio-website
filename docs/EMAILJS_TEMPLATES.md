# EmailJS Templates - Neural Network Theme

**App Colors**: Cyan (#00D4FF) → Purple (#9D4EDD) → Coral (#FF6B6B)

---

## Template 1: New Message Notification

**Template ID**: `template_notification`  
**Subject**: `New Contact Message from {{from_name}}`

### HTML Content (Copy & Paste)

```html
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#18182b;color:#ffffff;padding:40px 20px;">
  
  <div style="background:linear-gradient(135deg,#00D4FF 0%,#9D4EDD 50%,#FF6B6B 100%);padding:30px;border-radius:12px;margin-bottom:30px;">
    <h2 style="margin:0;color:#ffffff;font-size:24px;">New Contact Message</h2>
  </div>

  <div style="background:#1f1f33;border:1px solid #2d2d44;border-radius:8px;padding:30px;margin-bottom:20px;">
    <p style="margin:10px 0;"><strong style="color:#00D4FF;">From:</strong> <span style="color:#e2e8f0;">{{from_name}}</span></p>
    <p style="margin:10px 0;"><strong style="color:#00D4FF;">Email:</strong> <a href="mailto:{{from_email}}" style="color:#00D4FF;text-decoration:none;">{{from_email}}</a></p>
    <p style="margin:10px 0;"><strong style="color:#00D4FF;">Subject:</strong> <span style="color:#e2e8f0;">{{subject}}</span></p>
    <p style="margin:10px 0;"><strong style="color:#00D4FF;">Priority:</strong> <span style="color:#FF6B6B;text-transform:uppercase;font-weight:bold;">{{priority}}</span></p>
    
    <div style="margin-top:25px;padding-top:20px;border-top:1px solid #2d2d44;">
      <h3 style="color:#9D4EDD;font-size:16px;margin:0 0 15px 0;">Message:</h3>
      <p style="color:#cbd5e1;white-space:pre-wrap;line-height:1.6;margin:0;">{{message}}</p>
    </div>
    
    <p style="margin:20px 0 0 0;color:#64748b;font-size:13px;"><strong>Received:</strong> {{received_at}}</p>
  </div>

  <div style="text-align:center;margin:30px 0;">
    <a href="{{admin_url}}" style="background:linear-gradient(135deg,#00D4FF,#9D4EDD);color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:bold;box-shadow:0 4px 15px rgba(0,212,255,0.3);">
      View in Admin Panel
    </a>
  </div>

  <div style="text-align:center;padding-top:30px;border-top:1px solid #2d2d44;">
    <p style="color:#64748b;font-size:12px;margin:0;">© {{current_year}} CodePrince. All rights reserved.</p>
  </div>
</div>
```

---

## Template 2: Auto-Reply Template

**Template ID**: `template_autoreply`  
**Subject**: `Thank you for contacting CodePrince`  
**Purpose**: Automatic confirmation when someone contacts you

### HTML Content (Copy & Paste)

```html
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#18182b;color:#ffffff;padding:40px 20px;">
  
  <div style="background:linear-gradient(135deg,#00D4FF 0%,#9D4EDD 50%,#FF6B6B 100%);padding:30px;border-radius:12px;margin-bottom:30px;text-align:center;">
    <h2 style="margin:0;color:#ffffff;font-size:26px;">Message Received!</h2>
  </div>

  <div style="background:#1f1f33;border:1px solid #2d2d44;border-radius:8px;padding:30px;margin-bottom:20px;">
    <p style="color:#e2e8f0;line-height:1.6;margin:0 0 20px 0;">Hi <strong style="color:#00D4FF;">{{to_name}}</strong>,</p>

    <p style="color:#cbd5e1;line-height:1.6;margin:0 0 20px 0;">
      Thank you for reaching out! I've received your message regarding "<strong style="color:#9D4EDD;">{{original_subject}}</strong>" and wanted to let you know that I'll get back to you as soon as possible.
    </p>

    <p style="color:#cbd5e1;line-height:1.6;margin:0 0 30px 0;">
      I typically respond within <strong style="color:#FF6B6B;">24 hours</strong>. I appreciate your patience and look forward to connecting with you.
    </p>

    <div style="background:rgba(0,212,255,0.1);border-left:4px solid #00D4FF;padding:20px;border-radius:6px;margin:20px 0;">
      <h3 style="color:#00D4FF;margin:0 0 15px 0;font-size:18px;">What happens next?</h3>
      <ul style="color:#cbd5e1;line-height:1.8;margin:0;padding-left:20px;">
        <li>I'll review your message carefully</li>
        <li>I'll respond within 24 hours</li>
        <li>You'll receive a personalized reply to your inquiry</li>
      </ul>
    </div>

    <p style="color:#cbd5e1;line-height:1.6;margin:20px 0 0 0;">
      In the meantime, feel free to explore my website or check out my latest projects.
    </p>
  </div>

  <div style="background:#1f1f33;border:1px solid #2d2d44;border-radius:8px;padding:25px;margin-bottom:20px;">
    <p style="color:#cbd5e1;margin:0 0 5px 0;">Best regards,</p>
    <p style="margin:0;"><strong style="color:#00D4FF;font-size:18px;">Prince Kyeremeh</strong></p>
    <p style="color:#9D4EDD;margin:5px 0 0 0;">{{company_name}}</p>
  </div>

  <div style="text-align:center;padding-top:30px;border-top:1px solid #2d2d44;">
    <p style="color:#64748b;font-size:12px;margin:0;">© {{current_year}} CodePrince. All rights reserved.</p>
  </div>
</div>
```

---

## Template 3: Manual Reply Template

**Template ID**: `template_manual_reply`  
**Subject**: `Re: {{original_subject}}`  
**Purpose**: Your custom replies from admin panel

### HTML Content (Copy & Paste)

```html
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#18182b;color:#ffffff;padding:40px 20px;">
  
  <div style="background:linear-gradient(135deg,#00D4FF 0%,#9D4EDD 50%,#FF6B6B 100%);padding:20px;border-radius:12px;margin-bottom:30px;">
    <p style="margin:0;color:#ffffff;font-size:14px;">Reply from CodePrince</p>
  </div>

  <div style="background:#1f1f33;border:1px solid #2d2d44;border-radius:8px;padding:30px;margin-bottom:20px;">
    <p style="color:#e2e8f0;line-height:1.6;margin:0 0 20px 0;">Hi <strong style="color:#00D4FF;">{{to_name}}</strong>,</p>

    <div style="color:#cbd5e1;line-height:1.6;margin:20px 0;">
      {{{reply_content}}}
    </div>
  </div>

  <div style="background:rgba(157,78,221,0.1);border-left:4px solid #9D4EDD;padding:20px;border-radius:6px;margin:20px 0;">
    <p style="color:#9D4EDD;font-size:13px;font-weight:bold;margin:0 0 10px 0;">Your original message:</p>
    <p style="color:#94a3b8;font-size:14px;font-style:italic;margin:0;white-space:pre-wrap;line-height:1.5;">{{original_message}}</p>
  </div>

  <div style="background:#1f1f33;border:1px solid #2d2d44;border-radius:8px;padding:25px;margin:30px 0 20px 0;">
    <p style="color:#cbd5e1;margin:0 0 5px 0;">Best regards,</p>
    <p style="margin:0 0 5px 0;"><strong style="color:#00D4FF;font-size:18px;">{{from_name}}</strong></p>
    <p style="color:#9D4EDD;margin:0 0 10px 0;">{{company_name}}</p>
    <p style="margin:0;">
      <a href="mailto:contact@codeprince.qzz.io" style="color:#00D4FF;text-decoration:none;font-size:14px;">contact@codeprince.qzz.io</a>
    </p>
  </div>

  <div style="text-align:center;padding-top:30px;border-top:1px solid #2d2d44;">
    <p style="color:#64748b;font-size:12px;margin:0;">© {{current_year}} CodePrince. All rights reserved.</p>
  </div>
</div>
```

### Template Settings

In EmailJS dashboard, configure:

```
To Email: {{to_email}}
From Name: {{from_name}}
Reply To: contact@codeprince.qzz.io
Subject: Re: {{original_subject}}
```

---

## 🎯 Two Accounts Setup (Free Tier Workaround)

Since EmailJS free tier only allows 2 templates per account, use 2 accounts:

**Account 1 (Primary):**

- Template 1: Notification
- Template 2: Auto-reply

**Account 2 (Secondary):**

- Template 3: Manual Reply

See `EMAILJS_TWO_ACCOUNTS_SETUP.md` for detailed setup instructions!

---

## 🎨 Color Scheme

All templates use your app's neural network gradient:

- **Cyan**: `#00D4FF` - Primary accent, links, headings
- **Purple**: `#9D4EDD` - Secondary accent, labels
- **Coral**: `#FF6B6B` - Priority, warnings
- **Dark Background**: `#18182b` - Main background
- **Card Background**: `#1f1f33` - Content cards
- **Border**: `#2d2d44` - Subtle borders
- **Text**: `#e2e8f0` / `#cbd5e1` - Light text

---

## ✅ Variables Auto-Detection

**Just paste the HTML** - EmailJS will automatically find all `{{variables}}`!

You don't need to add them manually, but if you want to:

1. After pasting, scroll to "Template Parameters"
2. Click "Add Parameter" for each variable
3. Set default values for testing

---

## 🚀 Quick Start

1. Open <https://dashboard.emailjs.com/admin/templates>
2. Click "Create New Template"
3. Copy & paste HTML from above
4. Save
5. Done! Variables work automatically ✨

---

**All templates now match your app's cyberpunk/neural network theme!** 🎨
