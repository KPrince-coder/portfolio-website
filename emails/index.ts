/**
 * Email Templates - Public API
 *
 * Exports all email templates and utilities
 */

// Templates
export { NewMessageNotification } from "./templates/NewMessageNotification";
export type { NewMessageNotificationProps } from "./templates/NewMessageNotification";

export { ReplyToSender } from "./templates/ReplyToSender";
export type { ReplyToSenderProps } from "./templates/ReplyToSender";

export { AutoReply } from "./templates/AutoReply";
export type { AutoReplyProps } from "./templates/AutoReply";

// Components
export { EmailLayout } from "./components/EmailLayout";
export { EmailHeader } from "./components/EmailHeader";
export { EmailFooter } from "./components/EmailFooter";
export { EmailButton } from "./components/EmailButton";
export { EmailSection } from "./components/EmailSection";

// Utilities
export { renderToHtml, renderToText, renderEmail } from "./utils/render";
