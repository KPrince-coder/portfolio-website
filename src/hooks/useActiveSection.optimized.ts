import { useState, useEffect, useCallback, useMemo, useRef } from "react";

/**
 * Options for useActiveSection hook
 */
interface UseActiveSectionOptions extends IntersectionObserverInit {
  /**
   * Debounce delay in milliseconds for state updates
   * @default 50
   */
  debounceMs?: number;
}

/**
 * Custom hook to track which section is currently in view
 * Uses Intersection Observer API for efficient scroll tracking
 *
 * @param sectionIds - Array of section IDs to track (e.g., ['about', 'skills', 'projects'])
 * @param options - Intersection Observer options with optional debounce
 * @returns The ID of the currently active section
 *
 * @example
 * ```tsx
 * const SECTION_IDS = ['about', 'skills', 'projects'];
 *
 * function Navigation() {
 *   const activeSection = useActiveSection(SECTION_IDS);
 *
 *   return (
 *     <nav>
 *       {SECTION_IDS.map(id => (
 *         <a
 *           key={id}
 *           href={`#${id}`}
 *           className={activeSection === id ? 'active' : ''}
 *         >
 *           {id}
 *         </a>
 *       ))}
 *     </nav>
 *   );
 * }
 * ```
 */
export const useActiveSection = (
  sectionIds: string[],
  options?: UseActiveSectionOptions
): string => {
  const [activeSection, setActiveSection] = useState<string>("");
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Extract debounce option
  const { debounceMs = 50, ...observerOptions } = options || {};

  // Memoize sectionIds to prevent unnecessary re-observations
  const memoizedSectionIds = useMemo(() => sectionIds, [sectionIds.join(",")]);

  // Memoize options to prevent infinite loops
  const memoizedOptions = useMemo(
    () => observerOptions,
    [
      observerOptions.root,
      observerOptions.rootMargin,
      JSON.stringify(observerOptions.threshold),
    ]
  );

  // Set initial active section on mount
  useEffect(() => {
    if (memoizedSectionIds.length === 0) return;

    const sections = memoizedSectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    // Find which section is currently in view
    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      const isInView =
        rect.top < window.innerHeight / 2 &&
        rect.bottom > window.innerHeight / 2;

      if (isInView) {
        setActiveSection(section.id);
        break;
      }
    }
  }, []); // Only run on mount

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      // Find the section with the highest intersection ratio
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visibleSections.length > 0) {
        const mostVisible = visibleSections[0];
        const sectionId = mostVisible.target.id;

        // Debounce state updates to reduce re-renders during fast scrolling
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          setActiveSection(sectionId);
        }, debounceMs);
      }
    },
    [debounceMs]
  );

  useEffect(() => {
    // Early return if no sections to observe
    if (memoizedSectionIds.length === 0) {
      return;
    }

    // Check for Intersection Observer support
    if (!("IntersectionObserver" in window)) {
      console.warn(
        "IntersectionObserver not supported. Active section tracking disabled."
      );
      return;
    }

    const defaultOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "-20% 0px -35% 0px", // Trigger when section is in the middle of viewport
      threshold: [0, 0.25, 0.5, 0.75, 1],
      ...memoizedOptions,
    };

    const observer = new IntersectionObserver(
      handleIntersection,
      defaultOptions
    );

    // Observe all sections
    const sections = memoizedSectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    // Don't create observer if no sections found
    if (sections.length === 0) {
      console.warn(
        "useActiveSection: No sections found for IDs:",
        memoizedSectionIds
      );
      return;
    }

    sections.forEach((section) => observer.observe(section));

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [memoizedSectionIds, handleIntersection, memoizedOptions]);

  return activeSection;
};
