/**
 * Post Form Component
 *
 * Complete blog post editor with:
 * - Title and slug editing
 * - Markdown content editor
 * - Category and tag selection
 * - Featured image upload
 * - Status management
 * - Auto-save
 * - Preview
 *
 * @module blog/PostForm
 */

import { useState, useCallback, useMemo, memo } from "react";
import { format } from "date-fns";
import {
  Save,
  Send,
  Eye,
  Image as ImageIcon,
  Tag,
  Folder,
  Loader2,
  AlertCircle,
  Check,
  Upload,
  Clock,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Helmet } from "react-helmet-async";
import { MarkdownEditor } from "./MarkdownEditor";
import { ImageUploader } from "./ImageUploader";
import { ContentImporter } from "./ContentImporter";
import { usePostForm } from "./hooks/usePostForm";
import { useCategories } from "./hooks/useCategories";
import { useTags } from "./hooks/useTags";
import type { BlogPostStatus } from "./types";

// ============================================================================
// TYPES
// ============================================================================

interface PostFormProps {
  postId?: string;
  onSave?: () => void;
  onPublish?: () => void;
  onCancel?: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const PostForm = memo(function PostForm({
  postId,
  onSave,
  onPublish,
  onCancel,
}: PostFormProps) {
  const {
    formData,
    updateField,
    loading,
    saving,
    error,
    isDirty,
    lastSaved,
    saveDraft,
    publish,
    unpublish,
    generateSlug,
    errors,
  } = usePostForm({ postId, autoSave: true });

  // Move hooks to top level - CRITICAL FIX
  const { categories, loading: categoriesLoading } = useCategories();
  const { tags, loading: tagsLoading, searchQuery, setSearchQuery } = useTags();

  const [showImageUploader, setShowImageUploader] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showContentImporter, setShowContentImporter] = useState(false);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleSaveDraft = async () => {
    try {
      await saveDraft();
      onSave?.();
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const handlePublish = async () => {
    try {
      await publish();
      onPublish?.();
    } catch (error) {
      console.error("Publish failed:", error);
    }
  };

  const handleUnpublish = async () => {
    try {
      await unpublish();
    } catch (error) {
      console.error("Unpublish failed:", error);
    }
  };

  const handleImageUpload = (image: any) => {
    updateField("featured_image", image.optimized_url);
    setShowImageUploader(false);
  };

  const handleContentImport = (imported: any) => {
    // Import title if not already set
    if (imported.title && !formData.title) {
      updateField("title", imported.title);
    }

    // Import content
    updateField("content", imported.content);

    // Import excerpt if not already set
    if (imported.excerpt && !formData.excerpt) {
      updateField("excerpt", imported.excerpt);
    }

    setShowContentImporter(false);
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {postId ? "Edit Post" : "Create New Post"}
        </h1>
        {lastSaved && (
          <p className="text-sm text-muted-foreground mt-1">
            Last saved {format(lastSaved, "MMM d, yyyy h:mm a")}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isDirty && (
          <Badge
            variant="outline"
            className="text-orange-600 border-orange-600"
          >
            <AlertCircle className="h-3 w-3 mr-1" />
            Unsaved changes
          </Badge>
        )}

        {saving && (
          <Badge variant="outline">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Saving...
          </Badge>
        )}

        {!isDirty && lastSaved && (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Check className="h-3 w-3 mr-1" />
            Saved
          </Badge>
        )}
      </div>
    </div>
  );

  const renderActions = () => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleSaveDraft}
            disabled={saving || !isDirty}
            variant="outline"
            className="w-full"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>

          {formData.status === "published" ? (
            <Button
              onClick={handleUnpublish}
              disabled={saving}
              variant="outline"
              className="w-full"
            >
              Unpublish
            </Button>
          ) : (
            <Button
              onClick={handlePublish}
              disabled={saving}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              Publish
            </Button>
          )}

          <Button
            onClick={() => setShowPreview(true)}
            variant="ghost"
            className="w-full"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>

          <Separator />

          <Button
            onClick={() => setShowContentImporter(true)}
            variant="outline"
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Content
          </Button>

          {onCancel && (
            <>
              <Separator />
              <Button onClick={onCancel} variant="ghost" className="w-full">
                Cancel
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderStatusCard = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Status & Visibility
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              updateField("status", value as BlogPostStatus)
            }
          >
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.status === "scheduled" && (
          <div className="space-y-2">
            <Label htmlFor="scheduled-at">Publish Date</Label>
            <Input
              id="scheduled-at"
              type="datetime-local"
              value={formData.scheduled_for || ""}
              onChange={(e) => updateField("scheduled_for", e.target.value)}
            />
            {errors.scheduled_for && (
              <p className="text-sm text-destructive">{errors.scheduled_for}</p>
            )}
          </div>
        )}

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="featured">Featured Post</Label>
            <p className="text-xs text-muted-foreground">
              Show in featured section
            </p>
          </div>
          <Switch
            id="featured"
            checked={formData.is_featured}
            onCheckedChange={(checked) => updateField("is_featured", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="comments">Allow Comments</Label>
            <p className="text-xs text-muted-foreground">
              Enable reader comments
            </p>
          </div>
          <Switch
            id="comments"
            checked={formData.comments_enabled}
            onCheckedChange={(checked) =>
              updateField("comments_enabled", checked)
            }
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderFeaturedImageCard = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Featured Image</CardTitle>
      </CardHeader>
      <CardContent>
        {formData.featured_image ? (
          <div className="space-y-2">
            <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImageUploader(true)}
              className="w-full"
            >
              Change Image
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setShowImageUploader(true)}
            className="w-full"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
        )}
      </CardContent>
    </Card>
  );

  // Memoize callbacks for performance
  const toggleCategory = useCallback(
    (categoryId: string) => {
      const selectedCategories = formData.category_ids || [];
      const newCategories = selectedCategories.includes(categoryId)
        ? selectedCategories.filter((id) => id !== categoryId)
        : [...selectedCategories, categoryId];
      updateField("category_ids", newCategories);
    },
    [formData.category_ids, updateField]
  );

  const toggleTag = useCallback(
    (tagId: string) => {
      const selectedTags = formData.tag_ids || [];
      const newTags = selectedTags.includes(tagId)
        ? selectedTags.filter((id) => id !== tagId)
        : [...selectedTags, tagId];
      updateField("tag_ids", newTags);
    },
    [formData.tag_ids, updateField]
  );

  // Memoize selected items for O(1) lookups
  const selectedCategorySet = useMemo(
    () => new Set(formData.category_ids || []),
    [formData.category_ids]
  );

  const selectedTagSet = useMemo(
    () => new Set(formData.tag_ids || []),
    [formData.tag_ids]
  );

  const renderCategoriesCard = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Folder className="h-4 w-4" />
          Categories
        </CardTitle>
      </CardHeader>
      <CardContent>
        {categoriesLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No categories available
          </p>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`category-${category.id}`}
                  checked={selectedCategorySet.has(category.id)}
                  onChange={() => toggleCategory(category.id)}
                  className="rounded border-gray-300 focus:ring-2 focus:ring-primary"
                />
                <label
                  htmlFor={`category-${category.id}`}
                  className="text-sm cursor-pointer flex items-center gap-2"
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                    aria-hidden="true"
                  />
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderTagsCard = () => {
    const selectedTags = formData.tag_ids || [];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Tags
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="tags-search" className="sr-only">
              Search tags
            </Label>
            <Input
              id="tags-search"
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm"
              aria-label="Search tags"
            />
          </div>
          {tagsLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : tags.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tags found</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {tags.map((tag) => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`tag-${tag.id}`}
                    checked={selectedTagSet.has(tag.id)}
                    onChange={() => toggleTag(tag.id)}
                    className="rounded border-gray-300 focus:ring-2 focus:ring-primary"
                  />
                  <label
                    htmlFor={`tag-${tag.id}`}
                    className="text-sm cursor-pointer flex items-center gap-2"
                  >
                    {tag.name}
                    <span className="text-xs text-muted-foreground">
                      ({tag.usage_count})
                    </span>
                  </label>
                </div>
              ))}
            </div>
          )}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2 border-t">
              {tags
                .filter((tag) => selectedTags.includes(tag.id))
                .map((tag) => (
                  <Badge key={tag.id} variant="secondary" className="text-xs">
                    {tag.name}
                  </Badge>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {postId ? "Edit Post" : "Create New Post"} - Admin Dashboard
        </title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="space-y-6">
        {renderHeader()}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="Enter post title"
                    className="text-2xl font-bold"
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">
                    Slug{" "}
                    <span className="text-xs text-muted-foreground font-normal">
                      (Auto-updates from title)
                    </span>
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => updateField("slug", e.target.value)}
                    placeholder="auto-generated-from-title"
                  />
                  <p className="text-xs text-muted-foreground">
                    Updates automatically as you type the title. Edit manually
                    to customize. Database will ensure uniqueness on save.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Content *</CardTitle>
              </CardHeader>
              <CardContent>
                <MarkdownEditor
                  value={formData.content}
                  onChange={(value) => updateField("content", value)}
                  onImageInsert={() => setShowImageUploader(true)}
                />
                {errors.content && (
                  <p className="text-sm text-destructive mt-2">
                    {errors.content}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Excerpt */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Excerpt</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => updateField("excerpt", e.target.value)}
                  placeholder="Brief summary of the post (auto-generated if left empty)"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Used in post previews and meta descriptions
                </p>
              </CardContent>
            </Card>

            {/* Read Time Display */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Reading Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {formData.content ? (
                      <>
                        {Math.max(
                          1,
                          Math.ceil(
                            formData.content.trim().split(/\s+/).length / 200
                          )
                        )}{" "}
                        min read
                      </>
                    ) : (
                      <span className="text-muted-foreground">
                        Add content to calculate
                      </span>
                    )}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Based on ~200 words per minute. Final value calculated on
                  save.
                </p>
              </CardContent>
            </Card>

            {/* SEO Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>SEO & Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta-title">Meta Title</Label>
                  <Input
                    id="meta-title"
                    value={formData.seo_metadata?.meta_title || ""}
                    onChange={(e) =>
                      updateField("seo_metadata", {
                        ...formData.seo_metadata,
                        meta_title: e.target.value,
                      })
                    }
                    placeholder="Custom SEO title (defaults to post title)"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">
                    {(formData.seo_metadata?.meta_title || "").length}/60
                    characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta-description">Meta Description</Label>
                  <Textarea
                    id="meta-description"
                    value={formData.seo_metadata?.meta_description || ""}
                    onChange={(e) =>
                      updateField("seo_metadata", {
                        ...formData.seo_metadata,
                        meta_description: e.target.value,
                      })
                    }
                    placeholder="Custom SEO description (defaults to excerpt)"
                    rows={3}
                    maxLength={160}
                  />
                  <p className="text-xs text-muted-foreground">
                    {(formData.seo_metadata?.meta_description || "").length}/160
                    characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input
                    id="keywords"
                    value={formData.seo_metadata?.keywords?.join(", ") || ""}
                    onChange={(e) =>
                      updateField("seo_metadata", {
                        ...formData.seo_metadata,
                        keywords: e.target.value
                          .split(",")
                          .map((k) => k.trim()),
                      })
                    }
                    placeholder="keyword1, keyword2, keyword3"
                  />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated keywords for SEO
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="canonical-url">Canonical URL</Label>
                  <Input
                    id="canonical-url"
                    value={formData.seo_metadata?.canonical_url || ""}
                    onChange={(e) =>
                      updateField("seo_metadata", {
                        ...formData.seo_metadata,
                        canonical_url: e.target.value,
                      })
                    }
                    placeholder="https://example.com/original-post"
                  />
                  <p className="text-xs text-muted-foreground">
                    For cross-posted content (prevents duplicate content issues)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="robots-meta">Robots Meta</Label>
                  <Select
                    value={formData.seo_metadata?.robots_meta || "index,follow"}
                    onValueChange={(value) =>
                      updateField("seo_metadata", {
                        ...formData.seo_metadata,
                        robots_meta: value,
                      })
                    }
                  >
                    <SelectTrigger id="robots-meta">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="index,follow">
                        Index, Follow
                      </SelectItem>
                      <SelectItem value="noindex,follow">
                        No Index, Follow
                      </SelectItem>
                      <SelectItem value="index,nofollow">
                        Index, No Follow
                      </SelectItem>
                      <SelectItem value="noindex,nofollow">
                        No Index, No Follow
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {renderActions()}
            {renderStatusCard()}
            {renderFeaturedImageCard()}
            {renderCategoriesCard()}
            {renderTagsCard()}
          </div>
        </div>

        {/* Image Uploader Dialog */}
        <Dialog open={showImageUploader} onOpenChange={setShowImageUploader}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Image</DialogTitle>
            </DialogHeader>
            <ImageUploader
              onUploadComplete={handleImageUpload}
              onCancel={() => setShowImageUploader(false)}
              postId={postId}
            />
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Preview</DialogTitle>
            </DialogHeader>
            <div className="prose prose-sm max-w-none">
              <h1>{formData.title || "Untitled Post"}</h1>
              {formData.excerpt && <p className="lead">{formData.excerpt}</p>}
              <div dangerouslySetInnerHTML={{ __html: formData.content }} />
            </div>
          </DialogContent>
        </Dialog>

        {/* Content Importer Dialog */}
        {showContentImporter && (
          <ContentImporter
            onImport={handleContentImport}
            onCancel={() => setShowContentImporter(false)}
          />
        )}
      </div>
    </>
  );
});
