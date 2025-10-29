import React from "react";
import {
  ProjectsHeaderSection,
  ProjectsCategoriesSection,
  ProjectsListSection,
  TechnologiesSection,
} from "./sections";

interface ProjectsManagementRouterProps {
  activeSubTab: string;
}

/**
 * ProjectsManagementRouter Component
 * Routes between different projects management sections based on active sub-tab
 */
const ProjectsManagementRouter: React.FC<ProjectsManagementRouterProps> = ({
  activeSubTab,
}) => {
  const renderSection = () => {
    switch (activeSubTab) {
      case "projects-header":
        return <ProjectsHeaderSection />;
      case "projects-categories":
        return <ProjectsCategoriesSection />;
      case "projects-list":
        return <ProjectsListSection />;
      case "projects-technologies":
        return <TechnologiesSection />;
      default:
        return <ProjectsHeaderSection />;
    }
  };

  return <div className="space-y-6">{renderSection()}</div>;
};

export default ProjectsManagementRouter;
