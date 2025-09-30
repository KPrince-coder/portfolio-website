import React from 'react';
import { Briefcase, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProjectsManagementProps } from './types';

const ProjectsManagement: React.FC<ProjectsManagementProps> = ({ projects }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="heading-lg">Projects Management</h2>
        <Button variant="neural">
          <Briefcase className="w-4 h-4 mr-2" />
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
                  <p className="text-sm text-muted-foreground">{project.category}</p>
                  <div className="flex space-x-2 mt-2">
                    <Badge variant={project.published ? 'secondary' : 'outline'}>
                      {project.published ? 'Published' : 'Draft'}
                    </Badge>
                    {project.featured && (
                      <Badge variant="accent">Featured</Badge>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
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
