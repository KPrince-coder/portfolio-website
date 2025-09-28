import React from 'react';
import ParticleSystem from '@/components/ParticleSystem';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';

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
        
        {/* Placeholder sections for future development */}
        <section id="projects" className="py-20 bg-gradient-to-b from-background to-background/50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="heading-xl mb-8">
              Featured <span className="text-neural">Projects</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Showcase of innovative AI and data engineering solutions coming soon...
            </p>
          </div>
        </section>
        
        <section id="blog" className="py-20 bg-background/50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="heading-xl mb-8">
              Tech <span className="text-neural">Insights</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Deep dives into AI, data engineering, and emerging technologies coming soon...
            </p>
          </div>
        </section>
        
        <section id="contact" className="py-20 bg-gradient-to-b from-background/50 to-background">
          <div className="container mx-auto px-6 text-center">
            <h2 className="heading-xl mb-8">
              Let's <span className="text-neural">Connect</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Ready to collaborate on your next AI project? Contact form and CMS coming soon...
            </p>
          </div>
        </section>
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