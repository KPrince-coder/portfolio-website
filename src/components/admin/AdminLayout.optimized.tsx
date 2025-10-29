import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  useRef,
  ReactNode,
} from "react";

// ============================================================================
// Types and Interfaces
// ============================================================================

interface AdminLayoutContextValue {
  // Sidebar state
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;

  // Mobile state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;

  // Responsive state
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;

  // Additional state
  isTransitioning: boolean;
  storageAvailable: boolean;
  prefersReducedMotion: boolean;
  keyboardShortcuts: {
    toggleSidebar: string;
    closeMobileSidebar: string;
  };
}

interface AdminLayoutProps {
  children: ReactNode;
}

// ============================================================================
// Context
// ============================================================================

const AdminLayoutContext = createContext<AdminLayoutContextValue | undefined>(
  undefined
);

// ============================================================================
// Custom Hook for Context Access
// ============================================================================

/**
 * Hook to access the AdminLayout context
 * @throws Error if used outside of AdminLayoutProvider
 */
export const useAdminLayout = (): AdminLayoutContextValue => {
  const context = useContext(AdminLayoutContext);
  if (!context) {
    throw new Error("useAdminLayout must be used within AdminLayoutProvider");
  }
  return context;
};

// ============================================================================
// LocalStorage Utilities
// ============================================================================

const STORAGE_KEY = "admin-sidebar-collapsed";

/**
 * Safely retrieve sidebar collapsed state from localStorage
 * @returns boolean - collapsed state (defaults to false if unavailable)
 */
const getSavedSidebarState = (): { value: boolean; available: boolean } => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return { value: saved === "true", available: true };
  } catch (error) {
    console.warn("Failed to read sidebar state from localStorage:", error);
    return { value: false, available: false };
  }
};

/**
 * Safely save sidebar collapsed state to localStorage
 * @param collapsed - boolean state to save
 */
const saveSidebarState = (collapsed: boolean): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, String(collapsed));
    return true;
  } catch (error) {
    console.warn("Failed to save sidebar state to localStorage:", error);
    return false;
  }
};

// ============================================================================
// Custom Debounce Hook
// ============================================================================

/**
 * Custom hook for debouncing a callback function
 * @param callback - Function to debounce
 * @param delay - Milliseconds to wait
 * @returns Debounced function
 */
function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );
}

// ============================================================================
// Responsive Breakpoints
// ============================================================================

const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
} as const;

// ============================================================================
// AdminLayout Component
// ============================================================================

/**
 * AdminLayout - Root layout wrapper component for admin panel
 *
 * Features:
 * - Sidebar collapse state management (desktop)
 * - Mobile sidebar overlay state management
 * - Responsive breakpoint detection with matchMedia
 * - LocalStorage persistence for sidebar state
 * - Keyboard shortcuts (Ctrl+B, Escape)
 * - Accessibility features (reduced motion, focus management)
 * - Context provider for child components
 *
 * @param props.children - Child components to render
 */
