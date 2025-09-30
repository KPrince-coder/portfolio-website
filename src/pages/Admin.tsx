import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  AdminAuth,
  AdminHeader,
  AdminSidebar,
  AdminDashboard,
  ContactMessages,
  ProjectsManagement,
  PlaceholderSection,
  MessageReply,
  MessageStats,
  User,
  ContactMessage,
  Project,
} from '@/components/admin';
import { MessageService } from '@/lib/messages';
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages';

const Admin: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [initialMessages, setInitialMessages] = useState<ContactMessage[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [messageStats, setMessageStats] = useState({ // Keep useState for initial empty state
    totalMessages: 0,
    unreadMessages: 0,
    repliedMessages: 0,
    averageResponseTime: 0,
    messagesThisWeek: 0,
    messagesThisMonth: 0,
  });
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      // Load contact messages using MessageService
      const { data: messages } = await MessageService.getMessages({ limit: 50 });
      setInitialMessages(messages);

      // Load projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsData) {
        setProjects(projectsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        variant: "destructive",
        title: "Failed to load data",
        description: "Please refresh the page to try again.",
      });
    }
  }, [toast]);

  const checkAuth = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        loadData();
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  }, [loadData]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Set up real-time messages with callbacks
  const { messages: contactMessages, updateMessage } = useRealtimeMessages({
    initialMessages,
    onNewMessage: (message) => {
      // Stats will be re-calculated via useMemo
    },
    onMessageUpdate: (message) => {
      // Stats will be re-calculated via useMemo
    },
  });

  // Calculate message statistics from real-time messages
  const calculatedMessageStats = React.useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday as start of week
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const total = contactMessages.length;
    const unread = contactMessages.filter(msg => msg.status === 'unread').length;
    const replied = contactMessages.filter(msg => msg.status === 'replied').length;

    // Calculate average response time
    const repliedMessagesList = contactMessages.filter(msg => msg.is_replied && msg.reply_sent_at && msg.created_at);
    let avgResponseTime = 0;
    if (repliedMessagesList.length > 0) {
      const totalResponseTime = repliedMessagesList.reduce((sum, msg) => {
        const created = new Date(msg.created_at).getTime();
        const replied = new Date(msg.reply_sent_at!).getTime();
        return sum + (replied - created);
      }, 0);
      avgResponseTime = totalResponseTime / repliedMessagesList.length / (1000 * 60 * 60); // Convert ms to hours
    }

    // Calculate messages this week
    const messagesThisWeek = contactMessages.filter(msg => new Date(msg.created_at) >= startOfWeek).length;

    // Calculate messages this month
    const messagesThisMonth = contactMessages.filter(msg => new Date(msg.created_at) >= startOfMonth).length;

    return {
      totalMessages: total,
      unreadMessages: unread,
      repliedMessages: replied,
      averageResponseTime: avgResponseTime,
      messagesThisWeek: messagesThisWeek,
      messagesThisMonth: messagesThisMonth,
    };
  }, [contactMessages]);

  // Update messageStats state when calculatedMessageStats changes
  useEffect(() => {
    setMessageStats(calculatedMessageStats);
  }, [calculatedMessageStats]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  const signIn = async () => {
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Missing credentials",
        description: "Please enter both email and password",
      });
      return;
    }

    setIsSigningIn(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Update user state and load data on successful login
      if (data?.user) {
        setUser(data.user);
        await loadData();
        // Clear form fields
        setEmail('');
        setPassword('');
        // Redirect to admin panel
        window.location.href = '/admin';
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  // Enhanced message handling functions
  const handleMarkAsRead = async (messageId: string) => {
    try {
      await MessageService.markAsRead(messageId);

      // Update local state optimistically - real-time will sync the actual change
      updateMessage(messageId, { status: 'read' as const });

      toast({
        title: "Message marked as read",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating message",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    }
  };

  const handleBulkAction = async (messageIds: string[], action: string) => {
    try {
      setMessagesLoading(true);

      switch (action) {
        case 'mark_read':
          await MessageService.bulkUpdateMessages(messageIds, { status: 'read' });
          break;
        case 'mark_unread':
          await MessageService.bulkUpdateMessages(messageIds, { status: 'unread' });
          break;
        case 'archive':
          await MessageService.bulkUpdateMessages(messageIds, { archived: true, status: 'archived' });
          break;
        case 'delete':
          for (const id of messageIds) {
            await MessageService.deleteMessage(id);
          }
          break;
      }

      // Reload messages
      await loadData();

      toast({
        title: "Bulk action completed",
        description: `Successfully ${action.replace('_', ' ')} ${messageIds.length} message(s)`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Bulk action failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await MessageService.deleteMessage(messageId);

      // Real-time subscription will handle removing the message from the list
      toast({
        title: "Message deleted",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting message",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    }
  };

  const handleReplyToMessage = async (messageId: string) => {
    const message = contactMessages.find(m => m.id === messageId);
    if (message) {
      setSelectedMessage(message);
      setShowReplyModal(true);
      // Automatically mark as read when opened, if it's unread
      if (message.status === 'unread') {
        await handleMarkAsRead(messageId);
      }
    }
  };

  const handleSendReply = async (replyContent: string) => {
    if (!selectedMessage) return;

    await MessageService.sendReply(selectedMessage.id, replyContent, user?.email);

    // Optimistically update the message status in the local state
    updateMessage(selectedMessage.id, { 
      is_replied: true, 
      status: 'replied',
      reply_content: replyContent, // Update reply content
      reply_sent_at: new Date().toISOString(), // Update reply sent time
    });

    setShowReplyModal(false);
    setSelectedMessage(null);

    toast({
      title: "Reply sent successfully",
      description: "Your reply has been sent to the sender.",
    });
  };

  const handleSaveDraft = async (replyContent: string) => {
    if (!selectedMessage) return;

    await MessageService.saveReplyDraft(selectedMessage.id, replyContent);

    // Real-time subscription will handle updating the message
    toast({
      title: "Draft saved",
      description: "Your reply draft has been saved.",
    });
  };

  const handleUpdateStatus = async (messageId: string, updates: Partial<ContactMessage>) => {
    try {
      // Optimistic update
      updateMessage(messageId, updates);

      // Call service with the updates
      await MessageService.updateMessageFields(messageId, updates);

      toast({
        title: "Status updated",
        description: `Message status changed.`, // Generic description
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating status",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    }
  };

  const handleUpdatePriority = async (messageId: string, priority: ContactMessage['priority']) => {
    try {
      // Optimistic update
      updateMessage(messageId, { priority });
      await MessageService.updateMessagePriority(messageId, priority);

      toast({
        title: "Priority updated",
        description: `Message priority changed to ${priority}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating priority",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
      // Revert optimistic update if API call fails (optional)
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <AdminAuth
        email={email}
        password={password}
        isSigningIn={isSigningIn}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSignIn={signIn}
      />
    );
  }

  const unreadMessages = contactMessages.filter(msg => msg.status === 'unread').length;

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader user={user} onSignOut={signOut} />

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <AdminSidebar
            activeTab={activeTab}
            unreadMessages={unreadMessages}
            onTabChange={setActiveTab}
          />

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <MessageStats {...messageStats} />
                <AdminDashboard
                  contactMessages={contactMessages}
                  projects={projects}
                  unreadMessages={unreadMessages}
                />
              </div>
            )}

            {activeTab === 'messages' && (
              <ContactMessages
                contactMessages={contactMessages}
                onMarkAsRead={handleMarkAsRead}
                onBulkAction={handleBulkAction}
                onDeleteMessage={handleDeleteMessage}
                onReplyToMessage={handleReplyToMessage}
                onUpdateStatus={handleUpdateStatus}
                onUpdatePriority={handleUpdatePriority}
                loading={messagesLoading}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsManagement projects={projects} />
            )}

            {activeTab === 'posts' && (
              <PlaceholderSection
                title="Blog Posts"
                description="Blog management"
              />
            )}

            {activeTab === 'settings' && (
              <PlaceholderSection
                title="Site Settings"
                description="Site settings"
              />
            )}
          </div>
        </div>
      </div>

      {/* Message Reply Modal */}
      {showReplyModal && selectedMessage && (
        <MessageReply
          message={selectedMessage}
          onSendReply={handleSendReply}
          onSaveDraft={handleSaveDraft}
          onClose={() => {
            setShowReplyModal(false);
            setSelectedMessage(null);
          }}
        />
      )}
    </div>
  );
};

export default Admin;
