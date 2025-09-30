import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save, Eye, Calendar, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ProjectsAPI } from '@/lib/projects';
import { Project } from './types';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.any(), // JSONB from rich text editor
  excerpt: z.string().optional(),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  image_url: z.string().optional(),
  github_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  demo_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormModalProps {
  project?: Project;
  onSave: () => void;
  onCancel: () => void;
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  project,
  onSave,
  onCancel,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [duration, setDuration] = useState<number | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || '',
      slug: project?.slug || '',
      category: project?.category || '',
      description: project?.description || {},
      excerpt: project?.excerpt || '',
      start_date: project?.start_date || '',
      end_date: project?.end_date || '',
      technologies: (project?.technologies as string[]) || [],
      status: project?.status as 'draft' | 'published' | 'archived' || 'draft',
      image_url: project?.image_url || '',
      github_url: project?.github_url || '',
      demo_url: project?.demo_url || '',
      seo_title: project?.seo_title || '',
      seo_description: project?.seo_description || '',
    },
  });

  const watchedValues = watch();
  const technologies = watch('technologies');

  // Auto-generate slug from title
  useEffect(() => {
    const generateSlug = async () => {
      if (watchedValues.title && !project) {
        try {
          const slug = await ProjectsAPI.generateSlug(watchedValues.title);
          setValue('slug', slug);
        } catch (error) {
          console.error('Failed to generate slug:', error);
        }
      }
    };

    const timeoutId = setTimeout(generateSlug, 500);
    return () => clearTimeout(timeoutId);
  }, [watchedValues.title, project, setValue]);

  // Auto-calculate duration
  useEffect(() => {
    const calculateDuration = async () => {
      if (watchedValues.start_date) {
        try {
          const dur = await ProjectsAPI.calculateDuration(
            watchedValues.start_date,
            watchedValues.end_date
          );
          setDuration(dur);
        } catch (error) {
          console.error('Failed to calculate duration:', error);
        }
      }
    };

    calculateDuration();
  }, [watchedValues.start_date, watchedValues.end_date]);

  const handleAddTech = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setValue('technologies', [...technologies, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setValue('technologies', technologies.filter((t) => t !== tech));
  };

  const onSubmit = async (data: ProjectFormData) => {
    setIsSaving(true);
    try {
      if (project) {
        await ProjectsAPI.updateProject(project.id, {
          ...data,
          duration,
        });
        toast({
          title: 'Project updated',
          description: 'Your project has been updated successfully.',
        });
      } else {
        await ProjectsAPI.createProject({
          ...data,
          duration,
        });
        toast({
          title: 'Project created',
          description: 'Your project has been created successfully.',
        });
      }
      onSave();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save project',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="card-neural w-full max-w-4xl my-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              {project ? 'Edit Project' : 'Create New Project'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title, Slug & Category */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="AI-Powered Recommendation System"
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" {...register('slug')} placeholder="ai-recommendation-system" />
                {errors.slug && (
                  <p className="text-sm text-destructive">{errors.slug.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={watchedValues.category}
                  onValueChange={(value) => setValue('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AI & Machine Learning">AI & Machine Learning</SelectItem>
                    <SelectItem value="Data Engineering">Data Engineering</SelectItem>
                    <SelectItem value="Web Development">Web Development</SelectItem>
                    <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Detailed project description..."
                className="min-h-[200px]"
                onChange={(e) => setValue('description', { content: e.target.value })}
                defaultValue={typeof watchedValues.description === 'object' ? (watchedValues.description as any)?.content : ''}
              />
              <p className="text-xs text-muted-foreground">
                Rich text editor integration coming soon. Currently using plain text.
              </p>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  {...register('start_date')}
                />
                {errors.start_date && (
                  <p className="text-sm text-destructive">{errors.start_date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">End Date (Optional)</Label>
                <Input
                  id="end_date"
                  type="date"
                  {...register('end_date')}
                />
              </div>

              <div className="space-y-2">
                <Label>Duration</Label>
                <div className="h-10 flex items-center px-3 rounded-md border border-border bg-background/50">
                  <span className="text-sm text-muted-foreground">
                    {duration ? `${duration} days` : 'Calculating...'}
                  </span>
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div className="space-y-2">
              <Label>Technologies</Label>
              <div className="flex gap-2">
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                  placeholder="Add technology (press Enter)"
                />
                <Button type="button" variant="outline" onClick={handleAddTech}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTech(tech)}>
                    {tech} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input
                  id="github_url"
                  {...register('github_url')}
                  placeholder="https://github.com/username/repo"
                />
                {errors.github_url && (
                  <p className="text-sm text-destructive">{errors.github_url.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="demo_url">Demo URL</Label>
                <Input
                  id="demo_url"
                  {...register('demo_url')}
                  placeholder="https://demo.example.com"
                />
                {errors.demo_url && (
                  <p className="text-sm text-destructive">{errors.demo_url.message}</p>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={watchedValues.status}
                onValueChange={(value) => setValue('status', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* SEO */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-lg font-semibold">SEO Settings</h3>
              <div className="space-y-2">
                <Label htmlFor="seo_title">SEO Title</Label>
                <Input
                  id="seo_title"
                  {...register('seo_title')}
                  placeholder="Leave empty to use project title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo_description">SEO Description</Label>
                <Textarea
                  id="seo_description"
                  {...register('seo_description')}
                  placeholder="Leave empty to auto-generate from description"
                  rows={3}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="neural-glow">
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Project'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectFormModal;