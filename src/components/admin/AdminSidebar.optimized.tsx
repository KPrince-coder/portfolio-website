import React, { useState, useCallback, useEffect } from "react";
import {
  Shield,
  Mail,
  Briefcase,
  FileText,
  Settings,
  User,
  ChevronDown,
  ChevronRight,
  UserCircle,
  Sparkles,
  FileUser,
  Briefcase as BriefcaseIcon,
  TrendingUp,
  Award,
  Link as LinkIcon,
  Upload,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminSidebarProps, AdminTab } from "./types";

// Constants moved outside component for better performance
const MAIN_TABS: readonly AdminTab[] = [
  { id: "overview", label: "Overview", icon: Shield },
  { id: "messages", label: "Messages", icon: Mail },
  { id: "projects", label: "Projects", icon: Briefcase },
  { id: "posts", label: "Blog Posts", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

const PROFILE_SUB_TABS = [
  { id: "profile-personal", label: "Personal Info", icon: UserCircle },
  { id: "profile-hero", label: "Hero Section", icon: Sparkles },
  { id: "profile-about", label: "About Section", icon: FileUser },
  { id: "profile-experience", label: "Experience", icon: BriefcaseIcon },
  { id: "profile-metrics", label: "Impact Metrics", icon: TrendingUp },
  { id: "profile-philosophy", label: "Philosophy", icon: Award },
  { id: "profile-social", label: "Social Links", icon: LinkIcon },
  { id: "profile-resume", label: "Resume", icon: Upload },
] as const;

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  unreadMessages,
  onTabChange,
}) => {
  // Lazy initialization for better performance
  const [profileExpanded, setProfileExpanded] = useState(() =>
    activeTab.startsWith("profile")
  );

  // Sync expansion state when activeTab changes externally
  useEffect(() => {
    if (activeTab.startsWith("profile") && !profileExpanded) {
      setProfileExpanded(true);
    }
  }, [activeTab, profileExpanded]);

  const handleProfileClick = useCallback(() => {
    setProfileExpanded((prev) => {
      const newExpanded = !prev;
      if (newExpanded) {
        onTabChange("profile-personal");
      }
      return newExpanded;
    });
  }, [onTabChange]);

  const handleSubTabClick = useCallback(
    (subTabId: string) => {
      setProfileExpanded(true);
      onTabChange(subTabId);
    },
    [onTabChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleProfileClick();
      }
    },
    [handleProfileClick]
  );

  return (
    <div className="lg:col-span-1">
      <Card className="card-neural">
        <CardContent className="p-4">
          <nav className="space-y-1" aria-label="Admin navigation">
            {MAIN_TABS.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => onTabChange(tab.id)}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                <tab.icon className="w-4 h-4 mr-2" aria-hidden="true" />
                {tab.label}
                {tab.id === "messages" && unreadMessages > 0 && (
                  <Badge
                    variant="accent"
                    className="ml-auto"
                    aria-label={`${unreadMessages} unread messages`}
                  >
                    {unreadMessages}
                  </Badge>
                )}
              </Button>
            ))}

            {/* Profile Section with Sub-tabs */}
            <div
              className="space-y-1"
              role="group"
              aria-labelledby="profile-section"
            >
              <Button
                variant={activeTab.startsWith("profile") ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={handleProfileClick}
                onKeyDown={handleKeyDown}
                aria-expanded={profileExpanded}
                aria-controls="profile-submenu"
                aria-current={
                  activeTab.startsWith("profile") ? "page" : undefined
                }
                id="profile-section"
              >
                <User className="w-4 h-4 mr-2" aria-hidden="true" />
                Profile
                {profileExpanded ? (
                  <ChevronDown className="w-4 h-4 ml-auto" aria-hidden="true" />
                ) : (
                  <ChevronRight
                    className="w-4 h-4 ml-auto"
                    aria-hidden="true"
                  />
                )}
              </Button>

              {/* Sub-tabs */}
              {profileExpanded && (
                <div
                  id="profile-submenu"
                  role="menu"
                  aria-label="Profile sections"
                  className="ml-4 space-y-1 border-l-2 border-border pl-2 animate-in slide-in-from-top-2 duration-200"
                >
                  {PROFILE_SUB_TABS.map((subTab) => (
                    <Button
                      key={subTab.id}
                      variant={activeTab === subTab.id ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start text-sm"
                      onClick={() => handleSubTabClick(subTab.id)}
                      role="menuitem"
                      aria-current={
                        activeTab === subTab.id ? "page" : undefined
                      }
                    >
                      <subTab.icon
                        className="w-3 h-3 mr-2"
                        aria-hidden="true"
                      />
                      {subTab.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSidebar;
