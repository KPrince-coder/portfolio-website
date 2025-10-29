import React, { useState, useEffect, useCallback } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";
import {
  PersonalInfoSection,
  HeroSection,
  AboutSection,
  SocialLinksSection,
  ResumeSection,
  ExperienceSection,
  ImpactMetricsSection,
  PhilosophySection,
} from "./sections";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

interface ProfileManagementProps {
  activeSubTab?: string;
}

const ProfileManagement: React.FC<ProfileManagementProps> = ({
  activeSubTab = "profile-personal",
}) => {
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<ProfileUpdate>>({});

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          variant: "destructive",
          title: "Not authenticated",
          description: "Please sign in to manage your profile",
        });
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData(data);
      } else {
        setFormData({ user_id: user.id });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        variant: "destructive",
        title: "Failed to load profile",
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleInputChange = useCallback(
    (field: keyof ProfileUpdate, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSave = useCallback(async () => {
    setSaving(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (profile) {
        const { error } = await supabase
          .from("profiles")
          .update(formData)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("profiles")
          .insert({ ...formData, user_id: user.id } as ProfileInsert);

        if (error) throw error;
      }

      toast({
        title: "Profile saved",
        description: "Your profile has been updated successfully",
      });

      await loadProfile();
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description:
          error instanceof Error ? error.message : "Failed to save profile",
      });
    } finally {
      setSaving(false);
    }
  }, [profile, formData, toast, loadProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const getSectionTitle = () => {
    switch (activeSubTab) {
      case "profile-personal":
        return "Personal Information";
      case "profile-hero":
        return "Hero Section";
      case "profile-about":
        return "About Section";
      case "profile-experience":
        return "Professional Journey";
      case "profile-metrics":
        return "Impact Metrics";
      case "profile-philosophy":
        return "Philosophy";
      case "profile-social":
        return "Social Links";
      case "profile-resume":
        return "Resume";
      default:
        return "Profile Management";
    }
  };

  const renderSection = () => {
    switch (activeSubTab) {
      case "profile-personal":
        return (
          <PersonalInfoSection
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case "profile-hero":
        return (
          <HeroSection formData={formData} onInputChange={handleInputChange} />
        );
      case "profile-about":
        return (
          <AboutSection formData={formData} onInputChange={handleInputChange} />
        );
      case "profile-experience":
        return (
          <ExperienceSection
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case "profile-metrics":
        return (
          <ImpactMetricsSection
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case "profile-philosophy":
        return (
          <PhilosophySection
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case "profile-social":
        return (
          <SocialLinksSection
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case "profile-resume":
        return (
          <ResumeSection
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      default:
        return (
          <PersonalInfoSection
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="heading-lg">{getSectionTitle()}</h2>
        <Button onClick={handleSave} disabled={saving} className="neural-glow">
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {renderSection()}

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          size="lg"
          className="neural-glow"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileManagement;
