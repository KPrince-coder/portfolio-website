# EmailJS Template Settings - Fix "Recipients address is empty"

## Error

```
Response: The recipients address is empty
Status: 422
```

## Cause

Your EmailJS templates don't have the "To Email" field configured.

## Solution

### Step 1: Open Template Settings

1. Go to <https://dashboard.emailjs.com/admin/templates>
2. Click on your template (e.g., `template_yhzt39b`)
3. Look at the **top section** of the template editor

### Step 2: Configure Email Fields

You'll see a section like this at the top:

```
┌─────────────────────────────────────────────┐
│ Template Settings                           │
├─────────────────────────────────────────────┤
│ To Email:    [________________]             │  ← IMPORTANT!
│ From Name:   [________________]             │
│ Reply To:    [________________]             │
│ Subject:     [________________]             │
│ Bcc:         [________________]             │
└─────────────────────────────────────────────┘
```

### Step 3: Set the Values

**For NOTIFICATION Template** (sends to you):

```
To Email:    {{to_email}}
From Name:   {{from_name}}
Reply To:    {{from_email}}
Subject:     New Contact Message from {{from_name}}
```

**For AUTO-REPLY Template** (sends to sender):

```
To Email:    {{to_email}}
From Name:   CodePrince
Reply To:    contact@codeprince.qzz.io
Subject:     Thank you for contacting CodePrince
```

### Step 4: Save

Click **Save** at the bottom of the template editor.

## Why This Matters

- `{{to_email}}` is a **variable** that our code fills in
- For notifications: `to_email = "contact@codeprince.qzz.io"` (your email)
- For auto-replies: `to_email = "sender@example.com"` (their email)

Without `{{to_email}}` in the template settings, EmailJS doesn't know where to send!

## Visual Example

### ❌ WRONG (Empty recipient)

```
To Email: [empty or hardcoded]
```

### ✅ CORRECT (Uses variable)

```
To Email: {{to_email}}
```

## All Variables Available

Our code sends these variables to your templates:

**Notification Template:**

- `{{to_email}}` - Your admin email
- `{{to_name}}` - "Admin"
- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email
- `{{subject}}` - Message subject
- `{{message}}` - Message content
- `{{priority}}` - Priority level
- `{{received_at}}` - Timestamp
- `{{admin_url}}` - Link to admin panel
- `{{current_year}}` - Current year

**Auto-Reply Template:**

- `{{to_email}}` - Sender's email
- `{{to_name}}` - Sender's name
- `{{from_name}}` - "CodePrince"
- `{{from_email}}` - Your email
- `{{original_subject}}` - Their subject
- `{{company_name}}` - "CodePrince"
- `{{expected_response_time}}` - "24 hours"
- `{{current_year}}` - Current year

## After Fixing

1. Save both templates
2. Go back to your site
3. Submit a test message
4. Check browser console - should see:

   ```
   ✅ Notification email sent successfully
   ✅ Auto-reply email sent successfully
   ```

## Still Getting Error?

Check these:

- [ ] `{{to_email}}` is in the "To Email" field (not in the HTML body)
- [ ] No typos in the variable name (must be exact)
- [ ] Template is saved
- [ ] Using the correct template ID in `.env`
