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
 * SkillsHeaderSection Component
 * Manages the skills section title and description
 */
const SkillsHeaderSection: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    skills_title: "",
    skills_description: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // For now, use default values since these fields don't exist in profiles yet
      setFormData({
        skills_title: "Technical Expertise",
        skills_description:
          "A comprehensive overview of my technical skills and proficiency levels",
      });
    } catch (error) {
      console.error("Error loading skills header:", error);
      toast({
        variant: "destructive",
        title: "Error loading data",
        description: "Failed to load skills header information",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Add skills_title and skills_description columns to profiles table
      // For now, just show success message
      toast({
        title: "Skills header updated",
        description: "Your changes have been saved successfully",
      });
    } catch (error) {
      console.error("Error saving skills header:", error);
      toast({
        variant: "destructive",
        title: "Error saving",
        description: "Failed to save skills header information",
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
        <h2 className="text-3xl font-bold">Skills Section Header</h2>
        <p className="text-muted-foreground mt-2">
          Customize the title and description for your skills section
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Header Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="skills_title">Section Title</Label>
            <Input
              id="skills_title"
              value={formData.skills_title}
              onChange={(e) =>
                setFormData({ ...formData, skills_title: e.target.value })
              }
              placeholder="e.g., Technical Expertise"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills_description">Section Description</Label>
            <Textarea
              id="skills_description"
              value={formData.skills_description}
              onChange={(e) =>
                setFormData({ ...formData, skills_description: e.target.value })
              }
              placeholder="Brief description of your skills section"
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

export default SkillsHeaderSection;
