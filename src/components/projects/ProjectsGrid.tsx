import React from "react";
import ProjectCard from "./ProjectCard";
import type { ProjectsGridProps } from "./types";
import { groupProjectsByCategory } from "./utils";

/**
 * ProjectsGrid Component
 * Displays projects in a responsive grid, grouped by category
 */
const ProjectsGrid: React.FC<ProjectsGridProps> = ({
  projects,
  onProjectClick,
}) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No projects found.</p>
      </div>
    );
  }

  const groupedProjects = groupProjectsByCategory(projects);

  return (
    <div className="space-y-8 sm:space-y-12">
      {Object.entries(groupedProjects).map(([category, categoryProjects]) => (
        <div key={category}>
          <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
            <span className="text-neural">{category}</span>
            <span className="text-xs sm:text-sm text-muted-foreground font-normal">
              ({categoryProjects.length})
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {categoryProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onProjectClick={onProjectClick}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsGrid;
