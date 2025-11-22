/**
 * Messages Module Constants
 *
 * Centralized constants for the messages module
 *
 * @module messages/constants
 */

import type { ColorOption } from "./types";

// ============================================================================
// ADMIN SETTINGS CONSTANTS
// ============================================================================

export const DEFAULT_ADMIN_NAME = "CodePrince";

// ============================================================================
// CONTACT SETTINGS CONSTANTS
// ============================================================================

export const CONTACT_COLOR_OPTIONS: readonly ColorOption[] = [
  { value: "secondary", label: "Secondary", color: "bg-secondary" },
  { value: "accent", label: "Accent", color: "bg-accent" },
  { value: "success", label: "Success", color: "bg-success" },
  { value: "warning", label: "Warning", color: "bg-warning" },
  { value: "primary", label: "Primary", color: "bg-primary" },
] as const;

export const DEFAULT_EXPECTATION: Readonly<{ text: string; color: string }> = {
  text: "",
  color: "secondary",
} as const;

// ============================================================================
// MESSAGE STATUS CONSTANTS
// ============================================================================

export const MESSAGE_STATUS_COLORS = {
  unread: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  read: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  replied: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  spam: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
} as const;

// ============================================================================
// EMAIL TEMPLATE CONSTANTS
// ============================================================================

export const TEMPLATE_VARIABLES = {
  new_message_notification: [
    "{{sender_name}}",
    "{{sender_email}}",
    "{{subject}}",
    "{{message}}",
    "{{created_at}}",
    "{{admin_url}}",
    "{{message_id}}",
  ],
  reply_to_sender: [
    "{{sender_name}}",
    "{{reply_content}}",
    "{{original_message}}",
    "{{original_subject}}",
    "{{admin_name}}",
  ],
  auto_reply: [
    "{{sender_name}}",
    "{{subject}}",
    "{{admin_name}}",
    "{{company_name}}",
  ],
} as const;
