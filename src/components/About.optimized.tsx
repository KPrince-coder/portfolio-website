import React, { useState, useEffect, useCallback, useMemo } from "react";
import * as Icons from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Experience {
  year: string;
  title: string;
  company: string;
  description: string;
  icon: string;
  color: string;
}

interface ImpactMetric {
  label: string;
  value: string;
}

interface ProfileData {
  full_name: string | null;
  about_title: string | null;
  about_description: string | null;
  about_highlights: string[] | null;
  experiences: unknown;
  impact_metrics: unknown;
  philosophy_quote: string | null;
  philosophy_author: string | null;
}

const About: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "full_name, about_title, about_description, about_highlights, experiences, impact_metrics, philosophy_quote, philosophy_author"
        )
        .single();

      if (error) throw error;
      setProfile(data as ProfileData);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const getIcon = useCallback((iconName: string) => {
    const Icon = (Icons as any)[iconName] || Icons.Briefcase;
    return Icon;
  }, []);

  // Memoized fallback data
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

  const MapPin = Icons.MapPin;
  const Award = Icons.Award;

  if (loading) {
    return (
      <section
        id="about"
        className="py-20 bg-gradient-to-b from-background to-background/50"
      >
        <div className="container mx-auto px-6">
          <div
            className="flex items-center justify-center py-20"
            role="status"
            aria-live="polite"
          >
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
              <p className="text-muted-foreground">Loading about section...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-b from-background to-background/50"
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto px-6">
        <header className="text-center mb-16">
          <h2 id="about-heading" className="heading-xl mb-6">
            {aboutTitle} <span className="text-neural">{fullName}</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-secondary mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {aboutDescription}
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Experience Timeline */}
          <article className="space-y-8">
            <h3 className="heading-md text-center lg:text-left mb-8">
              Professional Journey
            </h3>
            <div
              className="relative"
              role="list"
              aria-label="Professional experience timeline"
            >
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary via-accent to-success"></div>

              {experiences.map((exp, index) => {
                const IconComponent = getIcon(exp.icon);
                return (
                  <div
                    key={index}
                    className="relative flex items-start space-x-6 pb-8 last:pb-0"
                    role="listitem"
                  >
                    <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-neural flex items-center justify-center shadow-glow-secondary">
                      <IconComponent
                        className={`w-8 h-8 ${exp.color}`}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="flex-1 pt-2">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-mono text-secondary bg-secondary/10 px-3 py-1 rounded-full">
                          {exp.year}
                        </span>
                        <MapPin
                          className="w-4 h-4 text-muted"
                          aria-hidden="true"
                        />
                      </div>
                      <h4 className="text-xl font-semibold text-foreground mb-1">
                        {exp.title}
                      </h4>
                      <p className="text-secondary font-medium mb-2">
                        {exp.company}
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          {/* Stats & Philosophy */}
          <aside className="space-y-8">
            <Card className="card-neural neural-glow">
              <CardContent className="p-8">
                <h3 className="heading-md text-center mb-8">Impact Metrics</h3>
                <div
                  className="grid grid-cols-2 gap-6"
                  role="list"
                  aria-label="Impact metrics"
                >
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="text-center p-4 rounded-lg bg-background/50"
                      role="listitem"
                    >
                      <div className="text-3xl font-bold text-neural mb-2">
                        {achievement.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {achievement.label}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {philosophyQuote && (
              <Card className="card-neural neural-glow">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <Award className="w-6 h-6 text-accent" aria-hidden="true" />
                    <h3 className="text-xl font-semibold">Philosophy</h3>
                  </div>
                  <blockquote className="text-lg italic text-muted-foreground leading-relaxed border-l-4 border-secondary pl-6">
                    "{philosophyQuote}"
                  </blockquote>
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                    <div className="text-sm text-muted">
                      <div className="font-semibold text-foreground">
                        {philosophyAuthor || fullName}
                      </div>
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
            )}
          </aside>
        </div>
      </div>
    </section>
  );
};

export default React.memo(About);
