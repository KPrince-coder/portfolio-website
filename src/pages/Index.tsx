import React, { lazy, Suspense, useEffect } from "react";
import ParticleSystem from "@/components/ParticleSystem";
import Navigation from "@/components/Navigation";
import Hero from "@/components/hero";

// Lazy load below-the-fold components for better performance
const About = lazy(() => import("@/components/about"));
const Skills = lazy(() => import("@/components/skills"));
const Projects = lazy(() =>
  import("@/components/projects").then((module) => ({
    default: module.Projects,
  }))
);
const Resume = lazy(() => import("@/components/Resume"));
const Contact = lazy(() => import("@/components/Contact"));

const Index: React.FC = () => {
  // Set page metadata for SEO
  useEffect(() => {
    document.title = "Alex Neural - AI Engineer & Data Scientist | Portfolio";

    // Update meta description if it exists
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Portfolio of Alex Neural - AI Engineer, Data Scientist, and Full-Stack Developer specializing in machine learning, data engineering, and scalable web applications."
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Particle Background */}
      <ParticleSystem />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main>
        <Hero />
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <About />
          <Skills />
          <Projects />
          <Resume />
          <Contact />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="bg-primary/5 border-t border-border py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            © 2024 Alex Neural. Crafted with ❤️ using React, TypeScript & AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
