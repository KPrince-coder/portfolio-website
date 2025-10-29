import React, { useMemo } from "react";
import AboutSkeleton from "./AboutSkeleton";
import AboutHeader from "./AboutHeader";
import ProfileCard from "./ProfileCard";
import ExperienceTimeline from "./ExperienceTimeline";
import ImpactMetricsCard from "./ImpactMetricsCard";
import PhilosophyCard from "./PhilosophyCard";
import { useProfile } from "./hooks/useProfile";
import { generateStructuredData } from "./utils/structuredData";
import type { Experience, ImpactMetric } from "./types";

/**
 * About Component
 * Main component that orchestrates all about section sub-components
 * Follows DRY and modular design principles
 */
const About: React.FC = () => {
  const { profile, loading } = useProfile();

  // Memoized computed values
  const experiences = useMemo(
    () => (profile?.experiences as Experience[]) || [],
    [profile?.experiences]
  );

  const achievements = useMemo(
    () => (profile?.impact_metrics as ImpactMetric[]) || [],
    [profile?.impact_metrics]
  );

  const aboutTitle = useMemo(
    () => profile?.about_title || "About",
    [profile?.about_title]
  );

  const aboutDescription = useMemo(
    () => profile?.about_description || "Loading...",
    [profile?.about_description]
  );

  const philosophyQuote = useMemo(
    () => profile?.philosophy_quote || "",
    [profile?.philosophy_quote]
  );

  const philosophyAuthor = useMemo(
    () => profile?.philosophy_author || "",
    [profile?.philosophy_author]
  );

  const fullName = useMemo(
    () => profile?.full_name || "Alex",
    [profile?.full_name]
  );

  const avatarUrl = useMemo(
    () => profile?.avatar_url || null,
    [profile?.avatar_url]
  );

  const bio = useMemo(() => profile?.bio || null, [profile?.bio]);

  const location = useMemo(
    () => profile?.location || null,
    [profile?.location]
  );

  const highlights = useMemo(
    () => profile?.about_highlights || [],
    [profile?.about_highlights]
  );

  // Generate structured data for SEO
  const structuredData = useMemo(
    () =>
      generateStructuredData(
        profile,
        fullName,
        bio,
        aboutDescription,
        avatarUrl,
        location
      ),
    [profile, fullName, bio, aboutDescription, avatarUrl, location]
  );

  if (loading) {
    return <AboutSkeleton />;
  }

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <section
        id="about"
        className="py-20 bg-gradient-to-b from-background to-background/50"
        aria-labelledby="about-heading"
      >
        <div className="container mx-auto px-6">
          <AboutHeader
            title={aboutTitle}
            fullName={fullName}
            description={aboutDescription}
          />

          {avatarUrl && (
            <ProfileCard
              avatarUrl={avatarUrl}
              fullName={fullName}
              location={location}
              bio={bio}
              highlights={highlights}
            />
          )}

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <ExperienceTimeline experiences={experiences} />

            <aside className="space-y-8">
              <ImpactMetricsCard metrics={achievements} />
              {philosophyQuote && (
                <PhilosophyCard
                  quote={philosophyQuote}
                  author={philosophyAuthor || fullName}
                />
              )}
            </aside>
          </div>
        </div>
      </section>
    </>
  );
};

export default React.memo(About);
