import React, { useState } from "react";
import { Edit, Save, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSkillCategories } from "../hooks/useSkillCategories";
import type { SkillCategory } from "../types";

/**
 * SkillsCategoriesSection Component
 * Manages skill categories (edit names, descriptions, active status)
 */
const SkillsCategoriesSection: React.FC = () => {
  const { categories, loading, refetch } = useSkillCategories();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<SkillCategory>>({});

  const handleEdit = (category: SkillCategory) => {
    setEditingId(category.id);
    setEditForm(category);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async (id: string) => {
    try {
      const { error } = await supabase
        .from("skill_categories")
        .update({
          label: editForm.label,
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Category updated",
        description: "Changes saved successfully",
      });

      await refetch();
      handleCancel();
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        variant: "destructive",
        title: "Error saving",
        description: "Failed to update category",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Skill Categories</h2>
        <p className="text-muted-foreground mt-2">
          Manage category names, descriptions, and visibility
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {categories
          .filter((cat) => cat.name !== "all")
          .map((category) => (
            <Card key={category.id}>
              <CardContent className="p-6">
                {editingId === category.id ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Category Label</Label>
                      <Input
                        value={editForm.label || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, label: e.target.value })
                        }
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSave(category.id)}>
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">
                        {category.label}
                      </h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">
                        {category.name}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default SkillsCategoriesSection;
