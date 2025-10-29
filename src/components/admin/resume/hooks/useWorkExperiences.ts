import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ResumeWorkExperience, WorkExperienceFormData } from "../types";

const db = supabase as any;

export const useWorkExperiences = () => {
  const [experiences, setExperiences] = useState<ResumeWorkExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchExperiences = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await db
        .from("resume_work_experiences")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setExperiences(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching work experiences:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  const createExperience = async (data: WorkExperienceFormData) => {
    try {
      const { data: newExperience, error } = await db
        .from("resume_work_experiences")
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      await fetchExperiences();
      return { data: newExperience, error: null };
    } catch (err) {
      console.error("Error creating work experience:", err);
      return { data: null, error: err as Error };
    }
  };

  const updateExperience = async (
    id: string,
    data: Partial<ResumeWorkExperience>
  ) => {
    try {
      const { data: updatedExperience, error } = await db
        .from("resume_work_experiences")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      await fetchExperiences();
      return { data: updatedExperience, error: null };
    } catch (err) {
      console.error("Error updating work experience:", err);
      return { data: null, error: err as Error };
    }
  };

  const deleteExperience = async (id: string) => {
    try {
      const { error } = await db
        .from("resume_work_experiences")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await fetchExperiences();
      return { error: null };
    } catch (err) {
      console.error("Error deleting work experience:", err);
      return { error: err as Error };
    }
  };

  return {
    experiences,
    loading,
    error,
    createExperience,
    updateExperience,
    deleteExperience,
    refetch: fetchExperiences,
  };
};
