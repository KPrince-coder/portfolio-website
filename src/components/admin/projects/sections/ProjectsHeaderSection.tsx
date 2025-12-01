import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

/**
 * ProjectsHeaderSection Component
 * Manages the projects section title and description
 */
const ProjectsHeaderSection: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    projects_title: "",
    projects_description: "",
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
        .select("projects_title, projects_description")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      setFormData({
        projects_title: data.projects_title || "Featured Projects",
        projects_description:
          data.projects_description ||
          "A showcase of my work, from concept to deployment. Each project represents a unique challenge and learning opportunity.",
      });
    } catch (error) {
      console.error("Error loading projects header:", error);
      toast({
        variant: "destructive",
        title: "Error loading data",
        description: "Failed to load projects header information",
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
          projects_title: formData.projects_title,
          projects_description: formData.projects_description,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Projects header updated",
        description: "Your changes have been saved successfully",
      });
    } catch (error) {
      console.error("Error saving projects header:", error);
      toast({
        variant: "destructive",
        title: "Error saving",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save projects header information",
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
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Projects Section Header</h2>
        <p className="text-muted-foreground mt-2">
          Customize the title and description for your projects section
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Header Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="projects_title">Section Title</Label>
            <Input
              id="projects_title"
              value={formData.projects_title}
              onChange={(e) =>
                setFormData({ ...formData, projects_title: e.target.value })
              }
              placeholder="e.g., Featured Projects"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projects_description">Section Description</Label>
            <Textarea
              id="projects_description"
              value={formData.projects_description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  projects_description: e.target.value,
                })
              }
              placeholder="Brief description of your projects section"
              rows={4}
            />
          </div>

          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectsHeaderSection;
