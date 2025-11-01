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

import { BlogManagement } from "./BlogManagement";

// ============================================================================
// TYPES
// ============================================================================

interface BlogManagementRouterProps {
  activeSubTab: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function BlogManagementRouter({
  activeSubTab,
}: BlogManagementRouterProps) {
  return <BlogManagement activeSubTab={activeSubTab} />;
}
