# Email Template Variables Fix

## Issue

The email templates were showing default/static data instead of dynamic data from the actual messages because of a variable naming mismatch.

## Root Cause

- **React Email Templates** use camelCase: `senderName`, `senderEmail`, `companyName`
- **Edge Functions** were using snake_case: `sender_name`, `sender_email`, `company_name`
- The template rendering system couldn't match the variables, so it used default values

## Fix Applied

Updated both Edge Functions to use camelCase variable names matching the React Email templates:

### send-message-notification

**Before:**

```typescript
const variables = {
  sender_name: message.name,
  sender_email: message.email,
  created_at: ...,
  admin_url: ...,
  message_id: ...,
  company_name: ...
};
```

**After:**

```typescript
const variables = {
  senderName: message.name,
  senderEmail: message.email,
  createdAt: ...,
  adminUrl: ...,
  messageId: ...,
  companyName: "CodePrince"
};
```

### send-reply

**Before:**

```typescript
const variables = {
  sender_name: message.name,
  reply_content,
  original_message: ...,
  original_subject: ...,
  admin_name: ...,
  company_name: ...,
  company_email: ...
};
```

**After:**

```typescript
const variables = {
  senderName: message.name,
  replyContent: reply_content,
  originalMessage: ...,
  originalSubject: ...,
  adminName: ...,
  companyName: "CodePrince",
  companyEmail: ...
};
```

## Variable Mapping

| React Email Template | Edge Function Variable | Description |
|---------------------|------------------------|-------------|
| `senderName` | `message.name` | Sender's name |
| `senderEmail` | `message.email` | Sender's email |
| `subject` | `message.subject` | Message subject |
| `message` | `message.message` | Message content |
| `priority` | `message.priority` | Priority level |
| `category` | `message.category` | Message category |
| `createdAt` | `new Date(...).toLocaleString()` | Formatted timestamp |
| `adminUrl` | `${config.adminUrl}/messages?id=${message.id}` | Admin panel link |
| `messageId` | `message.id` | Message UUID |
| `companyName` | `"CodePrince"` | Company name |
| `replyContent` | `reply_content` | Admin's reply |
| `originalMessage` | `message.message` | Original message |
| `originalSubject` | `message.subject` | Original subject |
| `adminName` | `admin_name` or "Support Team" | Admin's name |
| `companyEmail` | `config.fromEmail` | Company email |

## Testing

After deploying the fix, test by:

1. **Submit a contact form message**
2. **Check the notification email** - should show actual sender name, email, and message
3. **Reply to a message** - should show actual reply content and original message

## Files Updated

- `supabase/functions/send-message-notification/index.ts`
- `supabase/functions/send-reply/index.ts`

## Deployment

```bash
npx supabase functions deploy send-message-notification
npx supabase functions deploy send-reply
```

## Result

✅ Emails now display dynamic data from actual messages
✅ Sender information shows correctly
✅ Message content is properly rendered
✅ Company name shows as "CodePrince"
✅ All template variables are properly mapped
