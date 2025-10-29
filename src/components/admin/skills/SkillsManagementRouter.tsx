import React from "react";
import SkillsHeaderSection from "./sections/SkillsHeaderSection";
import SkillsCategoriesSection from "./sections/SkillsCategoriesSection";
import SkillsListSection from "./sections/SkillsListSection";
import LearningGoalsSection from "./sections/LearningGoalsSection";

interface SkillsManagementRouterProps {
  activeSubTab: string;
}

/**
 * SkillsManagementRouter Component
 * Routes to different skills management sections based on active sub-tab
 */
const SkillsManagementRouter: React.FC<SkillsManagementRouterProps> = ({
  activeSubTab,
}) => {
  switch (activeSubTab) {
    case "skills-header":
      return <SkillsHeaderSection />;
    case "skills-categories":
      return <SkillsCategoriesSection />;
    case "skills-list":
      return <SkillsListSection />;
    case "skills-goals":
      return <LearningGoalsSection />;
    default:
      return <SkillsHeaderSection />;
  }
};

export default SkillsManagementRouter;
