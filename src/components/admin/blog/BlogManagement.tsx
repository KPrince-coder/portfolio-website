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

import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Folder, Tag, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CategoriesSection } from "./sections/CategoriesSection";
import { TagsSection } from "./sections/TagsSection";

// ============================================================================
// TYPES
// ============================================================================

interface BlogManagementProps {
  defaultTab?: "posts" | "categories" | "tags";
}

// ============================================================================
// COMPONENT
// ============================================================================

export function BlogManagement({ defaultTab = "posts" }: BlogManagementProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
        <p className="text-muted-foreground">
          Manage your blog posts, categories, and tags.
        </p>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Posts</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Folder className="h-4 w-4" />
            <span className="hidden sm:inline">Categories</span>
          </TabsTrigger>
          <TabsTrigger value="tags" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span className="hidden sm:inline">Tags</span>
          </TabsTrigger>
        </TabsList>

        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Posts Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Create and manage your blog posts
                  </p>
                </div>
                <Button onClick={() => navigate("/admin/blog/new")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Post
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <CategoriesSection />
        </TabsContent>

        {/* Tags Tab */}
        <TabsContent value="tags" className="space-y-4">
          <TagsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
