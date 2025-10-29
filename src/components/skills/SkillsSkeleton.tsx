import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * SkillsSkeleton Component
 * Loading skeleton for the Skills section
 */
const SkillsSkeleton: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Header Skeleton */}
      <div className="text-center space-y-4">
        <Skeleton className="h-12 w-64 mx-auto" />
        <Skeleton className="h-1 w-24 mx-auto" />
        <Skeleton className="h-20 w-full max-w-3xl mx-auto" />
      </div>

      {/* Category Filter Skeleton */}
      <div className="flex flex-wrap justify-center gap-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-32" />
        ))}
      </div>

      {/* Skills Grid Skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="card-neural">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-5 w-12" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-2 w-full rounded-full" />
              <div className="flex justify-between items-center">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, j) => (
                    <Skeleton key={j} className="w-2 h-2 rounded-full" />
                  ))}
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SkillsSkeleton;
