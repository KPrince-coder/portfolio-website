import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ExternalLink,
  Github,
  Star,
  GitFork,
  Eye,
  Calendar,
  Tag,
} from "lucide-react";
import type { ProjectDetailModalProps } from "./types";
import { formatDate } from "./utils";

/**
 * ProjectDetailModal Component
 * Displays comprehensive project details in an accessible, SEO-friendly modal
 *
 * Features:
 * - Semantic HTML with proper ARIA labels
 * - Keyboard navigation support
 * - Performance optimized with lazy rendering
 * - Responsive design with mobile-first approach
 */
const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  open,
  onOpenChange,
}) => {
  if (!project) return null;

  const statusColors = {
    completed: "bg-success/10 text-success border-success/20",
    "in-progress": "bg-warning/10 text-warning border-warning/20",
    planned: "bg-secondary/10 text-secondary border-secondary/20",
    archived: "bg-muted/10 text-muted-foreground border-muted/20",
  };

  const hasMetrics =
    project.stars > 0 || project.forks > 0 || project.views > 0;
  const hasDates = project.start_date || project.end_date;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] p-0 gap-0 overflow-hidden"
        aria-describedby="project-description"
      >
        {/* Hero Image Section */}
        {project.image_url && (
          <div className="relative h-48 sm:h-56 md:h-64 lg:h-80 overflow-hidden bg-gradient-to-br from-neural/20 to-accent/20">
            <img
              src={project.image_url}
              alt={`${project.title} project screenshot`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {project.is_featured && (
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-warning/90 backdrop-blur-sm px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full flex items-center gap-1 sm:gap-1.5 shadow-lg">
                <Star
                  className="w-3 h-3 sm:w-4 sm:h-4 fill-current"
                  aria-hidden="true"
                />
                <span className="text-xs sm:text-sm font-medium">Featured</span>
              </div>
            )}
          </div>
        )}

        <ScrollArea className="max-h-[calc(90vh-12rem)] sm:max-h-[calc(90vh-14rem)] md:max-h-[calc(90vh-16rem)] lg:max-h-[calc(90vh-20rem)]">
          <div className="p-4 sm:p-6 md:p-8">
            {/* Header Section */}
            <DialogHeader className="space-y-4">
              <div className="flex flex-wrap items-start gap-3">
                <Badge
                  variant="outline"
                  className={`${project.category_color || "text-secondary"}`}
                >
                  {project.category_label}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    statusColors[project.status as keyof typeof statusColors]
                  }
                >
                  {project.status.replace("-", " ")}
                </Badge>
              </div>

              <DialogTitle className="text-3xl md:text-4xl font-bold leading-tight">
                {project.title}
              </DialogTitle>

              <DialogDescription
                id="project-description"
                className="text-base md:text-lg text-muted-foreground"
              >
                {project.description}
              </DialogDescription>
            </DialogHeader>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row fm:mt-6">
              {project.demo_url && (
                <Button
                  variant="default"
                  size="lg"
                  className="neural-glow w-auto"
                  asChild
                >
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View live demo of ${project.title}`}
                  >
                    <ExternalLink
                      className="w-4 h-4 mr-2 flex-shrink-0"
                      aria-hidden="true"
                    />
                    View Demo
                  </a>
                </Button>
              )}
              {project.github_url && (
                <Button variant="outline" size="lg" className="w-auto" asChild>
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View source code of ${project.title} on GitHub`}
                  >
                    <Github
                      className="w-4 h-4 mr-2 flex-shrink-0"
                      aria-hidden="true"
                    />
                    Source Code
                  </a>
                </Button>
              )}
            </div>

            <Separator className="my-6" />

            {/* Long Description */}
            {project.long_description && (
              <section aria-labelledby="project-details-heading">
                <h3
                  id="project-details-heading"
                  className="text-xl font-semibold mb-3"
                >
                  About This Project
                </h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {project.long_description}
                </p>
              </section>
            )}

            {/* Technologies Section */}
            {project.technologies && project.technologies.length > 0 && (
              <>
                <Separator className="my-6" />
                <section aria-labelledby="technologies-heading">
                  <h3
                    id="technologies-heading"
                    className="text-xl font-semibold mb-3 flex items-center gap-2"
                  >
                    <Tag className="w-5 h-5" aria-hidden="true" />
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-sm px-3 py-1"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* Tags Section */}
            {project.tags && project.tags.length > 0 && (
              <>
                <Separator className="my-6" />
                <section aria-labelledby="tags-heading">
                  <h3 id="tags-heading" className="text-xl font-semibold mb-3">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* Metrics & Dates Section */}
            {(hasMetrics || hasDates) && (
              <>
                <Separator className="my-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Metrics */}
                  {hasMetrics && (
                    <section aria-labelledby="metrics-heading">
                      <h3
                        id="metrics-heading"
                        className="text-lg font-semibold mb-3"
                      >
                        Project Metrics
                      </h3>
                      <div className="space-y-2">
                        {project.stars > 0 && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Star className="w-4 h-4" aria-hidden="true" />
                            <span>
                              <span className="font-medium text-foreground">
                                {project.stars}
                              </span>{" "}
                              {project.stars === 1 ? "star" : "stars"}
                            </span>
                          </div>
                        )}
                        {project.forks > 0 && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <GitFork className="w-4 h-4" aria-hidden="true" />
                            <span>
                              <span className="font-medium text-foreground">
                                {project.forks}
                              </span>{" "}
                              {project.forks === 1 ? "fork" : "forks"}
                            </span>
                          </div>
                        )}
                        {project.views > 0 && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Eye className="w-4 h-4" aria-hidden="true" />
                            <span>
                              <span className="font-medium text-foreground">
                                {project.views.toLocaleString()}
                              </span>{" "}
                              {project.views === 1 ? "view" : "views"}
                            </span>
                          </div>
                        )}
                      </div>
                    </section>
                  )}

                  {/* Dates */}
                  {hasDates && (
                    <section aria-labelledby="timeline-heading">
                      <h3
                        id="timeline-heading"
                        className="text-lg font-semibold mb-3"
                      >
                        Timeline
                      </h3>
                      <div className="space-y-2">
                        {project.start_date && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" aria-hidden="true" />
                            <span>
                              Started:{" "}
                              <span className="font-medium text-foreground">
                                {formatDate(project.start_date)}
                              </span>
                            </span>
                          </div>
                        )}
                        {project.end_date && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" aria-hidden="true" />
                            <span>
                              {project.status === "completed"
                                ? "Completed"
                                : "Expected"}
                              :{" "}
                              <span className="font-medium text-foreground">
                                {formatDate(project.end_date)}
                              </span>
                            </span>
                          </div>
                        )}
                      </div>
                    </section>
                  )}
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailModal;
