import React from "react";
import SkillCard from "./SkillCard";
import type { Skill } from "./types";

interface SkillsGridProps {
  skills: Skill[];
}

/**
 * SkillsGrid Component
 * Displays a grid of skill cards
 */
const SkillsGrid: React.FC<SkillsGridProps> = ({ skills }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {skills.map((skill, index) => (
        <SkillCard key={skill.id} skill={skill} index={index} />
      ))}
    </div>
  );
};

export default SkillsGrid;
