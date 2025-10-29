import React from "react";
import { Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PhilosophyCardProps {
  quote: string;
  author: string;
}

/**
 * PhilosophyCard Component
 * Displays philosophy quote with decorative elements
 */
const PhilosophyCard: React.FC<PhilosophyCardProps> = ({ quote, author }) => {
  return (
    <Card className="card-neural neural-glow">
      <CardContent className="p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Award className="w-6 h-6 text-accent" aria-hidden="true" />
          <h3 className="text-xl font-semibold">Philosophy</h3>
        </div>
        <blockquote className="text-lg italic text-muted-foreground leading-relaxed border-l-4 border-secondary pl-6">
          "{quote}"
        </blockquote>
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
          <div className="text-sm text-muted">
            <div className="font-semibold text-foreground">{author}</div>
            <div>Data & AI Engineer</div>
          </div>
          <div className="flex space-x-2" aria-hidden="true">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
            <div
              className="w-2 h-2 bg-accent rounded-full animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="w-2 h-2 bg-success rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(PhilosophyCard);
