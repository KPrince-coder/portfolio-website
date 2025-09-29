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

const Admin: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [messageStats, setMessageStats] = useState({
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
      setContactMessages(messages);

      // Load message statistics
      const stats = await MessageService.getMessageStats();
      setMessageStats(stats);

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

      setContactMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, status: 'read' as const } : msg
        )
      );

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

      setContactMessages(prev => prev.filter(msg => msg.id !== messageId));

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
    }
  };

  const handleSendReply = async (replyContent: string) => {
    if (!selectedMessage) return;

    try {
      await MessageService.sendReply(selectedMessage.id, replyContent, user?.email);

      // Update the message in the list
      setContactMessages(prev =>
        prev.map(msg =>
          msg.id === selectedMessage.id
            ? {
                ...msg,
                reply_content: replyContent,
                reply_sent_at: new Date().toISOString(),
                is_replied: true,
                status: 'replied' as const
              }
            : msg
        )
      );

      setShowReplyModal(false);
      setSelectedMessage(null);

      toast({
        title: "Reply sent successfully",
        description: "Your reply has been sent to the sender.",
      });
    } catch (error) {
      throw error; // Let the MessageReply component handle the error
    }
  };

  const handleSaveDraft = async (replyContent: string) => {
    if (!selectedMessage) return;

    try {
      await MessageService.saveReplyDraft(selectedMessage.id, replyContent);

      // Update the message in the list
      setContactMessages(prev =>
        prev.map(msg =>
          msg.id === selectedMessage.id
            ? { ...msg, reply_content: replyContent }
            : msg
        )
      );

      toast({
        title: "Draft saved",
        description: "Your reply draft has been saved.",
      });
    } catch (error) {
      throw error; // Let the MessageReply component handle the error
    }
  };

  const handleUpdateStatus = async (messageId: string, status: ContactMessage['status']) => {
    try {
      await MessageService.updateMessageStatus(messageId, status);

      setContactMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, status } : msg
        )
      );

      toast({
        title: "Status updated",
        description: `Message status changed to ${status}`,
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
      await MessageService.updateMessagePriority(messageId, priority);

      setContactMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, priority } : msg
        )
      );

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