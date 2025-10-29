import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { LearningGoal } from "./types";

interface LearningGoalsCardProps {
  goals: LearningGoal[];
}

const STATUS_LABELS = {
  learning: "Currently learning",
  exploring: "Exploring",
  researching: "Researching",
};

const STATUS_COLORS = {
  learning: "text-secondary",
  exploring: "text-accent",
  researching: "text-success",
};

/**
 * LearningGoalsCard Component
 * Displays active learning goals
 */
const LearningGoalsCard: React.FC<LearningGoalsCardProps> = ({ goals }) => {
  if (goals.length === 0) return null;

  return (
    <div className="mt-16 text-center">
      <Card className="card-neural max-w-4xl mx-auto">
        <CardContent className="p-8">
          <h3 className="heading-md mb-6">Continuous Learning</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            The field of AI and data engineering evolves rapidly. I dedicate
            time each week to exploring new frameworks, contributing to open
            source projects, and experimenting with cutting-edge technologies.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className={`flex items-center space-x-2 text-sm ${
                  STATUS_COLORS[goal.status]
                }`}
              >
                <div
                  className={`w-2 h-2 ${goal.color} rounded-full animate-pulse`}
                ></div>
                <span>
                  {STATUS_LABELS[goal.status]}: {goal.title}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningGoalsCard;
