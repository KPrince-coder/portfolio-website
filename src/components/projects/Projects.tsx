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
  const [showAll, setShowAll] = useState(false);

  const INITIAL_DISPLAY_COUNT = 6;

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

  // Display projects (limited or all)
  const displayedProjects = useMemo(() => {
    if (showAll || filteredProjects.length <= INITIAL_DISPLAY_COUNT) {
      return filteredProjects;
    }
    return filteredProjects.slice(0, INITIAL_DISPLAY_COUNT);
  }, [filteredProjects, showAll, INITIAL_DISPLAY_COUNT]);

  const hasMore = filteredProjects.length > INITIAL_DISPLAY_COUNT;

  // Reset showAll when category changes
  React.useEffect(() => {
    setShowAll(false);
  }, [activeCategory]);

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

        {filteredProjects.length === 0 ? (
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">No Projects Found</h3>
              <p className="text-muted-foreground">
                There are no projects in this category yet. Check back later or
                explore other categories!
              </p>
              <button
                onClick={() => setActiveCategory("all")}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-secondary hover:text-secondary/80 transition-colors"
              >
                View All Projects
              </button>
            </div>
          </div>
        ) : (
          <>
            <ProjectsGrid
              projects={displayedProjects}
              onProjectClick={handleProjectClick}
            />

            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary transition-all duration-200 neural-glow"
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
                      View More (
                      {filteredProjects.length - INITIAL_DISPLAY_COUNT} more)
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}

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
