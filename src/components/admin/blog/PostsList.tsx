/**
 * Posts List Component
 *
 * Modern blog posts management interface with:
 * - Advanced filtering and search
 * - Sortable columns
 * - Pagination
 * - Bulk actions
 * - Responsive design
 * - Loading states
 * - Error handling
 *
 * @module blog/PostsList
 */

import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Archive,
  Send,
  Clock,
  CheckSquare,
  Square,
  ChevronDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePosts } from "./hooks/usePosts";
import type { BlogPostStatus, BlogPostSortOptions } from "./types";

// ============================================================================
// TYPES
// ============================================================================

interface PostsListProps {
  onCreatePost?: () => void;
  onEditPost?: (postId: string) => void;
  onViewPost?: (postId: string) => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STATUS_COLORS: Record<BlogPostStatus, string> = {
  draft: "bg-gray-100 text-gray-800",
  published: "bg-green-100 text-green-800",
  scheduled: "bg-blue-100 text-blue-800",
  archived: "bg-yellow-100 text-yellow-800",
};

const STATUS_ICONS: Record<
  BlogPostStatus,
  React.ComponentType<{ className?: string }>
> = {
  draft: Edit,
  published: Eye,
  scheduled: Clock,
  archived: Archive,
};

const SORT_FIELDS = [
  { value: "created_at", label: "Created Date" },
  { value: "published_at", label: "Published Date" },
  { value: "updated_at", label: "Updated Date" },
  { value: "title", label: "Title" },
  { value: "view_count", label: "Views" },
] as const;

const PER_PAGE_OPTIONS = [10, 25, 50, 100];

// ============================================================================
// COMPONENT
// ============================================================================

export function PostsList({
  onCreatePost,
  onEditPost,
  onViewPost,
}: PostsListProps) {
  const navigate = useNavigate();

  const {
    posts,
    pagination,
    loading,
    error,
    filters,
    updateFilter,
    clearFilters,
    searchQuery,
    setSearchQuery,
    sort,
    setSort,
    currentPage,
    setCurrentPage,
    perPage,
    setPerPage,
    selectedPosts,
    togglePostSelection,
    selectAllPosts,
    clearSelection,
    deletePostById,
    publishPostById,
    unpublishPostById,
    archivePostById,
    bulkDelete,
    bulkPublish,
    bulkArchive,
  } = usePosts();

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleSort = (field: BlogPostSortOptions["field"]) => {
    setSort({
      field,
      direction:
        sort.field === field && sort.direction === "asc" ? "desc" : "asc",
    });
  };

  const handleSelectAll = () => {
    if (selectedPosts.length === posts.length) {
      clearSelection();
    } else {
      selectAllPosts();
    }
  };

  const handleBulkAction = async (action: "delete" | "publish" | "archive") => {
    if (selectedPosts.length === 0) return;

    try {
      switch (action) {
        case "delete":
          await bulkDelete();
          break;
        case "publish":
          await bulkPublish();
          break;
        case "archive":
          await bulkArchive();
          break;
      }
    } catch (error) {
      console.error(`Bulk ${action} failed:`, error);
    }
  };

  const handleCreatePost = () => {
    if (onCreatePost) {
      onCreatePost();
    } else {
      navigate("/admin/blog/new");
    }
  };

  const handleEditPost = (postId: string) => {
    if (onEditPost) {
      onEditPost(postId);
    } else {
      navigate(`/admin/blog/${postId}/edit`);
    }
  };

  const handleViewPost = (postId: string) => {
    if (onViewPost) {
      onViewPost(postId);
    } else {
      window.open(`/blog/${postId}`, "_blank");
    }
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderSortIcon = (field: BlogPostSortOptions["field"]) => {
    if (sort.field !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sort.direction === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const renderStatusBadge = (status: BlogPostStatus) => {
    const Icon = STATUS_ICONS[status];
    return (
      <Badge className={STATUS_COLORS[status]}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const renderPostActions = (post: any) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleViewPost(post.id)}>
          <Eye className="h-4 w-4 mr-2" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleEditPost(post.id)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {post.status === "draft" && (
          <DropdownMenuItem onClick={() => publishPostById(post.id)}>
            <Send className="h-4 w-4 mr-2" />
            Publish
          </DropdownMenuItem>
        )}
        {post.status === "published" && (
          <DropdownMenuItem onClick={() => unpublishPostById(post.id)}>
            <Edit className="h-4 w-4 mr-2" />
            Unpublish
          </DropdownMenuItem>
        )}
        {post.status !== "archived" && (
          <DropdownMenuItem onClick={() => archivePostById(post.id)}>
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => deletePostById(post.id)}
          className="text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderPagination = () => {
    if (!pagination) return null;

    const { page, total_pages, has_prev, has_next } = pagination;

    return (
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            Showing {posts.length} of {pagination.total} posts
          </p>
          <Select
            value={perPage.toString()}
            onValueChange={(value) => setPerPage(parseInt(value))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PER_PAGE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">per page</span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(page - 1)}
            disabled={!has_prev}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {total_pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(page + 1)}
            disabled={!has_next}
          >
            Next
          </Button>
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
          <h2 className="text-2xl font-bold tracking-tight">Blog Posts</h2>
          <p className="text-muted-foreground">
            Manage your blog posts, drafts, and published content.
          </p>
        </div>
        <Button onClick={handleCreatePost}>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Quick Filters */}
              <Select
                value={
                  typeof filters.status === "string" ? filters.status : "all"
                }
                onValueChange={(value) =>
                  updateFilter(
                    "status",
                    value === "all" ? undefined : (value as BlogPostStatus)
                  )
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            {(filters.status || searchQuery) && (
              <Button variant="ghost" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedPosts.length} post
                {selectedPosts.length === 1 ? "" : "s"} selected
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("publish")}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Publish
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("archive")}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBulkAction("delete")}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button variant="ghost" size="sm" onClick={clearSelection}>
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Posts Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedPosts.length === posts.length && posts.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("title")}
                    className="h-auto p-0 font-semibold"
                  >
                    Title
                    {renderSortIcon("title")}
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("view_count")}
                    className="h-auto p-0 font-semibold"
                  >
                    Views
                    {renderSortIcon("view_count")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("created_at")}
                    className="h-auto p-0 font-semibold"
                  >
                    Created
                    {renderSortIcon("created_at")}
                  </Button>
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Loading skeleton
                Array.from({ length: perPage }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8" />
                    </TableCell>
                  </TableRow>
                ))
              ) : posts.length === 0 ? (
                // Empty state
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="text-muted-foreground">
                      {searchQuery || filters.status ? (
                        <>
                          <p>No posts found matching your criteria.</p>
                          <Button
                            variant="link"
                            onClick={clearFilters}
                            className="mt-2"
                          >
                            Clear filters
                          </Button>
                        </>
                      ) : (
                        <>
                          <p>No blog posts yet.</p>
                          <Button onClick={handleCreatePost} className="mt-2">
                            Create your first post
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                // Posts data
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedPosts.includes(post.id)}
                        onCheckedChange={() => togglePostSelection(post.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{post.title}</div>
                        {post.excerpt && (
                          <div className="text-sm text-muted-foreground truncate max-w-md">
                            {post.excerpt}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{renderStatusBadge(post.status)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {post.categories?.slice(0, 2).map((category) => (
                          <Badge
                            key={category.id}
                            variant="outline"
                            className="text-xs"
                          >
                            {category.name}
                          </Badge>
                        ))}
                        {post.categories && post.categories.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.categories.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{post.view_count.toLocaleString()}</TableCell>
                    <TableCell>
                      {format(new Date(post.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{renderPostActions(post)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <Card>
          <CardContent className="py-4">{renderPagination()}</CardContent>
        </Card>
      )}
    </div>
  );
}
