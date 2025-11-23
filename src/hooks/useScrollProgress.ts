import { useState, useEffect } from "react";

/**
 * Custom hook to track scroll progress as a percentage
 * Useful for progress bars and scroll indicators
 *
 * @returns Scroll progress as a number between 0 and 100
 */
export const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const calculateScrollProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      const totalScrollableHeight = documentHeight - windowHeight;
      const progress = (scrollTop / totalScrollableHeight) * 100;

      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    // Calculate on mount
    calculateScrollProgress();

    // Update on scroll
    window.addEventListener("scroll", calculateScrollProgress, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", calculateScrollProgress);
    };
  }, []);

  return scrollProgress;
};
