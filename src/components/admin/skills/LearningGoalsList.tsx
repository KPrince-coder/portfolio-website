import React from "react";
import { Edit, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LearningGoal } from "./types";

interface LearningGoalsListProps {
  goals: LearningGoal[];
  loading: boolean;
  onEdit: (goal: LearningGoal) => void;
  onDelete: (id: string) => Promise<{ error: Error | null }>;
}

const STATUS_LABELS = {
  learning: "Learning",
  exploring: "Exploring",
  researching: "Researching",
};

/**
 * LearningGoalsList Component
 * Displays a list of learning goals with edit and delete actions
 */
const LearningGoalsList: React.FC<LearningGoalsListProps> = ({
  goals,
  loading,
  onEdit,
  onDelete,
}) => {
  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      const { error } = await onDelete(id);
      if (error) {
        alert(`Error deleting learning goal: ${error.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-muted-foreground">Loading learning goals...</p>
        </div>
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            No learning goals found. Add your first learning goal to get
            started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {goals.map((goal) => (
        <Card key={goal.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {goal.is_active && (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                  <Badge variant="secondary">
                    {STATUS_LABELS[goal.status]}
                  </Badge>
                </div>
                <h4 className="font-semibold text-lg">{goal.title}</h4>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => onEdit(goal)}>
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(goal.id, goal.title)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LearningGoalsList;
