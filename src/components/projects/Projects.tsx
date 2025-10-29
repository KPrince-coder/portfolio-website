import React, { useState, useMemo } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import CategoryFilter from "./CategoryFilter";
import ProjectsGrid from "./ProjectsGrid";
import ProjectsSkeleton from "./ProjectsSkeleton";
import { useProjectsData } from "./hooks/useProjectsData";
import { splitTitle } from "./utils";

/**
 * Projects Component
 * Main projects section displaying portfolio projects
 */
const Projects: React.FC = () => {
  const { data, loading } = useProjectsData();
  const [activeCategory, setActiveCategory] = useState("all");

  // Split title into main and highlight parts
  const fullTitle = data.profileData?.projects_title || "Featured Projects";
  const { title, titleHighlight } = useMemo(
    () => splitTitle(fullTitle),
    [fullTitle]
  );

  const description =
    data.profileData?.projects_description ||
    "A showcase of my work spanning web applications, AI/ML systems, and data engineering solutions.";

  // Filter projects based on active category
  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") {
      return data.projects;
    }
    return data.projects.filter(
      (project) => project.category_id === activeCategory
    );
  }, [data.projects, activeCategory]);

  if (loading) {
    return (
      <section
        id="projects"
        className="py-20 bg-gradient-to-b from-background to-background/50"
      >
        <div className="container mx-auto px-6">
          <ProjectsSkeleton />
        </div>
      </section>
    );
  }

  return (
    <section
      id="projects"
      className="py-20 bg-gradient-to-b from-background to-background/50"
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

        <ProjectsGrid projects={filteredProjects} />
      </div>
    </section>
  );
};

export default Projects;
