import React, { useState } from "react";
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

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  unreadMessages,
  onTabChange,
}) => {
  const [profileExpanded, setProfileExpanded] = useState(
    activeTab.startsWith("profile")
  );

  const tabs: AdminTab[] = [
    { id: "overview", label: "Overview", icon: Shield },
    { id: "messages", label: "Messages", icon: Mail },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "skills", label: "Skills", icon: Award },
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

  const handleProfileClick = () => {
    setProfileExpanded(!profileExpanded);
    if (!profileExpanded) {
      onTabChange("profile-personal");
    }
  };

  const handleSubTabClick = (subTabId: string) => {
    setProfileExpanded(true);
    onTabChange(subTabId);
  };

  return (
    <div className="lg:col-span-1">
      <Card className="card-neural">
        <CardContent className="p-4">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => onTabChange(tab.id)}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
                {tab.id === "messages" && unreadMessages > 0 && (
                  <Badge variant="accent" className="ml-auto">
                    {unreadMessages}
                  </Badge>
                )}
              </Button>
            ))}

            {/* Profile Section with Sub-tabs */}
            <div className="space-y-1">
              <Button
                variant={activeTab.startsWith("profile") ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={handleProfileClick}
              >
                <User className="w-4 h-4 mr-2" />
                Profile
                {profileExpanded ? (
                  <ChevronDown className="w-4 h-4 ml-auto" />
                ) : (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </Button>

              {/* Sub-tabs */}
              {profileExpanded && (
                <div className="ml-4 space-y-1 border-l-2 border-border pl-2 animate-in slide-in-from-top-2 duration-200">
                  {profileSubTabs.map((subTab) => (
                    <Button
                      key={subTab.id}
                      variant={activeTab === subTab.id ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start text-sm"
                      onClick={() => handleSubTabClick(subTab.id)}
                    >
                      <subTab.icon className="w-3 h-3 mr-2" />
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
