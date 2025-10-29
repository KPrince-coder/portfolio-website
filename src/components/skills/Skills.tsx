import React, { useState, useMemo } from "react";
import SkillsHeader from "./SkillsHeader";
import CategoryFilter from "./CategoryFilter";
import SkillsGrid from "./SkillsGrid";
import LearningGoalsCard from "./LearningGoalsCard";
import SkillsSkeleton from "./SkillsSkeleton";
import { useSkillsData } from "./hooks/useSkillsData";
import { splitTitle } from "./utils";

/**
 * Skills Component
 * Main skills section displaying technical expertise and learning goals
 */
const Skills: React.FC = () => {
  const { data, loading } = useSkillsData();
  const [activeCategory, setActiveCategory] = useState("all");

  // Split title into main and highlight parts (must be before conditional return)
  const fullTitle = data.profileData?.skills_title || "Technical Expertise";
  const { title, titleHighlight } = useMemo(
    () => splitTitle(fullTitle),
    [fullTitle]
  );

  const description =
    data.profileData?.skills_description ||
    "A comprehensive toolkit for building intelligent systems, from data pipelines to user interfaces.";

  // Filter skills based on active category
  const filteredSkills = useMemo(() => {
    if (activeCategory === "all") {
      return data.skills;
    }
    return data.skills.filter((skill) => skill.category_id === activeCategory);
  }, [data.skills, activeCategory]);

  if (loading) {
    return (
      <section
        id="skills"
        className="py-20 bg-gradient-to-b from-background/50 to-background"
      >
        <div className="container mx-auto px-6">
          <SkillsSkeleton />
        </div>
      </section>
    );
  }

  return (
    <section
      id="skills"
      className="py-20 bg-gradient-to-b from-background/50 to-background"
    >
      <div className="container mx-auto px-6">
        <SkillsHeader
          title={title}
          titleHighlight={titleHighlight}
          description={description}
        />

        <CategoryFilter
          categories={data.categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <SkillsGrid skills={filteredSkills} />

        <LearningGoalsCard goals={data.learningGoals} />
      </div>
    </section>
  );
};

export default Skills;
