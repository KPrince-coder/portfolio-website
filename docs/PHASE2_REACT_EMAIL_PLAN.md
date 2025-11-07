# Phase 2: React Email Templates - Implementation Plan

## Overview

Implement React Email component-based templates for beautiful, maintainable email designs.

## Goals

1. ✅ Create reusable React Email components
2. ✅ Build professional email templates
3. ✅ Add template preview functionality
4. ✅ Integrate with existing system
5. ✅ Maintain backward compatibility

## Architecture

```
React Email Templates (TSX)
         ↓
    Build Process
         ↓
   HTML + Text Output
         ↓
Store in react_email_templates table
         ↓
Edge Functions use rendered HTML
         ↓
    Resend API
```

## Implementation Steps

### Step 1: Setup React Email ✅

**Install Dependencies**:

```bash
npm install @react-email/components
npm install -D @react-email/render
```

**Files to Create**:

- `emails/` - Email template components
- `emails/components/` - Reusable email components
- `emails/utils/` - Email utilities
- `scripts/build-emails.ts` - Build script

### Step 2: Create Base Components ✅

**Reusable Components**:

- `EmailLayout.tsx` - Base layout wrapper
- `EmailHeader.tsx` - Header with branding
- `EmailFooter.tsx` - Footer with links
- `EmailButton.tsx` - Styled button
- `EmailSection.tsx` - Content section

### Step 3: Create Email Templates ✅

**Templates to Build**:

1. `NewMessageNotification.tsx` - Admin notification
2. `ReplyToSender.tsx` - Reply email
3. `AutoReply.tsx` - Automatic acknowledgment
4. `WelcomeEmail.tsx` - Welcome message (future)

### Step 4: Build System ✅

**Build Script**:

- Render React components to HTML
- Generate plain text versions
- Store in database
- Update template metadata

### Step 5: Preview System ✅

**Preview Features**:

- Live preview in admin panel
- Test with sample data
- Send test emails
- Mobile/desktop views

### Step 6: Integration ✅

**Update Components**:

- EmailTemplateForm - Add React Email support
- EmailTemplatesSection - Add preview
- Edge Functions - Use new templates

## File Structure

```
emails/
├── components/
│   ├── EmailLayout.tsx
│   ├── EmailHeader.tsx
│   ├── EmailFooter.tsx
│   ├── EmailButton.tsx
│   └── EmailSection.tsx
├── templates/
│   ├── NewMessageNotification.tsx
│   ├── ReplyToSender.tsx
│   ├── AutoReply.tsx
│   └── WelcomeEmail.tsx
├── utils/
│   ├── render.ts
│   └── variables.ts
└── index.ts

scripts/
└── build-emails.ts

src/components/admin/messages/
├── sections/
│   ├── EmailTemplatePreview.tsx (new)
│   └── EmailTemplatesSection.tsx (update)
└── hooks/
    └── useReactEmailTemplates.ts (new)
```

## Template Props Interface

```typescript
interface NewMessageNotificationProps {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  createdAt: string;
  adminUrl: string;
  messageId: string;
  companyName: string;
}

interface ReplyToSenderProps {
  senderName: string;
  replyContent: string;
  originalMessage: string;
  originalSubject: string;
  adminName: string;
  companyName: string;
  companyEmail: string;
}
```

## Benefits

### Developer Experience

- ✅ Type-safe props
- ✅ Component reusability
- ✅ Hot reload in development
- ✅ Easy to maintain

### Design Quality

- ✅ Consistent branding
- ✅ Responsive design
- ✅ Cross-client compatibility
- ✅ Professional appearance

### Maintainability

- ✅ Version control
- ✅ Easy updates
- ✅ Testable components
- ✅ Clear structure

## Migration Strategy

### Phase 2A: Setup & Base Components

1. Install dependencies
2. Create folder structure
3. Build base components
4. Setup build system

### Phase 2B: Email Templates

1. Create notification template
2. Create reply template
3. Create auto-reply template
4. Test all templates

### Phase 2C: Preview System

1. Create preview component
2. Add to admin panel
3. Add test email functionality
4. Add mobile preview

### Phase 2D: Integration

1. Update database with new templates
2. Update Edge Functions to use new templates
3. Add template selection in UI
4. Migrate existing templates

## Success Criteria

- [ ] React Email installed and configured
- [ ] Base components created
- [ ] All email templates built
- [ ] Preview system working
- [ ] Templates stored in database
- [ ] Edge Functions using new templates
- [ ] Backward compatibility maintained
- [ ] Documentation complete

## Timeline

- **Step 1-2**: 1-2 hours (Setup & Base Components)
- **Step 3**: 2-3 hours (Email Templates)
- **Step 4**: 1 hour (Build System)
- **Step 5**: 2 hours (Preview System)
- **Step 6**: 1-2 hours (Integration)

**Total**: 7-10 hours

---

**Status**: Ready to Start
**Next**: Install dependencies and create base components
