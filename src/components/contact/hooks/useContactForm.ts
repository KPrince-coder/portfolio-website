/**
 * useContactForm Hook
 *
 * Custom hook for managing contact form state and submission
 */

import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  sendNotificationEmail,
  sendAutoReplyEmail,
} from "@/services/emailjs.service";
import type { ContactFormData, ContactFormErrors } from "../types";
import { validateContactForm, isFormValid, sanitizeFormData } from "../utils";
import {
  INITIAL_FORM_DATA,
  SUCCESS_MESSAGE,
  ERROR_MESSAGE,
} from "../constants";

// ============================================================================
// HOOK
// ============================================================================

export function useContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // ============================================================================
  // HANDLERS
  // ============================================================================

  /**
   * Updates a single form field
   */
  const updateField = useCallback(
    (field: keyof ContactFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  /**
   * Updates the priority field
   */
  const updatePriority = useCallback(
    (priority: ContactFormData["priority"]) => {
      setFormData((prev) => ({ ...prev, priority }));
    },
    []
  );

  /**
   * Validates the form
   */
  const validateForm = useCallback((): boolean => {
    const validationErrors = validateContactForm(formData);
    setErrors(validationErrors);
    return isFormValid(validationErrors);
  }, [formData]);

  /**
   * Resets the form to initial state
   */
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
  }, []);

  /**
   * Submits the contact form
   */
  const submitForm = useCallback(async (): Promise<boolean> => {
    if (!validateForm()) {
      return false;
    }

    setIsSubmitting(true);

    try {
      const sanitizedData = sanitizeFormData(formData);

      // Insert message into database
      const { data, error } = await supabase
        .from("contact_messages")
        .insert([
          {
            name: sanitizedData.name,
            email: sanitizedData.email,
            subject: sanitizedData.subject,
            message: sanitizedData.message,
            priority: sanitizedData.priority,
            category: "general",
            ip_address: null,
            user_agent: navigator.userAgent,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Send emails via EmailJS (non-blocking)
      Promise.all([
        // 1. Send notification to admin
        sendNotificationEmail({
          senderName: sanitizedData.name,
          senderEmail: sanitizedData.email,
          subject: sanitizedData.subject,
          message: sanitizedData.message,
          priority: sanitizedData.priority,
          messageId: data.id,
        }),
        // 2. Send auto-reply to sender
        sendAutoReplyEmail({
          senderName: sanitizedData.name,
          senderEmail: sanitizedData.email,
          subject: sanitizedData.subject,
        }),
      ]).catch((emailError) => {
        console.error("Email sending failed:", emailError);
        // Don't fail the whole operation if emails fail
      });

      // Show success message
      toast({
        title: SUCCESS_MESSAGE.title,
        description: SUCCESS_MESSAGE.description,
      });

      // Reset form
      resetForm();
      return true;
    } catch (error) {
      console.error("Contact form error:", error);

      // Show error message
      toast({
        variant: "destructive",
        title: ERROR_MESSAGE.title,
        description: ERROR_MESSAGE.description,
      });

      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, resetForm, toast]);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    updatePriority,
    submitForm,
    resetForm,
  };
}
