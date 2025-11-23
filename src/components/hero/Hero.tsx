import React, { useState, useEffect, useMemo } from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroBackground from "./HeroBackground";
import SocialLinks from "./SocialLinks";
import ScrollIndicator from "./ScrollIndicator";
import HeroSkeleton from "./HeroSkeleton";
import { useHeroData } from "./hooks/useHeroData";
import { useTypewriter } from "./hooks/useTypewriter";

/**
 * Hero Component
 * Main hero section with dynamic content from backend
 * Features typewriter effect, social links, and smooth animations
 */
const Hero: React.FC = () => {
  const { heroData, loading } = useHeroData();
  const [mounted, setMounted] = useState(false);

  // Memoized values with fallbacks
  const heroTitle = useMemo(
    () => heroData?.hero_title || heroData?.full_name || "Welcome",
    [heroData]
  );

  const heroSubtitle = useMemo(
    () =>
      heroData?.hero_subtitle ||
      "Data & AI Engineer | Crafting Intelligent Systems",
    [heroData]
  );

  const heroTagline = useMemo(
    () =>
      heroData?.hero_tagline ||
      "Transforming complex data into intelligent solutions that drive innovation. Specializing in machine learning, neural networks, and scalable AI systems that bridge the gap between data science and real-world applications.",
    [heroData]
  );

  // Typewriter effect for subtitle
  const { displayedText } = useTypewriter(heroSubtitle, 80, 1000);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToProjects = () => {
    document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return <HeroSkeleton />;
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <HeroBackground />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <div
          className={`transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h1 className="heading-hero mb-8">{heroTitle}</h1>

          <div className="h-20 flex items-center justify-center mb-8">
            <p className="text-2xl md:text-3xl text-muted font-light">
              {displayedText}
              <span className="animate-pulse text-secondary">|</span>
            </p>
          </div>

          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            {heroTagline}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Button
              onClick={scrollToProjects}
              size="lg"
              className="neural-glow text-lg px-8 py-4"
            >
              View My Work
              <ArrowDown className="ml-2 w-5 h-5 animate-bounce" />
            </Button>

            <SocialLinks
              githubUrl={heroData?.github_url}
              linkedinUrl={heroData?.linkedin_url}
              email={heroData?.email}
              websiteUrl={heroData?.website_url}
              twitterUrl={heroData?.twitter_url}
            />
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
};

export default React.memo(Hero);
