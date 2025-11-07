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

  // Email Service Types
  SendNotificationParams,
  SendReplyParams,
  EmailResponse,
  EmailLog,
  EmailStatistics,

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
// COMPONENTS
// ============================================================================

export { MessagesList } from "./sections/MessagesList";
export { MessageReply } from "./sections/MessageReply";
export { MessageStats as MessageStatsComponent } from "./sections/MessageStats";
export { EmailTemplatesSection } from "./sections/EmailTemplatesSection";
export { MessagesManagement } from "./MessagesManagement";
export { MessagesManagementRouter } from "./MessagesManagementRouter";

// ============================================================================
// HOOKS
// ============================================================================

export { useMessages } from "./hooks/useMessages";
export { useMessageStats } from "./hooks/useMessageStats";
export { useEmailTemplates } from "./hooks/useEmailTemplates";

// ============================================================================
// UTILITIES
// ============================================================================

export { splitTitle } from "./utils";
