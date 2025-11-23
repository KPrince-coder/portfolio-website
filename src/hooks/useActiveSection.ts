import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook to track which section is currently in view
 * Uses Intersection Observer API for efficient scroll tracking
 *
 * @param sectionIds - Array of section IDs to track (e.g., ['about', 'skills', 'projects'])
 * @param options - Intersection Observer options
 * @returns The ID of the currently active section
 */
export const useActiveSection = (
  sectionIds: string[],
  options?: IntersectionObserverInit
) => {
  const [activeSection, setActiveSection] = useState<string>("");

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      // Check if we're at the very top of the page
      if (window.scrollY < 100) {
        setActiveSection("");
        return;
      }

      // Find the section with the highest intersection ratio
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visibleSections.length > 0) {
        const mostVisible = visibleSections[0];
        const sectionId = mostVisible.target.id;
        setActiveSection(sectionId);
      } else {
        // Clear active section when no sections are visible
        setActiveSection("");
      }
    },
    []
  );

  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "-20% 0px -35% 0px", // Trigger when section is in the middle of viewport
      threshold: [0, 0.25, 0.5, 0.75, 1],
      ...options,
    };

    const observer = new IntersectionObserver(
      handleIntersection,
      observerOptions
    );

    // Observe all sections
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    sections.forEach((section) => observer.observe(section));

    // Add scroll listener to detect when at top
    const handleScroll = () => {
      if (window.scrollY < 100) {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup
    return () => {
      sections.forEach((section) => observer.unobserve(section));
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sectionIds, handleIntersection, options]);

  return activeSection;
};
