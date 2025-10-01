import React, { useState } from 'react';
import { Briefcase, Edit, Trash2, Search, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectsManagementProps } from './types';
import ProjectForm from './ProjectForm'; // Import ProjectForm
import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type ProjectRow = Database['public']['Tables']['projects']['Row'];

const ProjectsManagement: React.FC<ProjectsManagementProps> = ({
  projects,
  projectCategories,
  projectSearchTerm,
  setProjectSearchTerm,
  projectCategoryFilter,
  setProjectCategoryFilter,
  projectStatusFilter,
  setProjectStatusFilter,
  projectPublishedFilter,
  setProjectPublishedFilter,
  projectFeaturedFilter,
  setProjectFeaturedFilter,
  refetchProjects,
}) => {
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectRow | undefined>(undefined);
  const { toast } = useToast();

  const handleAddProject = () => {
    setEditingProject(undefined);
    setShowProjectForm(true);
  };

  const handleEditProject = (project: ProjectRow) => {
    setEditingProject(project);
    setShowProjectForm(true);
  };

  const handleSave = async () => {
    setShowProjectForm(false);
    setEditingProject(undefined);
    await refetchProjects(); // Refetch projects after save
  };

  const handleCancel = () => {
    setShowProjectForm(false);
    setEditingProject(undefined);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const { error } = await supabase.from('projects').delete().eq('id', projectId);
        if (error) throw error;
        toast({ title: 'Project deleted successfully.' });
        await refetchProjects(); // Refetch projects after delete
      } catch (error) {
        console.error('Error deleting project:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to delete project.',
          description: error instanceof Error ? error.message : 'An unexpected error occurred.',
        });
      }
    }
  };

  if (showProjectForm) {
    return <ProjectForm project={editingProject} onSave={handleSave} onCancel={handleCancel} />;
  }

  const projectStatuses = ['All', 'Planning', 'In Progress', 'Completed', 'On Hold', 'Archived'];
  const booleanFilters = ['All', 'true', 'false'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="heading-lg">Projects Management</h2>
        <Button variant="neural" onClick={handleAddProject}>
          <Briefcase className="w-4 h-4 mr-2" />
          Add New Project
        </Button>
      </div>

      {/* Filter and Search Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="relative col-span-full lg:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9 pr-9"
            value={projectSearchTerm}
            onChange={(e) => setProjectSearchTerm(e.target.value)}
          />
          {projectSearchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 p-0 text-muted-foreground hover:bg-transparent"
              onClick={() => setProjectSearchTerm('')}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <Select value={projectCategoryFilter} onValueChange={setProjectCategoryFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {projectCategories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={projectStatusFilter} onValueChange={setProjectStatusFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            {projectStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={projectPublishedFilter} onValueChange={setProjectPublishedFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by Published" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Published</SelectItem>
            <SelectItem value="true">Published</SelectItem>
            <SelectItem value="false">Draft</SelectItem>
          </SelectContent>
        </Select>

        <Select value={projectFeaturedFilter} onValueChange={setProjectFeaturedFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by Featured" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Featured</SelectItem>
            <SelectItem value="true">Featured</SelectItem>
            <SelectItem value="false">Not Featured</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.id} className="card-neural">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.category}</p>
                  {project.start_date && project.end_date && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(project.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} - {new Date(project.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} {project.duration ? `(${project.duration} days)` : ''}
                    </p>
                  )}
                  <div className="flex space-x-2 mt-2">
                    <Badge variant={project.published ? 'secondary' : 'outline'}>
                      {project.published ? 'Published' : 'Draft'}
                    </Badge>
                    {project.featured && (
                      <Badge variant="accent">Featured</Badge>
                    )}
                    {project.status && (
                      <Badge variant="secondary">{project.status}</Badge>
                    )}
                    {project.duration && (
                      <Badge variant="secondary">{project.duration} days</Badge>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditProject(project)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteProject(project.id)}>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsManagement;
