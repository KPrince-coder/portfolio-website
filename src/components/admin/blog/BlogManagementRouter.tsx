/**
 * Blog Management Router Component
 *
 * Handles routing for blog management with:
 * - Posts list view
 * - Create new post
 * - Edit existing post
 * - Categories and tags management
 *
 * @module blog/BlogManagementRouter
 */

import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { BlogManagement } from "./BlogManagement";
import { PostForm } from "./PostForm";

// ============================================================================
// COMPONENT
// ============================================================================

export function BlogManagementRouter() {
  const navigate = useNavigate();

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handlePostSave = () => {
    // Navigate back to posts list after save
    navigate("/admin/blog");
  };

  const handlePostPublish = () => {
    // Navigate back to posts list after publish
    navigate("/admin/blog");
  };

  const handlePostCancel = () => {
    // Navigate back to posts list on cancel
    navigate("/admin/blog");
  };

  const handleCreatePost = () => {
    // Navigate to create post form
    navigate("/admin/blog/new");
  };

  const handleEditPost = (postId: string) => {
    // Navigate to edit post form
    navigate(`/admin/blog/${postId}/edit`);
  };

  const handleViewPost = (postId: string) => {
    // Navigate to public post view (in new tab)
    window.open(`/blog/${postId}`, "_blank");
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <Routes>
      {/* Main blog management with tabs */}
      <Route path="/" element={<BlogManagement defaultTab="posts" />} />

      {/* Create new post */}
      <Route
        path="/new"
        element={
          <PostForm
            onSave={handlePostSave}
            onPublish={handlePostPublish}
            onCancel={handlePostCancel}
          />
        }
      />

      {/* Edit existing post */}
      <Route
        path="/:postId/edit"
        element={
          <PostForm
            onSave={handlePostSave}
            onPublish={handlePostPublish}
            onCancel={handlePostCancel}
          />
        }
      />

      {/* Redirect any unknown routes to main */}
      <Route path="*" element={<Navigate to="/admin/blog" replace />} />
    </Routes>
  );
}
