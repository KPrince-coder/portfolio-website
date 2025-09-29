import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, X, Plus } from 'lucide-react';

interface Project {
  id?: string;
  title: string;
  slug: string;
  description: string;
  long_description: string;
  category: string;
  image_url: string;
  technologies: string[];
  github_url: string;
  demo_url: string;
  status: string;
  featured: boolean;
  published: boolean;
  metrics?: Record<string, any>;
}

interface ProjectFormProps {
  project?: Project;
  onSave: () => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Project>({
    title: '',
    slug: '',
    description: '',
    long_description: '',
    category: 'Data Engineering',
    image_url: '',
    technologies: [],
    github_url: '',
    demo_url: '',
    status: 'Development',
    featured: false,
    published: true,
    ...project
  });
  const [newTech, setNewTech] = useState('');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const categories = [
    'Data Engineering',
    'AI/Machine Learning',
    'Frontend Development',
    'Mobile Development',
    'Backend Development',
    'DevOps'
  ];

  const statuses = [
    'Planning',
    'Development',
    'Testing',
    'Completed',
    'Maintenance'
  ];

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.id ? prev.slug : generateSlug(title)
    }));
  };

  const addTechnology = () => {
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const removeTechnology = (techToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
    }));
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      toast({
        variant: "destructive",
        title: "Missing required fields",
        description: "Title and description are required",
      });
      return;
    }

    setSaving(true);
    try {
      if (formData.id) {
        const { error } = await supabase
          .from('projects')
          .update(formData)
          .eq('id', formData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([formData]);

        if (error) throw error;
      }

      toast({
        title: "Project saved successfully",
      });

      onSave();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error saving project",
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {formData.id ? 'Edit Project' : 'Create New Project'}
        </h3>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} className="neural-glow">
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Project'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="card-neural">
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter project title"
                />
              </div>

              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="url-friendly-slug"
                />
              </div>

              <div>
                <Label htmlFor="description">Short Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the project"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="long_description">Detailed Description</Label>
                <Textarea
                  id="long_description"
                  value={formData.long_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, long_description: e.target.value }))}
                  placeholder="Detailed project description (HTML supported)"
                  rows={8}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="github_url">GitHub URL</Label>
                  <Input
                    id="github_url"
                    value={formData.github_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                    placeholder="https://github.com/username/repo"
                  />
                </div>

                <div>
                  <Label htmlFor="demo_url">Demo URL</Label>
                  <Input
                    id="demo_url"
                    value={formData.demo_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, demo_url: e.target.value }))}
                    placeholder="https://demo-url.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image_url">Project Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/project-image.jpg"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Settings */}
          <Card className="card-neural">
            <CardHeader>
              <CardTitle>Project Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Featured Project</Label>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="published">Published</Label>
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Technologies */}
          <Card className="card-neural">
            <CardHeader>
              <CardTitle>Technologies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder="Add technology"
                  onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
                />
                <Button onClick={addTechnology} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="cursor-pointer">
                    {tech}
                    <X
                      className="w-3 h-3 ml-1"
                      onClick={() => removeTechnology(tech)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          {formData.title && (
            <Card className="card-neural">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <h4 className="font-semibold">{formData.title}</h4>
                  <p className="text-muted-foreground line-clamp-2">{formData.description}</p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">{formData.category}</Badge>
                    <Badge variant="outline" className="text-xs">{formData.status}</Badge>
                    {formData.featured && <Badge variant="accent" className="text-xs">Featured</Badge>}
                    {!formData.published && <Badge variant="outline" className="text-xs">Draft</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;