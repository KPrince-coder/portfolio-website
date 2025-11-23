import React from "react";
import { ExternalLink, Github, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProjectCardProps } from "./types";

/**
 * ProjectCard Component
 * Displays a single project with image, title, description, and links
 * Clickable to open detailed project modal
 */
const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onProjectClick,
}) => {
  const statusColors = {
    completed: "bg-success/10 text-success border-success/20",
    "in-progress": "bg-warning/10 text-warning border-warning/20",
    planned: "bg-secondary/10 text-secondary border-secondary/20",
    archived: "bg-muted/10 text-muted-foreground border-muted/20",
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger modal if clicking on links
    const target = e.target as HTMLElement;
    if (target.closest("a, button")) {
      return;
    }
    onProjectClick?.(project);
  };

  return (
    <Card
      className="group overflow-hidden hover:shadow-xl transition-all duration-300 card-neural cursor-pointer"
      onClick={handleCardClick}
      role="article"
      aria-label={`${project.title} project card. Click to view details.`}
    >
      {/* Project Image */}
      {project.image_url && (
        <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden">
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          {project.is_featured && (
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-warning/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-xs font-medium">Featured</span>
            </div>
          )}
        </div>
      )}

      <CardContent className="p-4 sm:p-6">
        {/* Category Badge */}
        <Badge
          variant="outline"
          className={`mb-2 sm:mb-3 text-xs sm:text-sm ${
            project.category_color || "text-secondary"
          }`}
        >
          {project.category_label}
        </Badge>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-neural transition-colors">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Status Badge */}
        <div className="mb-3 sm:mb-4">
          <Badge
            variant="outline"
            className={`text-xs ${
              statusColors[project.status as keyof typeof statusColors]
            }`}
          >
            {project.status.replace("-", " ")}
          </Badge>
        </div>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.slice(0, 4).map((tech, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{project.technologies.length - 4}
              </Badge>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {project.demo_url && (
            <Button
              variant="default"
              size="sm"
              className="flex-1 neural-glow min-h-[44px]"
              asChild
            >
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">Demo</span>
              </a>
            </Button>
          )}
          {project.github_url && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 min-h-[44px]"
              asChild
            >
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">Code</span>
              </a>
            </Button>
          )}
        </div>

        {/* Metrics */}
        {(project.stars || project.forks || project.views) && (
          <div className="flex gap-4 mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
            {project.stars > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                <span>{project.stars}</span>
              </div>
            )}
            {project.forks > 0 && (
              <div className="flex items-center gap-1">
                <Github className="w-4 h-4" />
                <span>{project.forks}</span>
              </div>
            )}
            {project.views > 0 && (
              <div className="flex items-center gap-1">
                <ExternalLink className="w-4 h-4" />
                <span>{project.views}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
