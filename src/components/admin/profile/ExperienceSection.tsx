import React, { useState } from "react";
import { Plus, Trash2, Edit2, Save, X, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Database } from "@/integrations/supabase/types";

type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

interface Experience {
  year: string;
  title: string;
  company: string;
  description: string;
  icon: string;
  color: string;
}

interface ExperienceSectionProps {
  formData: Partial<ProfileUpdate>;
  onInputChange: (field: keyof ProfileUpdate, value: any) => void;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  formData,
  onInputChange,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newExperience, setNewExperience] = useState<Experience>({
    year: "",
    title: "",
    company: "",
    description: "",
    icon: "Briefcase",
    color: "text-secondary",
  });

  const experiences = (formData.experiences as unknown as Experience[]) || [];

  const iconOptions = [
    "Brain",
    "Database",
    "Smartphone",
    "Code",
    "Briefcase",
    "Award",
    "Star",
    "Zap",
    "Rocket",
    "Target",
  ];

  const colorOptions = [
    { value: "text-secondary", label: "Secondary (Blue)" },
    { value: "text-accent", label: "Accent (Pink)" },
    { value: "text-success", label: "Success (Green)" },
    { value: "text-warning", label: "Warning (Yellow)" },
    { value: "text-neural", label: "Neural (Cyan)" },
  ];

  const handleAddExperience = () => {
    if (!newExperience.year || !newExperience.title || !newExperience.company) {
      return;
    }

    onInputChange("experiences", [...experiences, newExperience]);
    setNewExperience({
      year: "",
      title: "",
      company: "",
      description: "",
      icon: "Briefcase",
      color: "text-secondary",
    });
  };

  const handleUpdateExperience = (index: number) => {
    const updated = [...experiences];
    updated[index] = newExperience;
    onInputChange("experiences", updated);
    setEditingIndex(null);
    setNewExperience({
      year: "",
      title: "",
      company: "",
      description: "",
      icon: "Briefcase",
      color: "text-secondary",
    });
  };

  const handleEditExperience = (index: number) => {
    setEditingIndex(index);
    setNewExperience(experiences[index]);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setNewExperience({
      year: "",
      title: "",
      company: "",
      description: "",
      icon: "Briefcase",
      color: "text-secondary",
    });
  };

  const handleRemoveExperience = (index: number) => {
    onInputChange(
      "experiences",
      experiences.filter((_, i) => i !== index)
    );
  };

  return (
    <Card className="card-neural">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Briefcase className="w-5 h-5" />
          <span>Professional Journey</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Experiences */}
        <div className="space-y-3">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="p-4 border border-border rounded-lg bg-muted/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-mono bg-secondary/20 text-secondary px-2 py-1 rounded">
                      {exp.year}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Icon: {exp.icon} | Color: {exp.color}
                    </span>
                  </div>
                  <h4 className="font-semibold">{exp.title}</h4>
                  <p className="text-sm text-secondary">{exp.company}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {exp.description}
                  </p>
                </div>
                <div className="flex space-x-1 ml-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditExperience(index)}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemoveExperience(index)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Form */}
        <div className="p-4 border-2 border-dashed border-border rounded-lg space-y-3">
          <h4 className="font-medium text-sm">
            {editingIndex !== null ? "Edit Experience" : "Add New Experience"}
          </h4>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="exp_year">Year</Label>
              <Input
                id="exp_year"
                value={newExperience.year}
                onChange={(e) =>
                  setNewExperience({ ...newExperience, year: e.target.value })
                }
                placeholder="2024"
              />
            </div>
            <div>
              <Label htmlFor="exp_title">Job Title</Label>
              <Input
                id="exp_title"
                value={newExperience.title}
                onChange={(e) =>
                  setNewExperience({ ...newExperience, title: e.target.value })
                }
                placeholder="Senior AI Engineer"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="exp_company">Company</Label>
            <Input
              id="exp_company"
              value={newExperience.company}
              onChange={(e) =>
                setNewExperience({ ...newExperience, company: e.target.value })
              }
              placeholder="TechFlow AI"
            />
          </div>

          <div>
            <Label htmlFor="exp_description">Description</Label>
            <Textarea
              id="exp_description"
              value={newExperience.description}
              onChange={(e) =>
                setNewExperience({
                  ...newExperience,
                  description: e.target.value,
                })
              }
              placeholder="Brief description of role and achievements..."
              rows={2}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="exp_icon">Icon</Label>
              <Select
                value={newExperience.icon}
                onValueChange={(value) =>
                  setNewExperience({ ...newExperience, icon: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      {icon}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="exp_color">Color</Label>
              <Select
                value={newExperience.color}
                onValueChange={(value) =>
                  setNewExperience({ ...newExperience, color: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      {color.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex space-x-2">
            {editingIndex !== null ? (
              <>
                <Button
                  size="sm"
                  onClick={() => handleUpdateExperience(editingIndex)}
                >
                  <Save className="w-3 h-3 mr-1" />
                  Update
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                  <X className="w-3 h-3 mr-1" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={handleAddExperience}>
                <Plus className="w-3 h-3 mr-1" />
                Add Experience
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceSection;
