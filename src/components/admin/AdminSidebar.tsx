import React, { useState, useCallback } from "react";
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
  FolderKanban,
  Code,
  GraduationCap,
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
  const [skillsExpanded, setSkillsExpanded] = useState(
    activeTab.startsWith("skills")
  );
  const [projectsExpanded, setProjectsExpanded] = useState(
    activeTab.startsWith("projects")
  );
  const [resumeExpanded, setResumeExpanded] = useState(
    activeTab.startsWith("resume")
  );

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
    },
    [onTabChange]
  );

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

              {/* Profile Sub-tabs */}
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

            {/* Skills Section with Sub-tabs */}
            <div className="space-y-1">
              <Button
                variant={activeTab.startsWith("skills") ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={handleSkillsClick}
              >
                <Award className="w-4 h-4 mr-2" />
                Skills
                {skillsExpanded ? (
                  <ChevronDown className="w-4 h-4 ml-auto" />
                ) : (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </Button>

              {/* Skills Sub-tabs */}
              {skillsExpanded && (
                <div className="ml-4 space-y-1 border-l-2 border-border pl-2 animate-in slide-in-from-top-2 duration-200">
                  {skillsSubTabs.map((subTab) => (
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

            {/* Projects Section with Sub-tabs */}
            <div className="space-y-1">
              <Button
                variant={activeTab.startsWith("projects") ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={handleProjectsClick}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Projects
                {projectsExpanded ? (
                  <ChevronDown className="w-4 h-4 ml-auto" />
                ) : (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </Button>

              {/* Projects Sub-tabs */}
              {projectsExpanded && (
                <div className="ml-4 space-y-1 border-l-2 border-border pl-2 animate-in slide-in-from-top-2 duration-200">
                  {projectsSubTabs.map((subTab) => (
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

            {/* Resume Section with Sub-tabs */}
            <div className="space-y-1">
              <Button
                variant={activeTab.startsWith("resume") ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={handleResumeClick}
              >
                <Upload className="w-4 h-4 mr-2" />
                Resume
                {resumeExpanded ? (
                  <ChevronDown className="w-4 h-4 ml-auto" />
                ) : (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </Button>

              {/* Resume Sub-tabs */}
              {resumeExpanded && (
                <div className="ml-4 space-y-1 border-l-2 border-border pl-2 animate-in slide-in-from-top-2 duration-200">
                  {resumeSubTabs.map((subTab) => (
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
