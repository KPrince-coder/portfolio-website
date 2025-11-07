/**
 * Contact Component Constants
 *
 * Configuration and constant values for the contact section
 */

import { Mail, Linkedin, Github, Twitter } from "lucide-react";
import type { SocialLink, PriorityOption, ContactFormData } from "./types";

// ============================================================================
// FORM CONSTANTS
// ============================================================================

export const INITIAL_FORM_DATA: ContactFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
  priority: "medium",
};

export const MIN_MESSAGE_LENGTH = 10;
export const MAX_MESSAGE_LENGTH = 500;

// ============================================================================
// VALIDATION PATTERNS
// ============================================================================

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ============================================================================
// PRIORITY OPTIONS
// ============================================================================

export const PRIORITY_OPTIONS: PriorityOption[] = [
  {
    value: "low",
    label: "Low",
    color: "bg-green-500",
    description: "General inquiries",
  },
  {
    value: "medium",
    label: "Medium",
    color: "bg-yellow-500",
    description: "Standard priority",
  },
  {
    value: "high",
    label: "High",
    color: "bg-red-500",
    description: "Urgent matters",
  },
];

// ============================================================================
// SOCIAL LINKS
// ============================================================================

export const SOCIAL_LINKS: SocialLink[] = [
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/in/alexneural",
    color: "text-blue-500 hover:text-blue-400",
  },
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/alexneural",
    color: "text-secondary hover:text-secondary-glow",
  },
  {
    icon: Twitter,
    label: "Twitter",
    href: "https://twitter.com/alexneural",
    color: "text-blue-400 hover:text-blue-300",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:alex@alexneural.dev",
    color: "text-accent hover:text-accent-glow",
  },
];

// ============================================================================
// CONTACT INFO
// ============================================================================

export const CONTACT_INFO = {
  email: "alex@alexneural.dev",
  responseTime: "Within 24 hours",
};

// ============================================================================
// DEFAULT CONTACT DATA
// ============================================================================

import type { ContactData, ContactExpectation } from "./types";

export const DEFAULT_EXPECTATIONS: ContactExpectation[] = [
  {
    text: "Detailed discussion about your project requirements",
    color: "secondary",
  },
  {
    text: "Technical feasibility assessment and recommendations",
    color: "accent",
  },
  {
    text: "Transparent timeline and cost estimates",
    color: "success",
  },
  {
    text: "Ongoing support and collaboration approach",
    color: "warning",
  },
];

export const DEFAULT_CONTACT_DATA: ContactData = {
  title: "Let's Connect",
  title_highlight: "Connect",
  description:
    "Ready to discuss your next AI project? I'm always excited to collaborate on innovative solutions that push the boundaries of what's possible with data and artificial intelligence.",
  email: "alex@alexneural.dev",
  github_url: "https://github.com/alexneural",
  linkedin_url: "https://linkedin.com/in/alexneural",
  twitter_url: "https://twitter.com/alexneural",
  response_time: "Within 24 hours",
  expectations: DEFAULT_EXPECTATIONS,
};

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

export const SUCCESS_MESSAGE = {
  title: "Message sent successfully!",
  description:
    "Thank you for reaching out. I'll get back to you within 24 hours.",
};

export const ERROR_MESSAGE = {
  title: "Failed to send message",
  description: "Please try again or contact me directly via email.",
};
