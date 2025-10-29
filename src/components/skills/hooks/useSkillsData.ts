import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { SkillsData, Skill, LearningGoal } from "../types";

/**
 * Custom hook to fetch skills data from the backend
 */
export const useSkillsData = () => {
  const [data, setData] = useState<SkillsData>({
    categories: [],
    skills: [],
    learningGoals: [],
    profileData: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load profile skills data (get the first/primary profile)
      const { data: profileData } = await supabase
        .from("profiles")
        .select("skills_title, skills_description")
        .order("created_at", { ascending: true })
        .limit(1);

      const profile = profileData?.[0] || null;

      // Load categories
      const { data: categoriesData } = await supabase
        .from("skill_categories")
        .select("*")
        .order("display_order", { ascending: true });

      // Load skills with category info
      const { data: skillsData } = await supabase
        .from("skills_with_categories")
        .select("*")
        .order("display_order", { ascending: true });

      // Load learning goals
      const { data: goalsData } = await supabase
        .from("learning_goals")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      setData({
        categories: categoriesData || [],
        skills: (skillsData as unknown as Skill[]) || [],
        learningGoals: (goalsData as LearningGoal[]) || [],
        profileData: profile || null,
      });

      setError(null);
    } catch (err) {
      console.error("Error loading skills data:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: loadData };
};
