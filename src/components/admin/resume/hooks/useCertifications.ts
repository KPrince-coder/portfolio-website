import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ResumeCertification, CertificationFormData } from "../types";

const db = supabase as any;

export const useCertifications = () => {
  const [certifications, setCertifications] = useState<ResumeCertification[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCertifications = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await db
        .from("resume_certifications")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setCertifications(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching certifications:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertifications();
  }, [fetchCertifications]);

  const createCertification = async (data: CertificationFormData) => {
    try {
      const { data: newCertification, error } = await db
        .from("resume_certifications")
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      await fetchCertifications();
      return { data: newCertification, error: null };
    } catch (err) {
      console.error("Error creating certification:", err);
      return { data: null, error: err as Error };
    }
  };

  const updateCertification = async (
    id: string,
    data: Partial<ResumeCertification>
  ) => {
    try {
      const { data: updatedCertification, error } = await db
        .from("resume_certifications")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      await fetchCertifications();
      return { data: updatedCertification, error: null };
    } catch (err) {
      console.error("Error updating certification:", err);
      return { data: null, error: err as Error };
    }
  };

  const deleteCertification = async (id: string) => {
    try {
      const { error } = await db
        .from("resume_certifications")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await fetchCertifications();
      return { error: null };
    } catch (err) {
      console.error("Error deleting certification:", err);
      return { error: err as Error };
    }
  };

  return {
    certifications,
    loading,
    error,
    createCertification,
    updateCertification,
    deleteCertification,
    refetch: fetchCertifications,
  };
};
