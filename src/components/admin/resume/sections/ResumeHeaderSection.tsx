import React, { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/components/admin/profile/hooks/useProfile";

const ResumeHeaderSection: React.FC = () => {
  const { profile, updateProfile } = useProfile();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    resume_title: profile?.resume_title || "Professional Resume",
    resume_description: profile?.resume_description || "",
    years_of_experience: profile?.years_of_experience || 0,
    projects_completed: profile?.projects_completed || 0,
    technologies_mastered: profile?.technologies_mastered || 0,
    show_resume_stats: profile?.show_resume_stats ?? true,
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await updateProfile(formData);
      if (error) {
        alert(`Error saving resume header: ${error.message}`);
      }
    } catch (error) {
      console.error("Error saving resume header:", error);
      alert("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume Header & Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="resume_title">Resume Title</Label>
          <Input
            id="resume_title"
            value={formData.resume_title}
            onChange={(e) =>
              setFormData({ ...formData, resume_title: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="resume_description">Resume Description</Label>
          <Textarea
            id="resume_description"
            value={formData.resume_description}
            onChange={(e) =>
              setFormData({ ...formData, resume_description: e.target.value })
            }
            rows={3}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="years_of_experience">Years of Experience</Label>
            <Input
              id="years_of_experience"
              type="number"
              value={formData.years_of_experience}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  years_of_experience: parseInt(e.target.value) || 0,
                })
              }
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projects_completed">Projects Completed</Label>
            <Input
              id="projects_completed"
              type="number"
              value={formData.projects_completed}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  projects_completed: parseInt(e.target.value) || 0,
                })
              }
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="technologies_mastered">Technologies Mastered</Label>
            <Input
              id="technologies_mastered"
              type="number"
              value={formData.technologies_mastered}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  technologies_mastered: parseInt(e.target.value) || 0,
                })
              }
              min="0"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="show_resume_stats"
            checked={formData.show_resume_stats}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, show_resume_stats: checked })
            }
          />
          <Label htmlFor="show_resume_stats">Show Quick Stats Section</Label>
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Resume Header"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResumeHeaderSection;
