import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type {
  LearningGoal,
  LearningGoalFormData,
  LearningGoalFormProps,
} from "./types";

const STATUS_OPTIONS = [
  { value: "learning", label: "Learning" },
  { value: "exploring", label: "Exploring" },
  { value: "researching", label: "Researching" },
];

const COLOR_OPTIONS = [
  { value: "text-secondary", label: "Secondary (Blue)" },
  { value: "text-accent", label: "Accent (Pink)" },
  { value: "text-success", label: "Success (Green)" },
  { value: "text-warning", label: "Warning (Yellow)" },
  { value: "text-neural", label: "Neural (Cyan)" },
];

/**
 * LearningGoalForm Component
 * Form for creating and editing learning goals
 */
const LearningGoalForm: React.FC<LearningGoalFormProps> = ({
  goal,
  onClose,
  onSave,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<LearningGoalFormData>({
    title: goal?.title || "",
    status: goal?.status || "learning",
    color: goal?.color || "text-secondary",
    display_order: goal?.display_order || 0,
    is_active: goal?.is_active ?? true,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const result = await onSave(formData);

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error saving learning goal",
          description: result.error.message,
        });
      } else {
        toast({
          title: "Learning goal saved",
          description: `Successfully ${
            goal ? "updated" : "created"
          } learning goal`,
        });
        onClose();
      }
    } catch (error) {
      console.error("Error saving learning goal:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while saving the learning goal",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {goal ? "Edit Learning Goal" : "Add New Learning Goal"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Currently learning: JAX & MLX"
                required
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(
                  value: "learning" | "exploring" | "researching"
                ) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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

            {/* Active */}
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : goal ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningGoalForm;
