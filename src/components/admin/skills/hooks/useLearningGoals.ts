import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { LearningGoal } from "../types";

// Type assertion for tables not yet in generated types
const db = supabase as any;

/**
 * Custom hook to fetch and manage learning goals
 */
export const useLearningGoals = () => {
  const [goals, setGoals] = useState<LearningGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadGoals = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await db
        .from("learning_goals")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setGoals(data as unknown as LearningGoal[]);
      setError(null);
    } catch (err) {
      console.error("Error loading learning goals:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createGoal = useCallback(
    async (
      goalData: Omit<LearningGoal, "id" | "created_at" | "updated_at">
    ) => {
      try {
        const { data, error } = await db
          .from("learning_goals")
          .insert([goalData])
          .select()
          .single();

        if (error) throw error;
        await loadGoals();
        return { data, error: null };
      } catch (err) {
        console.error("Error creating learning goal:", err);
        return { data: null, error: err as Error };
      }
    },
    [loadGoals]
  );

  const updateGoal = useCallback(
    async (id: string, goalData: Partial<LearningGoal>) => {
      try {
        const { data, error } = await db
          .from("learning_goals")
          .update(goalData)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        await loadGoals();
        return { data, error: null };
      } catch (err) {
        console.error("Error updating learning goal:", err);
        return { data: null, error: err as Error };
      }
    },
    [loadGoals]
  );

  const deleteGoal = useCallback(
    async (id: string) => {
      try {
        const { error } = await db.from("learning_goals").delete().eq("id", id);

        if (error) throw error;
        await loadGoals();
        return { error: null };
      } catch (err) {
        console.error("Error deleting learning goal:", err);
        return { error: err as Error };
      }
    },
    [loadGoals]
  );

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  return {
    goals,
    loading,
    error,
    refetch: loadGoals,
    createGoal,
    updateGoal,
    deleteGoal,
  };
};
