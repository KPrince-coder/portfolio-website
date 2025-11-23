import React, { useState, useMemo } from "react";
import { Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProjectsList from "../ProjectsList";
import ProjectForm from "../ProjectForm";
import { useProjects } from "../hooks/useProjects";
import { useProjectCategories } from "../hooks/useProjectCategories";
import type { ProjectWithCategory } from "../types";

/**
 * ProjectsListSection Component
 * Manages the list of projects with CRUD operations
 */
const ProjectsListSection: React.FC = () => {
  const {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    toggleFeatured,
  } = useProjects();
  const { categories } = useProjectCategories();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] =
    useState<ProjectWithCategory | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [featuredFilter, setFeaturedFilter] = useState("All");

  const handleEdit = (project: ProjectWithCategory) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingProject(null);
  };

  const handleSave = async (
    ...args: any[]
  ): Promise<{ data: any; error: Error | null }> => {
    try {
      let result;
      if (editingProject) {
        result = await updateProject(args[0], args[1]);
      } else {
        result = await createProject(args[0]);
      }
      handleClose();
      return result;
    } catch (error) {
      console.error("Error saving project:", error);
      return { data: null, error: error as Error };
    }
  };

  // Filter projects based on search and filters
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search filter
      const matchesSearch =
        !searchTerm ||
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory =
        categoryFilter === "All" || project.category_id === categoryFilter;

      // Status filter
      const matchesStatus =
        statusFilter === "All" || project.status === statusFilter;

      // Featured filter
      const matchesFeatured =
        featuredFilter === "All" ||
        (featuredFilter === "true" && project.is_featured) ||
        (featuredFilter === "false" && !project.is_featured);

      return (
        matchesSearch && matchesCategory && matchesStatus && matchesFeatured
      );
    });
  }, [projects, searchTerm, categoryFilter, statusFilter, featuredFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Projects</h2>
          <p className="text-muted-foreground mt-2">
            Manage your project portfolio
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9 pr-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 p-0 text-muted-foreground hover:bg-transparent"
              onClick={() => setSearchTerm("")}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Category Filter */}
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="planned">Planned</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        {/* Featured Filter */}
        <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Featured" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Projects</SelectItem>
            <SelectItem value="true">Featured Only</SelectItem>
            <SelectItem value="false">Non-Featured</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredProjects.length} of {projects.length} projects
      </div>

      <ProjectsList
        projects={filteredProjects}
        loading={loading}
        onEdit={handleEdit}
        onDelete={deleteProject}
        onToggleFeatured={toggleFeatured}
      />

      {isFormOpen && (
        <ProjectForm
          project={editingProject}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ProjectsListSection;
