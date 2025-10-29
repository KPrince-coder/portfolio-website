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
import type { WorkExperienceFormProps, WorkExperienceFormData } from "./types";
import { EMPLOYMENT_TYPES } from "./types";

const WorkExperienceForm: React.FC<WorkExperienceFormProps> = ({
  experience,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<WorkExperienceFormData>({
    title: experience?.title || "",
    company: experience?.company || "",
    location: experience?.location || "",
    employment_type: experience?.employment_type || "Full-time",
    start_date: experience?.start_date || "",
    end_date: experience?.end_date || "",
    is_current: experience?.is_current || false,
    description: experience?.description || "",
    achievements: experience?.achievements || [],
    company_url: experience?.company_url || "",
    company_logo_url: experience?.company_logo_url || "",
    display_order: experience?.display_order || 0,
    is_featured: experience?.is_featured || false,
    is_visible: experience?.is_visible ?? true,
  });

  const [achievementInput, setAchievementInput] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAddAchievement = () => {
    if (achievementInput.trim()) {
      setFormData({
        ...formData,
        achievements: [
          ...(formData.achievements || []),
          achievementInput.trim(),
        ],
      });
      setAchievementInput("");
    }
  };

  const handleRemoveAchievement = (index: number) => {
    setFormData({
      ...formData,
      achievements: formData.achievements?.filter((_, i) => i !== index) || [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const result = experience
        ? await onSave(formData)
        : await onSave(formData);

      if (result.error) {
        alert(`Error saving work experience: ${result.error.message}`);
      } else {
        onClose();
      }
    } catch (error) {
      console.error("Error saving work experience:", error);
      alert("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {experience ? "Edit Work Experience" : "Add Work Experience"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employment_type">Employment Type</Label>
                <Select
                  value={formData.employment_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, employment_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => {
                    const newStartDate = e.target.value;
                    setFormData((prev) => {
                      if (prev.end_date && newStartDate > prev.end_date) {
                        return {
                          ...prev,
                          start_date: newStartDate,
                          end_date: "",
                        };
                      }
                      return { ...prev, start_date: newStartDate };
                    });
                  }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                  min={formData.start_date || undefined}
                  disabled={formData.is_current}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_current"
                checked={formData.is_current}
                onCheckedChange={(checked) => {
                  setFormData({
                    ...formData,
                    is_current: checked,
                    end_date: checked ? "" : formData.end_date,
                  });
                }}
              />
              <Label htmlFor="is_current">Currently working here</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Achievements</Label>
              <div className="flex gap-2">
                <Input
                  value={achievementInput}
                  onChange={(e) => setAchievementInput(e.target.value)}
                  placeholder="Add an achievement"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddAchievement();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddAchievement}
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              {formData.achievements && formData.achievements.length > 0 && (
                <ul className="space-y-2 mt-2">
                  {formData.achievements.map((achievement, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-muted p-2 rounded"
                    >
                      <span className="text-sm">{achievement}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAchievement(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_url">Company URL</Label>
                <Input
                  id="company_url"
                  type="url"
                  value={formData.company_url}
                  onChange={(e) =>
                    setFormData({ ...formData, company_url: e.target.value })
                  }
                />
              </div>

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

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_featured: checked })
                  }
                />
                <Label htmlFor="is_featured">Featured</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_visible"
                  checked={formData.is_visible}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_visible: checked })
                  }
                />
                <Label htmlFor="is_visible">Visible</Label>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : experience ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkExperienceForm;
