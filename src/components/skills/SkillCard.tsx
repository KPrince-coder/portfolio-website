import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getIcon } from "./utils";
import type { Skill } from "./types";

interface SkillCardProps {
  skill: Skill;
  index: number;
}

/**
 * SkillCard Component
 * Displays an individual skill with proficiency bar and details
 */
const SkillCard: React.FC<SkillCardProps> = ({ skill, index }) => {
  const SkillIcon = getIcon(skill.icon);

  return (
    <Card
      className="card-neural neural-glow group hover:scale-105 transition-all duration-300"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-gradient-neural`}>
              <SkillIcon className={`w-6 h-6 ${skill.color}`} />
            </div>
            <span className="text-lg">{skill.name}</span>
          </div>
          <span className="text-sm font-mono text-secondary">
            {skill.proficiency}%
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {skill.description}
        </p>

        {/* Proficiency Bar */}
        <div className="space-y-2">
          <div className="w-full bg-border rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-secondary rounded-full transition-all duration-1000 ease-out group-hover:shadow-glow-secondary"
              style={{
                width: `${skill.proficiency}%`,
                animation: `data-flow 3s ease-in-out infinite`,
                animationDelay: `${index * 0.2}s`,
              }}
            />
          </div>

          {/* Neural Network Visualization */}
          <div className="flex justify-between items-center pt-2">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    i < Math.floor(skill.proficiency / 20)
                      ? "bg-secondary shadow-glow-secondary"
                      : "bg-border"
                  }`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <div className="text-xs text-muted font-mono">Expert Level</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillCard;
