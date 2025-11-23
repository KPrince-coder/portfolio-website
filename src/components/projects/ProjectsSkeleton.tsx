import React from "react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * ProjectsSkeleton Component
 * Loading skeleton for the projects section
 */
const ProjectsSkeleton: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Header Skeleton */}
      <div className="text-center mb-16">
        <div className="h-12 w-64 bg-muted/50 rounded-lg mx-auto mb-6 animate-pulse"></div>
        <div className="w-24 h-1 bg-muted/50 mx-auto mb-8 animate-pulse"></div>
        <div className="h-6 w-96 bg-muted/50 rounded-lg mx-auto animate-pulse"></div>
      </div>

      {/* Category Filter Skeleton */}
      <div className="flex flex-wrap gap-3 justify-center mb-12">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-10 w-32 bg-muted/50 rounded-full animate-pulse"
          ></div>
        ))}
      </div>

      {/* Projects Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-48 bg-muted/50 animate-pulse"></div>
            <CardContent className="p-6 space-y-4">
              <div className="h-6 w-24 bg-muted/50 rounded animate-pulse"></div>
              <div className="h-8 w-full bg-muted/50 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-muted/50 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-muted/50 rounded animate-pulse"></div>
              <div className="flex gap-2">
                <div className="h-9 flex-1 bg-muted/50 rounded animate-pulse"></div>
                <div className="h-9 flex-1 bg-muted/50 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectsSkeleton;
