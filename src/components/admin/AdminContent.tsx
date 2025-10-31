import React from "react";
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
  const { sidebarCollapsed, isDesktop, isMobile, isTablet } = useAdminLayout();

  // Calculate responsive margins based on sidebar state
  const getMainContentClasses = () => {
    const baseClasses =
      "pt-16 min-h-screen transition-all duration-300 ease-in-out";

    if (isMobile || isTablet) {
      // Mobile: no left margin
      return `${baseClasses} ml-0`;
    }

    // Desktop: adjust margin based on sidebar state
    if (sidebarCollapsed) {
      return `${baseClasses} lg:ml-16`; // 64px collapsed
    }

    return `${baseClasses} lg:ml-70`; // 280px expanded
  };

  return (
    <>
      <SkipToContent />
      <AdminHeader user={user} onSignOut={onSignOut} />
      <AdminSidebar
        activeTab={activeTab}
        unreadMessages={unreadMessages}
        onTabChange={onTabChange}
      />

      {/* Main Content with responsive margins */}
      <main id="main-content" className={getMainContentClasses()} role="main">
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
