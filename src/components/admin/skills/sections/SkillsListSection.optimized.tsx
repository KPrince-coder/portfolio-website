import React, { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import SkillsList from "../SkillsList";
import SkillForm from "../SkillForm";
import { useSkills } from "../hooks/useSkills";
import type { Skill, SkillFormData } from "../types";

/**
 * SkillsListSection Component
 * Manages the list of skills with CRUD operations
 *
 * Features:
 * - Add, edit, and delete skills
 * - Loading states and error handling
 * - Toast notifications for user feedback
 * - Optimized with useCallback to prevent unnecessary re-renders
 */
const SkillsListSection: React.FC = () => {
  const { skills, loading, createSkill, updateSkill, deleteSkill } =
    useSkills();
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Opens the form to edit an existing skill
   */
  const handleEdit = useCallback((skill: Skill) => {
    setEditingSkill(skill);
    setIsFormOpen(true);
  }, []);

  /**
   * Closes the form and resets editing state
   */
  const handleClose = useCallback(() => {
    setIsFormOpen(false);
    setEditingSkill(null);
  }, []);

  /**
   * Saves a skill (create or update)
   */
  const handleSave = useCallback(
    async (skillData: Omit<Skill, "id" | "created_at" | "updated_at">) => {
      setIsSaving(true);

      try {
        let result;

        if (editingSkill) {
          result = await updateSkill(editingSkill.id, skillData);
        } else {
          result = await createSkill(skillData);
        }

        if (result.error) {
          toast({
            variant: "destructive",
            title: "Error saving skill",
            description: result.error.message,
          });
          return;
        }

        toast({
          title: editingSkill ? "Skill updated" : "Skill created",
          description: editingSkill
            ? "Your skill has been updated successfully"
            : "Your skill has been created successfully",
        });

        handleClose();
      } catch (error) {
        console.error("Error saving skill:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred while saving the skill",
        });
      } finally {
        setIsSaving(false);
      }
    },
    [editingSkill, updateSkill, createSkill, toast, handleClose]
  );

  return (
    <div
      className="space-y-6"
      role="region"
      aria-labelledby="skills-section-title"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 id="skills-section-title" className="text-3xl font-bold">
            Skills
          </h2>
          <p className="text-muted-foreground mt-2">
            Manage your technical skills and proficiency levels
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} aria-label="Add new skill">
          <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
          Add Skill
        </Button>
      </div>

      <SkillsList
        skills={skills}
        loading={loading}
        onEdit={handleEdit}
        onDelete={deleteSkill}
      />

      {isFormOpen && (
        <SkillForm
          skill={editingSkill}
          onClose={handleClose}
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

export default SkillsListSection;
