import React, { useState } from 'react';
import { Briefcase, Edit, Trash2, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProjectsManagementProps } from './types';
import ProjectFormModal from './ProjectFormModal';
import { ProjectsAPI } from '@/lib/projects';
import { useToast } from '@/hooks/use-toast';

const ProjectsManagement: React.FC<ProjectsManagementProps> = ({ projects: initialProjects }) => {
  const [projects, setProjects] = useState(initialProjects);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const handleRefresh = async () => {
    try {
      const updatedProjects = await ProjectsAPI.getAllProjects();
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Failed to refresh projects:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await ProjectsAPI.deleteProject(id);
      toast({
        title: 'Project deleted',
        description: 'Project has been deleted successfully.',
      });
      handleRefresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete project',
      });
    }
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProject(null);
    handleRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="heading-lg">Projects Management</h2>
        <Button variant="default" className="neural-glow" onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Project
        </Button>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.id} className="card-neural">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.slug}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={project.status === 'published' ? 'secondary' : 'outline'}>
                      {project.status}
                    </Badge>
                    {project.featured && (
                      <Badge variant="default">Featured</Badge>
                    )}
                    {project.technologies && (project.technologies as string[]).length > 0 && (
                      <Badge variant="outline">
                        {(project.technologies as string[]).length} tech{(project.technologies as string[]).length !== 1 && 's'}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(project)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(project.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {projects.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted-foreground">No projects yet</p>
            <Button className="mt-4 neural-glow" onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Project
            </Button>
          </div>
        )}
      </div>

      {showForm && (
        <ProjectFormModal
          project={editingProject}
          onSave={handleFormClose}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default ProjectsManagement;
