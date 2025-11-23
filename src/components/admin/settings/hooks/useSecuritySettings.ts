import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SecuritySettings } from "../types";

export const useSecuritySettings = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const updateEmail = async (
    newEmail: string,
    currentPassword: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      // Verify current password first
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.email) throw new Error("No user found");

      // Re-authenticate user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.user.email,
        password: currentPassword,
      });

      if (signInError) {
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: "Current password is incorrect",
        });
        return false;
      }

      // Update email
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) throw error;

      toast({
        title: "Email update initiated",
        description:
          "Please check both your old and new email for confirmation links",
      });

      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update email",
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      // Verify current password
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.email) throw new Error("No user found");

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.user.email,
        password: currentPassword,
      });

      if (signInError) {
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: "Current password is incorrect",
        });
        return false;
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully",
      });

      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update password",
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateEmail,
    updatePassword,
  };
};
