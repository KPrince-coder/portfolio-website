/**
 * MessagesManagement Component
 *
 * Main container for messages management with tab navigation
 *
 * @module messages/MessagesManagement
 */

import { useState, useCallback, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMessages } from "./hooks/useMessages";
import { MessagesList } from "./sections/MessagesList";
import { MessageReply } from "./sections/MessageReply";
import { MessageStats as MessageStatsComponent } from "./sections/MessageStats";
import { EmailTemplatesSection } from "./sections/EmailTemplatesSection";
import { sendReplyEmail } from "@/services/emailService";
import { supabase } from "@/integrations/supabase/client";
import { emailConfig } from "@/config/email.config";

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
            // Fallback to email username or company name
            setAdminName(user.email?.split("@")[0] || emailConfig.companyName);
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
        // Send email through Supabase Edge Function
        // This will also update the message status automatically
        const result = await sendReplyEmail(
          replyingToMessageId,
          content,
          adminName
        );

        if (!result.success) {
          throw new Error(result.error || "Failed to send reply");
        }

        toast({
          title: "Reply sent",
          description: `Your reply has been sent successfully. ${
            result.response_time_hours
              ? `Response time: ${result.response_time_hours}h`
              : ""
          }`,
        });

        // Refresh messages to get updated status
        // The Edge Function already updated the database
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
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-0 h-auto sm:h-10">
          <TabsTrigger value="messages" className="min-h-[44px]">
            Messages
          </TabsTrigger>
          <TabsTrigger value="stats" className="min-h-[44px]">
            Statistics
          </TabsTrigger>
          <TabsTrigger value="templates" className="min-h-[44px]">
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="mt-4 sm:mt-6">
          <MessagesList onReplyToMessage={handleReplyToMessage} />
        </TabsContent>

        <TabsContent value="stats" className="mt-4 sm:mt-6">
          <MessageStatsComponent stats={undefined as any} />
        </TabsContent>

        <TabsContent value="templates" className="mt-4 sm:mt-6">
          <EmailTemplatesSection />
        </TabsContent>
      </Tabs>

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
