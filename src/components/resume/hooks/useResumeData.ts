import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ResumeData } from "../types";

const db = supabase as any;

/**
 * Custom hook to fetch resume data from database
 * Fetches work experiences, education, certifications, and stats
 */
export const useResumeData = () => {
  const [data, setData] = useState<ResumeData>({
    experiences: [],
    education: [],
    certifications: [],
    stats: {
      show_resume_stats: true,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [experiencesRes, educationRes, certificationsRes, profileRes] =
          await Promise.all([
            db
              .from("resume_work_experiences")
              .select("*")
              .eq("is_visible", true)
              .order("display_order", { ascending: true }),
            db
              .from("resume_education")
              .select("*")
              .eq("is_visible", true)
              .order("display_order", { ascending: true }),
            db
              .from("resume_certifications")
              .select("*")
              .eq("is_visible", true)
              .order("display_order", { ascending: true }),
            db
              .from("profiles")
              .select(
                "resume_title, resume_description, years_of_experience, projects_completed, technologies_mastered, show_resume_stats, resume_url"
              )
              .single(),
          ]);

        if (experiencesRes.error) throw experiencesRes.error;
        if (educationRes.error) throw educationRes.error;
        if (certificationsRes.error) throw certificationsRes.error;

        setData({
          experiences: experiencesRes.data || [],
          education: educationRes.data || [],
          certifications: certificationsRes.data || [],
          stats: {
            years_of_experience: profileRes.data?.years_of_experience,
            projects_completed: profileRes.data?.projects_completed,
            technologies_mastered: profileRes.data?.technologies_mastered,
            show_resume_stats: profileRes.data?.show_resume_stats ?? true,
          },
          title: profileRes.data?.resume_title,
          description: profileRes.data?.resume_description,
          resume_url: profileRes.data?.resume_url,
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching resume data:", err);
        setError(err as Error);
      } finally {
        // Minimum loading time for skeleton visibility
        setTimeout(() => setLoading(false), 300);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