export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  // ============================================================================
  // State Management
  // ============================================================================

  // Desktop sidebar collapsed state (persisted)
  const [sidebarCollapsed, setSidebarCollapsedState] = useState<boolean>(() => {
    const { value } = getSavedSidebarState();
    return value;
  });

  // Storage availability
  const [storageAvailable, setStorageAvailable] = useState<boolean>(() => {
    const { available } = getSavedSidebarState();
    return available;
  });

  // Mobile sidebar open state (session only)
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Transition state
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Responsive breakpoint state using matchMedia
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(true);

  // Reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] =
    useState<boolean>(false);

  // ============================================================================
  // Sidebar State Handlers
  // ============================================================================

  /**
   * Set sidebar collapsed state and persist to localStorage
   */
  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setIsTransitioning(true);
    setSidebarCollapsedState(collapsed);
    const saved = saveSidebarState(collapsed);
    setStorageAvailable(saved);

    // Reset transition state after animation
    setTimeout(() => setIsTransitioning(false), 300);
  }, []);

  /**
   * Toggle sidebar collapsed state
   */
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(!sidebarCollapsed);
  }, [sidebarCollapsed, setSidebarCollapsed]);

  /**
   * Open mobile sidebar overlay
   */
  const openMobileSidebar = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  /**
   * Close mobile sidebar overlay
   */
  const closeMobileSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // ============================================================================
  // Responsive Breakpoint Detection with matchMedia
  // ============================================================================

  useLayoutEffect(() => {
    // SSR safety check
    if (typeof window === "undefined") return;

    const mobileQuery = window.matchMedia(
      `(max-width: ${BREAKPOINTS.mobile - 1}px)`
    );
    const tabletQuery = window.matchMedia(
      `(min-width: ${BREAKPOINTS.mobile}px) and (max-width: ${
        BREAKPOINTS.tablet - 1
      }px)`
    );
    const desktopQuery = window.matchMedia(
      `(min-width: ${BREAKPOINTS.tablet}px)`
    );

    const updateBreakpoints = () => {
      setIsMobile(mobileQuery.matches);
      setIsTablet(tabletQuery.matches);
      setIsDesktop(desktopQuery.matches);
    };

    // Set initial state
    updateBreakpoints();

    // Modern browsers
    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener("change", updateBreakpoints);
      tabletQuery.addEventListener("change", updateBreakpoints);
      desktopQuery.addEventListener("change", updateBreakpoints);

      return () => {
        mobileQuery.removeEventListener("change", updateBreakpoints);
        tabletQuery.removeEventListener("change", updateBreakpoints);
        desktopQuery.removeEventListener("change", updateBreakpoints);
      };
    } else {
      // Safari < 14 fallback
      mobileQuery.addListener(updateBreakpoints);
      tabletQuery.addListener(updateBreakpoints);
      desktopQuery.addListener(updateBreakpoints);

      return () => {
        mobileQuery.removeListener(updateBreakpoints);
        tabletQuery.removeListener(updateBreakpoints);
        desktopQuery.removeListener(updateBreakpoints);
      };
    }
  }, []);

  // ============================================================================
  // Prefers Reduced Motion Detection
  // ============================================================================

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  // ============================================================================
  // CSS Custom Properties
  // ============================================================================

  useEffect(() => {
    if (typeof document === "undefined") return;

    document.documentElement.style.setProperty(
      "--sidebar-width",
      sidebarCollapsed ? "80px" : "280px"
    );
    document.documentElement.style.setProperty(
      "--sidebar-transition-duration",
      prefersReducedMotion ? "0ms" : "300ms"
    );
  }, [sidebarCollapsed, prefersReducedMotion]);

  // ============================================================================
  // Keyboard Shortcuts
  // ============================================================================

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+B (or Cmd+B on Mac) - Toggle sidebar (desktop only)
      if ((event.ctrlKey || event.metaKey) && event.key === "b" && !isMobile) {
        event.preventDefault();
        toggleSidebar();
      }

      // Escape - Close mobile sidebar
      if (event.key === "Escape" && sidebarOpen) {
        event.preventDefault();
        closeMobileSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleSidebar, sidebarOpen, closeMobileSidebar, isMobile]);

  // ============================================================================
  // Auto-close mobile sidebar when switching to desktop
  // ============================================================================

  useEffect(() => {
    if (isDesktop && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [isDesktop, sidebarOpen]);

  // ============================================================================
  // Context Value
  // ============================================================================

  const contextValue = useMemo<AdminLayoutContextValue>(
    () => ({
      // Sidebar state
      sidebarCollapsed,
      setSidebarCollapsed,
      toggleSidebar,

      // Mobile state
      sidebarOpen,
      setSidebarOpen,
      openMobileSidebar,
      closeMobileSidebar,

      // Responsive state
      isMobile,
      isTablet,
      isDesktop,

      // Additional state
      isTransitioning,
      storageAvailable,
      prefersReducedMotion,
      keyboardShortcuts: {
        toggleSidebar: isMobile ? "" : "Ctrl+B",
        closeMobileSidebar: "Escape",
      },
    }),
    [
      sidebarCollapsed,
      setSidebarCollapsed,
      toggleSidebar,
      sidebarOpen,
      openMobileSidebar,
      closeMobileSidebar,
      isMobile,
      isTablet,
      isDesktop,
      isTransitioning,
      storageAvailable,
      prefersReducedMotion,
    ]
  );

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <AdminLayoutContext.Provider value={contextValue}>
      <div
        className="admin-layout min-h-screen bg-background"
        role="main"
        aria-label="Admin panel layout"
      >
        {children}
      </div>
    </AdminLayoutContext.Provider>
  );
};

export default AdminLayout;
