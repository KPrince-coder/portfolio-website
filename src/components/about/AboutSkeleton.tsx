import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * AboutSkeleton Component
 *
 * Provides a structured skeleton loader for the About section that:
 * - Mirrors the actual content layout for better UX
 * - Uses semantic HTML for accessibility
 * - Optimized for performance with minimal re-renders
 * - SEO-friendly with proper ARIA attributes
 */
const AboutSkeleton: React.FC = () => {
  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-b from-background to-background/50"
      aria-labelledby="about-heading"
      aria-busy="true"
    >
      <div className="container mx-auto px-6">
        {/* Header Skeleton */}
        <header className="text-center mb-16">
          <div className="flex justify-center items-center gap-3 mb-6">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-24" />
          </div>
          <Skeleton className="w-24 h-1 mx-auto mb-8" />
          <div className="max-w-3xl mx-auto space-y-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6 mx-auto" />
          </div>
        </header>

        {/* Avatar and Bio Card Skeleton */}
        <div className="mb-16">
          <Card className="card-neural neural-glow max-w-5xl mx-auto">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-[minmax(280px,320px)_1fr] lg:grid-cols-[minmax(320px,380px)_1fr] xl:grid-cols-[minmax(400px,460px)_1fr] 2xl:grid-cols-[minmax(480px,540px)_1fr] gap-0">
                {/* Avatar Side Skeleton */}
                <div className="relative bg-gradient-to-br from-secondary/20 via-accent/20 to-neural/20 p-8 flex items-center justify-center">
                  <div className="relative">
                    {/* Decorative rings */}
                    <div className="absolute inset-0 rounded-full bg-gradient-neural opacity-20 blur-xl animate-pulse"></div>
                    <div className="absolute -inset-4 rounded-full border-2 border-secondary/30"></div>
                    <div className="absolute -inset-8 rounded-full border border-accent/20"></div>

                    {/* Avatar Skeleton */}
                    <Skeleton className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-80 xl:h-80 2xl:w-96 2xl:h-96 rounded-full" />
                  </div>
                </div>

                {/* Info Side Skeleton */}
                <div className="p-8 flex flex-col justify-center space-y-6">
                  {/* Name */}
                  <div className="flex items-center space-x-2">
                    <Skeleton className="w-5 h-5 rounded" />
                    <Skeleton className="h-8 w-40" />
                  </div>

                  {/* Location */}
                  <div className="flex items-center space-x-2">
                    <Skeleton className="w-4 h-4 rounded" />
                    <Skeleton className="h-5 w-32" />
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-4/5" />
                  </div>

                  {/* Highlights */}
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-32" />
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-start space-x-2">
                          <Skeleton className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Experience Timeline Skeleton */}
          <article className="space-y-8">
            <Skeleton className="h-10 w-64 mx-auto lg:mx-0" />
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary via-accent to-success opacity-30"></div>

              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="relative flex items-start space-x-6 pb-8 last:pb-0"
                >
                  <Skeleton className="relative z-10 w-16 h-16 rounded-full flex-shrink-0" />

                  <div className="flex-1 pt-2 space-y-3">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="w-4 h-4 rounded" />
                    </div>
                    <Skeleton className="h-7 w-3/4" />
                    <Skeleton className="h-5 w-1/2" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* Stats & Philosophy Skeleton */}
          <aside className="space-y-8">
            {/* Impact Metrics Card Skeleton */}
            <Card className="card-neural neural-glow">
              <CardContent className="p-8">
                <Skeleton className="h-10 w-48 mx-auto mb-8" />
                <div className="grid grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="text-center p-4 rounded-lg bg-background/50 space-y-3"
                    >
                      <Skeleton className="h-10 w-16 mx-auto" />
                      <Skeleton className="h-4 w-20 mx-auto" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Philosophy Card Skeleton */}
            <Card className="card-neural neural-glow">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Skeleton className="w-6 h-6 rounded" />
                  <Skeleton className="h-7 w-32" />
                </div>
                <div className="space-y-3 border-l-4 border-secondary pl-6">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-4/5" />
                </div>
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="w-2 h-2 rounded-full" />
                    <Skeleton className="w-2 h-2 rounded-full" />
                    <Skeleton className="w-2 h-2 rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default React.memo(AboutSkeleton);
