import React, { useState } from "react";
import { X } from "lucide-react";
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
import { IconPicker } from "@/components/ui/icon-picker";
import { useToast } from "@/hooks/use-toast";
import { useSkillCategories } from "./hooks/useSkillCategories";
import type { Skill, SkillFormData, SkillFormProps } from "./types";

const COLOR_OPTIONS = [
  { value: "text-secondary", label: "Secondary (Blue)" },
  { value: "text-accent", label: "Accent (Pink)" },
  { value: "text-success", label: "Success (Green)" },
  { value: "text-warning", label: "Warning (Yellow)" },
  { value: "text-neural", label: "Neural (Cyan)" },
];

/**
 * SkillForm Component
 * Form for creating and editing skills
 */
const SkillForm: React.FC<SkillFormProps> = ({ skill, onClose, onSave }) => {
  const { toast } = useToast();
  const { categories, loading: categoriesLoading } = useSkillCategories();
  const [formData, setFormData] = useState<SkillFormData>({
    category_id: skill?.category_id || "",
    name: skill?.name || "",
    proficiency: skill?.proficiency || 50,
    description: skill?.description || "",
    icon: skill?.icon || "Brain",
    color: skill?.color || "text-secondary",
    display_order: skill?.display_order || 0,
    is_featured: skill?.is_featured || false,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let result: { data: any; error: Error | null };
      if (skill) {
        result = await (
          onSave as (
            id: string,
            data: Partial<Skill>
          ) => Promise<{ data: any; error: Error | null }>
        )(skill.id, formData);
      } else {
        result = await (
          onSave as (
            data: Omit<Skill, "id" | "created_at" | "updated_at">
          ) => Promise<{ data: any; error: Error | null }>
        )(formData);
      }

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error saving skill",
          description: result.error.message,
        });
      } else {
        toast({
          title: "Skill saved",
          description: `Successfully ${skill ? "updated" : "created"} skill`,
        });
        onClose();
      }
    } catch (error) {
      console.error("Error saving skill:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while saving the skill",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{skill ? "Edit Skill" : "Add New Skill"}</CardTitle>
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
                  {categories
                    .filter((cat) => cat.name !== "all")
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Skill Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., TensorFlow"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of your experience with this skill"
                rows={3}
              />
            </div>

            {/* Proficiency */}
            <div className="space-y-2">
              <Label htmlFor="proficiency">
                Proficiency: {formData.proficiency}%
              </Label>
              <Input
                id="proficiency"
                type="range"
                min="0"
                max="100"
                value={formData.proficiency}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    proficiency: parseInt(e.target.value),
                  })
                }
                className="w-full"
              />
            </div>

            {/* Icon */}
            <IconPicker
              value={formData.icon}
              onValueChange={(value) =>
                setFormData({ ...formData, icon: value })
              }
              label="Icon"
              id="icon"
            />

            {/* Color */}
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Select
                value={formData.color}
                onValueChange={(value) =>
                  setFormData({ ...formData, color: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLOR_OPTIONS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      {color.label}
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

            {/* Featured */}
            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_featured: checked })
                }
              />
              <Label htmlFor="is_featured">Featured Skill</Label>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : skill ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillForm;
