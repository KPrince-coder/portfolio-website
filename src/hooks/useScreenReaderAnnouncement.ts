import { useEffect, useRef } from "react";

/**
 * Custom hook for screen reader announcements
 *
 * Creates a live region that announces messages to screen readers
 * without disrupting the visual UI
 *
 * @param message - Message to announce
 * @param politeness - ARIA live region politeness level
 */
export const useScreenReaderAnnouncement = (
  message: string,
  politeness: "polite" | "assertive" = "polite"
) => {
  const liveRegionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create live region if it doesn't exist
    if (!liveRegionRef.current) {
      const liveRegion = document.createElement("div");
      liveRegion.setAttribute("role", "status");
      liveRegion.setAttribute("aria-live", politeness);
      liveRegion.setAttribute("aria-atomic", "true");
      liveRegion.className = "sr-only";
      document.body.appendChild(liveRegion);
      liveRegionRef.current = liveRegion;
    }

    // Announce message
    if (message && liveRegionRef.current) {
      liveRegionRef.current.textContent = message;
    }

    // Cleanup on unmount
    return () => {
      if (liveRegionRef.current) {
        document.body.removeChild(liveRegionRef.current);
        liveRegionRef.current = null;
      }
    };
  }, [message, politeness]);
};

/**
 * Announce a message to screen readers
 * Useful for one-off announcements
 *
 * @param message - Message to announce
 * @param politeness - ARIA live region politeness level
 */
export const announceToScreenReader = (
  message: string,
  politeness: "polite" | "assertive" = "polite"
) => {
  const liveRegion = document.createElement("div");
  liveRegion.setAttribute("role", "status");
  liveRegion.setAttribute("aria-live", politeness);
  liveRegion.setAttribute("aria-atomic", "true");
  liveRegion.className = "sr-only";
  liveRegion.textContent = message;

  document.body.appendChild(liveRegion);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(liveRegion);
  }, 1000);
};
