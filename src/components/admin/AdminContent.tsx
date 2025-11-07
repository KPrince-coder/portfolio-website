import React, { useMemo, useState, useEffect } from "react";
import {
  AdminHeader,
  AdminSidebar,
  SkipToContent,
  useAdminLayout,
  AdminDashboard,
  ProjectsManagement,
  ProfileManagement,
  ResumeManagement,
  SettingsManagement,
  BrandManagement,
  MessageStats,
  ProjectStats,
  User,
  ContactMessage,
} from "@/components/admin";
import { MessagesManagementRouter } from "@/components/admin/messages";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import SkillsManagementRouter from "@/components/admin/skills/SkillsManagementRouter";
import { BlogManagementRouter } from "@/components/admin/blog/BlogManagementRouter";
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
  onSignOut: () => void;
  onTabChange: (tab: string) => void;
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
  onSignOut,
  onTabChange,
}) => {
  const { sidebarCollapsed, isDesktop } = useAdminLayout();
  const [fullUser, setFullUser] = useState<SupabaseUser | null>(null);

  // Fetch full user data for settings
  useEffect(() => {
    const fetchFullUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setFullUser(data.user);
      }
    };
    fetchFullUser();
  }, []);

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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
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

          {activeTab.startsWith("messages") && (
            <MessagesManagementRouter
              activeSubTab={activeTab}
              onTabChange={onTabChange}
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

          {activeTab.startsWith("posts") && (
            <BlogManagementRouter
              activeSubTab={activeTab}
              onTabChange={onTabChange}
            />
          )}

          {activeTab === "brand" && <BrandManagement />}

          {activeTab === "settings" && fullUser && (
            <SettingsManagement user={fullUser} />
          )}
        </div>
      </main>
    </>
  );
};

export default AdminContent;
