import React from "react";
import ProjectsManagementRouter from "./ProjectsManagementRouter";

interface ProjectsManagementProps {
  activeTab: string;
}

/**
 * ProjectsManagement Component
 * Main component for managing projects in the admin panel
 * Routes to different sections based on active sub-tab
 */
const ProjectsManagement: React.FC<ProjectsManagementProps> = ({
  activeTab,
}) => {
  return <ProjectsManagementRouter activeSubTab={activeTab} />;
};

export default ProjectsManagement;
