import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Brain, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const BlogNavigation: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isIndividualPost = useMemo(
    () =>
      location.pathname.startsWith("/blog/") && location.pathname !== "/blog",
    [location.pathname]
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleHomeClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleBackToBlog = useCallback(() => {
    navigate("/blog");
  }, [navigate]);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-lg border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={handleHomeClick}
            className="flex items-center space-x-2 group"
            aria-label="Navigate to home page"
          >
            <div className="w-8 h-8 bg-gradient-neural rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-space font-bold text-xl text-neural">
              DataFlow
            </span>
          </button>

          {/* Navigation Actions */}
          <div className="flex items-center space-x-4">
            {isIndividualPost && (
              <Button
                variant="ghost"
                onClick={handleBackToBlog}
                className="text-muted hover:text-secondary transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Back to Blog</span>
                <span className="sm:hidden">Blog</span>
              </Button>
            )}

            <Button
              variant="outline"
              onClick={handleHomeClick}
              className="neural-glow"
            >
              <Home className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BlogNavigation;
