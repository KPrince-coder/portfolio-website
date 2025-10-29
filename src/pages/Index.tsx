import React from "react";
import ParticleSystem from "@/components/ParticleSystem";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/about";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Resume from "@/components/Resume";
import Contact from "@/components/Contact";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Particle Background */}
      <ParticleSystem />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Resume />

        <Contact />
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
