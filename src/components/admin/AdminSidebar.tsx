import React, { useReducer, useCallback, useRef, useEffect } from "react";
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
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AdminSidebarProps, AdminTab } from "./types";
import { useAdminLayout } from "./AdminLayout";
import { MobileSidebarBackdrop } from "./MobileSidebarBackdrop";
import { cn } from "@/lib/utils";
import {
  MAIN_TABS,
  PROFILE_SUB_TABS,
  SKILLS_SUB_TABS,
  PROJECTS_SUB_TABS,
  RESUME_SUB_TABS,
  MOBILE_SIDEBAR_CLOSE_DELAY,
} from "./AdminSidebar.constants";

// ============================================================================
// State Management - Reducer for expandable sections
// ============================================================================

type SectionState = {
  profile: boolean;
  skills: boolean;
  projects: boolean;
  resume: boolean;
};

type SectionAction =
  | { type: "TOGGLE"; section: keyof SectionState }
  | { type: "EXPAND"; section: keyof SectionState }
  | { type: "COLLAPSE_ALL" };

const sectionReducer = (
  state: SectionState,
  action: SectionAction
): SectionState => {
  switch (action.type) {
    case "TOGGLE":
      return { ...state, [action.section]: !state[action.section] };
    case "EXPAND":
      return { ...state, [action.section]: true };
    case "COLLAPSE_ALL":
      return { profile: false, skills: false, projects: false, resume: false };
    default:
      return state;
  }
};

/**
 * AdminSidebar - Collapsible navigation sidebar with responsive behavior
 *
 * Features:
 * - Desktop: Fixed sidebar with collapse toggle (280px expanded, 64px collapsed)
 * - Mobile: Overlay sidebar that slides in from left
 * - Internal scrolling using ScrollArea component
 * - Smooth animations with GPU acceleration
 * - Nested navigation with expandable sections
 * - Optimized with React.memo, useReducer, and memoized callbacks
 *
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6,
 *               4.2, 4.6, 4.7, 7.1, 7.2, 9.1, 9.2, 10.1, 10.2, 10.4
 */
