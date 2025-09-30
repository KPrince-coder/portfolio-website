import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContactMessage } from '@/components/admin/types';
import { useToast } from '@/hooks/use-toast';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface UseRealtimeMessagesProps {
  initialMessages: ContactMessage[];
  onMessageUpdate?: (message: ContactMessage) => void;
  onNewMessage?: (message: ContactMessage) => void;
}

export const useRealtimeMessages = ({
  initialMessages,
  onMessageUpdate,
  onNewMessage,
}: UseRealtimeMessagesProps) => {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const { toast } = useToast();

  const handleInsert = useCallback((payload: RealtimePostgresChangesPayload<ContactMessage>) => {
    const newMessage = payload.new as ContactMessage;
    setMessages(prev => [newMessage, ...prev]);
    
    // Show notification for new message
    toast({
      title: "New message received",
      description: `From ${newMessage.name}: ${newMessage.subject}`,
    });

    onNewMessage?.(newMessage);
  }, [toast, onNewMessage]);

  const handleUpdate = useCallback((payload: RealtimePostgresChangesPayload<ContactMessage>) => {
    const updatedMessage = payload.new as ContactMessage;
    setMessages(prev => 
      prev.map(msg => 
        msg.id === updatedMessage.id ? updatedMessage : msg
      )
    );

    onMessageUpdate?.(updatedMessage);
  }, [onMessageUpdate]);

  const handleDelete = useCallback((payload: RealtimePostgresChangesPayload<ContactMessage>) => {
    const deletedMessage = payload.old as ContactMessage;
    setMessages(prev => prev.filter(msg => msg.id !== deletedMessage.id));
  }, []);

  useEffect(() => {
    // Set up real-time subscription for contact_messages table
    const channel = supabase
      .channel('contact_messages_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contact_messages',
        },
        handleInsert
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'contact_messages',
        },
        handleUpdate
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'contact_messages',
        },
        handleDelete
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Real-time subscription established for contact messages');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Failed to establish real-time subscription');
          toast({
            variant: "destructive",
            title: "Real-time connection failed",
            description: "You may need to refresh to see updates.",
          });
        }
      });

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [handleInsert, handleUpdate, handleDelete, toast]);

  // Update messages when initialMessages changes
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const updateMessage = useCallback((messageId: string, updates: Partial<ContactMessage>) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      )
    );
  }, []);

  const addMessage = useCallback((message: ContactMessage) => {
    setMessages(prev => [message, ...prev]);
  }, []);

  const removeMessage = useCallback((messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  }, []);

  return {
    messages,
    updateMessage,
    addMessage,
    removeMessage,
  };
};
