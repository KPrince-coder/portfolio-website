# EmailJS Template Creation - Visual Step-by-Step Guide

## 📋 Creating Your First Template

### Step 1: Go to Email Templates

1. Open <https://dashboard.emailjs.com/admin>
2. Click **"Email Templates"** in left sidebar
3. Click **"Create New Template"** button

### Step 2: Basic Information

```
Template Name: New Message Notification
Template ID: template_notification
```

### Step 3: Subject Line

```
Subject: New Contact Message from {{from_name}}
```

### Step 4: Content (HTML)

**Just paste the entire HTML from `EMAILJS_TEMPLATES.md`**

The template editor looks like this:

```
┌─────────────────────────────────────────┐
│ Subject: [New Contact Message from...] │
├─────────────────────────────────────────┤
│ Content:                                │
│ ┌─────────────────────────────────────┐ │
│ │ <h2>New Contact Message</h2>        │ │
│ │ <p><strong>From:</strong>           │ │
│ │ {{from_name}}</p>                   │ │
│ │ ...                                 │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Step 5: Variables Section (Optional but Recommended)

**After pasting the template**, scroll down to see **"Template Parameters"** section.

You'll see two options:

#### Option A: Auto-Detected Variables ✨

EmailJS automatically finds all `{{variables}}` in your template and lists them:

```
✓ from_name
✓ from_email
✓ subject
✓ message
✓ priority
✓ received_at
✓ admin_url
✓ current_year
```

#### Option B: Manually Add Variables (Better)

Click **"Add Parameter"** for each variable:

```
┌──────────────────────────────────────────┐
│ Parameter Name: from_name                │
│ Default Value: John Doe                  │
│ Description: Sender's name               │
└──────────────────────────────────────────┘
```

**Why add manually?**

- You can set default values for testing
- Add descriptions for your reference
- Better organized in the dashboard

---

## 🎨 Complete Variable Setup for Each Template

### Template 1: Notification

| Parameter Name | Default Value | Description |
|----------------|---------------|-------------|
| `from_name` | John Doe | Sender's name |
| `from_email` | <john@example.com> | Sender's email |
| `subject` | Project Inquiry | Message subject |
| `message` | I would like to discuss... | Message content |
| `priority` | medium | Priority level |
| `received_at` | Nov 12, 2024 | Timestamp |
| `admin_url` | https://... | Admin panel link |
| `current_year` | 2024 | Current year |

### Template 2: Auto Reply

| Parameter Name | Default Value | Description |
|----------------|---------------|-------------|
| `to_name` | John Doe | Recipient's name |
| `original_subject` | Project Inquiry | Original subject |
| `expected_response_time` | 24 hours | Response time |
| `company_name` | CodePrince | Company name |
| `current_year` | 2024 | Current year |

### Template 3: Manual Reply

| Parameter Name | Default Value | Description |
|----------------|---------------|-------------|
| `to_name` | John Doe | Recipient's name |
| `original_subject` | Project Inquiry | Original subject |
| `original_message` | I would like... | Original message |
| `reply_content` | Thank you for... | Your reply |
| `from_name` | Prince Kyeremeh | Your name |
| `company_name` | CodePrince | Company name |
| `current_year` | 2024 | Current year |

---

## ✅ Quick Answer to Your Question

**Do you need to add variables manually?**

**NO** - EmailJS will automatically detect `{{variable_name}}` when you paste the template.

**BUT** - It's recommended to add them manually for:

- Testing with default values
- Better organization
- Documentation

---

## 🚀 Fastest Way (What I Recommend)

1. **Paste the HTML template** → Variables auto-detected ✨
2. **Click "Test It"** button
3. **Fill in test values** → Send test email to yourself
4. **If it works** → You're done! ✅
5. **If you want** → Add variables manually later for organization

---

## 🎯 Testing Your Template

After creating the template:

1. Click **"Test It"** button in EmailJS dashboard
2. You'll see a form with all variables:

   ```
   from_name: [John Doe        ]
   from_email: [john@example.com]
   subject: [Project Inquiry   ]
   ...
   ```

3. Fill in test values
4. Click **"Send Test"**
5. Check your email!

---

## 📸 What You'll See in EmailJS Dashboard

```
┌─────────────────────────────────────────────────┐
│ Email Templates                                 │
├─────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────┐ │
│ │ template_notification                       │ │
│ │ New Contact Message from {{from_name}}      │ │
│ │ [Edit] [Test It] [Delete]                   │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ template_autoreply                          │ │
│ │ Thank you for contacting CodePrince         │ │
│ │ [Edit] [Test It] [Delete]                   │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ template_reply                              │ │
│ │ Re: {{original_subject}}                    │ │
│ │ [Edit] [Test It] [Delete]                   │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

---

## 💡 Pro Tips

1. **Use "Test It" frequently** - Test after creating each template
2. **Variables are case-sensitive** - `{{from_name}}` ≠ `{{From_Name}}`
3. **Spaces matter** - `{{from_name}}` ≠ `{{ from_name }}`
4. **Preview before saving** - Use the preview button
5. **Copy Template ID** - You'll need it for `.env` file

---

## ✅ Summary

**Just paste the HTML template** - EmailJS handles the rest automatically!

Variables will work immediately. Adding them manually is optional but helpful for testing and organization.

---

**Ready to create your templates?** Open `EMAILJS_TEMPLATES.md` and start copying! 🚀
