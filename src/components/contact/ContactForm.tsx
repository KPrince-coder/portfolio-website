/**
 * ContactForm Component
 *
 * Main contact form with validation
 */

import React from "react";
import { MessageSquare, Send, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ContactFormData, ContactFormErrors } from "./types";
import { PRIORITY_OPTIONS, MAX_MESSAGE_LENGTH } from "./constants";

// ============================================================================
// TYPES
// ============================================================================

interface ContactFormProps {
  formData: ContactFormData;
  errors: ContactFormErrors;
  isSubmitting: boolean;
  onFieldChange: (field: keyof ContactFormData, value: string) => void;
  onPriorityChange: (priority: ContactFormData["priority"]) => void;
  onSubmit: () => Promise<boolean>;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ContactForm({
  formData,
  errors,
  isSubmitting,
  onFieldChange,
  onPriorityChange,
  onSubmit,
}: ContactFormProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  const messageLength = formData.message.length;
  const isMessageLengthWarning = messageLength > MAX_MESSAGE_LENGTH * 0.9;

  return (
    <Card className="card-neural neural-glow">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3 text-xl">
          <MessageSquare className="w-6 h-6 text-secondary" />
          <span>Send a Message</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name and Email Row */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => onFieldChange("name", e.target.value)}
                placeholder="Your full name"
                className={`bg-background/50 border-border focus:border-secondary ${
                  errors.name ? "border-destructive" : ""
                }`}
                disabled={isSubmitting}
              />
              {errors.name && (
                <div className="flex items-center space-x-2 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => onFieldChange("email", e.target.value)}
                placeholder="your.email@example.com"
                className={`bg-background/50 border-border focus:border-secondary ${
                  errors.email ? "border-destructive" : ""
                }`}
                disabled={isSubmitting}
              />
              {errors.email && (
                <div className="flex items-center space-x-2 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Subject and Priority Row */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Subject Field */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="subject" className="text-sm font-medium">
                Subject *
              </Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => onFieldChange("subject", e.target.value)}
                placeholder="What would you like to discuss?"
                className={`bg-background/50 border-border focus:border-secondary ${
                  errors.subject ? "border-destructive" : ""
                }`}
                disabled={isSubmitting}
              />
              {errors.subject && (
                <div className="flex items-center space-x-2 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errors.subject}</span>
                </div>
              )}
            </div>

            {/* Priority Field */}
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium">
                Priority
              </Label>
              <Select
                value={formData.priority}
                onValueChange={onPriorityChange}
                disabled={isSubmitting}
              >
                <SelectTrigger className="bg-background/50 border-border focus:border-secondary">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${option.color} flex-shrink-0`}
                        />
                        {option.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                How urgent is your inquiry?
              </p>
            </div>
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Message *
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => onFieldChange("message", e.target.value)}
              placeholder="Tell me about your project, goals, or any questions you have..."
              rows={5}
              maxLength={MAX_MESSAGE_LENGTH}
              className={`bg-background/50 border-border focus:border-secondary resize-none ${
                errors.message ? "border-destructive" : ""
              }`}
              disabled={isSubmitting}
            />
            {errors.message && (
              <div className="flex items-center space-x-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errors.message}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span className="hidden sm:inline">Minimum 10 characters</span>
              <span
                className={
                  isMessageLengthWarning ? "text-warning font-medium" : ""
                }
              >
                {messageLength}/{MAX_MESSAGE_LENGTH} characters
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full neural-glow"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                Sending Message...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
