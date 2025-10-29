import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ResumeEducation, EducationFormData } from "../types";

const db = supabase as any;

export const useEducation = () => {
  const [education, setEducation] = useState<ResumeEducation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEducation = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await db
        .from("resume_education")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setEducation(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching education:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEducation();
  }, [fetchEducation]);

  const createEducation = async (data: EducationFormData) => {
    try {
      const { data: newEducation, error } = await db
        .from("resume_education")
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      await fetchEducation();
      return { data: newEducation, error: null };
    } catch (err) {
      console.error("Error creating education:", err);
      return { data: null, error: err as Error };
    }
  };

  const updateEducation = async (
    id: string,
    data: Partial<ResumeEducation>
  ) => {
    try {
      const { data: updatedEducation, error } = await db
        .from("resume_education")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      await fetchEducation();
      return { data: updatedEducation, error: null };
    } catch (err) {
      console.error("Error updating education:", err);
      return { data: null, error: err as Error };
    }
  };

  const deleteEducation = async (id: string) => {
    try {
      const { error } = await db.from("resume_education").delete().eq("id", id);

      if (error) throw error;
      await fetchEducation();
      return { error: null };
    } catch (err) {
      console.error("Error deleting education:", err);
      return { error: err as Error };
    }
  };

  return {
    education,
    loading,
    error,
    createEducation,
    updateEducation,
    deleteEducation,
    refetch: fetchEducation,
  };
};
