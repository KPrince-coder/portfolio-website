import React, { useState, useMemo } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import CategoryFilter from "./CategoryFilter";
import SkillsGrid from "./SkillsGrid";
import LearningGoalsCard from "./LearningGoalsCard";
import SkillsSkeleton from "./SkillsSkeleton";
import { useSkillsData } from "./hooks/useSkillsData";
import { splitTitle } from "./utils";
import {
  INITIAL_DISPLAY_COUNT,
  DEFAULT_CATEGORY,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
} from "./constants";

/**
 * Skills Component
 * Main skills section displaying technical expertise and learning goals
 */
const Skills: React.FC = () => {
  const { data, loading } = useSkillsData();
  const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORY);
  const [showAll, setShowAll] = useState(false);

  // Split title into main and highlight parts (must be before conditional return)
  const fullTitle = data.profileData?.skills_title || DEFAULT_TITLE;
  const { title, titleHighlight } = useMemo(
    () => splitTitle(fullTitle),
    [fullTitle]
  );

  const description =
    data.profileData?.skills_description || DEFAULT_DESCRIPTION;

  // Filter skills based on active category
  const filteredSkills = useMemo(() => {
    if (activeCategory === DEFAULT_CATEGORY) {
      return data.skills;
    }
    // Find the category name for the selected ID
    const selectedCategory = data.categories.find(
      (cat) => cat.id === activeCategory
    );
    if (!selectedCategory) return data.skills;

    // Filter by category name (since view doesn't include category_id)
    return data.skills.filter(
      (skill) => skill.category_name === selectedCategory.name
    );
  }, [data.skills, activeCategory, data.categories]);

  // Display skills (limited or all)
  const displayedSkills = useMemo(() => {
    if (showAll || filteredSkills.length <= INITIAL_DISPLAY_COUNT) {
      return filteredSkills;
    }
    return filteredSkills.slice(0, INITIAL_DISPLAY_COUNT);
  }, [filteredSkills, showAll, INITIAL_DISPLAY_COUNT]);

  const hasMore = filteredSkills.length > INITIAL_DISPLAY_COUNT;

  // Reset showAll when category changes
  React.useEffect(() => {
    setShowAll(false);
  }, [activeCategory]);

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
        <SectionHeader
          title={title}
          titleHighlight={titleHighlight}
          description={description}
        />

        <CategoryFilter
          categories={data.categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {filteredSkills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-center space-y-4 max-w-md">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-accent/50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">No Skills Found</h3>
              <p className="text-muted-foreground">
                There are no skills in this category yet. Check back later or
                explore other categories!
              </p>
              <button
                onClick={() => setActiveCategory(DEFAULT_CATEGORY)}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-secondary hover:text-secondary/80 transition-colors"
              >
                View All Skills
              </button>
            </div>
          </div>
        ) : (
          <>
            <SkillsGrid skills={displayedSkills} />

            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 text-secondary transition-all duration-200 neural-glow"
                >
                  {showAll ? (
                    <>
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                      Show Less
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                      View More ({filteredSkills.length - INITIAL_DISPLAY_COUNT}{" "}
                      more)
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}

        <LearningGoalsCard goals={data.learningGoals} />
      </div>
    </section>
  );
};

export default Skills;
