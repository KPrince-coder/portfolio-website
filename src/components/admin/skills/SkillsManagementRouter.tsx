import React from "react";
import SkillsHeaderSection from "./sections/SkillsHeaderSection";
import SkillsCategoriesSection from "./sections/SkillsCategoriesSection";
import SkillsListSection from "./sections/SkillsListSection";
import LearningGoalsSection from "./sections/LearningGoalsSection";
import type { SkillsManagementRouterProps } from "./types";

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
