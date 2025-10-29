import React, { useState } from "react";
import { Edit, Trash2, Star, ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DestructiveButton } from "@/components/ui/destructive-button";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import type { ProjectsListProps } from "./types";

/**
 * ProjectsList Component
 * Displays a list of projects with edit and delete actions
 */
const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  loading,
  onEdit,
  onDelete,
  onToggleFeatured,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const handleDeleteClick = (id: string, title: string) => {
    setProjectToDelete({ id, title });
    setDeleteDialogOpen(true);
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    await onToggleFeatured(id, !currentFeatured);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            No projects found. Add your first project to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group projects by category
  const groupedProjects = projects.reduce((acc, project) => {
    const category = project.category_label;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(project);
    return acc;
  }, {} as Record<string, typeof projects>);

  return (
    <>
      <div className="space-y-6">
        {Object.entries(groupedProjects).map(([category, categoryProjects]) => (
          <div key={category}>
            <h3 className="text-xl font-semibold mb-4">{category}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {categoryProjects.map((project) => (
                <Card
                  key={project.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-lg">
                            {project.title}
                          </h4>
                          {project.is_featured && (
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="secondary">{project.status}</Badge>
                          {project.demo_url && (
                            <Badge variant="outline">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Demo
                            </Badge>
                          )}
                          {project.github_url && (
                            <Badge variant="outline">
                              <Github className="w-3 h-3 mr-1" />
                              GitHub
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {project.image_url && (
                      <div className="mb-4 rounded-md overflow-hidden">
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(project)}
                        aria-label={`Edit ${project.title}`}
                      >
                        <Edit className="w-4 h-4 mr-1" aria-hidden="true" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleToggleFeatured(project.id, project.is_featured)
                        }
                        aria-label={`Toggle featured for ${project.title}`}
                      >
                        <Star
                          className={`w-4 h-4 mr-1 ${
                            project.is_featured
                              ? "fill-yellow-500 text-yellow-500"
                              : ""
                          }`}
                          aria-hidden="true"
                        />
                        {project.is_featured ? "Unfeature" : "Feature"}
                      </Button>
                      <DestructiveButton
                        size="sm"
                        onClick={() =>
                          handleDeleteClick(project.id, project.title)
                        }
                        aria-label={`Delete ${project.title}`}
                      >
                        <Trash2 className="w-4 h-4 mr-1" aria-hidden="true" />
                        Delete
                      </DestructiveButton>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {projectToDelete && (
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Delete Project"
          itemName={projectToDelete.title}
          itemType="project"
          onConfirm={async () => await onDelete(projectToDelete.id)}
        />
      )}
    </>
  );
};

export default ProjectsList;
