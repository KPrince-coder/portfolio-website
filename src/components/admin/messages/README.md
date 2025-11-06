# Messages Module

Comprehensive contact messages management system with email templates and analytics.

## 📁 Structure

```
messages/
├── hooks/                      # Data layer
│   ├── useMessages.ts         # Message CRUD operations
│   ├── useMessageStats.ts     # Statistics and analytics
│   └── useEmailTemplates.ts   # Email template management
├── sections/                   # UI components
│   ├── MessagesList.tsx       # Main messages list
│   ├── MessageReply.tsx       # Reply interface
│   ├── MessageStats.tsx       # Statistics dashboard
│   └── EmailTemplatesSection.tsx  # Template management
├── MessagesManagement.tsx      # Main container
├── MessagesManagementRouter.tsx   # Routing logic
├── types.ts                    # Type definitions
├── index.ts                    # Public exports
└── README.md                   # This file
```

## 🎯 Features

### Message Management

- ✅ View all messages with advanced filtering
- ✅ Mark as read/unread
- ✅ Reply to messages with rich text editor
- ✅ Archive/unarchive messages
- ✅ Bulk operations
- ✅ Priority and category management
- ✅ Tag support

### Email Templates

- ✅ Create and manage email templates
- ✅ Variable substitution
- ✅ Preview functionality
- ✅ Template types:
  - New message notification (to admin)
  - Reply to sender
  - Auto-reply

### Analytics

- ✅ Total messages count
- ✅ Unread messages tracking
- ✅ Response rate calculation
- ✅ Average response time
- ✅ Weekly/monthly trends

## 🔧 Usage

### Import Types

```typescript
import type {
  ContactMessage,
  MessageFilters,
  MessageStats,
  EmailTemplate,
} from '@/components/admin/messages';
```

### Import Components (after refactoring)

```typescript
import {
  MessagesList,
  MessageReply,
  MessageStats,
  MessagesManagement,
} from '@/components/admin/messages';
```

### Import Hooks (after implementation)

```typescript
import {
  useMessages,
  useMessageStats,
  useEmailTemplates,
} from '@/components/admin/messages';
```

## 📝 Type Definitions

### ContactMessage

Represents a contact form submission.

```typescript
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string | null;
  priority: string | null;
  category: string | null;
  tags: string[] | null;
  archived: boolean | null;
  is_replied: boolean | null;
  reply_content: string | null;
  reply_sent_at: string | null;
  created_at: string;
  updated_at: string;
}
```

### MessageFilters

Filter criteria for message list.

```typescript
interface MessageFilters {
  status?: MessageStatus | "all" | "archived";
  priority?: MessagePriority | "all";
  category?: MessageCategory | "all";
  search?: string;
}
```

### EmailTemplate

Email template configuration.

```typescript
interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  text_content: string | null;
  template_type: string;
  is_active: boolean | null;
  variables: Json | null;
  created_at: string;
  updated_at: string;
}
```

## 🚀 Migration Status

### Phase 1: Core Structure ✅

- [x] Create folder structure
- [x] Create comprehensive types.ts
- [x] Create index.ts for exports
- [x] Create README.md

### Phase 2: Hooks (In Progress)

- [ ] useMessages.ts
- [ ] useMessageStats.ts
- [ ] useEmailTemplates.ts

### Phase 3: Component Refactoring (Pending)

- [ ] Move ContactMessages.tsx → sections/MessagesList.tsx
- [ ] Move MessageReply.tsx → sections/MessageReply.tsx
- [ ] Move MessageStats.tsx → sections/MessageStats.tsx
- [ ] Move EmailTemplateForm.tsx → sections/EmailTemplatesSection.tsx

### Phase 4: Integration (Pending)

- [ ] Create MessagesManagement.tsx
- [ ] Create MessagesManagementRouter.tsx
- [ ] Update AdminContent.tsx imports

### Phase 5: Cleanup (Pending)

- [ ] Remove duplicate types from admin/types.ts
- [ ] Remove old component files
- [ ] Update all imports across codebase

## 🔗 Related Documentation

- [Messages Refactoring Plan](../../../docs/MESSAGES_REFACTORING_PLAN.md)
- [Blog System Review](../../../docs/BLOG_SYSTEM_COMPREHENSIVE_REVIEW.md) (reference implementation)

## 📊 Best Practices

### Type Safety

- All types aligned with Supabase schema
- Strict TypeScript mode enabled
- Proper null handling

### Performance

- React.memo for expensive components
- useMemo/useCallback for optimization
- Debounced search
- Lazy loading

### Accessibility

- ARIA labels
- Keyboard navigation
- Screen reader support
- Focus management

### Code Quality

- Single Responsibility Principle
- DRY principles
- Proper error handling
- Comprehensive documentation
