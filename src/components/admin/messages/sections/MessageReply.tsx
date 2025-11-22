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
          "prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4 bg-background/50 rounded-md border border-border",
      },
    },
  });

  useEffect(() => {
    if (editor && message.reply_content) {
      editor.commands.setContent(message.reply_content);
    }
  }, [editor, message.reply_content]);

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
        title: "Email client opened",
        description:
          "Your email client has been opened with the reply. Send it from there to complete.",
      });
      // Don't close immediately - let user decide after sending from email client
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to open email client",
        description: "Please try again or copy the message and send manually.",
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>Reply to Message</span>
                {message.is_replied && (
                  <Badge variant="default">Previously Replied</Badge>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                From: {message.name} ({message.email})
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 overflow-y-auto flex-1">
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Original Message</h4>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(message.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <p className="text-sm font-medium mb-1">
              Subject: {message.subject}
            </p>
            <p className="text-sm text-muted-foreground">{message.message}</p>
          </div>

          {message.reply_content && message.reply_sent_at && (
            <div className="bg-secondary/10 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Previous Reply</h4>
                <span className="text-xs text-muted-foreground">
                  Sent{" "}
                  {formatDistanceToNow(new Date(message.reply_sent_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <div
                className="text-sm prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: message.reply_content }}
              />
            </div>
          )}

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Your Reply</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? "Edit" : "Preview"}
              </Button>
            </div>

            {!showPreview ? (
              <>
                <div className="flex items-center space-x-2 p-2 border border-border rounded-md bg-background/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleBold}
                    className={editor.isActive("bold") ? "bg-secondary" : ""}
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleItalic}
                    className={editor.isActive("italic") ? "bg-secondary" : ""}
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addLink}
                    className={editor.isActive("link") ? "bg-secondary" : ""}
                  >
                    <LinkIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleBulletList}
                    className={
                      editor.isActive("bulletList") ? "bg-secondary" : ""
                    }
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleOrderedList}
                    className={
                      editor.isActive("orderedList") ? "bg-secondary" : ""
                    }
                  >
                    <ListOrdered className="w-4 h-4" />
                  </Button>
                </div>
                <EditorContent editor={editor} />
              </>
            ) : (
              <div className="min-h-[200px] p-4 bg-background/50 rounded-md border border-border">
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
                />
              </div>
            )}
          </div>
        </CardContent>

        <div className="flex items-center justify-between p-6 border-t border-border flex-shrink-0">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSavingDraft || loading}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSavingDraft ? "Saving..." : "Save Draft"}
          </Button>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSendReply} disabled={isSending || loading}>
              <Send className="w-4 h-4 mr-2" />
              {isSending ? "Opening..." : "Open in Email Client"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
