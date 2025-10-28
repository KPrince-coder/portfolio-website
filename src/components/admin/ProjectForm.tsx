import React, { useState, useEffect } from 'react';
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
import { Save, X, Plus, CalendarIcon, Edit, Trash2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react'; // Import all Lucide icons
import { Calendar } from '@/components/ui/calendar';
import { Database } from '@/integrations/supabase/types';
import { availableIcons } from '@/lib/icons'; // Import available icons

type ProjectRow = Database['public']['Tables']['projects']['Row'];
type CategoryRow = Database['public']['Tables']['projects_categories']['Row'];
type CategoryInsert = Database['public']['Tables']['projects_categories']['Insert'];
type CategoryUpdate = Database['public']['Tables']['projects_categories']['Update'];

type MetricItem = {
  label: string;
  value: string;
};

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'; // Import Popover components
import { format } from 'date-fns'; // Import format for date formatting
import { cn } from '@/lib/utils'; // Import cn for conditional class names

interface ProjectFormProps {
  project?: ProjectRow;
  onSave: () => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSave, onCancel }) => {
  const [formData, setFormData] = useState<ProjectRow>({
    id: project?.id || '', // Add id for existing projects
    title: project?.title || '',
    slug: project?.slug || '',
    description: project?.description || null,
    long_description: project?.long_description || null,
    category: project?.category || 'Data Engineering',
    image_url: project?.image_url || null,
    technologies: project?.technologies || [],
    github_url: project?.github_url || null,
    demo_url: project?.demo_url || null,
    status: project?.status || 'Development',
    featured: project?.featured || false,
    published: project?.published || true,
    metrics: project?.metrics || null,
    sort_order: project?.sort_order || 0,
    created_at: project?.created_at || new Date().toISOString(),
    updated_at: project?.updated_at || new Date().toISOString(),
    excerpt: project?.excerpt || null,
    start_date: project?.start_date || null,
    end_date: project?.end_date || null,
    duration: project?.duration || null,
    assets: project?.assets || [],
    seo_title: project?.seo_title || null,
    seo_description: project?.seo_description || null,
    author_id: project?.author_id || null,
  });
  const [newTech, setNewTech] = useState('');
  const [dbCategories, setDbCategories] = useState<CategoryRow[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string>(availableIcons[0]);
  const [editingCategory, setEditingCategory] = useState<CategoryRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageUploadMode, setImageUploadMode] = useState<'url' | 'file'>('url');
  const [iconSearchQuery, setIconSearchQuery] = useState('');
  const [metrics, setMetrics] = useState<MetricItem[]>(() => {
    if (project?.metrics && Array.isArray(project.metrics)) {
      return project.metrics.map((metric: MetricItem) => ({
        label: metric.label || '',
        value: metric.value || '',
      }));
    }
    return [];
  });
  const { toast } = useToast();

  // State for controlling calendar popover visibility
  const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);

  // Effect to calculate duration when start_date or end_date changes
  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setFormData(prev => ({ ...prev, duration: diffDays }));
    } else {
      setFormData(prev => ({ ...prev, duration: null }));
    }
  }, [formData.start_date, formData.end_date]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('projects_categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        toast({
          variant: "destructive",
          title: "Failed to load categories",
          description: error.message,
        });
      } else {
        setDbCategories(data || []);
      }
    };
    fetchCategories();
  }, [toast]);

  useEffect(() => {
    if (project?.metrics && Array.isArray(project.metrics)) {
      setMetrics(project.metrics.map((metric: MetricItem) => ({
        label: metric.label || '',
        value: metric.value || '',
      })));
    } else {
      setMetrics([]);
    }
  }, [project?.metrics]);

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

  const addCategory = async () => {
    if (newCategoryName.trim()) {
      const newSlug = generateSlug(newCategoryName.trim());
      const categoryToInsert: CategoryInsert = {
        name: newCategoryName.trim(),
        slug: newSlug,
        icon: selectedIcon,
      };

      const { data, error } = await supabase
        .from('projects_categories')
        .insert([categoryToInsert])
        .select();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error adding category",
          description: error.message,
        });
      } else if (data && data.length > 0) {
        setDbCategories(prev => [...prev, data[0]]);
        setFormData(prev => ({ ...prev, category: data[0].name }));
        setNewCategoryName('');
        setSelectedIcon(availableIcons[0]); // Reset selected icon
        toast({
          title: "Category added successfully",
        });
      }
    }
  };

  const updateCategory = async () => {
    if (editingCategory && editingCategory.name.trim()) {
      const categoryToUpdate: CategoryUpdate = {
        name: editingCategory.name.trim(),
        slug: generateSlug(editingCategory.name.trim()),
        icon: editingCategory.icon,
      };

      const { data, error } = await supabase
        .from('projects_categories')
        .update(categoryToUpdate)
        .eq('id', editingCategory.id)
        .select();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error updating category",
          description: error.message,
        });
      } else if (data && data.length > 0) {
        setDbCategories(prev => prev.map(cat => cat.id === data[0].id ? data[0] : cat));
        setFormData(prev => ({ ...prev, category: data[0].name }));
        setEditingCategory(null); // Exit editing mode
        toast({
          title: "Category updated successfully",
        });
      }
    }
  };

  const deleteCategory = async (categoryId: string) => {
    const { error } = await supabase
      .from('projects_categories')
      .delete()
      .eq('id', categoryId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error deleting category",
        description: error.message,
      });
    } else {
      setDbCategories(prev => prev.filter(cat => cat.id !== categoryId));
      if (formData.category === dbCategories.find(cat => cat.id === categoryId)?.name) {
        setFormData(prev => ({ ...prev, category: dbCategories[0]?.name || '' }));
      }
      toast({
        title: "Category deleted successfully",
      });
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
      const metricsArray = metrics.filter(metric => metric.label.trim() !== '' && metric.value.trim() !== '').map(metric => ({
        label: metric.label.trim(),
        value: metric.value.trim(),
      }));

      const dataToSave = {
        ...formData,
        metrics: metricsArray,
      };

      if (formData.id) {
        const { error } = await supabase
          .from('projects')
          .update(dataToSave)
          .eq('id', formData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([dataToSave]);

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
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the project"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="long_description">Detailed Description</Label>
                <Textarea
                  id="long_description"
                  value={formData.long_description || ''}
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
                    value={formData.github_url || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                    placeholder="https://github.com/username/repo"
                  />
                </div>

                <div>
                  <Label htmlFor="demo_url">Demo URL</Label>
                  <Input
                    id="demo_url"
                    value={formData.demo_url || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, demo_url: e.target.value }))}
                    placeholder="https://demo-url.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="seo_title">SEO Title</Label>
                <Input
                  id="seo_title"
                  value={formData.seo_title || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                  placeholder="Enter SEO title"
                />
              </div>

              <div>
                <Label htmlFor="seo_description">SEO Description</Label>
                <Textarea
                  id="seo_description"
                  value={formData.seo_description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                  placeholder="Enter SEO description"
                  rows={3}
                />
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
                    value={formData.image_url || ''}
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
              {/* Project Metrics */}
              <div className="space-y-2">
                <Label>Project Metrics</Label>
                {metrics.map((metric, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="Metric Label"
                      value={metric.label}
                      onChange={(e) => {
                        const newMetrics = [...metrics];
                        newMetrics[index].label = e.target.value;
                        setMetrics(newMetrics);
                      }}
                      className="w-1/2"
                    />
                    <Input
                      placeholder="Metric Value"
                      value={metric.value}
                      onChange={(e) => {
                        const newMetrics = [...metrics];
                        newMetrics[index].value = e.target.value;
                        setMetrics(newMetrics);
                      }}
                      className="w-1/2"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMetrics(prev => prev.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMetrics(prev => [...prev, { label: '', value: '' }])}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Metric
                </Button>
              </div>

              {/* Start Date */}
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Popover open={isStartDatePickerOpen} onOpenChange={setIsStartDatePickerOpen}>
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
                      onSelect={(date) => {
                        const newStartDate = date ? date.toISOString() : null;
                        setFormData(prev => {
                          const updatedFormData = { ...prev, start_date: newStartDate };
                          if (updatedFormData.start_date && updatedFormData.end_date) {
                            const start = new Date(updatedFormData.start_date);
                            const end = new Date(updatedFormData.end_date);
                            const diffTime = Math.abs(end.getTime() - start.getTime());
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            updatedFormData.duration = diffDays;
                          } else {
                            updatedFormData.duration = null;
                          }
                          return updatedFormData;
                        });
                        setIsStartDatePickerOpen(false); // Close the popover after selection
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date */}
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Popover open={isEndDatePickerOpen} onOpenChange={setIsEndDatePickerOpen}>
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
                      onSelect={(date) => {
                        const newEndDate = date ? date.toISOString() : null;
                        setFormData(prev => {
                          const updatedFormData = { ...prev, end_date: newEndDate };
                          if (updatedFormData.start_date && updatedFormData.end_date) {
                            const start = new Date(updatedFormData.start_date);
                            const end = new Date(updatedFormData.end_date);
                            const diffTime = Math.abs(end.getTime() - start.getTime());
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            updatedFormData.duration = diffDays;
                          } else {
                            updatedFormData.duration = null;
                          }
                          return updatedFormData;
                        });
                        setIsEndDatePickerOpen(false); // Close the popover after selection
                      }}
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
                    {formData.duration ? `${formData.duration} days` : 'N/A'}
                  </p>
                </div>
              )}

              {/* Category Management */}
              <div className="space-y-4">
                <Label htmlFor="category">Categories</Label>
                <div className="flex flex-col gap-2">
                  {dbCategories.map((category) => {
                    const IconComponent = (LucideIcons[category.icon as keyof typeof LucideIcons] || LucideIcons.Folder) as React.ElementType;
                    return (
                      <div key={category.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          <span>{category.name}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setEditingCategory(category)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          {category.name !== 'AI/ML' && category.name !== 'Mobile/AI' && category.name !== 'Data Engineering' && category.name !== 'Frontend Development' && category.name !== 'Backend Development' && category.name !== 'DevOps' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive hover:bg-destructive/10"
                              onClick={() => deleteCategory(category.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {editingCategory ? (
                  <div className="space-y-2 mt-4 p-3 border rounded-md bg-muted/20">
                    <h5 className="font-semibold">Edit Category</h5>
                    <div>
                      <Label htmlFor="edit-category-name">Category Name</Label>
                      <Input
                        id="edit-category-name"
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory(prev => prev ? { ...prev, name: e.target.value } : null)}
                        placeholder="Edit category name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-category-icon">Category Icon</Label>
                      <Select
                        value={editingCategory.icon || ''}
                        onValueChange={(value) => {
                          setEditingCategory(prev => prev ? { ...prev, icon: value } : null);
                          setIconSearchQuery(''); // Clear search query on selection
                        }}
                      >
                        <SelectTrigger id="edit-category-icon">
                          <SelectValue placeholder="Select an icon" />
                        </SelectTrigger>
                        <SelectContent className="p-0">
                          <div className="p-2">
                            <Input
                              placeholder="Search icons..."
                              value={iconSearchQuery}
                              onChange={(e) => setIconSearchQuery(e.target.value)}
                            />
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {availableIcons
                              .filter(iconName => iconName.toLowerCase().includes(iconSearchQuery.toLowerCase()))
                              .map((iconName) => {
                                const IconComponent = (LucideIcons[iconName as keyof typeof LucideIcons] || LucideIcons.Folder) as React.ElementType;
                                return (
                                  <SelectItem key={iconName} value={iconName}>
                                    <div className="flex items-center gap-2">
                                      <IconComponent className="w-4 h-4" />
                                      {iconName}
                                    </div>
                                  </SelectItem>
                                );
                              })}
                          </div>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button onClick={updateCategory} size="sm">Save Changes</Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingCategory(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 mt-4 p-3 border rounded-md bg-muted/20">
                    <h5 className="font-semibold">Add New Category</h5>
                    <div>
                      <Label htmlFor="new-category-name">Category Name</Label>
                      <Input
                        id="new-category-name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="New category name"
                        onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-category-icon">Category Icon</Label>
                      <Select
                        value={selectedIcon}
                        onValueChange={(value) => {
                          setSelectedIcon(value);
                          setIconSearchQuery(''); // Clear search query on selection
                        }}
                      >
                        <SelectTrigger id="new-category-icon">
                          <SelectValue placeholder="Select an icon" />
                        </SelectTrigger>
                        <SelectContent className="p-0">
                          <div className="p-2">
                            <Input
                              placeholder="Search icons..."
                              value={iconSearchQuery}
                              onChange={(e) => setIconSearchQuery(e.target.value)}
                            />
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {availableIcons
                              .filter(iconName => iconName.toLowerCase().includes(iconSearchQuery.toLowerCase()))
                              .map((iconName) => {
                                const IconComponent = (LucideIcons[iconName as keyof typeof LucideIcons] || LucideIcons.Folder) as React.ElementType;
                                return (
                                  <SelectItem key={iconName} value={iconName}>
                                    <div className="flex items-center gap-2">
                                      <IconComponent className="w-4 h-4" />
                                      {iconName}
                                    </div>
                                  </SelectItem>
                                );
                              })}
                          </div>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={addCategory} size="sm" className="mt-2">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Category
                    </Button>
                  </div>
                )}
              </div>

              {/* Project Category Selection */}
              <div>
                <Label htmlFor="project-category-select">Assign Project Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger id="project-category-select">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {dbCategories.map((category) => {
                      const IconComponent = (LucideIcons[category.icon as keyof typeof LucideIcons] || LucideIcons.Folder) as React.ElementType;
                      return (
                        <SelectItem key={category.id} value={category.name}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4" />
                            {category.name}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
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

              {/* Featured */}
              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Featured Project</Label>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                />
              </div>

              {/* Published */}
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
                  <Badge key={tech} variant="secondary" className="cursor-pointer" onClick={() => removeTechnology(tech)}>
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
        </div>
      </div>

      {/* Preview - Full Width */}
      {formData.title && (
        <Card className="card-neural mt-6">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <h4 className="font-semibold text-lg">{formData.title}</h4>
              {formData.image_url && (
                <img src={formData.image_url} alt="Project Preview" className="w-full h-48 object-cover rounded-md" />
              )}
              <p className="text-muted-foreground">{formData.description}</p>
              {formData.long_description && (
                <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: formData.long_description }} />
              )}
              <div className="flex flex-wrap gap-2">
                {formData.category && (
                  <Badge variant="outline" className="text-xs flex items-center gap-1">
                    {(() => {
                      const category = dbCategories.find(cat => cat.name === formData.category);
                      const IconComponent = category?.icon ? (LucideIcons[category.icon as keyof typeof LucideIcons] || LucideIcons.Folder) as React.ElementType : LucideIcons.Folder as React.ElementType;
                      return (
                        <>
                          <IconComponent className="w-3 h-3" />
                          {formData.category}
                        </>
                      );
                    })()}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">{formData.status}</Badge>
                {formData.featured && <Badge variant="accent" className="text-xs">Featured</Badge>}
                {!formData.published && <Badge variant="outline" className="text-xs">Draft</Badge>}
                {formData.technologies && formData.technologies.map(tech => (
                  <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                ))}
              </div>

              {metrics.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-semibold text-sm mb-2">Metrics:</h5>
                  <div className="flex flex-wrap gap-2">
                    {metrics.map((metric, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {metric.label}: {metric.value}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {(formData.github_url || formData.demo_url) && (
                <div className="flex gap-2 mt-4">
                  {formData.github_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={formData.github_url} target="_blank" rel="noopener noreferrer">GitHub</a>
                    </Button>
                  )}
                  {formData.demo_url && (
                    <Button variant="default" size="sm" asChild>
                      <a href={formData.demo_url} target="_blank" rel="noopener noreferrer">Live Demo</a>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectForm;
