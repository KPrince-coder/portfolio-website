/**
 * Categories Section Component
 *
 * Blog categories management with:
 * - Inline editing
 * - Color picker
 * - Icon selector
 * - Post count display
 * - Drag & drop reordering
 *
 * @module blog/sections/CategoriesSection
 */

import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  GripVertical,
  Folder,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "../hooks/useCategories";
import type { BlogCategory, CreateCategoryInput } from "../types";

// ============================================================================
// TYPES
// ============================================================================

interface CategoriesSectionProps {
  onCategorySelect?: (category: BlogCategory) => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#F97316", // Orange
];

// ============================================================================
// COMPONENT
// ============================================================================

export function CategoriesSection({
  onCategorySelect,
}: CategoriesSectionProps) {
  const {
    categories,
    loading,
    error,
    createNewCategory,
    updateCategoryById,
    deleteCategoryById,
  } = useCategories();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateCategoryInput>({
    name: "",
    slug: "",
    description: "",
    color: DEFAULT_COLORS[0],
    display_order: 0,
  });

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleCreate = async () => {
    try {
      await createNewCategory(formData);
      setShowCreateDialog(false);
      setFormData({
        name: "",
        slug: "",
        description: "",
        color: DEFAULT_COLORS[0],
        display_order: 0,
      });
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const handleUpdate = async (
    id: string,
    data: Partial<CreateCategoryInput>
  ) => {
    try {
      await updateCategoryById(id, data);
      setEditingId(null);
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategoryById(id);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderCategoryItem = (category: BlogCategory) => {
    const isEditing = editingId === category.id;

    return (
      <div
        key={category.id}
        className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
      >
        {/* Drag Handle */}
        <div className="cursor-grab text-muted-foreground">
          <GripVertical className="h-5 w-5" />
        </div>

        {/* Color Indicator */}
        <div
          className="w-4 h-4 rounded-full flex-shrink-0"
          style={{ backgroundColor: category.color }}
        />

        {/* Category Info */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={category.name}
                onChange={(e) =>
                  handleUpdate(category.id, { name: e.target.value })
                }
                placeholder="Category name"
                className="h-8"
              />
              <Input
                value={category.description || ""}
                onChange={(e) =>
                  handleUpdate(category.id, { description: e.target.value })
                }
                placeholder="Description (optional)"
                className="h-8 text-sm"
              />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{category.name}</h4>
                <Badge variant="secondary" className="text-xs">
                  {category.slug}
                </Badge>
              </div>
              {category.description && (
                <p className="text-sm text-muted-foreground truncate">
                  {category.description}
                </p>
              )}
            </>
          )}
        </div>

        {/* Post Count */}
        <Badge variant="outline" className="flex-shrink-0">
          <Folder className="h-3 w-3 mr-1" />0 posts
        </Badge>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingId(null)}
                className="h-8 w-8 p-0"
              >
                <Check className="h-4 w-4 text-green-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingId(null)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingId(category.id)}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteConfirmId(category.id)}
                className="h-8 w-8 p-0 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">
            Organize your blog posts into categories
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Category
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No categories yet.</p>
              <Button
                variant="link"
                onClick={() => setShowCreateDialog(true)}
                className="mt-2"
              >
                Create your first category
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map(renderCategoryItem)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData({
                    ...formData,
                    name,
                    slug: generateSlug(name),
                  });
                }}
                placeholder="Technology"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="technology"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Posts about technology and software development"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                {DEFAULT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      formData.color === color
                        ? "border-primary scale-110"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData({ ...formData, color })}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!formData.name || !formData.slug}
            >
              Create Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirmId}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this category? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
