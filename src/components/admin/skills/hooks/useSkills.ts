import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Skill, SkillWithCategory } from "../types";

// Type assertion for tables not yet in generated types
const db = supabase as any;

/**
 * Custom hook to fetch and manage skills data
 */
export const useSkills = () => {
  const [skills, setSkills] = useState<SkillWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadSkills = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await db
        .from("skills_with_categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setSkills(data as unknown as SkillWithCategory[]);
      setError(null);
    } catch (err) {
      console.error("Error loading skills:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSkill = useCallback(
    async (skillData: Omit<Skill, "id" | "created_at" | "updated_at">) => {
      try {
        const { data, error } = await db
          .from("skills")
          .insert([skillData])
          .select()
          .single();

        if (error) throw error;
        await loadSkills();
        return { data, error: null };
      } catch (err) {
        console.error("Error creating skill:", err);
        return { data: null, error: err as Error };
      }
    },
    [loadSkills]
  );

  const updateSkill = useCallback(
    async (id: string, skillData: Partial<Skill>) => {
      try {
        const { data, error } = await db
          .from("skills")
          .update(skillData)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        await loadSkills();
        return { data, error: null };
      } catch (err) {
        console.error("Error updating skill:", err);
        return { data: null, error: err as Error };
      }
    },
    [loadSkills]
  );

  const deleteSkill = useCallback(
    async (id: string) => {
      try {
        const { error } = await db.from("skills").delete().eq("id", id);

        if (error) throw error;
        await loadSkills();
        return { error: null };
      } catch (err) {
        console.error("Error deleting skill:", err);
        return { error: err as Error };
      }
    },
    [loadSkills]
  );

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  return {
    skills,
    loading,
    error,
    refetch: loadSkills,
    createSkill,
    updateSkill,
    deleteSkill,
  };
};
