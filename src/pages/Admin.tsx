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
  User,
  ContactMessage,
  Project,
} from '@/components/admin';

const Admin: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const { toast } = useToast();

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
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const loadData = async () => {
    try {
      // Load contact messages
      const { data: messages } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (messages) {
        setContactMessages(messages);
      }

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
    }
  };

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

  const markMessageAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: 'read' })
        .eq('id', messageId);

      if (error) throw error;

      setContactMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, status: 'read' } : msg
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
              <AdminDashboard
                contactMessages={contactMessages}
                projects={projects}
                unreadMessages={unreadMessages}
              />
            )}

            {activeTab === 'messages' && (
              <ContactMessages
                contactMessages={contactMessages}
                onMarkAsRead={markMessageAsRead}
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
    </div>
  );
};

export default Admin;