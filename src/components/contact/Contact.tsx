/**
 * Contact Component
 *
 * Main contact section with form and information
 */

import React from "react";
import { ContactHeader } from "./ContactHeader";
import { ContactForm } from "./ContactForm";
import { ContactInfo } from "./ContactInfo";
import { useContactForm } from "./hooks/useContactForm";

// ============================================================================
// COMPONENT
// ============================================================================

export function Contact() {
  const {
    formData,
    errors,
    isSubmitting,
    updateField,
    updatePriority,
    submitForm,
  } = useContactForm();

  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-b from-background/50 to-background"
    >
      <div className="container mx-auto px-6">
        <ContactHeader />

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm
              formData={formData}
              errors={errors}
              isSubmitting={isSubmitting}
              onFieldChange={updateField}
              onPriorityChange={updatePriority}
              onSubmit={submitForm}
            />
          </div>

          {/* Contact Info & Social Links */}
          <ContactInfo />
        </div>
      </div>
    </section>
  );
}
