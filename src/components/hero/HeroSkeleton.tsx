import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import HeroBackground from "./HeroBackground";
import ScrollIndicator from "./ScrollIndicator";

/**
 * HeroSkeleton Component
 * Loading skeleton for the Hero section
 */
const HeroSkeleton: React.FC = () => {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-busy="true"
      aria-label="Loading hero section"
    >
      <HeroBackground />

      {/* Content Skeleton */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <div className="space-y-8">
          {/* Title Skeleton */}
          <Skeleton className="h-20 w-96 mx-auto" />

          {/* Subtitle Skeleton */}
          <div className="h-20 flex items-center justify-center">
            <Skeleton className="h-10 w-[600px]" />
          </div>

          {/* Description Skeleton */}
          <div className="space-y-3 max-w-3xl mx-auto">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-4/5 mx-auto" />
          </div>

          {/* CTA and Social Links Skeleton */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Skeleton className="h-14 w-48" />
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-10 rounded-md" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
};

export default React.memo(HeroSkeleton);
