/**
 * Contact Component Utilities
 *
 * Validation and helper functions for the contact form
 */

import type { ContactFormData, ContactFormErrors } from "./types";
import { EMAIL_REGEX, MIN_MESSAGE_LENGTH } from "./constants";

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates the contact form data
 * @param formData - The form data to validate
 * @returns Object containing validation errors (empty if valid)
 */
export function validateContactForm(
  formData: ContactFormData
): ContactFormErrors {
  const errors: ContactFormErrors = {};

  // Name validation
  if (!formData.name.trim()) {
    errors.name = "Name is required";
  }

  // Email validation
  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  // Subject validation
  if (!formData.subject.trim()) {
    errors.subject = "Subject is required";
  }

  // Message validation
  if (!formData.message.trim()) {
    errors.message = "Message is required";
  } else if (formData.message.trim().length < MIN_MESSAGE_LENGTH) {
    errors.message = `Message must be at least ${MIN_MESSAGE_LENGTH} characters long`;
  }

  return errors;
}

/**
 * Checks if the form has any validation errors
 * @param errors - The errors object
 * @returns True if form is valid (no errors)
 */
export function isFormValid(errors: ContactFormErrors): boolean {
  return Object.keys(errors).length === 0;
}

/**
 * Sanitizes form data by trimming whitespace
 * @param formData - The form data to sanitize
 * @returns Sanitized form data
 */
export function sanitizeFormData(formData: ContactFormData): ContactFormData {
  return {
    ...formData,
    name: formData.name.trim(),
    email: formData.email.trim(),
    subject: formData.subject.trim(),
    message: formData.message.trim(),
  };
}

// ============================================================================
// CONTACT DATA UTILITIES
// ============================================================================

import type { ContactData, ProfileData, ContactSettings } from "./types";
import { DEFAULT_CONTACT_DATA } from "./constants";

/**
 * Merges profile and settings data into ContactData with fallbacks
 * @param profile - Profile data from database
 * @param settings - Contact settings from database
 * @returns Merged contact data with fallbacks
 */
export function mergeContactData(
  profile: ProfileData | null,
  settings: ContactSettings | null
): ContactData {
  return {
    email: profile?.email || DEFAULT_CONTACT_DATA.email,
    phone: profile?.phone,
    website_url: profile?.website_url,
    github_url: profile?.github_url || DEFAULT_CONTACT_DATA.github_url,
    linkedin_url: profile?.linkedin_url || DEFAULT_CONTACT_DATA.linkedin_url,
    twitter_url: profile?.twitter_url || DEFAULT_CONTACT_DATA.twitter_url,
    response_time:
      settings?.response_time || DEFAULT_CONTACT_DATA.response_time,
    expectations: settings?.expectations || DEFAULT_CONTACT_DATA.expectations,
  };
}
