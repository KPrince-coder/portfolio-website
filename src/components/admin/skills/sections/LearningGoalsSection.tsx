import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import LearningGoalsList from "../LearningGoalsList";
import LearningGoalForm from "../LearningGoalForm";
import { useLearningGoals } from "../hooks/useLearningGoals";
import type { LearningGoal } from "../types";

/**
 * LearningGoalsSection Component
 * Manages learning goals with CRUD operations
 */
const LearningGoalsSection: React.FC = () => {
  const { goals, loading, createGoal, updateGoal, deleteGoal } =
    useLearningGoals();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<LearningGoal | null>(null);

  const handleEdit = (goal: LearningGoal) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingGoal(null);
  };

  const handleSave = async (
    ...args: any[]
  ): Promise<{ data: any; error: Error | null }> => {
    try {
      let result;
      if (editingGoal) {
        result = await updateGoal(args[0], args[1]);
      } else {
        result = await createGoal(args[0]);
      }
      handleClose();
      return result;
    } catch (error) {
      console.error("Error saving goal:", error);
      return { data: null, error: error as Error };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Learning Goals</h2>
          <p className="text-muted-foreground mt-2">
            Track your learning journey and future goals
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Learning Goal
        </Button>
      </div>

      <LearningGoalsList
        goals={goals}
        loading={loading}
        onEdit={handleEdit}
        onDelete={deleteGoal}
      />

      {isFormOpen && (
        <LearningGoalForm
          goal={editingGoal}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default LearningGoalsSection;
