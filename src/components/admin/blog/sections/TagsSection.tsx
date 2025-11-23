/**
 * Tags Section Component
 *
 * Blog tags management with:
 * - Search functionality
 * - Inline editing
 * - Usage count display
 * - Popular tags section
 *
 * @module blog/sections/TagsSection
 */

import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  Tag as TagIcon,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useTags } from "../hooks/useTags";
import type { BlogTag, CreateTagInput } from "../types";

// ============================================================================
// TYPES
// ============================================================================

interface TagsSectionProps {
  onTagSelect?: (tag: BlogTag) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function TagsSection({ onTagSelect }: TagsSectionProps) {
  const {
    tags,
    popularTags,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    createNewTag,
    updateTagById,
    deleteTagById,
  } = useTags();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateTagInput>({
    name: "",
    slug: "",
  });

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleCreate = async () => {
    try {
      await createNewTag(formData);
      setShowCreateDialog(false);
      setFormData({ name: "", slug: "" });
    } catch (error) {
      console.error("Failed to create tag:", error);
    }
  };

  const handleUpdate = async (id: string, data: Partial<CreateTagInput>) => {
    try {
      await updateTagById(id, data);
      setEditingId(null);
    } catch (error) {
      console.error("Failed to update tag:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTagById(id);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Failed to delete tag:", error);
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

  const renderTagItem = (tag: BlogTag) => {
    const isEditing = editingId === tag.id;

    return (
      <div
        key={tag.id}
        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
      >
        {/* Tag Icon */}
        <TagIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />

        {/* Tag Info */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Input
              value={tag.name}
              onChange={(e) => handleUpdate(tag.id, { name: e.target.value })}
              placeholder="Tag name"
              className="h-8"
            />
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-medium">{tag.name}</span>
              <Badge variant="secondary" className="text-xs">
                {tag.slug}
              </Badge>
            </div>
          )}
        </div>

        {/* Usage Count */}
        <Badge variant="outline" className="flex-shrink-0">
          {tag.usage_count} {tag.usage_count === 1 ? "post" : "posts"}
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
                onClick={() => setEditingId(tag.id)}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteConfirmId(tag.id)}
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
          <h2 className="text-2xl font-bold tracking-tight">Tags</h2>
          <p className="text-muted-foreground">
            Tag your posts for better organization and discovery
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Tag
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Popular Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            {popularTags.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No tags yet
              </p>
            ) : (
              <div className="space-y-2">
                {popularTags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between p-2 rounded hover:bg-muted/50"
                  >
                    <span className="text-sm font-medium">{tag.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {tag.usage_count}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Tags */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">All Tags</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tags..."
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : tags.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <TagIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>
                  {searchQuery
                    ? "No tags found matching your search."
                    : "No tags yet."}
                </p>
                {!searchQuery && (
                  <Button
                    variant="link"
                    onClick={() => setShowCreateDialog(true)}
                    className="mt-2"
                  >
                    Create your first tag
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-2">{tags.map(renderTagItem)}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Tag</DialogTitle>
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
                placeholder="React"
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
                placeholder="react"
              />
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
              Create Tag
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
            <DialogTitle>Delete Tag</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this tag? This action cannot be
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
