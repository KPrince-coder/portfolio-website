# Messages Module Refactoring Plan

## Overview

Refactor the contact messages system following the same best practices used for the blog module, with React Email and Resend integration.

## Current State

- Files scattered in `/src/components/admin/` root
- Components: `ContactMessages.tsx`, `MessageReply.tsx`, `MessageStats.tsx`, `EmailTemplateForm.tsx`
- No organized structure or hooks
- Basic functionality exists but needs modernization

## Target Structure

```
src/components/admin/messages/
├── hooks/
│   ├── useMessages.ts          # Message CRUD operations
│   ├── useMessageStats.ts      # Statistics and analytics
│   └── useEmailTemplates.ts    # Email template management
├── sections/
│   ├── MessagesList.tsx        # Main messages list (refactored)
│   ├── MessageReply.tsx        # Reply interface (refactored)
│   ├── MessageStats.tsx        # Statistics dashboard (refactored)
│   └── EmailTemplatesSection.tsx  # Template management
├── MessagesManagement.tsx      # Main container component
├── MessagesManagementRouter.tsx   # Routing logic
├── types.ts                    # ✅ DONE - Type definitions
├── index.ts                    # Public exports
└── README.md                   # Documentation
```

## Refactoring Tasks

### Phase 1: Core Structure ✅ COMPLETE

- [x] Create folder structure
- [x] Create comprehensive types.ts (aligned with Supabase schema)
- [x] Create index.ts for exports
- [x] Create README.md

**⚠️ Critical Issues Identified:**

- Type duplication between `admin/types.ts` and `messages/types.ts`
- Components still in root admin folder (not moved to messages/)
- Need to consolidate and migrate

### Phase 2: Hooks (Data Layer)

- [ ] **useMessages.ts**
  - Fetch messages with filters
  - Mark as read/unread
  - Update status, priority, category
  - Archive/unarchive
  - Delete messages
  - Bulk operations
  - Real-time updates (optional)

- [ ] **useMessageStats.ts**
  - Calculate statistics
  - Response time tracking
  - Message trends
  - Performance metrics

- [ ] **useEmailTemplates.ts**
  - CRUD operations for templates
  - Template variables parsing
  - Preview generation
  - React Email integration

### Phase 3: Component Refactoring

- [ ] **MessagesList.tsx** (from ContactMessages.tsx)
  - Modern table/card view
  - Advanced filtering
  - Bulk actions
  - Optimized rendering
  - Keyboard shortcuts

- [ ] **MessageReply.tsx**
  - Rich text editor (TipTap)
  - Template selection
  - Variable insertion
  - Preview mode
  - Draft auto-save

- [ ] **MessageStats.tsx**
  - Modern dashboard cards
  - Charts and graphs
  - Trend indicators
  - Export functionality

- [ ] **EmailTemplatesSection.tsx**
  - Template list
  - Template editor
  - React Email integration
  - Variable documentation
  - Preview and testing

### Phase 4: Integration

- [ ] **MessagesManagement.tsx**
  - Tab navigation
  - State management
  - Action handlers
  - Toast notifications

- [ ] **MessagesManagementRouter.tsx**
  - Route handling
  - Deep linking
  - State persistence

### Phase 5: React Email & Resend

- [ ] Set up React Email templates
- [ ] Create email components
- [ ] Integrate Resend API
- [ ] Auto-reply system
- [ ] Email tracking
- [ ] Delivery status

## Best Practices to Follow

### Code Quality

- ✅ TypeScript strict mode
- ✅ Comprehensive type definitions
- ✅ DRY principles
- ✅ Single Responsibility Principle
- ✅ Proper error handling
- ✅ Loading states
- ✅ Optimistic updates

### Performance

- ✅ React.memo for expensive components
- ✅ useMemo/useCallback for optimization
- ✅ Virtualization for long lists
- ✅ Debounced search
- ✅ Lazy loading
- ✅ Code splitting

### User Experience

- ✅ Keyboard shortcuts
- ✅ Bulk operations
- ✅ Undo/redo
- ✅ Draft auto-save
- ✅ Real-time updates
- ✅ Responsive design
- ✅ Accessibility (ARIA labels)

### Testing

- Unit tests for hooks
- Integration tests for components
- E2E tests for critical flows

## Migration Strategy

1. **Create new structure** (non-breaking)
2. **Implement hooks** (parallel to existing)
3. **Refactor components** (one at a time)
4. **Update imports** (in AdminContent.tsx)
5. **Remove old files** (after verification)
6. **Update documentation**

## React Email Templates

### Template Types

1. **New Message Notification** (to admin)
   - Sender info
   - Message preview
   - Quick reply link
   - Priority indicator

2. **Auto Reply** (to sender)
   - Acknowledgment
   - Expected response time
   - Alternative contact methods

3. **Reply to Sender** (manual reply)
   - Admin response
   - Original message context
   - Signature

### Variables System

```typescript
{
  sender_name: string;
  sender_email: string;
  subject: string;
  message: string;
  reply_content: string;
  admin_name: string;
  company_name: string;
  created_at: Date;
  message_id: string;
}
```

## Resend Integration

### Features

- Send transactional emails
- Track delivery status
- Handle bounces
- Email analytics
- Rate limiting
- Error handling

### Configuration

```typescript
// .env
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=noreply@domain.com
RESEND_ADMIN_EMAIL=admin@domain.com
```

## Success Criteria

- [ ] All components refactored and working
- [ ] No breaking changes to existing functionality
- [ ] Improved performance (measured)
- [ ] Better code organization
- [ ] Comprehensive documentation
- [ ] React Email templates working
- [ ] Resend integration complete
- [ ] Auto-reply system functional
- [ ] Email tracking implemented

## Timeline Estimate

- Phase 1: 30 minutes ✅
- Phase 2: 2-3 hours
- Phase 3: 3-4 hours
- Phase 4: 1-2 hours
- Phase 5: 2-3 hours

**Total: 8-12 hours**

## Next Steps

1. Create hooks (useMessages, useMessageStats, useEmailTemplates)
2. Refactor MessagesList component
3. Refactor MessageReply component
4. Create MessagesManagement container
5. Set up React Email
6. Integrate Resend
7. Test and document

---

**Status**: Phase 1 Complete ✅
**Last Updated**: 2025-11-06
