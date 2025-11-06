/**
 * Messages Module - Public API
 *
 * Centralized exports for the messages module
 *
 * @module messages
 */

// ============================================================================
// TYPES
// ============================================================================

export type {
  // Message Types
  MessageStatus,
  MessagePriority,
  MessageCategory,
  ContactMessage,
  MessageFilters,
  MessageStats,

  // Email Template Types
  EmailTemplateType,
  EmailTemplate,
  EmailTemplateFormData,

  // Component Props
  MessagesListProps,
  MessageReplyProps,
  MessageStatsProps,
  EmailTemplateFormProps,

  // API Types
  CreateMessageInput,
  UpdateMessageInput,
  SendReplyInput,

  // Result Types
  Result,
  PaginationOptions,
  PaginatedResponse,
} from "./types";

// ============================================================================
// COMPONENTS (to be added as they're refactored)
// ============================================================================

// export { MessagesList } from './sections/MessagesList';
// export { MessageReply } from './sections/MessageReply';
// export { MessageStats } from './sections/MessageStats';
// export { EmailTemplatesSection } from './sections/EmailTemplatesSection';
// export { MessagesManagement } from './MessagesManagement';
// export { MessagesManagementRouter } from './MessagesManagementRouter';

// ============================================================================
// HOOKS (to be added)
// ============================================================================

// export { useMessages } from './hooks/useMessages';
// export { useMessageStats } from './hooks/useMessageStats';
// export { useEmailTemplates } from './hooks/useEmailTemplates';
