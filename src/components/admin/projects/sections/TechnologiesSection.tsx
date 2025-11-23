import React, { useState } from "react";
import { Edit, Save, X, Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DestructiveButton } from "@/components/ui/destructive-button";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { IconPicker } from "@/components/ui/icon-picker";
import { useToast } from "@/hooks/use-toast";
import { useTechnologies } from "../hooks/useTechnologies";
import type { Technology, TechnologyFormData } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TECHNOLOGY_CATEGORIES } from "../types";

/**
 * TechnologiesSection Component
 * Manages technologies/tech stack (create, edit, delete)
 */
const TechnologiesSection: React.FC = () => {
  const {
    technologies,
    loading,
    createTechnology,
    updateTechnology,
    deleteTechnology,
  } = useTechnologies();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<TechnologyFormData>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [newTechnologyForm, setNewTechnologyForm] =
    useState<TechnologyFormData>({
      name: "",
      label: "",
      icon: "Code",
      color: "text-secondary",
      category: "frontend",
      display_order: 0,
      is_active: true,
    });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [technologyToDelete, setTechnologyToDelete] = useState<{
    id: string;
    label: string;
  } | null>(null);

  const handleEdit = (technology: Technology) => {
    setEditingId(technology.id);
    setEditForm({
      name: technology.name,
      label: technology.label,
      icon: technology.icon,
      color: technology.color,
      category: technology.category || "frontend",
      display_order: technology.display_order,
      is_active: technology.is_active,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async (id: string) => {
    try {
      const { error } = await updateTechnology(id, editForm);

      if (error) throw error;

      toast({
        title: "Technology updated",
        description: "Changes saved successfully",
      });

      handleCancel();
    } catch (error) {
      console.error("Error updating technology:", error);
      toast({
        variant: "destructive",
        title: "Error saving",
        description: "Failed to update technology",
      });
    }
  };

  const handleCreate = async () => {
    if (!newTechnologyForm.name || !newTechnologyForm.label) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in both name and label",
      });
      return;
    }

    try {
      const { error } = await createTechnology(newTechnologyForm);

      if (error) throw error;

      toast({
        title: "Technology created",
        description: "New technology added successfully",
      });

      setIsCreating(false);
      setNewTechnologyForm({
        name: "",
        label: "",
        icon: "Code",
        color: "text-secondary",
        category: "frontend",
        display_order: technologies.length,
        is_active: true,
      });
    } catch (error) {
      console.error("Error creating technology:", error);
      toast({
        variant: "destructive",
        title: "Error creating",
        description: "Failed to create technology",
      });
    }
  };

  const handleDeleteClick = (id: string, label: string) => {
    setTechnologyToDelete({ id, label });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!technologyToDelete) return;

    const { error } = await deleteTechnology(technologyToDelete.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error deleting",
        description: "Failed to delete technology",
      });
    } else {
      toast({
        title: "Technology deleted",
        description: "Technology removed successfully",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-muted-foreground">Loading technologies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Technologies</h2>
          <p className="text-muted-foreground mt-2">
            Manage your technology stack and tools
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Technology
        </Button>
      </div>

      {/* Create New Technology Form */}
      {isCreating && (
        <Card className="border-2 border-primary">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">New Technology</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-name">Technology Name (slug) *</Label>
                  <Input
                    id="new-name"
                    value={newTechnologyForm.name}
                    onChange={(e) =>
                      setNewTechnologyForm({
                        ...newTechnologyForm,
                        name: e.target.value,
                      })
                    }
                    placeholder="e.g., react, typescript, python"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-label">Display Label *</Label>
                  <Input
                    id="new-label"
                    value={newTechnologyForm.label}
                    onChange={(e) =>
                      setNewTechnologyForm({
                        ...newTechnologyForm,
                        label: e.target.value,
                      })
                    }
                    placeholder="e.g., React, TypeScript"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <IconPicker
                  value={newTechnologyForm.icon}
                  onValueChange={(value) =>
                    setNewTechnologyForm({
                      ...newTechnologyForm,
                      icon: value,
                    })
                  }
                  label="Icon"
                  id="new-icon"
                  placeholder="Select an icon"
                />

                <div className="space-y-2">
                  <Label htmlFor="new-category">Category</Label>
                  <Select
                    value={newTechnologyForm.category}
                    onValueChange={(value) =>
                      setNewTechnologyForm({
                        ...newTechnologyForm,
                        category: value,
                      })
                    }
                  >
                    <SelectTrigger id="new-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TECHNOLOGY_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
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
                    value={newTechnologyForm.display_order}
                    onChange={(e) =>
                      setNewTechnologyForm({
                        ...newTechnologyForm,
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
                    setNewTechnologyForm({
                      name: "",
                      label: "",
                      icon: "Code",
                      color: "text-secondary",
                      category: "frontend",
                      display_order: technologies.length,
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

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {technologies.map((technology) => (
          <Card key={technology.id}>
            <CardContent className="p-4">
              {editingId === technology.id ? (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Label</Label>
                    <Input
                      value={editForm.label || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, label: e.target.value })
                      }
                      className="h-8"
                    />
                  </div>

                  <IconPicker
                    value={editForm.icon || "Code"}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, icon: value })
                    }
                    label="Icon"
                    id={`edit-icon-${technology.id}`}
                  />

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSave(technology.id)}
                      className="h-7 text-xs"
                    >
                      <Save className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancel}
                      className="h-7 text-xs"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm">
                      {technology.label}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                    <span>{technology.name}</span>
                    {technology.category && (
                      <>
                        <span>•</span>
                        <span className="capitalize">
                          {technology.category}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(technology)}
                      aria-label={`Edit ${technology.label}`}
                      className="h-7 text-xs flex-1"
                    >
                      <Edit className="w-3 h-3 mr-1" aria-hidden="true" />
                      Edit
                    </Button>
                    <DestructiveButton
                      size="sm"
                      onClick={() =>
                        handleDeleteClick(technology.id, technology.label)
                      }
                      aria-label={`Delete ${technology.label}`}
                      className="h-7 text-xs flex-1"
                    >
                      <Trash2 className="w-3 h-3 mr-1" aria-hidden="true" />
                      Delete
                    </DestructiveButton>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {technologyToDelete && (
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Delete Technology"
          itemName={technologyToDelete.label}
          itemType="technology"
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default TechnologiesSection;
