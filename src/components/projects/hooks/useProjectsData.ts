import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type {
  ProjectsData,
  ProjectWithCategory,
  ProjectCategory,
  Technology,
} from "../types";

// Type assertion for tables not yet in generated types
const db = supabase as any;

/**
 * Custom hook to fetch all projects data
 * Fetches projects, categories, technologies, and profile data
 */
export const useProjectsData = () => {
  const [data, setData] = useState<ProjectsData>({
    projects: [],
    categories: [],
    technologies: [],
    profileData: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [projectsRes, categoriesRes, technologiesRes, profileRes] =
          await Promise.all([
            db
              .from("projects_with_categories")
              .select("*")
              .order("display_order", { ascending: true }),
            db
              .from("project_categories")
              .select("*")
              .eq("is_active", true)
              .order("display_order", { ascending: true }),
            db
              .from("technologies")
              .select("*")
              .eq("is_active", true)
              .order("display_order", { ascending: true }),
            db
              .from("profiles")
              .select("projects_title, projects_description")
              .single(),
          ]);

        if (projectsRes.error) throw projectsRes.error;
        if (categoriesRes.error) throw categoriesRes.error;
        if (technologiesRes.error) throw technologiesRes.error;
        // Profile error is non-fatal

        setData({
          projects: (projectsRes.data as ProjectWithCategory[]) || [],
          categories: (categoriesRes.data as ProjectCategory[]) || [],
          technologies: (technologiesRes.data as Technology[]) || [],
          profileData: profileRes.data || null,
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching projects data:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
