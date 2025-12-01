import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ResumeHeaderSection: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    resume_title: "Professional Resume",
    resume_description: "",
    years_of_experience: 0,
    projects_completed: 0,
    technologies_mastered: 0,
    show_resume_stats: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "resume_title, resume_description, years_of_experience, projects_completed, technologies_mastered, show_resume_stats"
        )
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      setFormData({
        resume_title: data.resume_title || "Professional Resume",
        resume_description: data.resume_description || "",
        years_of_experience: data.years_of_experience || 0,
        projects_completed: data.projects_completed || 0,
        technologies_mastered: data.technologies_mastered || 0,
        show_resume_stats: data.show_resume_stats ?? true,
      });
    } catch (error) {
      console.error("Error loading resume header:", error);
      toast({
        variant: "destructive",
        title: "Error loading data",
        description: "Failed to load resume header information",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          resume_title: formData.resume_title,
          resume_description: formData.resume_description,
          years_of_experience: formData.years_of_experience,
          projects_completed: formData.projects_completed,
          technologies_mastered: formData.technologies_mastered,
          show_resume_stats: formData.show_resume_stats,
        })
        .limit(1)
        .single();

      if (error) throw error;

      toast({
        title: "Resume header updated",
        description: "Your changes have been saved successfully",
      });
    } catch (error) {
      console.error("Error saving resume header:", error);
      toast({
        variant: "destructive",
        title: "Error saving",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save resume header information",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

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
