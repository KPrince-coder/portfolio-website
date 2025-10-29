import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EducationFormProps, EducationFormData } from "./types";

const EducationForm: React.FC<EducationFormProps> = ({
  education,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<EducationFormData>({
    degree: education?.degree || "",
    field_of_study: education?.field_of_study || "",
    school: education?.school || "",
    location: education?.location || "",
    start_date: education?.start_date || "",
    end_date: education?.end_date || "",
    gpa: education?.gpa || "",
    grade: education?.grade || "",
    description: education?.description || "",
    activities: education?.activities || [],
    school_url: education?.school_url || "",
    school_logo_url: education?.school_logo_url || "",
    display_order: education?.display_order || 0,
    is_visible: education?.is_visible ?? true,
  });

  const [activityInput, setActivityInput] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAddActivity = () => {
    if (activityInput.trim()) {
      setFormData({
        ...formData,
        activities: [...(formData.activities || []), activityInput.trim()],
      });
      setActivityInput("");
    }
  };

  const handleRemoveActivity = (index: number) => {
    setFormData({
      ...formData,
      activities: formData.activities?.filter((_, i) => i !== index) || [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const result = await onSave(formData);
      if (result.error) {
        alert(`Error saving education: ${result.error.message}`);
      } else {
        onClose();
      }
    } catch (error) {
      console.error("Error saving education:", error);
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
            {education ? "Edit Education" : "Add Education"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="degree">Degree *</Label>
                <Input
                  id="degree"
                  value={formData.degree}
                  onChange={(e) =>
                    setFormData({ ...formData, degree: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="field_of_study">Field of Study</Label>
                <Input
                  id="field_of_study"
                  value={formData.field_of_study}
                  onChange={(e) =>
                    setFormData({ ...formData, field_of_study: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="school">School *</Label>
                <Input
                  id="school"
                  value={formData.school}
                  onChange={(e) =>
                    setFormData({ ...formData, school: e.target.value })
                  }
                  required
                />
              </div>

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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
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
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gpa">GPA</Label>
                <Input
                  id="gpa"
                  value={formData.gpa}
                  onChange={(e) =>
                    setFormData({ ...formData, gpa: e.target.value })
                  }
                  placeholder="e.g., 3.8/4.0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <Input
                  id="grade"
                  value={formData.grade}
                  onChange={(e) =>
                    setFormData({ ...formData, grade: e.target.value })
                  }
                  placeholder="e.g., First Class Honours"
                />
              </div>
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
              <Label>Activities & Achievements</Label>
              <div className="flex gap-2">
                <Input
                  value={activityInput}
                  onChange={(e) => setActivityInput(e.target.value)}
                  placeholder="Add an activity"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddActivity();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddActivity}
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              {formData.activities && formData.activities.length > 0 && (
                <ul className="space-y-2 mt-2">
                  {formData.activities.map((activity, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-muted p-2 rounded"
                    >
                      <span className="text-sm">{activity}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveActivity(index)}
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
                <Label htmlFor="school_url">School URL</Label>
                <Input
                  id="school_url"
                  type="url"
                  value={formData.school_url}
                  onChange={(e) =>
                    setFormData({ ...formData, school_url: e.target.value })
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

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : education ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EducationForm;
