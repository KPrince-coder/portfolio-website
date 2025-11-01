/**
 * Blog Management Component
 *
 * Main container for blog administration with:
 * - Tab navigation between sections
 * - Posts, Categories, and Tags management
 * - Responsive layout
 * - Clean navigation
 *
 * @module blog/BlogManagement
 */

import { useState, useCallback, useMemo, memo } from "react";
import { PostsList } from "./PostsList";
import { PostForm } from "./PostForm";
import { CategoriesSection } from "./sections/CategoriesSection";
import { TagsSection } from "./sections/TagsSection";
import { useToast } from "@/hooks/use-toast";

// ============================================================================
// TYPES
// ============================================================================

interface BlogManagementProps {
  activeSubTab?: string;
  onTabChange?: (tab: string) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const BlogManagement = memo(function BlogManagement({
  activeSubTab = "posts-list",
  onTabChange,
}: BlogManagementProps) {
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const { toast } = useToast();

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleCreatePost = useCallback(() => {
    setEditingPostId(null);
    onTabChange?.("posts-new");
  }, [onTabChange]);

  const handleEditPost = useCallback(
    (postId: string) => {
      setEditingPostId(postId);
      onTabChange?.("posts-edit");
    },
    [onTabChange]
  );

  const handlePostSave = useCallback(() => {
    toast({
      title: "Post saved",
      description: "Your blog post has been saved successfully",
    });
    setEditingPostId(null);
    onTabChange?.("posts-list");
  }, [toast, onTabChange]);

  const handlePostPublish = useCallback(() => {
    toast({
      title: "Post published",
      description: "Your blog post has been published successfully",
    });
    setEditingPostId(null);
    onTabChange?.("posts-list");
  }, [toast, onTabChange]);

  const handlePostCancel = useCallback(() => {
    setEditingPostId(null);
    onTabChange?.("posts-list");
  }, [onTabChange]);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const sectionContent = useMemo(() => {
    switch (activeSubTab) {
      case "posts-list":
        return (
          <PostsList
            onEditPost={handleEditPost}
            onCreatePost={handleCreatePost}
          />
        );
      case "posts-new":
        return (
          <PostForm
            onSave={handlePostSave}
            onPublish={handlePostPublish}
            onCancel={handlePostCancel}
          />
        );
      case "posts-edit":
        return (
          <PostForm
            postId={editingPostId}
            onSave={handlePostSave}
            onPublish={handlePostPublish}
            onCancel={handlePostCancel}
          />
        );
      case "posts-categories":
        return <CategoriesSection />;
      case "posts-tags":
        return <TagsSection />;
      default:
        return (
          <PostsList
            onEditPost={handleEditPost}
            onCreatePost={handleCreatePost}
          />
        );
    }
  }, [
    activeSubTab,
    editingPostId,
    handleEditPost,
    handleCreatePost,
    handlePostSave,
    handlePostPublish,
    handlePostCancel,
  ]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return <div className="space-y-6">{sectionContent}</div>;
});
