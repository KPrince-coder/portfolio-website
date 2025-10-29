import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { ImpactMetricsCardProps } from "./types";

/**
 * ImpactMetricsCard Component
 * Displays achievement metrics in a grid
 */
const ImpactMetricsCard: React.FC<ImpactMetricsCardProps> = ({ metrics }) => {
  return (
    <Card className="card-neural neural-glow">
      <CardContent className="p-8">
        <h3 className="heading-md text-center mb-8">Impact Metrics</h3>
        <div
          className="grid grid-cols-2 gap-6"
          role="list"
          aria-label="Impact metrics"
        >
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="text-center p-4 rounded-lg bg-background/50"
              role="listitem"
            >
              <div className="text-3xl font-bold text-neural mb-2">
                {metric.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(ImpactMetricsCard);
