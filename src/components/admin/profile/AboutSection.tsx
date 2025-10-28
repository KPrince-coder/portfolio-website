import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Database } from "@/integrations/supabase/types";

type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

interface AboutSectionProps {
  formData: Partial<ProfileUpdate>;
  onInputChange: (field: keyof ProfileUpdate, value: any) => void;
}

const AboutSection: React.FC<AboutSectionProps> = ({
  formData,
  onInputChange,
}) => {
  const [newHighlight, setNewHighlight] = useState("");

  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return;

    const currentHighlights = formData.about_highlights || [];
    onInputChange("about_highlights", [
      ...currentHighlights,
      newHighlight.trim(),
    ]);
    setNewHighlight("");
  };

  const handleRemoveHighlight = (index: number) => {
    const currentHighlights = formData.about_highlights || [];
    onInputChange(
      "about_highlights",
      currentHighlights.filter((_, i) => i !== index)
    );
  };

  return (
    <Card className="card-neural">
      <CardHeader>
        <CardTitle>About Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="about_title">About Title</Label>
          <Input
            id="about_title"
            value={formData.about_title || ""}
            onChange={(e) => onInputChange("about_title", e.target.value)}
            placeholder="About Me"
          />
        </div>

        <div>
          <Label htmlFor="about_description">About Description</Label>
          <Textarea
            id="about_description"
            value={formData.about_description || ""}
            onChange={(e) => onInputChange("about_description", e.target.value)}
            placeholder="Tell your story..."
            rows={5}
          />
        </div>

        <div>
          <Label>Highlights/Achievements</Label>
          <div className="space-y-2 mt-2">
            {(formData.about_highlights || []).map((highlight, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input value={highlight} readOnly className="flex-1" />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemoveHighlight(index)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Input
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                placeholder="Add a highlight..."
                onKeyPress={(e) => e.key === "Enter" && handleAddHighlight()}
              />
              <Button size="sm" onClick={handleAddHighlight}>
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AboutSection;
