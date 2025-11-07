/**
 * Contact Component
 *
 * Main contact section with form and information from backend
 */

import React from "react";
import { ContactHeader } from "./ContactHeader";
import { ContactForm } from "./ContactForm";
import { ContactInfo } from "./ContactInfo";
import { useContactForm } from "./hooks/useContactForm";
import { useContactData } from "./hooks/useContactData";

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

  const { contactData, loading } = useContactData();

  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-b from-background/50 to-background"
    >
      <div className="container mx-auto px-6">
        {contactData && (
          <ContactHeader
            title={contactData.title}
            titleHighlight={contactData.title_highlight}
            description={contactData.description}
          />
        )}

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
          {contactData && (
            <ContactInfo
              email={contactData.email}
              responseTime={contactData.response_time}
              githubUrl={contactData.github_url}
              linkedinUrl={contactData.linkedin_url}
              twitterUrl={contactData.twitter_url}
              websiteUrl={contactData.website_url}
              expectations={contactData.expectations}
              loading={loading}
            />
          )}
        </div>
      </div>
    </section>
  );
}
