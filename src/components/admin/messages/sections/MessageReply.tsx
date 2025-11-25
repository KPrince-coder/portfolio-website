/**
 * Message Reply Component
 *
 * Rich text editor for replying to messages with draft support
 *
 * @module messages/sections/MessageReply
 */

import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Send,
  Save,
  X,
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import type { MessageReplyProps } from "../types";

export function MessageReply({
  message,
  onSendReply,
  onSaveDraft,
  onClose,
  loading = false,
}: MessageReplyProps) {
  const [isSending, setIsSending] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const editor = useEditor({
    extensions: [StarterKit],
    content: message.reply_content || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[120px] sm:min-h-[200px] p-3 sm:p-4 bg-background/50 rounded-md border border-border",
      },
    },
  });

  useEffect(() => {
    if (editor && message.reply_content) {
      editor.commands.setContent(message.reply_content);
    }
  }, [editor, message.reply_content]);

  // Auto-scroll to top when modal opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSendReply = async () => {
    if (!editor) return;

    const content = editor.getHTML();
    if (!content.trim() || content === "<p></p>") {
      toast({
        variant: "destructive",
        title: "Reply content required",
        description: "Please enter a reply message before sending.",
      });
      return;
    }

    setIsSending(true);
    try {
      await onSendReply(content);
      toast({
        title: "Reply sent successfully",
        description: "Your reply has been sent to the recipient.",
      });
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send reply",
        description: "Please try again or contact support.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!editor) return;

    const content = editor.getHTML();
    setIsSavingDraft(true);
    try {
      await onSaveDraft(content);
      toast({
        title: "Draft saved",
        description: "Your reply draft has been saved.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to save draft",
        description: "Please try again.",
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

  const toggleBold = () => editor?.chain().focus().toggleBold().run();
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  const toggleBulletList = () =>
    editor?.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () =>
    editor?.chain().focus().toggleOrderedList().run();

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  if (!editor) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-4xl">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Loading editor...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 md:p-6">
        <Card className="w-full max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-2rem)] md:max-w-3xl lg:max-w-4xl my-4 sm:my-8 flex flex-col">
          <CardHeader className="flex-shrink-0 p-4 sm:p-6">
            <div className="flex items-start sm:items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                  <span className="text-base sm:text-lg">Reply to Message</span>
                  {message.is_replied && (
                    <Badge variant="default" className="w-fit">
                      Previously Replied
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-sm text-muted-foreground truncate">
                  From: <span className="font-medium">{message.name}</span>
                  <span className="hidden sm:inline"> ({message.email})</span>
                </p>
                <p className="text-xs text-muted-foreground sm:hidden truncate mt-0.5">
                  {message.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9 p-0"
                aria-label="Close reply dialog"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6 overflow-y-auto flex-1 p-4 sm:p-6">
            <div className="bg-muted/30 p-3 sm:p-4 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-2">
                <h4 className="font-medium text-sm sm:text-base">
                  Original Message
                </h4>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(message.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-sm font-medium mb-1 break-words">
                Subject: {message.subject}
              </p>
              <p className="text-sm text-muted-foreground break-words">
                {message.message}
              </p>
            </div>

            {message.reply_content && message.reply_sent_at && (
              <div className="bg-secondary/10 p-3 sm:p-4 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-2">
                  <h4 className="font-medium text-sm sm:text-base">
                    Previous Reply
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    Sent{" "}
                    {formatDistanceToNow(new Date(message.reply_sent_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <div
                  className="text-sm prose prose-sm max-w-none break-words"
                  dangerouslySetInnerHTML={{ __html: message.reply_content }}
                />
              </div>
            )}

            <Separator />

            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h4 className="font-medium text-sm sm:text-base">Your Reply</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-full sm:w-auto"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {showPreview ? "Edit" : "Preview"}
                </Button>
              </div>

              {!showPreview ? (
                <>
                  <div className="flex items-center flex-wrap gap-1 sm:gap-2 p-2 border border-border rounded-md bg-background/50">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleBold}
                      className={cn(
                        "h-9 w-9 sm:h-8 sm:w-8 p-0",
                        editor.isActive("bold") && "bg-secondary"
                      )}
                      title="Bold"
                      aria-label="Toggle bold"
                    >
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleItalic}
                      className={cn(
                        "h-9 w-9 sm:h-8 sm:w-8 p-0",
                        editor.isActive("italic") && "bg-secondary"
                      )}
                      title="Italic"
                      aria-label="Toggle italic"
                    >
                      <Italic className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={addLink}
                      className={cn(
                        "h-9 w-9 sm:h-8 sm:w-8 p-0",
                        editor.isActive("link") && "bg-secondary"
                      )}
                      title="Add link"
                      aria-label="Add link"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleBulletList}
                      className={cn(
                        "h-9 w-9 sm:h-8 sm:w-8 p-0",
                        editor.isActive("bulletList") && "bg-secondary"
                      )}
                      title="Bullet list"
                      aria-label="Toggle bullet list"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleOrderedList}
                      className={cn(
                        "h-9 w-9 sm:h-8 sm:w-8 p-0",
                        editor.isActive("orderedList") && "bg-secondary"
                      )}
                      title="Numbered list"
                      aria-label="Toggle numbered list"
                    >
                      <ListOrdered className="w-4 h-4" />
                    </Button>
                  </div>
                  <EditorContent editor={editor} />
                </>
              ) : (
                <div className="min-h-[120px] sm:min-h-[200px] p-3 sm:p-4 bg-background/50 rounded-md border border-border">
                  <div
                    className="prose prose-sm max-w-none break-words"
                    dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
                  />
                </div>
              )}
            </div>
          </CardContent>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 sm:p-6 border-t border-border flex-shrink-0">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSavingDraft || loading}
              className="w-full sm:w-auto min-h-[44px]"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSavingDraft ? "Saving..." : "Save Draft"}
            </Button>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full sm:w-auto order-2 sm:order-1 min-h-[44px]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendReply}
                disabled={isSending || loading}
                className="w-full sm:w-auto order-1 sm:order-2 min-h-[44px]"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSending ? "Sending..." : "Send Reply"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
