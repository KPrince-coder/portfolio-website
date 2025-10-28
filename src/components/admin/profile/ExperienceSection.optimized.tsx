import React, { useState, useCallback, useMemo } from "react";
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
import { useToast } from "@/hooks/use-toast";

type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

// Strict type definitions
type IconName =
  | "Brain"
  | "Database"
  | "Smartphone"
  | "Code"
  | "Briefcase"
  | "Award"
  | "Star"
  | "Zap"
  | "Rocket"
  | "Target";

type ColorClass =
  | "text-secondary"
  | "text-accent"
  | "text-success"
  | "text-warning"
  | "text-neural";

interface Experience {
  year: string;
  title: string;
  company: string;
  description: string;
  icon: IconName;
  color: ColorClass;
}

interface ExperienceSectionProps {
  formData: Partial<ProfileUpdate>;
  onInputChange: (field: keyof ProfileUpdate, value: any) => void;
  isSaving?: boolean;
}

// Constants moved outside component for better performance
const ICON_OPTIONS: readonly IconName[] = [
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
] as const;

const COLOR_OPTIONS = [
  { value: "text-secondary" as const, label: "Secondary (Blue)" },
  { value: "text-accent" as const, label: "Accent (Pink)" },
  { value: "text-success" as const, label: "Success (Green)" },
  { value: "text-warning" as const, label: "Warning (Yellow)" },
  { value: "text-neural" as const, label: "Neural (Cyan)" },
] as const;

const DEFAULT_EXPERIENCE: Experience = {
  year: "",
  title: "",
  company: "",
  description: "",
  icon: "Briefcase",
  color: "text-secondary",
};

// Validation helper
const isValidExperience = (exp: Experience): boolean => {
  return Boolean(exp.year && exp.title && exp.company);
};

const validateYear = (year: string): boolean => {
  const yearRegex = /^\d{4}(-\d{4})?$/; // Matches "2024" or "2022-2024"
  return yearRegex.test(year);
};

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  formData,
  onInputChange,
  isSaving = false,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newExperience, setNewExperience] =
    useState<Experience>(DEFAULT_EXPERIENCE);
  const { toast } = useToast();

  // Safely parse experiences from JSON
  const experiences = useMemo(
    () => (formData.experiences as unknown as Experience[]) || [],
    [formData.experiences]
  );

  const handleAddExperience = useCallback(() => {
    if (!isValidExperience(newExperience)) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in year, title, and company",
      });
      return;
    }

    if (!validateYear(newExperience.year)) {
      toast({
        variant: "destructive",
        title: "Invalid Year",
        description: 'Please enter a valid year (e.g., "2024" or "2022-2024")',
      });
      return;
    }

    onInputChange("experiences", [...experiences, newExperience]);
    setNewExperience(DEFAULT_EXPERIENCE);

    toast({
      title: "Experience Added",
      description: "Your experience has been added successfully",
    });
  }, [newExperience, experiences, onInputChange, toast]);

  const handleUpdateExperience = useCallback(
    (index: number) => {
      if (!isValidExperience(newExperience)) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please fill in year, title, and company",
        });
        return;
      }

      if (!validateYear(newExperience.year)) {
        toast({
          variant: "destructive",
          title: "Invalid Year",
          description:
            'Please enter a valid year (e.g., "2024" or "2022-2024")',
        });
        return;
      }

      const updated = [...experiences];
      updated[index] = newExperience;
      onInputChange("experiences", updated);
      setEditingIndex(null);
      setNewExperience(DEFAULT_EXPERIENCE);

      toast({
        title: "Experience Updated",
        description: "Your experience has been updated successfully",
      });
    },
    [experiences, newExperience, onInputChange, toast]
  );

  const handleEditExperience = useCallback(
    (index: number) => {
      setEditingIndex(index);
      setNewExperience(experiences[index]);
    },
    [experiences]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingIndex(null);
    setNewExperience(DEFAULT_EXPERIENCE);
  }, []);

  const handleRemoveExperience = useCallback(
    (index: number) => {
      if (window.confirm("Are you sure you want to delete this experience?")) {
        onInputChange(
          "experiences",
          experiences.filter((_, i) => i !== index)
        );

        toast({
          title: "Experience Deleted",
          description: "The experience has been removed",
        });
      }
    },
    [experiences, onInputChange, toast]
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape" && editingIndex !== null) {
        handleCancelEdit();
      }
    },
    [editingIndex, handleCancelEdit]
  );

  return (
    <Card
      className="card-neural"
      role="region"
      aria-labelledby="experience-section-title"
    >
      <CardHeader>
        <CardTitle
          id="experience-section-title"
          className="flex items-center space-x-2"
        >
          <Briefcase className="w-5 h-5" aria-hidden="true" />
          <span>Professional Journey</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Experiences */}
        <div className="space-y-3" role="list" aria-label="Experience list">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="p-4 border border-border rounded-lg bg-muted/50"
              role="listitem"
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
                    disabled={isSaving}
                    aria-label={`Edit ${exp.title} experience`}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemoveExperience(index)}
                    disabled={isSaving}
                    className="text-destructive"
                    aria-label={`Delete ${exp.title} experience`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Form */}
        <div
          className="p-4 border-2 border-dashed border-border rounded-lg space-y-3"
          onKeyDown={handleKeyPress}
          role="form"
          aria-label={
            editingIndex !== null
              ? "Edit experience form"
              : "Add experience form"
          }
        >
          <h4 className="font-medium text-sm">
            {editingIndex !== null ? "Edit Experience" : "Add New Experience"}
          </h4>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="exp_year">
                Year <span className="text-destructive">*</span>
              </Label>
              <Input
                id="exp_year"
                value={newExperience.year}
                onChange={(e) =>
                  setNewExperience({ ...newExperience, year: e.target.value })
                }
                placeholder="2024 or 2022-2024"
                disabled={isSaving}
                aria-required="true"
                aria-invalid={!newExperience.year}
              />
            </div>
            <div>
              <Label htmlFor="exp_title">
                Job Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="exp_title"
                value={newExperience.title}
                onChange={(e) =>
                  setNewExperience({ ...newExperience, title: e.target.value })
                }
                placeholder="Senior AI Engineer"
                disabled={isSaving}
                aria-required="true"
                aria-invalid={!newExperience.title}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="exp_company">
              Company <span className="text-destructive">*</span>
            </Label>
            <Input
              id="exp_company"
              value={newExperience.company}
              onChange={(e) =>
                setNewExperience({ ...newExperience, company: e.target.value })
              }
              placeholder="TechFlow AI"
              disabled={isSaving}
              aria-required="true"
              aria-invalid={!newExperience.company}
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
              disabled={isSaving}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="exp_icon">Icon</Label>
              <Select
                value={newExperience.icon}
                onValueChange={(value) =>
                  setNewExperience({
                    ...newExperience,
                    icon: value as IconName,
                  })
                }
                disabled={isSaving}
              >
                <SelectTrigger id="exp_icon">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((icon) => (
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
                  setNewExperience({
                    ...newExperience,
                    color: value as ColorClass,
                  })
                }
                disabled={isSaving}
              >
                <SelectTrigger id="exp_color">
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
          </div>

          <div className="flex space-x-2">
            {editingIndex !== null ? (
              <>
                <Button
                  size="sm"
                  onClick={() => handleUpdateExperience(editingIndex)}
                  disabled={isSaving}
                >
                  <Save className="w-3 h-3 mr-1" />
                  Update
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                >
                  <X className="w-3 h-3 mr-1" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                onClick={handleAddExperience}
                disabled={isSaving}
              >
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
