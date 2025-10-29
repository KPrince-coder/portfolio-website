import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Shield,
  Mail,
  Briefcase,
  FileText,
  Settings,
  User,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  UserCircle,
  Sparkles,
  FileUser,
  Briefcase as BriefcaseIcon,
  TrendingUp,
  Award,
  Link as LinkIcon,
  Upload,
  FolderKanban,
  Code,
  GraduationCap,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AdminSidebarProps, AdminTab } from "./types";
import { useAdminLayout } from "./AdminLayout";
import { MobileSidebarBackdrop } from "./MobileSidebarBackdrop";
import { cn } from "@/lib/utils";

/**
 * AdminSidebar - Collapsible navigation sidebar with responsive behavior
 *
 * Features:
 * - Desktop: Fixed sidebar with collapse toggle (280px expanded, 64px collapsed)
 * - Mobile: Overlay sidebar that slides in from left
 * - Internal scrolling using ScrollArea component
 * - Smooth animations with GPU acceleration
 * - Nested navigation with expandable sections
 *
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6,
 *               4.2, 4.6, 4.7, 7.1, 7.2, 9.1, 9.2, 10.1, 10.2, 10.4
 */
const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  unreadMessages,
  onTabChange,
}) => {
  const {
    sidebarCollapsed,
    toggleSidebar,
    sidebarOpen,
    closeMobileSidebar,
    isMobile,
    isTablet,
    isDesktop,
  } = useAdminLayout();

  const sidebarRef = useRef<HTMLElement>(null);

  // Local state for expandable sections
  const [profileExpanded, setProfileExpanded] = useState(
    activeTab.startsWith("profile")
  );
  const [skillsExpanded, setSkillsExpanded] = useState(
    activeTab.startsWith("skills")
  );
  const [projectsExpanded, setProjectsExpanded] = useState(
    activeTab.startsWith("projects")
  );
  const [resumeExpanded, setResumeExpanded] = useState(
    activeTab.startsWith("resume")
  );

  // Navigation items configuration
  const tabs: AdminTab[] = [
    { id: "overview", label: "Overview", icon: Shield },
    { id: "messages", label: "Messages", icon: Mail },
    { id: "posts", label: "Blog Posts", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const profileSubTabs = [
    { id: "profile-personal", label: "Personal Info", icon: UserCircle },
    { id: "profile-hero", label: "Hero Section", icon: Sparkles },
    { id: "profile-about", label: "About Section", icon: FileUser },
    { id: "profile-experience", label: "Experience", icon: BriefcaseIcon },
    { id: "profile-metrics", label: "Impact Metrics", icon: TrendingUp },
    { id: "profile-philosophy", label: "Philosophy", icon: Award },
    { id: "profile-social", label: "Social Links", icon: LinkIcon },
    { id: "profile-resume", label: "Resume", icon: Upload },
  ];

  const skillsSubTabs = [
    { id: "skills-header", label: "Skills Header", icon: FileText },
    { id: "skills-categories", label: "Categories", icon: Briefcase },
    { id: "skills-list", label: "Skills", icon: Award },
    { id: "skills-goals", label: "Learning Goals", icon: TrendingUp },
  ];

  const projectsSubTabs = [
    { id: "projects-header", label: "Projects Header", icon: FileText },
    { id: "projects-categories", label: "Categories", icon: FolderKanban },
    { id: "projects-list", label: "Projects", icon: Briefcase },
    { id: "projects-technologies", label: "Technologies", icon: Code },
  ];

  const resumeSubTabs = [
    { id: "resume-header", label: "Resume Header", icon: FileText },
    {
      id: "resume-experiences",
      label: "Work Experiences",
      icon: BriefcaseIcon,
    },
    { id: "resume-education", label: "Education", icon: GraduationCap },
    { id: "resume-certifications", label: "Certifications", icon: Award },
  ];

  // Event handlers
  const handleProfileClick = useCallback(() => {
    setProfileExpanded(!profileExpanded);
    if (!profileExpanded) {
      onTabChange("profile-personal");
    }
  }, [profileExpanded, onTabChange]);

  const handleSkillsClick = useCallback(() => {
    setSkillsExpanded(!skillsExpanded);
    if (!skillsExpanded) {
      onTabChange("skills-header");
    }
  }, [skillsExpanded, onTabChange]);

  const handleProjectsClick = useCallback(() => {
    setProjectsExpanded(!projectsExpanded);
    if (!projectsExpanded) {
      onTabChange("projects-header");
    }
  }, [projectsExpanded, onTabChange]);

  const handleResumeClick = useCallback(() => {
    setResumeExpanded(!resumeExpanded);
    if (!resumeExpanded) {
      onTabChange("resume-header");
    }
  }, [resumeExpanded, onTabChange]);

  const handleSubTabClick = useCallback(
    (subTabId: string) => {
      if (subTabId.startsWith("profile")) {
        setProfileExpanded(true);
      } else if (subTabId.startsWith("skills")) {
        setSkillsExpanded(true);
      } else if (subTabId.startsWith("projects")) {
        setProjectsExpanded(true);
      } else if (subTabId.startsWith("resume")) {
        setResumeExpanded(true);
      }
      onTabChange(subTabId);

      // Close mobile sidebar after navigation
      if (isMobile || isTablet) {
        closeMobileSidebar();
      }
    },
    [onTabChange, isMobile, isTablet, closeMobileSidebar]
  );

  const handleTabClick = useCallback(
    (tabId: string) => {
      onTabChange(tabId);

      // Close mobile sidebar after navigation
      if (isMobile || isTablet) {
        closeMobileSidebar();
      }
    },
    [onTabChange, isMobile, isTablet, closeMobileSidebar]
  );

  // Handle clicks outside sidebar on mobile
  useEffect(() => {
    if (!sidebarOpen || isDesktop) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        closeMobileSidebar();
      }
    };

    // Add slight delay to prevent immediate closing
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen, isDesktop, closeMobileSidebar]);

  // Determine if we're showing mobile or desktop variant
  const showMobileVariant = isMobile || isTablet;

  // Desktop sidebar classes
  const desktopClasses = cn(
    "fixed left-0 top-16 bottom-0 z-40",
    "bg-background border-r border-border",
    "transition-all duration-300 ease-in-out",
    "hidden lg:flex flex-col",
    "will-change-[width]",
    "transform-gpu",
    sidebarCollapsed ? "w-16" : "w-70"
  );

  // Mobile sidebar classes
  const mobileClasses = cn(
    "fixed top-0 bottom-0 left-0 z-[60] w-70",
    "bg-background border-r border-border shadow-xl",
    "transform transition-transform duration-300 ease-in-out",
    "lg:hidden flex flex-col",
    "will-change-transform",
    "transform-gpu",
    sidebarOpen ? "translate-x-0" : "-translate-x-full"
  );

  // Render navigation button
  const renderNavButton = (tab: AdminTab) => (
    <Button
      key={tab.id}
      variant={activeTab === tab.id ? "default" : "ghost"}
      className={cn(
        "w-full transition-all duration-200",
        sidebarCollapsed && isDesktop ? "justify-center px-0" : "justify-start"
      )}
      onClick={() => handleTabClick(tab.id)}
      title={sidebarCollapsed && isDesktop ? tab.label : undefined}
    >
      <tab.icon
        className={cn(
          "w-4 h-4 flex-shrink-0",
          !sidebarCollapsed || !isDesktop ? "mr-2" : ""
        )}
      />
      <span
        className={cn(
          "transition-opacity duration-200",
          sidebarCollapsed && isDesktop
            ? "opacity-0 w-0 overflow-hidden"
            : "opacity-100"
        )}
      >
        {tab.label}
      </span>
      {tab.id === "messages" && unreadMessages > 0 && (
        <Badge
          variant="accent"
          className={cn(
            "ml-auto transition-opacity duration-200",
            sidebarCollapsed && isDesktop
              ? "opacity-0 w-0 overflow-hidden"
              : "opacity-100"
          )}
        >
          {unreadMessages}
        </Badge>
      )}
    </Button>
  );

  // Render expandable section
  const renderExpandableSection = (
    icon: React.ComponentType<{ className?: string }>,
    label: string,
    isExpanded: boolean,
    onClick: () => void,
    isActive: boolean,
    subTabs: AdminTab[]
  ) => {
    const Icon = icon;

    return (
      <div className="space-y-1">
        <Button
          variant={isActive ? "default" : "ghost"}
          className={cn(
            "w-full transition-all duration-200",
            sidebarCollapsed && isDesktop
              ? "justify-center px-0"
              : "justify-start"
          )}
          onClick={onClick}
          title={sidebarCollapsed && isDesktop ? label : undefined}
        >
          <Icon
            className={cn(
              "w-4 h-4 flex-shrink-0",
              !sidebarCollapsed || !isDesktop ? "mr-2" : ""
            )}
          />
          <span
            className={cn(
              "transition-opacity duration-200 flex-1 text-left",
              sidebarCollapsed && isDesktop
                ? "opacity-0 w-0 overflow-hidden"
                : "opacity-100"
            )}
          >
            {label}
          </span>
          {(!sidebarCollapsed || !isDesktop) && (
            <span className="ml-auto">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </span>
          )}
        </Button>

        {/* Sub-tabs */}
        {isExpanded && (!sidebarCollapsed || !isDesktop) && (
          <div className="ml-4 space-y-1 border-l-2 border-border pl-2 animate-in slide-in-from-top-2 duration-200">
            {subTabs.map((subTab) => (
              <Button
                key={subTab.id}
                variant={activeTab === subTab.id ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start text-sm"
                onClick={() => handleSubTabClick(subTab.id)}
              >
                <subTab.icon className="w-3 h-3 mr-2 flex-shrink-0" />
                {subTab.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Sidebar content
  const sidebarContent = (
    <>
      {/* Mobile header with close button */}
      {showMobileVariant && (
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-neural rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Admin Panel</h2>
              <p className="text-xs text-muted-foreground">Navigation</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeMobileSidebar}
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Desktop toggle button */}
      {isDesktop && (
        <div className="p-4 border-b border-border flex items-center justify-between">
          {!sidebarCollapsed && (
            <h2 className="text-lg font-semibold transition-opacity duration-200">
              Navigation
            </h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label={
              sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
            aria-expanded={!sidebarCollapsed}
            className={cn(sidebarCollapsed && "mx-auto")}
          >
            <ChevronLeft
              className={cn(
                "w-5 h-5 transition-transform duration-300",
                sidebarCollapsed && "rotate-180"
              )}
            />
          </Button>
        </div>
      )}

      {/* Navigation items with internal scrolling */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav
          className="space-y-1"
          role="navigation"
          aria-label="Main navigation"
        >
          {tabs.map((tab) => renderNavButton(tab))}

          {/* Profile Section */}
          {renderExpandableSection(
            User,
            "Profile",
            profileExpanded,
            handleProfileClick,
            activeTab.startsWith("profile"),
            profileSubTabs
          )}

          {/* Skills Section */}
          {renderExpandableSection(
            Award,
            "Skills",
            skillsExpanded,
            handleSkillsClick,
            activeTab.startsWith("skills"),
            skillsSubTabs
          )}

          {/* Projects Section */}
          {renderExpandableSection(
            Briefcase,
            "Projects",
            projectsExpanded,
            handleProjectsClick,
            activeTab.startsWith("projects"),
            projectsSubTabs
          )}

          {/* Resume Section */}
          {renderExpandableSection(
            Upload,
            "Resume",
            resumeExpanded,
            handleResumeClick,
            activeTab.startsWith("resume"),
            resumeSubTabs
          )}
        </nav>
      </ScrollArea>
    </>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      <MobileSidebarBackdrop
        visible={sidebarOpen && showMobileVariant}
        onClick={closeMobileSidebar}
      />

      {/* Desktop Sidebar */}
      <aside
        ref={sidebarRef}
        className={desktopClasses}
        aria-label="Main navigation"
        aria-hidden={!isDesktop}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <aside
        ref={sidebarRef}
        className={mobileClasses}
        aria-label="Main navigation"
        aria-hidden={!sidebarOpen}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default AdminSidebar;
