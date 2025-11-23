import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Technology, TechnologyFormData } from "../types";

// Type assertion for tables not yet in generated types
const db = supabase as any;

/**
 * Result type for mutation operations
 */
type MutationResult<T = any> =
  | { data: T; error: null }
  | { data: null; error: Error };

type DeleteResult = { error: null } | { error: Error };

/**
 * Custom hook to fetch and manage technologies
 *
 * @returns {Object} Hook state and methods
 * @returns {Technology[]} technologies - Array of technologies
 * @returns {boolean} loading - Loading state
 * @returns {Error | null} error - Error state
 * @returns {Function} refetch - Manually refetch technologies
 * @returns {Function} createTechnology - Create a new technology
 * @returns {Function} updateTechnology - Update an existing technology
 * @returns {Function} deleteTechnology - Delete a technology by ID
 *
 * @example
 * const { technologies, loading, createTechnology, deleteTechnology } = useTechnologies();
 *
 * // Create a new technology
 * const result = await createTechnology({
 *   name: 'react',
 *   label: 'React',
 *   icon: 'Atom',
 *   color: 'text-secondary',
 *   category: 'frontend',
 *   display_order: 1,
 *   is_active: true
 * });
 *
 * // Delete a technology
 * const deleteResult = await deleteTechnology(technologyId);
 */
export const useTechnologies = () => {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadTechnologies = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await db
        .from("technologies")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setTechnologies(data as unknown as Technology[]);
      setError(null);
    } catch (err) {
      console.error("Error loading technologies:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTechnology = useCallback(
    async (
      technologyData: TechnologyFormData
    ): Promise<MutationResult<Technology>> => {
      try {
        const { data, error } = await db
          .from("technologies")
          .insert([technologyData])
          .select()
          .single();

        if (error) throw error;
        await loadTechnologies();
        return { data, error: null };
      } catch (err) {
        console.error("Error creating technology:", err);
        return { data: null, error: err as Error };
      }
    },
    [loadTechnologies]
  );

  const updateTechnology = useCallback(
    async (
      id: string,
      technologyData: Partial<TechnologyFormData>
    ): Promise<MutationResult<Technology>> => {
      try {
        const { data, error } = await db
          .from("technologies")
          .update(technologyData)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        await loadTechnologies();
        return { data, error: null };
      } catch (err) {
        console.error("Error updating technology:", err);
        return { data: null, error: err as Error };
      }
    },
    [loadTechnologies]
  );

  const deleteTechnology = useCallback(
    async (id: string): Promise<DeleteResult> => {
      try {
        const { error } = await db.from("technologies").delete().eq("id", id);

        if (error) throw error;
        await loadTechnologies();
        return { error: null };
      } catch (err) {
        console.error("Error deleting technology:", err);
        return { error: err as Error };
      }
    },
    [loadTechnologies]
  );

  useEffect(() => {
    loadTechnologies();
  }, [loadTechnologies]);

  return {
    technologies,
    loading,
    error,
    refetch: loadTechnologies,
    createTechnology,
    updateTechnology,
    deleteTechnology,
  };
};
