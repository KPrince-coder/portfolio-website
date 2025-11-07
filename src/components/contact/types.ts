/**
 * Contact Component Types
 *
 * Type definitions for the contact form and related components
 */

// ============================================================================
// FORM TYPES
// ============================================================================

export type MessagePriority = "low" | "medium" | "high";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  priority: MessagePriority;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

// ============================================================================
// SOCIAL LINK TYPES
// ============================================================================

export interface SocialLink {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  color: string;
}

// ============================================================================
// PRIORITY CONFIG
// ============================================================================

export interface PriorityOption {
  value: MessagePriority;
  label: string;
  color: string;
  description: string;
}
