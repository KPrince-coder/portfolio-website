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

import React, { useState } from "react";
import { Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
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
}

// ============================================================================
// COMPONENT
// ============================================================================

export function BlogManagement({
  activeSubTab = "posts-list",
}: BlogManagementProps) {
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const { toast } = useToast();

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleCreatePost = () => {
    setEditingPostId(null);
    // The activeSubTab should be changed by parent, but we can show the form
  };

  const handleEditPost = (postId: string) => {
    setEditingPostId(postId);
  };

  const handlePostSave = () => {
    toast({
      title: "Post saved",
      description: "Your blog post has been saved successfully",
    });
    setEditingPostId(null);
  };

  const handlePostPublish = () => {
    toast({
      title: "Post published",
      description: "Your blog post has been published successfully",
    });
    setEditingPostId(null);
  };

  const handlePostCancel = () => {
    setEditingPostId(null);
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const getSectionTitle = () => {
    switch (activeSubTab) {
      case "posts-list":
        return "Blog Posts";
      case "posts-new":
        return "Create New Post";
      case "posts-edit":
        return "Edit Post";
      case "posts-categories":
        return "Categories";
      case "posts-tags":
        return "Tags";
      default:
        return "Blog Management";
    }
  };

  const renderSection = () => {
    switch (activeSubTab) {
      case "posts-list":
        return <PostsList onEditPost={handleEditPost} />;
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
        return <PostsList onEditPost={handleEditPost} />;
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {getSectionTitle()}
          </h1>
          <p className="text-muted-foreground">
            Manage your blog posts, categories, and tags.
          </p>
        </div>
      </div>

      {renderSection()}
    </div>
  );
}
