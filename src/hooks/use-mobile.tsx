import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Custom hook to detect if the viewport is mobile-sized
 * Uses matchMedia API for efficient viewport detection
 *
 * @returns {boolean} true if viewport width is below mobile breakpoint (768px)
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isMobile = useIsMobile();
 *   return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>;
 * }
 * ```
 */
export function useIsMobile() {
  // Initialize with false to prevent hydration mismatches
  // Will update to correct value after mount
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    // SSR safety check
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // Use matchMedia.matches for consistent logic
    const onChange = () => {
      setIsMobile(mql.matches);
    };

    // Set initial value
    setIsMobile(mql.matches);

    // Modern API with fallback for older browsers
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    } else {
      // Fallback for older browsers
      mql.addListener(onChange);
      return () => mql.removeListener(onChange);
    }
  }, []);

  return isMobile;
}
