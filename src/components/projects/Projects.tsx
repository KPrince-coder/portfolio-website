import React, { useState, useMemo } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import CategoryFilter from "./CategoryFilter";
import ProjectsGrid from "./ProjectsGrid";
import ProjectsSkeleton from "./ProjectsSkeleton";
import ProjectDetailModal from "./ProjectDetailModal";
import { useProjectsData } from "./hooks/useProjectsData";
import { splitTitle } from "./utils";
import type { ProjectWithCategory } from "./types";

/**
 * Projects Component
 * Main projects section displaying portfolio projects with detail modal
 */
const Projects: React.FC = () => {
  const { data, loading } = useProjectsData();
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProject, setSelectedProject] =
    useState<ProjectWithCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = (project: ProjectWithCategory) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      // Delay clearing selected project for smooth animation
      setTimeout(() => setSelectedProject(null), 200);
    }
  };

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

        <ProjectsGrid
          projects={filteredProjects}
          onProjectClick={handleProjectClick}
        />

        <ProjectDetailModal
          project={selectedProject}
          open={isModalOpen}
          onOpenChange={handleModalClose}
        />
      </div>
    </section>
  );
};

export default Projects;
