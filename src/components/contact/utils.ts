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