const AdminSidebar: React.FC<AdminSidebarProps> = React.memo(
  ({ activeTab, unreadMessages, onTabChange }) => {
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

    // Consolidated state for expandable sections using useReducer
    const [expandedSections, dispatch] = useReducer(sectionReducer, {
      profile: activeTab.startsWith("profile"),
      skills: activeTab.startsWith("skills"),
      projects: activeTab.startsWith("projects"),
      resume: activeTab.startsWith("resume"),
    });

    // Memoized event handlers
    const handleProfileClick = useCallback(() => {
      dispatch({ type: "TOGGLE", section: "profile" });
      if (!expandedSections.profile) {
        onTabChange("profile-personal");
      }
    }, [expandedSections.profile, onTabChange]);

    const handleSkillsClick = useCallback(() => {
      dispatch({ type: "TOGGLE", section: "skills" });
      if (!expandedSections.skills) {
        onTabChange("skills-header");
      }
    }, [expandedSections.skills, onTabChange]);

    const handleProjectsClick = useCallback(() => {
      dispatch({ type: "TOGGLE", section: "projects" });
      if (!expandedSections.projects) {
        onTabChange("projects-header");
      }
    }, [expandedSections.projects, onTabChange]);

    const handleResumeClick = useCallback(() => {
      dispatch({ type: "TOGGLE", section: "resume" });
      if (!expandedSections.resume) {
        onTabChange("resume-header");
      }
    }, [expandedSections.resume, onTabChange]);

    const handleSubTabClick = useCallback(
      (subTabId: string) => {
        if (subTabId.startsWith("profile")) {
          dispatch({ type: "EXPAND", section: "profile" });
        } else if (subTabId.startsWith("skills")) {
          dispatch({ type: "EXPAND", section: "skills" });
        } else if (subTabId.startsWith("projects")) {
          dispatch({ type: "EXPAND", section: "projects" });
        } else if (subTabId.startsWith("resume")) {
          dispatch({ type: "EXPAND", section: "resume" });
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
      }, MOBILE_SIDEBAR_CLOSE_DELAY);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [sidebarOpen, isDesktop, closeMobileSidebar]);

    // Determine if we're showing mobile or desktop variant
    const showMobileVariant = isMobile || isTablet;

    // Desktop sidebar classes - fixed position
    const desktopClasses = cn(
      "bg-background border-r border-border",
      "transition-all duration-300 ease-in-out",
      "hidden lg:flex flex-col",
      "will-change-[width]",
      "transform-gpu",
      "fixed left-0 top-16 bottom-0 z-40", // Fixed positioning from below header
      sidebarCollapsed ? "w-20" : "w-72" // 288px expanded, 80px collapsed (increased)
    );

    // Mobile sidebar classes - fixed overlay
    const mobileClasses = cn(
      "fixed top-0 bottom-0 left-0 z-[60] w-72",
      "bg-background border-r border-border shadow-xl",
      "transform transition-transform duration-300 ease-in-out",
      "lg:hidden flex flex-col",
      "will-change-transform",
      "transform-gpu",
      sidebarOpen ? "translate-x-0" : "-translate-x-full"
    );

    // Memoized render navigation button
    const renderNavButton = useCallback(
      (tab: AdminTab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "ghost"}
          className={cn(
            "w-full transition-all duration-200 relative",
            "hover:scale-100 hover:translate-x-1 hover:brightness-110", // Subtle hover effect
            sidebarCollapsed && isDesktop
              ? "justify-center px-2"
              : "justify-start"
          )}
          onClick={() => handleTabClick(tab.id)}
          title={sidebarCollapsed && isDesktop ? tab.label : undefined}
        >
          {sidebarCollapsed && isDesktop ? (
            // Collapsed state - icon only, perfectly centered
            <tab.icon className="w-5 h-5 flex-shrink-0" />
          ) : (
            // Expanded state - icon + label + badge
            <>
              <tab.icon className="w-4 h-4 flex-shrink-0 mr-2" />
              <span className="flex-1 text-left">{tab.label}</span>
              {tab.id === "messages" && unreadMessages > 0 && (
                <Badge variant="accent" className="ml-auto">
                  {unreadMessages}
                </Badge>
              )}
            </>
          )}
        </Button>
      ),
      [activeTab, sidebarCollapsed, isDesktop, unreadMessages, handleTabClick]
    );

    // Memoized render expandable section
    const renderExpandableSection = useCallback(
      (
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
                "w-full transition-all duration-200 relative",
                "hover:scale-100 hover:translate-x-1 hover:brightness-110", // Subtle hover effect
                sidebarCollapsed && isDesktop
                  ? "justify-center px-2"
                  : "justify-start"
              )}
              onClick={onClick}
              title={sidebarCollapsed && isDesktop ? label : undefined}
            >
              {sidebarCollapsed && isDesktop ? (
                // Collapsed state - icon only, perfectly centered
                <Icon className="w-5 h-5 flex-shrink-0" />
              ) : (
                // Expanded state - icon + label + chevron
                <>
                  <Icon className="w-4 h-4 flex-shrink-0 mr-2" />
                  <span className="flex-1 text-left">{label}</span>
                  <span className="ml-auto">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </span>
                </>
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
                    className="w-full justify-start text-sm transition-all duration-200 hover:scale-100 hover:translate-x-1 hover:brightness-110"
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
      },
      [activeTab, sidebarCollapsed, isDesktop, handleSubTabClick]
    );

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
            {MAIN_TABS.map((tab) => renderNavButton(tab))}

            {/* Profile Section */}
            {renderExpandableSection(
              User,
              "Profile",
              expandedSections.profile,
              handleProfileClick,
              activeTab.startsWith("profile"),
              PROFILE_SUB_TABS as unknown as AdminTab[]
            )}

            {/* Skills Section */}
            {renderExpandableSection(
              Briefcase,
              "Skills",
              expandedSections.skills,
              handleSkillsClick,
              activeTab.startsWith("skills"),
              SKILLS_SUB_TABS as unknown as AdminTab[]
            )}

            {/* Projects Section */}
            {renderExpandableSection(
              Briefcase,
              "Projects",
              expandedSections.projects,
              handleProjectsClick,
              activeTab.startsWith("projects"),
              PROJECTS_SUB_TABS as unknown as AdminTab[]
            )}

            {/* Resume Section */}
            {renderExpandableSection(
              FileText,
              "Resume",
              expandedSections.resume,
              handleResumeClick,
              activeTab.startsWith("resume"),
              RESUME_SUB_TABS as unknown as AdminTab[]
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

        {/* Conditional Sidebar Rendering - Only render one variant */}
        {showMobileVariant ? (
          <aside
            ref={sidebarRef}
            className={mobileClasses}
            aria-label="Main navigation"
            aria-hidden={!sidebarOpen}
          >
            {sidebarContent}
          </aside>
        ) : (
          <aside
            ref={sidebarRef}
            className={desktopClasses}
            aria-label="Main navigation"
            aria-hidden={false}
          >
            {sidebarContent}
          </aside>
        )}
      </>
    );
  }
);

AdminSidebar.displayName = "AdminSidebar";

export default AdminSidebar;
