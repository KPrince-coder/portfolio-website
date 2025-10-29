import React, { useState } from "react";
import { Edit, Save, X, Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DestructiveButton } from "@/components/ui/destructive-button";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { IconPicker } from "@/components/ui/icon-picker";
import { useToast } from "@/hooks/use-toast";
import { useProjectCategories } from "../hooks/useProjectCategories";
import type { ProjectCategory, ProjectCategoryFormData } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROJECT_CATEGORY_COLORS } from "../types";

/**
 * ProjectsCategoriesSection Component
 * Manages project categories (create, edit, delete)
 */
const ProjectsCategoriesSection: React.FC = () => {
  const {
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useProjectCategories();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProjectCategoryFormData>>(
    {}
  );
  const [isCreating, setIsCreating] = useState(false);
  const [newCategoryForm, setNewCategoryForm] =
    useState<ProjectCategoryFormData>({
      name: "",
      label: "",
      icon: "FolderKanban",
      color: "text-secondary",
      description: "",
      display_order: 0,
      is_active: true,
    });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{
    id: string;
    label: string;
  } | null>(null);

  const handleEdit = (category: ProjectCategory) => {
    setEditingId(category.id);
    setEditForm({
      name: category.name,
      label: category.label,
      icon: category.icon,
      color: category.color,
      description: category.description || "",
      display_order: category.display_order,
      is_active: category.is_active,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async (id: string) => {
    try {
      const { error } = await updateCategory(id, editForm);

      if (error) throw error;

      toast({
        title: "Category updated",
        description: "Changes saved successfully",
      });

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
        icon: "FolderKanban",
        color: "text-secondary",
        description: "",
        display_order: categories.length,
        is_active: true,
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

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    const { error } = await deleteCategory(categoryToDelete.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error deleting",
        description: "Failed to delete category",
      });
    } else {
      toast({
        title: "Category deleted",
        description: "Category removed successfully",
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Project Categories</h2>
          <p className="text-muted-foreground mt-2">
            Create, edit, and manage project categories
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
              <div className="grid grid-cols-2 gap-4">
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
                    placeholder="e.g., web-apps, mobile, ai-ml"
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
                    placeholder="e.g., Web Applications"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-description">Description</Label>
                <Textarea
                  id="new-description"
                  value={newCategoryForm.description}
                  onChange={(e) =>
                    setNewCategoryForm({
                      ...newCategoryForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Brief description of this category"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <IconPicker
                  value={newCategoryForm.icon}
                  onValueChange={(value) =>
                    setNewCategoryForm({
                      ...newCategoryForm,
                      icon: value,
                    })
                  }
                  label="Icon"
                  id="new-icon"
                  placeholder="Select an icon"
                />

                <div className="space-y-2">
                  <Label htmlFor="new-color">Color</Label>
                  <Select
                    value={newCategoryForm.color}
                    onValueChange={(value) =>
                      setNewCategoryForm({
                        ...newCategoryForm,
                        color: value,
                      })
                    }
                  >
                    <SelectTrigger id="new-color">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_CATEGORY_COLORS.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded ${color.preview}`}
                            />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      icon: "FolderKanban",
                      color: "text-secondary",
                      description: "",
                      display_order: categories.length,
                      is_active: true,
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
        {categories.map((category) => (
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

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={editForm.description || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <IconPicker
                      value={editForm.icon || "FolderKanban"}
                      onValueChange={(value) =>
                        setEditForm({ ...editForm, icon: value })
                      }
                      label="Icon"
                      id={`edit-icon-${category.id}`}
                    />

                    <div className="space-y-2">
                      <Label>Color</Label>
                      <Select
                        value={editForm.color || "text-secondary"}
                        onValueChange={(value) =>
                          setEditForm({ ...editForm, color: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PROJECT_CATEGORY_COLORS.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-4 h-4 rounded ${color.preview}`}
                                />
                                {color.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSave(category.id)}>
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel}>
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">{category.label}</h3>
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

                  {category.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {category.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">
                      {category.name}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className={category.color}>{category.icon}</span>
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
          onConfirm={async () => {
            await handleDeleteConfirm();
            return { error: null as any };
          }}
        />
      )}
    </div>
  );
};

export default ProjectsCategoriesSection;
