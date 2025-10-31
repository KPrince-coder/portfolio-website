import React, { useMemo } from "react";
import {
  AdminHeader,
  AdminSidebar,
  SkipToContent,
  useAdminLayout,
  AdminDashboard,
  ContactMessages,
  ProjectsManagement,
  ProfileManagement,
  ResumeManagement,
  PlaceholderSection,
  MessageReply,
  MessageStats,
  ProjectStats,
  User,
  ContactMessage,
} from "@/components/admin";
import SkillsManagementRouter from "@/components/admin/skills/SkillsManagementRouter";
import { Database } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];

interface AdminContentProps {
  user: User;
  activeTab: string;
  contactMessages: ContactMessage[];
  projects: ProjectRow[];
  unreadMessages: number;
  messageStats: {
    totalMessages: number;
    unreadMessages: number;
    repliedMessages: number;
    averageResponseTime: number;
    messagesThisWeek: number;
    messagesThisMonth: number;
  };
  projectStats: {
    totalProjects: number;
    publishedProjects: number;
    draftProjects: number;
    totalViews: number;
    averageViewsPerProject: number;
    mostViewedProjectTitle: string | null;
    projectsThisWeek: number;
    projectsThisMonth: number;
  };
  messagesLoading: boolean;
  selectedMessage: ContactMessage | null;
  showReplyModal: boolean;
  onSignOut: () => void;
  onTabChange: (tab: string) => void;
  onMarkAsRead: (id: string) => void;
  onBulkAction: (ids: string[], action: string) => void;
  onDeleteMessage: (id: string) => void;
  onReplyToMessage: (id: string) => void;
  onUpdateStatus: (id: string, updates: Partial<ContactMessage>) => void;
  onUpdatePriority: (id: string, priority: ContactMessage["priority"]) => void;
  onSendReply: (content: string) => Promise<void>;
  onSaveDraft: (content: string) => Promise<void>;
  onCloseReplyModal: () => void;
}

/**
 * AdminContent - Main authenticated admin panel content
 *
 * Features:
 * - Responsive layout with adaptive margins
 * - Fixed header and collapsible sidebar
 * - Main content area with proper spacing
 * - Accessibility features (skip-to-content, semantic HTML)
 *
 * Requirements: 1.1, 2.5, 3.6, 4.5, 5.4, 8.1, 8.3, 8.7
 */
export const AdminContent: React.FC<AdminContentProps> = ({
  user,
  activeTab,
  contactMessages,
  projects,
  unreadMessages,
  messageStats,
  projectStats,
  messagesLoading,
  selectedMessage,
  showReplyModal,
  onSignOut,
  onTabChange,
  onMarkAsRead,
  onBulkAction,
  onDeleteMessage,
  onReplyToMessage,
  onUpdateStatus,
  onUpdatePriority,
  onSendReply,
  onSaveDraft,
  onCloseReplyModal,
}) => {
  const { sidebarCollapsed, isDesktop } = useAdminLayout();

  // Calculate left margin based on sidebar state
  // Memoized to prevent recreation on every render
  const mainContentClasses = useMemo(() => {
    const baseClasses = "pt-16 min-h-[calc(100vh-4rem)]";

    if (!isDesktop) {
      // Mobile/Tablet: no left margin (sidebar is overlay)
      return baseClasses;
    }

    // Desktop: add left margin for fixed sidebar with smooth transitions
    return cn(
      baseClasses,
      "transition-all duration-300 ease-in-out",
      "will-change-[margin]", // Hint to browser for optimization
      "transform-gpu", // Force GPU acceleration for smoother animations
      sidebarCollapsed ? "ml-20" : "ml-72" // 80px collapsed, 288px expanded
    );
  }, [isDesktop, sidebarCollapsed]);

  return (
    <>
      <SkipToContent />
      <AdminHeader user={user} onSignOut={onSignOut} />
      <AdminSidebar
        activeTab={activeTab}
        unreadMessages={unreadMessages}
        onTabChange={onTabChange}
      />

      {/* Main Content with responsive left margin */}
      <main id="main-content" className={mainContentClasses} role="main">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <MessageStats {...messageStats} />
              <ProjectStats {...projectStats} />
              <AdminDashboard
                contactMessages={contactMessages}
                projects={projects}
                unreadMessages={unreadMessages}
              />
            </div>
          )}

          {activeTab.startsWith("profile") && (
            <ProfileManagement activeSubTab={activeTab} />
          )}

          {activeTab === "messages" && (
            <ContactMessages
              contactMessages={contactMessages}
              onMarkAsRead={onMarkAsRead}
              onBulkAction={onBulkAction}
              onDeleteMessage={onDeleteMessage}
              onReplyToMessage={onReplyToMessage}
              onUpdateStatus={onUpdateStatus}
              onUpdatePriority={onUpdatePriority}
              loading={messagesLoading}
            />
          )}

          {activeTab.startsWith("projects") && (
            <ProjectsManagement activeTab={activeTab} />
          )}

          {activeTab.startsWith("skills") && (
            <SkillsManagementRouter activeSubTab={activeTab} />
          )}

          {activeTab.startsWith("resume") && (
            <ResumeManagement activeTab={activeTab} />
          )}

          {activeTab === "posts" && (
            <PlaceholderSection
              title="Blog Posts"
              description="Blog management"
            />
          )}

          {activeTab === "settings" && (
            <PlaceholderSection
              title="Site Settings"
              description="Site settings"
            />
          )}
        </div>
      </main>

      {/* Message Reply Modal */}
      {showReplyModal && selectedMessage && (
        <MessageReply
          message={selectedMessage}
          onSendReply={onSendReply}
          onSaveDraft={onSaveDraft}
          onClose={onCloseReplyModal}
        />
      )}
    </>
  );
};

export default AdminContent;
