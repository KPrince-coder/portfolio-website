import React, { useState, useEffect } from 'react';
import { Menu, X, Code, Brain, Briefcase, User, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { icon: User, label: 'About', href: '#about' },
    { icon: Brain, label: 'Skills', href: '#skills' },
    { icon: Briefcase, label: 'Projects', href: '#projects' },
    { icon: Code, label: 'Blog', href: '#blog' },
    { icon: MessageSquare, label: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-background/90 backdrop-blur-lg border-b border-border' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-neural rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-space font-bold text-xl text-neural">DataFlow</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="flex items-center space-x-2 text-muted hover:text-secondary transition-colors duration-200 group"
              >
                <item.icon className="w-4 h-4 group-hover:text-secondary" />
                <span>{item.label}</span>
              </button>
            ))}
            <Button variant="outline" className="neural-glow">
              <MessageSquare className="w-4 h-4 mr-2" />
              Let's Connect
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border">
            <div className="px-6 py-4 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="flex items-center space-x-3 w-full text-left text-muted hover:text-secondary transition-colors duration-200"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
              <Button variant="outline" className="w-full neural-glow">
                <MessageSquare className="w-4 h-4 mr-2" />
                Let's Connect
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;