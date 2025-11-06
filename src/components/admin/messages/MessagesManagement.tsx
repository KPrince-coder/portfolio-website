/**
 * MessagesManagement Component
 *
 * Main container for messages management with tab navigation
 *
 * @module messages/MessagesManagement
 */

import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMessages } from "./hooks/useMessages";
import { MessagesList } from "./sections/MessagesList";
import { MessageReply } from "./sections/MessageReply";
import { MessageStats as MessageStatsComponent } from "./sections/MessageStats";
import { EmailTemplatesSection } from "./sections/EmailTemplatesSection";

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
        await updateMessage({
          id: replyingToMessageId,
          reply_content: content,
          reply_sent_at: new Date().toISOString(),
          is_replied: true,
          status: "replied",
        });

        toast({
          title: "Reply sent",
          description: "Your reply has been sent successfully.",
        });

        setReplyingToMessageId(null);
      } catch (error) {
        console.error("Send reply error:", error);
        throw error;
      }
    },
    [replyingToMessageId, updateMessage, toast]
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
