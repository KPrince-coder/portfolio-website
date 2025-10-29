import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import SkillsList from "../SkillsList";
import SkillForm from "../SkillForm";
import { useSkills } from "../hooks/useSkills";
import type { Skill } from "../types";

/**
 * SkillsListSection Component
 * Manages the list of skills with CRUD operations
 */
const SkillsListSection: React.FC = () => {
  const { skills, loading, createSkill, updateSkill, deleteSkill } =
    useSkills();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingSkill(null);
  };

  const handleSave = async (
    ...args: any[]
  ): Promise<{ data: any; error: Error | null }> => {
    try {
      let result;
      if (editingSkill) {
        result = await updateSkill(args[0], args[1]);
      } else {
        result = await createSkill(args[0]);
      }
      handleClose();
      return result;
    } catch (error) {
      console.error("Error saving skill:", error);
      return { data: null, error: error as Error };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Skills</h2>
          <p className="text-muted-foreground mt-2">
            Manage your technical skills and proficiency levels
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
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
        />
      )}
    </div>
  );
};

export default SkillsListSection;
