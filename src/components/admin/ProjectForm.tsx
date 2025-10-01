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
import { Save, X, Plus, CalendarIcon } from 'lucide-react'; // Added CalendarIcon
import { Project } from './types'; // Import Project from types.ts
import { Calendar } from '@/components/ui/calendar'; // Import Calendar
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'; // Import Popover components
import { format } from 'date-fns'; // Import format for date formatting
import { cn } from '@/lib/utils'; // Import cn for conditional class names

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
    metrics: {},
    start_date: project?.start_date || null, // Initialize start_date
    end_date: project?.end_date || null,     // Initialize end_date
    ...project
  });
  const [newTech, setNewTech] = useState('');
  const [newCategory, setNewCategory] = useState(''); // New state for custom category
  const [customCategories, setCustomCategories] = useState<string[]>([]); // State for custom categories
  const [saving, setSaving] = useState(false);
  const [imageUploadMode, setImageUploadMode] = useState<'url' | 'file'>('url'); // New state for image upload mode
  const { toast } = useToast();

  const predefinedCategories = [
    'Data Engineering',
    'AI/Machine Learning',
    'Frontend Development',
    'Mobile Development',
    'Backend Development',
    'DevOps'
  ];

  const allCategories = [...predefinedCategories, ...customCategories];

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

  const addCategory = () => {
    if (newCategory.trim() && !allCategories.includes(newCategory.trim())) {
      setCustomCategories(prev => [...prev, newCategory.trim()]);
      setFormData(prev => ({ ...prev, category: newCategory.trim() })); // Set new category as active
      setNewCategory('');
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
    } catch (error: unknown) { // Changed type to unknown
      toast({
        variant: "destructive",
        title: "Error saving project",
        description: (error instanceof Error) ? error.message : String(error),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-h-screen overflow-y-auto p-4"> {/* Added max-h-screen and overflow-y-auto */}
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
                <Label htmlFor="image_url">Project Image</Label>
                <div className="flex space-x-2 mb-2">
                  <Button
                    variant={imageUploadMode === 'url' ? 'default' : 'outline'}
                    onClick={() => setImageUploadMode('url')}
                    size="sm"
                  >
                    Use URL
                  </Button>
                  <Button
                    variant={imageUploadMode === 'file' ? 'default' : 'outline'}
                    onClick={() => setImageUploadMode('file')}
                    size="sm"
                  >
                    Upload File
                  </Button>
                </div>

                {imageUploadMode === 'url' ? (
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, image_url: e.target.value }));
                      setImageUploadMode('url'); // Ensure mode is 'url' when typing in URL input
                    }}
                    placeholder="https://example.com/project-image.jpg"
                  />
                ) : (
                  <Input
                    id="image_file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData(prev => ({ ...prev, image_url: reader.result as string }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                )}
                {formData.image_url && (
                  <div className="mt-4">
                    <Label>Image Preview</Label>
                    <img src={formData.image_url} alt="Project Preview" className="w-full h-32 object-cover rounded-md mt-2" />
                  </div>
                )}
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
              {/* Start Date */}
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.start_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.start_date ? format(new Date(formData.start_date), "PPP") : <span>Pick a start date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.start_date ? new Date(formData.start_date) : undefined}
                      onSelect={(date) => setFormData(prev => ({ ...prev, start_date: date ? date.toISOString() : null }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date */}
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.end_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.end_date ? format(new Date(formData.end_date), "PPP") : <span>Pick an end date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.end_date ? new Date(formData.end_date) : undefined}
                      onSelect={(date) => setFormData(prev => ({ ...prev, end_date: date ? date.toISOString() : null }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Duration Display */}
              {formData.start_date && formData.end_date && (
                <div>
                  <Label>Duration</Label>
                  <p className="text-sm text-muted-foreground">
                    {(() => {
                      const start = new Date(formData.start_date!);
                      const end = new Date(formData.end_date!);
                      const diffTime = Math.abs(end.getTime() - start.getTime());
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return `${diffDays} days`;
                    })()}
                  </p>
                </div>
              )}

              {/* Category Management */}
              <div>
                <Label htmlFor="category">Category</Label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Add new category"
                    onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                  />
                  <Button onClick={addCategory} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {predefinedCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                    {customCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        <div className="flex items-center justify-between w-full">
                          {category}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-foreground"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent select item from closing
                              setCustomCategories(prev => prev.filter(c => c !== category));
                              if (formData.category === category) {
                                setFormData(prev => ({ ...prev, category: predefinedCategories[0] })); // Reset to a default category
                              }
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
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
