import React, { useState } from "react";
import { Edit, Save, X, Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DestructiveButton } from "@/components/ui/destructive-button";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSkillCategories } from "../hooks/useSkillCategories";
import type { SkillCategory } from "../types";

/**
 * SkillsCategoriesSection Component
 * Manages skill categories (create, edit, delete)
 */
const SkillsCategoriesSection: React.FC = () => {
  const { categories, loading, refetch, createCategory, deleteCategory } =
    useSkillCategories();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<SkillCategory>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [newCategoryForm, setNewCategoryForm] = useState({
    name: "",
    label: "",
    icon: "Code",
    display_order: 0,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{
    id: string;
    label: string;
  } | null>(null);

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

  const handleCreate = async () => {
    if (!newCategoryForm.name || !newCategoryForm.label) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in both name and label",
      });
      return;
    }

    try {
      const { error } = await createCategory(newCategoryForm);

      if (error) throw error;

      toast({
        title: "Category created",
        description: "New category added successfully",
      });

      setIsCreating(false);
      setNewCategoryForm({
        name: "",
        label: "",
        icon: "Code",
        display_order: categories.length,
      });
    } catch (error) {
      console.error("Error creating category:", error);
      toast({
        variant: "destructive",
        title: "Error creating",
        description: "Failed to create category",
      });
    }
  };

  const handleDeleteClick = (id: string, label: string) => {
    setCategoryToDelete({ id, label });
    setDeleteDialogOpen(true);
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Skill Categories</h2>
          <p className="text-muted-foreground mt-2">
            Create, edit, and manage skill categories
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Create New Category Form */}
      {isCreating && (
        <Card className="border-2 border-primary">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">New Category</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-name">Category Name (slug) *</Label>
                <Input
                  id="new-name"
                  value={newCategoryForm.name}
                  onChange={(e) =>
                    setNewCategoryForm({
                      ...newCategoryForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g., frontend, backend, devops"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-label">Display Label *</Label>
                <Input
                  id="new-label"
                  value={newCategoryForm.label}
                  onChange={(e) =>
                    setNewCategoryForm({
                      ...newCategoryForm,
                      label: e.target.value,
                    })
                  }
                  placeholder="e.g., Frontend Development"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-icon">Icon Name</Label>
                <Input
                  id="new-icon"
                  value={newCategoryForm.icon}
                  onChange={(e) =>
                    setNewCategoryForm({
                      ...newCategoryForm,
                      icon: e.target.value,
                    })
                  }
                  placeholder="e.g., Code, Database, Cloud"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-order">Display Order</Label>
                <Input
                  id="new-order"
                  type="number"
                  value={newCategoryForm.display_order}
                  onChange={(e) =>
                    setNewCategoryForm({
                      ...newCategoryForm,
                      display_order: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreate}>
                  <Save className="w-4 h-4 mr-1" />
                  Create
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setNewCategoryForm({
                      name: "",
                      label: "",
                      icon: "Code",
                      display_order: categories.length,
                    });
                  }}
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(category)}
                          aria-label={`Edit ${category.label}`}
                        >
                          <Edit className="w-4 h-4 mr-1" aria-hidden="true" />
                          Edit
                        </Button>
                        <DestructiveButton
                          size="sm"
                          onClick={() =>
                            handleDeleteClick(category.id, category.label)
                          }
                          aria-label={`Delete ${category.label}`}
                        >
                          <Trash2 className="w-4 h-4 mr-1" aria-hidden="true" />
                          Delete
                        </DestructiveButton>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">
                        {category.name}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        Order: {category.display_order}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
      </div>

      {categoryToDelete && (
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Delete Category"
          itemName={categoryToDelete.label}
          itemType="category"
          onConfirm={async () => await deleteCategory(categoryToDelete.id)}
        />
      )}
    </div>
  );
};

export default SkillsCategoriesSection;
