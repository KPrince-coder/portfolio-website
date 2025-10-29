import React, { useState } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjectCategories } from "./hooks/useProjectCategories";
import { useTechnologies } from "./hooks/useTechnologies";
import { useProjects } from "./hooks/useProjects";
import type { Project, ProjectFormData, ProjectFormProps } from "./types";
import { PROJECT_STATUSES } from "./types";
import { Badge } from "@/components/ui/badge";

/**
 * ProjectForm Component
 * Form for creating and editing projects
 */
const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  onClose,
  onSave,
}) => {
  const { categories, loading: categoriesLoading } = useProjectCategories();
  const { technologies, loading: technologiesLoading } = useTechnologies();
  const { uploadImage } = useProjects();

  const [formData, setFormData] = useState<ProjectFormData>({
    category_id: project?.category_id || "",
    title: project?.title || "",
    slug: project?.slug || "",
    description: project?.description || "",
    long_description: project?.long_description,
    image_url: project?.image_url,
    demo_url: project?.demo_url,
    github_url: project?.github_url,
    technologies: [], // Will be loaded separately if editing
    tags: project?.tags,
    status:
      (project?.status as
        | "completed"
        | "in-progress"
        | "planned"
        | "archived") || "in-progress",
    stars: project?.stars,
    forks: project?.forks,
    views: project?.views,
    is_featured: project?.is_featured || false,
    display_order: project?.display_order || 0,
    start_date: project?.start_date,
    end_date: project?.end_date,
  });

  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { url, error } = await uploadImage(file);
      if (error) {
        alert(`Error uploading image: ${error.message}`);
      } else if (url) {
        setFormData({ ...formData, image_url: url });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("An error occurred while uploading the image");
    } finally {
      setUploading(false);
    }
  };

  const handleTechToggle = (techId: string) => {
    setSelectedTechs((prev) =>
      prev.includes(techId)
        ? prev.filter((id) => id !== techId)
        : [...prev, techId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dataToSave = {
        ...formData,
        technologies: selectedTechs,
        slug:
          formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-"),
      };

      let result: { data: any; error: Error | null };
      if (project) {
        result = await (
          onSave as (
            id: string,
            data: Partial<Project>
          ) => Promise<{ data: any; error: Error | null }>
        )(project.id, dataToSave);
      } else {
        result = await (
          onSave as (data: any) => Promise<{ data: any; error: Error | null }>
        )(dataToSave);
      }

      if (result.error) {
        alert(`Error saving project: ${result.error.message}`);
      } else {
        onClose();
      }
    } catch (error) {
      console.error("Error saving project:", error);
      alert("An error occurred while saving the project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{project ? "Edit Project" : "Add New Project"}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, category_id: value })
                }
                disabled={categoriesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Portfolio Website"
                  required
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="auto-generated from title"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Short Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of the project"
                rows={2}
                required
              />
            </div>

            {/* Long Description */}
            <div className="space-y-2">
              <Label htmlFor="long_description">Long Description</Label>
              <Textarea
                id="long_description"
                value={formData.long_description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    long_description: e.target.value,
                  })
                }
                placeholder="Detailed description (supports markdown)"
                rows={4}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Project Image</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="flex-1"
                />
                {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
              {formData.image_url && (
                <div className="mt-2">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Demo URL */}
              <div className="space-y-2">
                <Label htmlFor="demo_url">Demo URL</Label>
                <Input
                  id="demo_url"
                  type="url"
                  value={formData.demo_url}
                  onChange={(e) =>
                    setFormData({ ...formData, demo_url: e.target.value })
                  }
                  placeholder="https://demo.example.com"
                />
              </div>

              {/* GitHub URL */}
              <div className="space-y-2">
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input
                  id="github_url"
                  type="url"
                  value={formData.github_url}
                  onChange={(e) =>
                    setFormData({ ...formData, github_url: e.target.value })
                  }
                  placeholder="https://github.com/user/repo"
                />
              </div>
            </div>

            {/* Technologies */}
            <div className="space-y-2">
              <Label>Technologies</Label>
              <div className="border rounded-md p-4 max-h-48 overflow-y-auto">
                {technologiesLoading ? (
                  <p className="text-sm text-muted-foreground">
                    Loading technologies...
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech) => (
                      <Badge
                        key={tech.id}
                        variant={
                          selectedTechs.includes(tech.id)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => handleTechToggle(tech.id)}
                      >
                        {tech.label}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Display Order */}
              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      display_order: parseInt(e.target.value) || 0,
                    })
                  }
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Stars */}
              <div className="space-y-2">
                <Label htmlFor="stars">Stars</Label>
                <Input
                  id="stars"
                  type="number"
                  value={formData.stars}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stars: parseInt(e.target.value) || 0,
                    })
                  }
                  min="0"
                />
              </div>

              {/* Forks */}
              <div className="space-y-2">
                <Label htmlFor="forks">Forks</Label>
                <Input
                  id="forks"
                  type="number"
                  value={formData.forks}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      forks: parseInt(e.target.value) || 0,
                    })
                  }
                  min="0"
                />
              </div>

              {/* Views */}
              <div className="space-y-2">
                <Label htmlFor="views">Views</Label>
                <Input
                  id="views"
                  type="number"
                  value={formData.views}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      views: parseInt(e.target.value) || 0,
                    })
                  }
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Featured */}
            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_featured: checked })
                }
              />
              <Label htmlFor="is_featured">Featured Project</Label>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving || uploading}>
                {saving ? "Saving..." : project ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectForm;
