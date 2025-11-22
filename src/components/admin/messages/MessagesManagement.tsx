/**
 * MessagesManagement Component
 *
 * Main container for messages management with tab navigation
 *
 * @module messages/MessagesManagement
 */

import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMessages } from "./hooks/useMessages";
import { MessagesList } from "./sections/MessagesList";
import { MessageReply } from "./sections/MessageReply";
import { MessageStats as MessageStatsComponent } from "./sections/MessageStats";
import { EmailTemplatesSection } from "./sections/EmailTemplatesSection";
import { ContactSettingsSection } from "./sections/ContactSettingsSection";
import { sendManualReplyEmail } from "@/services/emailjs.service";
import { supabase } from "@/integrations/supabase/client";

// ============================================================================
// TYPES
// ============================================================================

interface MessagesManagementProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function MessagesManagement({
  activeTab = "messages",
  onTabChange,
}: MessagesManagementProps) {
  const { toast } = useToast();
  const { messages, updateMessage } = useMessages();
  const [replyingToMessageId, setReplyingToMessageId] = useState<string | null>(
    null
  );
  const [adminName, setAdminName] = useState<string>("Support Team");

  // ============================================================================
  // FETCH ADMIN NAME
  // ============================================================================

  useEffect(() => {
    const fetchAdminName = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          // Try to get name from user profile
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("user_id", user.id)
            .single();

          if (profile?.full_name) {
            setAdminName(profile.full_name);
          } else {
            // Fallback to email username or default
            setAdminName(user.email?.split("@")[0] || "CodePrince");
          }
        }
      } catch (error) {
        console.error("Failed to fetch admin name:", error);
        // Keep default "Support Team"
      }
    };

    fetchAdminName();
  }, []);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleReplyToMessage = useCallback((messageId: string) => {
    setReplyingToMessageId(messageId);
  }, []);

  const handleCloseReply = useCallback(() => {
    setReplyingToMessageId(null);
  }, []);

  const handleSendReply = useCallback(
    async (content: string) => {
      if (!replyingToMessageId) return;

      try {
        const message = messages.find((m) => m.id === replyingToMessageId);
        if (!message) throw new Error("Message not found");

        // Send email through EmailJS (November 2025)
        const result = await sendManualReplyEmail({
          recipientName: message.name,
          recipientEmail: message.email,
          replyContent: content,
          originalMessage: message.message,
          originalSubject: message.subject,
          adminName: adminName || "Prince Kyeremeh",
        });

        if (!result.success) {
          throw new Error(result.error || "Failed to send reply");
        }

        // Update message in database
        const now = new Date().toISOString();
        const { error: updateError } = await supabase
          .from("contact_messages")
          .update({
            reply_content: content,
            reply_sent_at: now,
            is_replied: true,
            status: "replied",
            updated_at: now,
          })
          .eq("id", replyingToMessageId);

        if (updateError) throw updateError;

        toast({
          title: "Reply sent",
          description: `Your reply has been sent successfully via EmailJS.`,
        });

        // Refresh messages
        setReplyingToMessageId(null);
      } catch (error) {
        console.error("Send reply error:", error);
        toast({
          variant: "destructive",
          title: "Failed to send reply",
          description:
            error instanceof Error
              ? error.message
              : "Please try again or contact support.",
        });
        throw error;
      }
    },
    [replyingToMessageId, toast]
  );

  const handleSaveDraft = useCallback(
    async (content: string) => {
      if (!replyingToMessageId) return;

      try {
        await updateMessage({
          id: replyingToMessageId,
          reply_content: content,
        });

        toast({
          title: "Draft saved",
          description: "Your reply draft has been saved.",
        });
      } catch (error) {
        console.error("Save draft error:", error);
        throw error;
      }
    },
    [replyingToMessageId, updateMessage, toast]
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  const replyingToMessage = messages.find((m) => m.id === replyingToMessageId);

  return (
    <div className="space-y-6">
      {/* Messages Section */}
      {activeTab === "messages" && (
        <MessagesList onReplyToMessage={handleReplyToMessage} />
      )}

      {/* Statistics Section */}
      {activeTab === "stats" && (
        <MessageStatsComponent stats={undefined as any} />
      )}

      {/* Templates Section */}
      {activeTab === "templates" && <EmailTemplatesSection />}

      {/* Contact Settings Section */}
      {activeTab === "contact" && <ContactSettingsSection />}

      {/* Reply Modal */}
      {replyingToMessage && (
        <MessageReply
          message={replyingToMessage}
          onSendReply={handleSendReply}
          onSaveDraft={handleSaveDraft}
          onClose={handleCloseReply}
        />
      )}
    </div>
  );
}
