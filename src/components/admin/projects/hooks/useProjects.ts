import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Project, ProjectWithCategory, ProjectFormData } from "../types";

// Type assertion for tables not yet in generated types
const db = supabase as any;

/**
 * Result type for mutation operations
 */
type MutationResult<T = any> =
  | { data: T; error: null }
  | { data: null; error: Error };

type DeleteResult = { error: null } | { error: Error };

type UploadResult = { url: string; error: null } | { url: null; error: Error };

/**
 * Custom hook to fetch and manage projects
 *
 * @returns {Object} Hook state and methods
 * @returns {ProjectWithCategory[]} projects - Array of projects with category info
 * @returns {boolean} loading - Loading state
 * @returns {Error | null} error - Error state
 * @returns {Function} refetch - Manually refetch projects
 * @returns {Function} createProject - Create a new project
 * @returns {Function} updateProject - Update an existing project
 * @returns {Function} deleteProject - Delete a project by ID
 * @returns {Function} toggleFeatured - Toggle featured status
 * @returns {Function} uploadImage - Upload project image to storage
 *
 * @example
 * const { projects, loading, createProject, uploadImage } = useProjects();
 *
 * // Upload an image first
 * const { url, error } = await uploadImage(file);
 *
 * // Create a new project
 * const result = await createProject({
 *   category_id: 'category-id',
 *   title: 'My Project',
 *   slug: 'my-project',
 *   description: 'A cool project',
 *   image_url: url,
 *   technologies: ['react', 'typescript'],
 *   status: 'completed',
 *   is_featured: false,
 *   display_order: 1
 * });
 */
export const useProjects = () => {
  const [projects, setProjects] = useState<ProjectWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      // Use the view that joins projects with categories
      const { data, error } = await db
        .from("projects_with_categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setProjects(data as unknown as ProjectWithCategory[]);
      setError(null);
    } catch (err) {
      console.error("Error loading projects:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = useCallback(
    async (projectData: ProjectFormData): Promise<MutationResult<Project>> => {
      try {
        // Extract technologies array for separate handling
        const { technologies, ...projectFields } = projectData;

        // Insert the project
        const { data: project, error: projectError } = await db
          .from("projects")
          .insert([projectFields])
          .select()
          .single();

        if (projectError) throw projectError;

        // Insert project-technology relationships if technologies provided
        if (technologies && technologies.length > 0) {
          const projectTechs = technologies.map((techId) => ({
            project_id: project.id,
            technology_id: techId,
          }));

          const { error: techError } = await db
            .from("project_technologies")
            .insert(projectTechs);

          if (techError) throw techError;
        }

        await loadProjects();
        return { data: project, error: null };
      } catch (err) {
        console.error("Error creating project:", err);
        return { data: null, error: err as Error };
      }
    },
    [loadProjects]
  );

  const updateProject = useCallback(
    async (
      id: string,
      projectData: Partial<ProjectFormData>
    ): Promise<MutationResult<Project>> => {
      try {
        // Extract technologies array for separate handling
        const { technologies, ...projectFields } = projectData;

        // Update the project
        const { data: project, error: projectError } = await db
          .from("projects")
          .update(projectFields)
          .eq("id", id)
          .select()
          .single();

        if (projectError) throw projectError;

        // Update project-technology relationships if technologies provided
        if (technologies !== undefined) {
          // Delete existing relationships
          const { error: deleteError } = await db
            .from("project_technologies")
            .delete()
            .eq("project_id", id);

          if (deleteError) throw deleteError;

          // Insert new relationships
          if (technologies.length > 0) {
            const projectTechs = technologies.map((techId) => ({
              project_id: id,
              technology_id: techId,
            }));

            const { error: techError } = await db
              .from("project_technologies")
              .insert(projectTechs);

            if (techError) throw techError;
          }
        }

        await loadProjects();
        return { data: project, error: null };
      } catch (err) {
        console.error("Error updating project:", err);
        return { data: null, error: err as Error };
      }
    },
    [loadProjects]
  );

  const deleteProject = useCallback(
    async (id: string): Promise<DeleteResult> => {
      try {
        // Delete project-technology relationships first (cascade should handle this)
        const { error: techError } = await db
          .from("project_technologies")
          .delete()
          .eq("project_id", id);

        if (techError) throw techError;

        // Delete the project
        const { error } = await db.from("projects").delete().eq("id", id);

        if (error) throw error;
        await loadProjects();
        return { error: null };
      } catch (err) {
        console.error("Error deleting project:", err);
        return { error: err as Error };
      }
    },
    [loadProjects]
  );

  const toggleFeatured = useCallback(
    async (id: string, featured: boolean): Promise<DeleteResult> => {
      try {
        const { error } = await db
          .from("projects")
          .update({ is_featured: featured })
          .eq("id", id);

        if (error) throw error;
        await loadProjects();
        return { error: null };
      } catch (err) {
        console.error("Error toggling featured status:", err);
        return { error: err as Error };
      }
    },
    [loadProjects]
  );

  const uploadImage = useCallback(async (file: File): Promise<UploadResult> => {
    try {
      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()
        .toString(36)
        .substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("project-images").getPublicUrl(filePath);

      return { url: publicUrl, error: null };
    } catch (err) {
      console.error("Error uploading image:", err);
      return { url: null, error: err as Error };
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    projects,
    loading,
    error,
    refetch: loadProjects,
    createProject,
    updateProject,
    deleteProject,
    toggleFeatured,
    uploadImage,
  };
};
