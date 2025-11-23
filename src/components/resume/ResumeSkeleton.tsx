import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * ResumeSkeleton Component
 * Loading skeleton for resume section
 */
const ResumeSkeleton: React.FC = () => {
  return (
    <section className="py-20 bg-card/50">
      <div className="container mx-auto px-6">
        {/* Header Skeleton */}
        <div className="text-center mb-16 animate-pulse">
          <div className="h-10 bg-muted rounded w-64 mx-auto mb-4" />
          <div className="h-6 bg-muted rounded w-96 mx-auto mb-8" />
          <div className="h-12 bg-muted rounded w-48 mx-auto" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-8">
            {[1, 2].map((i) => (
              <Card key={i} className="card-neural">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-48 animate-pulse" />
                </CardHeader>
                <CardContent className="space-y-6">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="space-y-3 animate-pulse">
                      <div className="h-5 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                      <div className="h-4 bg-muted rounded w-full" />
                      <div className="h-4 bg-muted rounded w-5/6" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="card-neural">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-32 animate-pulse" />
                </CardHeader>
                <CardContent className="space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="h-4 bg-muted rounded animate-pulse"
                    />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeSkeleton;
