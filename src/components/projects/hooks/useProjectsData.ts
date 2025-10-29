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
            // Try to use the view first, fallback to table if view doesn't exist
            db
              .from("projects_with_categories")
              .select("*")
              .order("display_order", { ascending: true })
              .then((res: any) => {
                // If view doesn't exist, try the projects table directly
                if (res.error && res.error.code === "42P01") {
                  console.warn(
                    "View projects_with_categories not found, using projects table"
                  );
                  return db
                    .from("projects")
                    .select(
                      `
                      *,
                      category:project_categories(name, label, icon, color)
                    `
                    )
                    .order("display_order", { ascending: true });
                }
                return res;
              }),
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

        if (projectsRes.error) {
          console.error("Projects query error:", projectsRes.error);
          throw projectsRes.error;
        }
        if (categoriesRes.error) {
          console.error("Categories query error:", categoriesRes.error);
          throw categoriesRes.error;
        }
        if (technologiesRes.error) {
          console.error("Technologies query error:", technologiesRes.error);
          throw technologiesRes.error;
        }
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
        const error = err as any;

        // Provide helpful error message if tables don't exist
        if (error?.code === "42P01") {
          console.error(
            "Database tables not found. Please run the projects migration:",
            "\n1. Make sure Supabase is running: npx supabase start",
            "\n2. Run migrations: npx supabase db reset",
            "\nOr apply the specific migration: supabase/migrations/20241028000005_projects.sql"
          );
        }

        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
