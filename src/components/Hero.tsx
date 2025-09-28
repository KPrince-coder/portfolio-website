import React, { useEffect, useState } from 'react';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBackground from '@/assets/hero-bg.jpg';

const Hero: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [typedText, setTypedText] = useState('');
  
  const fullText = 'Data & AI Engineer | Crafting Intelligent Systems';
  
  useEffect(() => {
    setMounted(true);
    
    let currentIndex = 0;
    const typeText = () => {
      if (currentIndex < fullText.length) {
        setTypedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeText, 80);
      }
    };
    
    setTimeout(typeText, 1000);
  }, []);

  const scrollToProjects = () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-96 h-96 rounded-full opacity-10 animate-float"
            style={{
              background: `radial-gradient(circle, hsl(191, 100%, 50%) 0%, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${6 + i}s`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="heading-hero mb-8">
            Alex Neural
          </h1>
          
          <div className="h-20 flex items-center justify-center mb-8">
            <p className="text-2xl md:text-3xl text-muted font-light">
              {typedText}
              <span className="animate-pulse text-secondary">|</span>
            </p>
          </div>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Transforming complex data into intelligent solutions that drive innovation. 
            Specializing in machine learning, neural networks, and scalable AI systems 
            that bridge the gap between data science and real-world applications.
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
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" className="neural-glow">
                <Github className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="neural-glow">
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="neural-glow">
                <Mail className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-secondary animate-bounce">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-6 h-10 border-2 border-secondary rounded-full relative">
            <div className="w-1 h-3 bg-secondary rounded-full absolute top-2 left-1/2 transform -translate-x-1/2 animate-pulse" />
          </div>
          <span className="text-xs uppercase tracking-wider">Scroll</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;