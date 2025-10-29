import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SkillsList from "./SkillsList";
import SkillForm from "./SkillForm";
import LearningGoalsList from "./LearningGoalsList";
import LearningGoalForm from "./LearningGoalForm";
import { useSkills } from "./hooks/useSkills";
import { useLearningGoals } from "./hooks/useLearningGoals";
import type { Skill, LearningGoal } from "./types";

/**
 * SkillsManagement Component
 * Main component for managing skills and learning goals in the admin panel
 */
const SkillsManagement: React.FC = () => {
  const {
    skills,
    loading: skillsLoading,
    createSkill,
    updateSkill,
    deleteSkill,
  } = useSkills();
  const {
    goals,
    loading: goalsLoading,
    createGoal,
    updateGoal,
    deleteGoal,
  } = useLearningGoals();

  const [isSkillFormOpen, setIsSkillFormOpen] = useState(false);
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [editingGoal, setEditingGoal] = useState<LearningGoal | null>(null);

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setIsSkillFormOpen(true);
  };

  const handleEditGoal = (goal: LearningGoal) => {
    setEditingGoal(goal);
    setIsGoalFormOpen(true);
  };

  const handleCloseSkillForm = () => {
    setIsSkillFormOpen(false);
    setEditingSkill(null);
  };

  const handleCloseGoalForm = () => {
    setIsGoalFormOpen(false);
    setEditingGoal(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Skills Management</h2>
          <p className="text-muted-foreground mt-2">
            Manage your technical skills and learning goals
          </p>
        </div>
      </div>

      <Tabs defaultValue="skills" className="space-y-6">
        <TabsList>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="learning-goals">Learning Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => setIsSkillFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </div>

          <SkillsList
            skills={skills}
            loading={skillsLoading}
            onEdit={handleEditSkill}
            onDelete={deleteSkill}
          />

          {isSkillFormOpen && (
            <SkillForm
              skill={editingSkill}
              onClose={handleCloseSkillForm}
              onSave={editingSkill ? updateSkill : createSkill}
            />
          )}
        </TabsContent>

        <TabsContent value="learning-goals" className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => setIsGoalFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Learning Goal
            </Button>
          </div>

          <LearningGoalsList
            goals={goals}
            loading={goalsLoading}
            onEdit={handleEditGoal}
            onDelete={deleteGoal}
          />

          {isGoalFormOpen && (
            <LearningGoalForm
              goal={editingGoal}
              onClose={handleCloseGoalForm}
              onSave={editingGoal ? updateGoal : createGoal}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SkillsManagement;
