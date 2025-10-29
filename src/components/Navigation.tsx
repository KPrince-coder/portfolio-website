import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Code,
  Brain,
  Briefcase,
  User,
  MessageSquare,
  Shield,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useScrollProgress } from "@/hooks/useScrollProgress";

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Track active section
  const activeSection = useActiveSection([
    "about",
    "skills",
    "projects",
    "resume",
    "contact",
  ]);

  // Track scroll progress
  const scrollProgress = useScrollProgress();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { icon: User, label: "About", href: "#about", id: "about", isRoute: false },
    {
      icon: Brain,
      label: "Skills",
      href: "#skills",
      id: "skills",
      isRoute: false,
    },
    {
      icon: Briefcase,
      label: "Projects",
      href: "#projects",
      id: "projects",
      isRoute: false,
    },
    {
      icon: Code,
      label: "Resume",
      href: "#resume",
      id: "resume",
      isRoute: false,
    },
    { icon: FileText, label: "Blog", href: "/blog", id: "blog", isRoute: true },
    {
      icon: MessageSquare,
      label: "Contact",
      href: "#contact",
      id: "contact",
      isRoute: false,
    },
  ];

  const handleNavClick = (href: string, isRoute: boolean) => {
    if (isRoute) {
      navigate(href);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-lg border-b border-border"
          : "bg-transparent"
      }`}
    >
      {/* Scroll Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-muted/20">
        <div
          className="h-full bg-gradient-to-r from-secondary via-accent to-success transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
          role="progressbar"
          aria-valuenow={scrollProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Page scroll progress"
        />
      </div>

      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-neural rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-space font-bold text-xl text-neural">
              DataFlow
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href, item.isRoute)}
                  className={`relative flex items-center space-x-2 transition-all duration-300 group ${
                    isActive
                      ? "text-secondary font-semibold"
                      : "text-muted hover:text-secondary"
                  }`}
                >
                  <item.icon
                    className={`w-4 h-4 transition-all duration-300 ${
                      isActive
                        ? "text-secondary scale-110"
                        : "group-hover:text-secondary"
                    }`}
                  />
                  <span>{item.label}</span>
                  {/* Active indicator - animated underline */}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-secondary via-accent to-secondary animate-pulse" />
                  )}
                  {/* Glow effect for active item */}
                  {isActive && (
                    <span className="absolute inset-0 bg-secondary/10 rounded-lg blur-sm -z-10" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tablet/Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Tablet/Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border">
            <div className="px-6 py-4 space-y-4">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.href}
                    onClick={() => handleNavClick(item.href, item.isRoute)}
                    className={`relative flex items-center space-x-3 w-full text-left transition-all duration-300 ${
                      isActive
                        ? "text-secondary font-semibold"
                        : "text-muted hover:text-secondary"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 transition-all duration-300 ${
                        isActive ? "text-secondary scale-110" : ""
                      }`}
                    />
                    <span>{item.label}</span>
                    {/* Active indicator - side bar */}
                    {isActive && (
                      <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-secondary via-accent to-secondary rounded-r-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
