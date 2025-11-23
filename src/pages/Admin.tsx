import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  AdminAuth,
  AdminLayout,
  AdminContent,
  User,
  ContactMessage,
} from "@/components/admin";

import { Database } from "@/integrations/supabase/types";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type ProjectCategoryRow =
  Database["public"]["Tables"]["project_categories"]["Row"];
// Note: project_analytics table doesn't exist in schema yet
// type ProjectAnalyticsRow =
//   Database["public"]["Tables"]["project_analytics"]["Row"];

import { MessageService } from "@/lib/messages";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";

const Admin: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Sync activeTab with URL for blog routes
  useEffect(() => {
    if (location.pathname.startsWith("/admin/blog")) {
      setActiveTab("posts");
    }
  }, [location.pathname]);
  const [initialMessages, setInitialMessages] = useState<ContactMessage[]>([]);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [projectCategories, setProjectCategories] = useState<
    ProjectCategoryRow[]
  >([]);
  // Temporarily use any[] until project_analytics table is created
  const [projectAnalytics, setProjectAnalytics] = useState<any[]>([]);
  const [messageStats, setMessageStats] = useState({
    totalMessages: 0,
    unreadMessages: 0,
    repliedMessages: 0,
    averageResponseTime: 0,
    messagesThisWeek: 0,
    messagesThisMonth: 0,
  });
  const [projectStats, setProjectStats] = useState({
    // New state for project stats
    totalProjects: 0,
    publishedProjects: 0,
    draftProjects: 0,
    totalViews: 0,
    averageViewsPerProject: 0,
    mostViewedProjectTitle: null as string | null,
    projectsThisWeek: 0,
    projectsThisMonth: 0,
  });
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const { toast } = useToast();

  // Project filter states
  const [projectSearchTerm, setProjectSearchTerm] = useState<string>("");
  const [projectCategoryFilter, setProjectCategoryFilter] =
    useState<string>("All");
  const [projectStatusFilter, setProjectStatusFilter] = useState<string>("All");
  const [projectPublishedFilter, setProjectPublishedFilter] =
    useState<string>("All");
  const [projectFeaturedFilter, setProjectFeaturedFilter] =
    useState<string>("All");

  const fetchProjects = useCallback(async (): Promise<ProjectRow[]> => {
    try {
      let query = supabase.from("projects").select("*");

      if (projectSearchTerm) {
        query = query.or(
          `title.ilike.%${projectSearchTerm}%,description.ilike.%${projectSearchTerm}%`
        );
      }
      if (projectCategoryFilter !== "All") {
        query = query.eq("category_id", projectCategoryFilter);
      }
      if (projectStatusFilter !== "All") {
        query = query.eq("status", projectStatusFilter);
      }
      // Note: Projects don't have a published field - they use status instead
      // Skip published filter for projects as it's not applicable
      // if (projectPublishedFilter !== "All") {
      //   query = query.eq("status", "completed");
      // }
      if (projectFeaturedFilter !== "All") {
        query = query.eq("is_featured", projectFeaturedFilter === "true");
      }

      query = query.order("created_at", { ascending: false });

      const { data: projectsData, error: projectsError } = await query;

      if (projectsError) {
        throw projectsError;
      }
      return (projectsData as ProjectRow[]) || [];
    } catch (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
  }, [
    projectSearchTerm,
    projectCategoryFilter,
    projectStatusFilter,
    projectPublishedFilter,
    projectFeaturedFilter,
  ]);

  const refetchProjects = useCallback(async () => {
    try {
      const projectsData = await fetchProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error("Error refetching projects:", error);
      // Don't include toast in dependencies to avoid infinite loops
    }
  }, [fetchProjects]);

  const loadData = useCallback(async () => {
    try {
      // Load contact messages using MessageService
      const { data: messages } = await MessageService.getMessages({
        limit: 50,
      });
      setInitialMessages(messages);

      // Load projects
      const projectsData = await fetchProjects();
      setProjects(projectsData);

      // Load project categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("project_categories")
        .select("*")
        .order("name", { ascending: true });

      if (categoriesError) {
        throw categoriesError;
      }
      setProjectCategories(categoriesData || []);

      // Load project analytics (table doesn't exist yet - commented out)
      // TODO: Create project_analytics table in migration
      // const { data: analyticsData, error: analyticsError } = await supabase
      //   .from("project_analytics")
      //   .select("*");
      // if (analyticsError) {
      //   throw analyticsError;
      // }
      // setProjectAnalytics(analyticsData || []);
      setProjectAnalytics([]); // Empty array until table is created
    } catch (error) {
      console.error("Error loading data:", error);
      // Don't include toast in dependencies to avoid infinite loops
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        loadData();
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  }, [loadData]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Refetch projects when filter states change
  useEffect(() => {
    if (user) {
      // Only refetch if user is authenticated
      fetchProjects()
        .then(setProjects)
        .catch((err) => {
          console.error("Error refetching projects:", err);
          toast({
            variant: "destructive",
            title: "Failed to refetch projects",
            description: "Please try again.",
          });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user,
    projectSearchTerm,
    projectCategoryFilter,
    projectStatusFilter,
    projectPublishedFilter,
    projectFeaturedFilter,
  ]);

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
  const calculatedMessageStats = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday as start of week
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const total = contactMessages.length;
    const unread = contactMessages.filter(
      (msg) => msg.status === "unread"
    ).length;
    const replied = contactMessages.filter(
      (msg) => msg.status === "replied"
    ).length;

    // Calculate average response time
    const repliedMessagesList = contactMessages.filter(
      (msg) => msg.is_replied && msg.reply_sent_at && msg.created_at
    );
    let avgResponseTime = 0;
    if (repliedMessagesList.length > 0) {
      const totalResponseTime = repliedMessagesList.reduce((sum, msg) => {
        const created = new Date(msg.created_at).getTime();
        const replied = new Date(msg.reply_sent_at!).getTime();
        return sum + (replied - created);
      }, 0);
      avgResponseTime =
        totalResponseTime / repliedMessagesList.length / (1000 * 60 * 60); // Convert ms to hours
    }

    // Calculate messages this week
    const messagesThisWeek = contactMessages.filter(
      (msg) => new Date(msg.created_at) >= startOfWeek
    ).length;

    // Calculate messages this month
    const messagesThisMonth = contactMessages.filter(
      (msg) => new Date(msg.created_at) >= startOfMonth
    ).length;

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

  // Calculate project statistics from projects and projectAnalytics
  const calculatedProjectStats = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday as start of week
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const total = projects.length;
    // Projects use status field: 'completed' = published, others = draft
    const published = projects.filter((p) => p.status === "completed").length;
    const draft = projects.filter((p) => p.status !== "completed").length;

    const totalViews = projectAnalytics.reduce(
      (sum, pa) => sum + pa.view_count,
      0
    );
    const averageViewsPerProject = total > 0 ? totalViews / total : 0;

    let mostViewedProjectTitle: string | null = null;
    if (projectAnalytics.length > 0) {
      const sortedAnalytics = [...projectAnalytics].sort(
        (a, b) => b.view_count - a.view_count
      );
      const mostViewedProjectId = sortedAnalytics[0].project_id;
      const mostViewedProject = projects.find(
        (p) => p.id === mostViewedProjectId
      );
      mostViewedProjectTitle = mostViewedProject?.title || null;
    }

    const projectsThisWeek = projects.filter(
      (p) => new Date(p.created_at) >= startOfWeek
    ).length;
    const projectsThisMonth = projects.filter(
      (p) => new Date(p.created_at) >= startOfMonth
    ).length;

    return {
      totalProjects: total,
      publishedProjects: published,
      draftProjects: draft,
      totalViews: totalViews,
      averageViewsPerProject: averageViewsPerProject,
      mostViewedProjectTitle: mostViewedProjectTitle,
      projectsThisWeek: projectsThisWeek,
      projectsThisMonth: projectsThisMonth,
    };
  }, [projects, projectAnalytics]);

  // Update projectStats state when calculatedProjectStats changes
  useEffect(() => {
    setProjectStats(calculatedProjectStats);
  }, [calculatedProjectStats]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        setEmail("");
        setPassword("");
        // Redirect to admin panel
        window.location.href = "/admin";
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
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
      updateMessage(messageId, { status: "read" as const });

      toast({
        title: "Message marked as read",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating message",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };

  const handleBulkAction = async (messageIds: string[], action: string) => {
    try {
      setMessagesLoading(true);

      switch (action) {
        case "mark_read":
          await MessageService.bulkUpdateMessages(messageIds, {
            status: "read",
          });
          break;
        case "mark_unread":
          await MessageService.bulkUpdateMessages(messageIds, {
            status: "unread",
          });
          break;
        case "archive":
          await MessageService.bulkUpdateMessages(messageIds, {
            archived: true,
            status: "archived",
          });
          break;
        case "delete":
          for (const id of messageIds) {
            await MessageService.deleteMessage(id);
          }
          break;
      }

      // Reload messages
      await loadData();

      toast({
        title: "Bulk action completed",
        description: `Successfully ${action.replace("_", " ")} ${
          messageIds.length
        } message(s)`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Bulk action failed",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
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
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };

  const handleReplyToMessage = async (messageId: string) => {
    const message = contactMessages.find((m) => m.id === messageId);
    if (message) {
      setSelectedMessage(message);
      setShowReplyModal(true);
      // Automatically mark as read when opened, if it's unread
      if (message.status === "unread") {
        await handleMarkAsRead(messageId);
      }
    }
  };

  const handleSendReply = async (replyContent: string) => {
    if (!selectedMessage) return;

    await MessageService.sendReply(
      selectedMessage.id,
      replyContent,
      user?.email
    );

    // Optimistically update the message status in the local state
    updateMessage(selectedMessage.id, {
      is_replied: true,
      status: "replied",
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

  const handleUpdateStatus = async (
    messageId: string,
    updates: Partial<ContactMessage>
  ) => {
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
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };

  const handleUpdatePriority = async (
    messageId: string,
    priority: ContactMessage["priority"]
  ) => {
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
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
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

  const unreadMessages = contactMessages.filter(
    (msg) => msg.status === "unread"
  ).length;

  return (
    <AdminLayout>
      <AdminContent
        user={user}
        activeTab={activeTab}
        contactMessages={contactMessages}
        projects={projects}
        unreadMessages={unreadMessages}
        messageStats={messageStats}
        projectStats={projectStats}
        messagesLoading={messagesLoading}
        selectedMessage={selectedMessage}
        showReplyModal={showReplyModal}
        onSignOut={signOut}
        onTabChange={setActiveTab}
        onMarkAsRead={handleMarkAsRead}
        onBulkAction={handleBulkAction}
        onDeleteMessage={handleDeleteMessage}
        onReplyToMessage={handleReplyToMessage}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePriority={handleUpdatePriority}
        onSendReply={handleSendReply}
        onSaveDraft={handleSaveDraft}
        onCloseReplyModal={() => {
          setShowReplyModal(false);
          setSelectedMessage(null);
        }}
      />
    </AdminLayout>
  );
};

export default Admin;
