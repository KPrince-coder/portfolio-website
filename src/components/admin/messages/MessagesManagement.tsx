/**
 * MessagesManagement Component
 *
 * Main container for messages management with tab navigation
 * Responsive design with mobile-first approach
 *
 * @module messages/MessagesManagement
 */

import { useState, useCallback, useEffect } from "react";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMessages } from "./hooks/useMessages";
import { useMessageStats } from "./hooks/useMessageStats";
import { MessagesList } from "./sections/MessagesList";
import { MessageReply } from "./sections/MessageReply";
import { MessageStats as MessageStatsComponent } from "./sections/MessageStats";
import { ContactSettingsSection } from "./sections/ContactSettingsSection";
import { sendManualReplyEmail } from "@/services/emailjs.service";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_ADMIN_NAME } from "./constants";

// ============================================================================
// TYPES
// ============================================================================

interface MessagesManagementProps {
  activeTab?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function MessagesManagement({
  activeTab = "messages",
}: MessagesManagementProps) {
  const { toast } = useToast();
  const { messages, loading, updateMessage } = useMessages();
  const { stats, loading: statsLoading } = useMessageStats({
    autoLoad: activeTab === "stats",
  });
  const [replyingToMessageId, setReplyingToMessageId] = useState<string | null>(
    null
  );
  const [adminName, setAdminName] = useState<string>("Support Team");
  const [adminLoading, setAdminLoading] = useState(true);

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
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("user_id", user.id)
            .maybeSingle();

          if (profileError) {
            console.warn("Failed to fetch profile:", profileError);
          }

          if (profile?.full_name) {
            setAdminName(profile.full_name);
          } else {
            // Fallback to email username or default
            setAdminName(user.email?.split("@")[0] || DEFAULT_ADMIN_NAME);
          }
        }
      } catch (error) {
        console.error("Failed to fetch admin name:", error);
        // Keep default "Support Team"
      } finally {
        setAdminLoading(false);
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

  // Loading state
  if (loading || adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-[25rem] sm:min-h-[31.25rem]">
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-xs sm:text-sm text-muted-foreground px-4">
            Loading messages...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 p-4 sm:p-5 md:p-6 lg:p-8">
      {/* Messages Section */}
      {activeTab === "messages" && (
        <>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[25rem] sm:min-h-[31.25rem] text-center p-4 sm:p-6">
              <Mail className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2">
                No messages yet
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-[90%] sm:max-w-md px-2">
                When visitors submit the contact form, their messages will
                appear here.
              </p>
            </div>
          ) : (
            <MessagesList onReplyToMessage={handleReplyToMessage} />
          )}
        </>
      )}

      {/* Statistics Section */}
      {activeTab === "stats" && (
        <>
          {statsLoading ? (
            <div className="flex items-center justify-center min-h-[25rem] sm:min-h-[31.25rem]">
              <div className="text-center space-y-3 sm:space-y-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
                <p className="text-xs sm:text-sm text-muted-foreground px-4">
                  Loading statistics...
                </p>
              </div>
            </div>
          ) : (
            <MessageStatsComponent stats={stats} />
          )}
        </>
      )}

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
