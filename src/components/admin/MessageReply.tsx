import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
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
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { MessageReplyProps } from './types';
import { formatDistanceToNow } from 'date-fns';

const MessageReply: React.FC<MessageReplyProps> = ({
  message,
  onSendReply,
  onSaveDraft,
  onClose,
  loading = false,
}) => {
  const [isSending, setIsSending] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const editor = useEditor({
    extensions: [
      StarterKit,
      // Link extension is often included in StarterKit, or can be added separately if needed.
      // Removing explicit Link.configure to avoid duplicate extension warning.
      // If link functionality breaks, re-add Link.configure.
    ],
    content: message.reply_content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4 bg-background/50 rounded-md border border-border',
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
    if (!content.trim() || content === '<p></p>') {
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
        description: "Your reply has been sent to the sender.",
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
  const toggleBulletList = () => editor?.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor?.chain().focus().toggleOrderedList().run();

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="card-neural w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>Reply to Message</span>
                {message.is_replied && (
                  <Badge variant="default">
                    Previously Replied
                  </Badge>
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
        
        <CardContent className="space-y-6 overflow-y-auto">
          {/* Original Message */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Original Message</h4>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm font-medium mb-1">Subject: {message.subject}</p>
            <p className="text-sm text-muted-foreground">{message.message}</p>
          </div>

          {/* Previous Reply (if exists) */}
          {message.reply_content && message.reply_sent_at && (
            <div className="bg-secondary/10 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Previous Reply</h4>
                <span className="text-xs text-muted-foreground">
                  Sent {formatDistanceToNow(new Date(message.reply_sent_at), { addSuffix: true })}
                </span>
              </div>
              <div 
                className="text-sm prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: message.reply_content }}
              />
            </div>
          )}

          <Separator />

          {/* Reply Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Your Reply</h4>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {showPreview ? 'Edit' : 'Preview'}
                </Button>
              </div>
            </div>

            {!showPreview ? (
              <>
                {/* Editor Toolbar */}
                <div className="flex items-center space-x-2 p-2 border border-border rounded-md bg-background/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleBold}
                    className={editor.isActive('bold') ? 'bg-secondary' : ''}
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleItalic}
                    className={editor.isActive('italic') ? 'bg-secondary' : ''}
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addLink}
                    className={editor.isActive('link') ? 'bg-secondary' : ''}
                  >
                    <LinkIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleBulletList}
                    className={editor.isActive('bulletList') ? 'bg-secondary' : ''}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleOrderedList}
                    className={editor.isActive('orderedList') ? 'bg-secondary' : ''}
                  >
                    <ListOrdered className="w-4 h-4" />
                  </Button>
                </div>

                {/* Editor Content */}
                <EditorContent editor={editor} />
              </>
            ) : (
              /* Preview */
              <div className="min-h-[200px] p-4 bg-background/50 rounded-md border border-border">
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSavingDraft || loading}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSavingDraft ? 'Saving...' : 'Save Draft'}
            </Button>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSendReply}
                disabled={isSending || loading}
                className="neural-glow"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSending ? 'Sending...' : 'Send Reply'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageReply;
