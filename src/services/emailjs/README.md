# EmailJS Service Module

Modern, modular email service using EmailJS with security and performance optimizations.

## 📁 Structure

```
services/
├── emailjs.service.ts      # Main service implementation
├── emailjs.types.ts        # Type definitions
├── emailjs.rateLimit.ts    # Rate limiting utility
├── emailjs.sanitize.ts     # Input sanitization utilities
└── emailjs/
    └── index.ts            # Public API exports
```

## 🎯 Features

- ✅ **Rate Limiting**: Prevents abuse with configurable limits
- ✅ **Input Sanitization**: XSS protection and data cleaning
- ✅ **Retry Logic**: Automatic retry with exponential backoff
- ✅ **Performance Monitoring**: Tracks email send duration
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Modular Design**: Separated concerns for maintainability

## 📦 Usage

### Basic Import

```typescript
import { EmailJSService, sendNotificationEmail } from '@/services/emailjs.service';

// Or use the module index
import { EmailJSService, sendNotificationEmail } from '@/services/emailjs';
```

### Initialize Service

```typescript
// In App.tsx or main entry point
import { EmailJSService } from '@/services/emailjs.service';

EmailJSService.init();
```

### Send Notification Email

```typescript
import { sendNotificationEmail } from '@/services/emailjs.service';

const result = await sendNotificationEmail({
  senderName: 'John Doe',
  senderEmail: 'john@example.com',
  subject: 'Contact Form Submission',
  message: 'Hello, I would like to...',
  priority: 'high',
  messageId: 'msg-123'
});

if (result.success) {
  console.log('Email sent!', result.messageId);
} else {
  console.error('Failed:', result.error);
}
```

### Send Auto-Reply

```typescript
import { sendAutoReplyEmail } from '@/services/emailjs.service';

await sendAutoReplyEmail({
  senderName: 'John Doe',
  senderEmail: 'john@example.com',
  subject: 'Contact Form Submission'
});
```

### Send Manual Reply

```typescript
import { sendManualReplyEmail } from '@/services/emailjs.service';

await sendManualReplyEmail({
  recipientName: 'John Doe',
  recipientEmail: 'john@example.com',
  replyContent: '<p>Thank you for your message...</p>',
  originalMessage: 'Original message text',
  originalSubject: 'Contact Form Submission',
  adminName: 'Admin Name'
});
```

## 🔧 Utilities

### Rate Limiter

```typescript
import { RateLimiter } from '@/services/emailjs.rateLimit';

const limiter = new RateLimiter({
  maxAttempts: 5,
  windowMs: 60000 // 1 minute
});

if (limiter.check('user@example.com')) {
  // Proceed with operation
} else {
  // Rate limit exceeded
}
```

### Input Sanitization

```typescript
import {
  sanitizeEmail,
  sanitizeText,
  validateEmailParams
} from '@/services/emailjs.sanitize';

const cleanEmail = sanitizeEmail(' USER@EXAMPLE.COM ');
// Returns: 'user@example.com'

const cleanText = sanitizeText('<script>alert("xss")</script>Hello');
// Returns: 'Hello'

const validation = validateEmailParams({
  to_email: 'user@example.com',
  from_email: 'admin@example.com',
  from_name: 'Admin',
  subject: 'Test',
  message: 'Hello'
});

if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
}
```

## 📝 Types

### EmailResponse

```typescript
interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  duration?: number;
}
```

### NotificationEmailParams

```typescript
interface NotificationEmailParams {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  priority?: string;
  messageId?: string;
}
```

### AutoReplyEmailParams

```typescript
interface AutoReplyEmailParams {
  senderName: string;
  senderEmail: string;
  subject: string;
}
```

### ManualReplyEmailParams

```typescript
interface ManualReplyEmailParams {
  recipientName: string;
  recipientEmail: string;
  replyContent: string;
  originalMessage: string;
  originalSubject: string;
  adminName?: string;
}
```

## 🔒 Security Features

1. **XSS Prevention**: Removes script and iframe tags
2. **Email Validation**: Validates email format
3. **Rate Limiting**: Prevents spam and abuse
4. **Input Sanitization**: Cleans all user inputs
5. **Headless Browser Blocking**: Blocks automated bots

## ⚡ Performance

- **Retry Logic**: Up to 3 attempts with exponential backoff
- **Performance Monitoring**: Tracks send duration
- **Rate Limiting**: Prevents server overload
- **Efficient Caching**: Reuses EmailJS instance

## 🧪 Testing

```typescript
import { EmailJSService } from '@/services/emailjs.service';

// Mock EmailJS for testing
jest.mock('@emailjs/browser');

describe('EmailJSService', () => {
  it('should send notification email', async () => {
    const result = await EmailJSService.sendNotification({
      senderName: 'Test User',
      senderEmail: 'test@example.com',
      subject: 'Test',
      message: 'Test message'
    });
    
    expect(result.success).toBe(true);
  });
});
```

## 📚 Related Documentation

- [EmailJS Setup Guide](../../../EMAILJS_QUICKSTART.md)
- [EmailJS Templates](../../../EMAILJS_TEMPLATES.md)
- [Email Configuration](../../config/emailjs.config.ts)

## 🔄 Migration Guide

If you're using the old inline implementation:

**Before:**

```typescript
import { sendNotificationEmail } from '@/services/emailjs.service';
```

**After (no changes needed):**

```typescript
import { sendNotificationEmail } from '@/services/emailjs.service';
// Or use the module index
import { sendNotificationEmail } from '@/services/emailjs';
```

All existing imports continue to work. The refactoring is backward compatible.

## 🎯 Best Practices

1. **Always initialize**: Call `EmailJSService.init()` on app start
2. **Handle errors**: Check `result.success` before proceeding
3. **Sanitize inputs**: Use provided sanitization utilities
4. **Respect rate limits**: Don't bypass rate limiting
5. **Monitor performance**: Log `result.duration` for monitoring

## 🐛 Troubleshooting

### Email not sending

1. Check EmailJS configuration in `emailjs.config.ts`
2. Verify service is initialized: `EmailJSService.init()`
3. Check browser console for errors
4. Verify rate limits not exceeded

### Rate limit errors

```typescript
import { RateLimiter } from '@/services/emailjs.rateLimit';

// Reset rate limit for testing
rateLimiter.reset('user@example.com');
```

### Validation errors

```typescript
import { validateEmailParams } from '@/services/emailjs.sanitize';

const validation = validateEmailParams(params);
console.log('Errors:', validation.errors);
```
