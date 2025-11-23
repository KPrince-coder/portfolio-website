import React, { useEffect } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types and Interfaces
// ============================================================================

export interface MobileSidebarBackdropProps {
  /** Whether the backdrop is visible */
  visible: boolean;
  /** Click handler for backdrop clicks */
  onClick: () => void;
  /** Optional z-index value (defaults to 55) */
  zIndex?: number;
  /** Optional additional CSS classes */
  className?: string;
}

// ============================================================================
// MobileSidebarBackdrop Component
// ============================================================================

/**
 * MobileSidebarBackdrop - Semi-transparent backdrop for mobile sidebar overlay
 *
 * Features:
 * - Semi-transparent backdrop with blur effect (backdrop-filter: blur(8px))
 * - Fade in/out animation (200ms ease-in-out)
 * - Click handler to close mobile sidebar
 * - Prevents body scroll when visible
 * - GPU-accelerated animations
 *
 * Requirements: 4.3, 4.4, 10.5
 */
export const MobileSidebarBackdrop: React.FC<MobileSidebarBackdropProps> = ({
  visible,
  onClick,
  zIndex = 55,
  className,
}) => {
  // Prevent body scroll when backdrop is visible
  useEffect(() => {
    if (visible) {
      // Save current scroll position
      const scrollY = window.scrollY;

      // Prevent scrolling
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      return () => {
        // Restore scrolling
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";

        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [visible]);

  // Don't render if not visible (for performance)
  if (!visible) {
    return null;
  }

  return (
    <div
      className={cn(
        // Positioning
        "fixed inset-0",
        // Backdrop styling
        "bg-black/30",
        // Blur effect with fallback
        "backdrop-blur-sm",
        // Animation
        "transition-opacity duration-200 ease-in-out",
        "animate-in fade-in",
        // GPU acceleration
        "will-change-[opacity]",
        "transform-gpu",
        // Cursor
        "cursor-pointer",
        // Custom classes
        className
      )}
      style={{ zIndex }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label="Close navigation menu"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    />
  );
};

export default MobileSidebarBackdrop;
