/**
 * Blog Filters Component
 *
 * Advanced filtering interface for blog posts with:
 * - Category filtering
 * - Tag filtering
 * - Search functionality
 * - Sort options
 * - Featured posts filter
 * - Responsive design
 * - Active filter display
 *
 * @module blog/BlogFilters
 */

import React, { useState } from "react";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  Star,
  Calendar,
  Eye,
  TrendingUp,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { PublicBlogFilters } from "./hooks/useBlogPosts";
import type { BlogPostSortOptions } from "@/components/admin/blog/types";

// ============================================================================
// TYPES
// ============================================================================

interface BlogFiltersProps {
  // Filter state
  filters: PublicBlogFilters;
  onFilterChange: <K extends keyof PublicBlogFilters>(
    key: K,
    value: PublicBlogFilters[K]
  ) => void;
  onClearFilters: () => void;

  // Search
  searchQuery: string;
  onSearchChange: (query: string) => void;

  // Sort
  sort: BlogPostSortOptions;
  onSortChange: (sort: BlogPostSortOptions) => void;

  // Data
  categories?: Array<{
    id: string;
    name: string;
    slug: string;
    post_count?: number;
  }>;
  tags?: Array<{ id: string; name: string; slug: string; post_count?: number }>;

  // State
  loading?: boolean;
  totalPosts?: number;

  // UI
  className?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const SORT_OPTIONS = [
  {
    value: "published_at-desc",
    label: "Latest First",
    icon: Calendar,
    field: "published_at" as const,
    direction: "desc" as const,
  },
  {
    value: "published_at-asc",
    label: "Oldest First",
    icon: Calendar,
    field: "published_at" as const,
    direction: "asc" as const,
  },
  {
    value: "view_count-desc",
    label: "Most Popular",
    icon: Eye,
    field: "view_count" as const,
    direction: "desc" as const,
  },
  {
    value: "title-asc",
    label: "A to Z",
    icon: TrendingUp,
    field: "title" as const,
    direction: "asc" as const,
  },
] as const;

// ============================================================================
// COMPONENT
// ============================================================================

export const BlogFilters = React.memo<BlogFiltersProps>(function BlogFilters({
  filters,
  onFilterChange,
  onClearFilters,
  searchQuery,
  onSearchChange,
  sort,
  onSortChange,
  categories = [],
  tags = [],
  loading = false,
  totalPosts = 0,
  className = "",
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const hasActiveFilters = React.useMemo(() => {
    return Boolean(
      filters.category ||
        filters.tag ||
        filters.featured !== undefined ||
        searchQuery
    );
  }, [filters, searchQuery]);

  const activeFilterCount = React.useMemo(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.tag) count++;
    if (filters.featured !== undefined) count++;
    if (searchQuery) count++;
    return count;
  }, [filters, searchQuery]);

  const currentSortOption = React.useMemo(() => {
    return (
      SORT_OPTIONS.find(
        (option) =>
          option.field === sort.field && option.direction === sort.direction
      ) || SORT_OPTIONS[0]
    );
  }, [sort]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleSortChange = (value: string) => {
    const option = SORT_OPTIONS.find((opt) => opt.value === value);
    if (option) {
      onSortChange({
        field: option.field,
        direction: option.direction,
      });
    }
  };

  const handleClearAll = () => {
    onClearFilters();
    setShowAdvanced(false);
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderActiveFilters = () => {
    if (!hasActiveFilters) return null;

    const activeFilters = [];

    if (searchQuery) {
      activeFilters.push(
        <Badge key="search" variant="secondary" className="gap-1">
          Search: "{searchQuery}"
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 ml-1"
            onClick={() => onSearchChange("")}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      );
    }

    if (filters.category) {
      const category = categories.find((c) => c.id === filters.category);
      activeFilters.push(
        <Badge key="category" variant="secondary" className="gap-1">
          Category: {category?.name || filters.category}
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 ml-1"
            onClick={() => onFilterChange("category", undefined)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      );
    }

    if (filters.tag) {
      const tag = tags.find((t) => t.id === filters.tag);
      activeFilters.push(
        <Badge key="tag" variant="secondary" className="gap-1">
          Tag: #{tag?.name || filters.tag}
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 ml-1"
            onClick={() => onFilterChange("tag", undefined)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      );
    }

    if (filters.featured) {
      activeFilters.push(
        <Badge key="featured" variant="secondary" className="gap-1">
          <Star className="h-3 w-3" />
          Featured Only
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 ml-1"
            onClick={() => onFilterChange("featured", undefined)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      );
    }

    return (
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-muted-foreground">Active filters:</span>
        {activeFilters}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearAll}
          className="text-muted-foreground hover:text-foreground"
        >
          Clear all
        </Button>
      </div>
    );
  };

  const renderAdvancedFilters = () => {
    if (!showAdvanced) return null;

    return (
      <div className="space-y-4 pt-4 border-t">
        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={filters.category || "all"}
              onValueChange={(value) =>
                onFilterChange("category", value === "all" ? undefined : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                    {category.post_count !== undefined && (
                      <span className="ml-2 text-muted-foreground">
                        ({category.post_count})
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Tag Filter */}
        {tags.length > 0 && (
          <div className="space-y-2">
            <Label>Tag</Label>
            <Select
              value={filters.tag || "all"}
              onValueChange={(value) =>
                onFilterChange("tag", value === "all" ? undefined : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {tags.slice(0, 20).map((tag) => (
                  <SelectItem key={tag.id} value={tag.id}>
                    #{tag.name}
                    {tag.post_count !== undefined && (
                      <span className="ml-2 text-muted-foreground">
                        ({tag.post_count})
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Featured Filter */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Featured Posts Only</Label>
            <p className="text-xs text-muted-foreground">
              Show only featured posts
            </p>
          </div>
          <Switch
            checked={filters.featured || false}
            onCheckedChange={(checked) =>
              onFilterChange("featured", checked ? true : undefined)
            }
          />
        </div>
      </div>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
            disabled={loading}
          />
        </div>

        {/* Sort */}
        <Select
          value={currentSortOption.value}
          onValueChange={handleSortChange}
          disabled={loading}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {option.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {/* Advanced Filters Toggle */}
        <Popover open={showAdvanced} onOpenChange={setShowAdvanced}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
                >
                  {activeFilterCount}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Advanced Filters</h4>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={handleClearAll}>
                    Clear all
                  </Button>
                )}
              </div>
              {renderAdvancedFilters()}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <>
          <Separator />
          {renderActiveFilters()}
        </>
      )}

      {/* Results Count */}
      {totalPosts > 0 && (
        <div className="text-sm text-muted-foreground">
          {loading
            ? "Loading..."
            : `${totalPosts.toLocaleString()} post${
                totalPosts === 1 ? "" : "s"
              } found`}
        </div>
      )}
    </div>
  );
});

BlogFilters.displayName = "BlogFilters";
