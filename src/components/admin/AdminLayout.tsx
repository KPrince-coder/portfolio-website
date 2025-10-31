import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { announceToScreenReader } from "@/hooks/useScreenReaderAnnouncement";

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
const getSavedSidebarState = (): boolean => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "true";
  } catch (error) {
    console.warn("Failed to read sidebar state from localStorage:", error);
    return false; // Default to expanded
  }
};

/**
 * Safely save sidebar collapsed state to localStorage
 * @param collapsed - boolean state to save
 */
const saveSidebarState = (collapsed: boolean): void => {
  try {
    localStorage.setItem(STORAGE_KEY, String(collapsed));
  } catch (error) {
    console.warn("Failed to save sidebar state to localStorage:", error);
  }
};

// ============================================================================
// Debounce Utility
// ============================================================================

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * @param func - Function to debounce
 * @param wait - Milliseconds to wait
 * @returns Debounced function
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// ============================================================================
// Responsive Breakpoints
// ============================================================================

const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
} as const;

/**
 * Determine responsive state based on window width
 * @param width - Current window width
 * @returns Object with isMobile, isTablet, isDesktop flags
 */
const getResponsiveState = (width: number) => ({
  isMobile: width < BREAKPOINTS.mobile,
  isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet,
  isDesktop: width >= BREAKPOINTS.tablet,
});

// ============================================================================
// AdminLayout Component
// ============================================================================

/**
 * AdminLayout - Root layout wrapper component for admin panel
 *
 * Features:
 * - Sidebar collapse state management (desktop)
 * - Mobile sidebar overlay state management
 * - Responsive breakpoint detection
 * - LocalStorage persistence for sidebar state
 * - Keyboard shortcuts (Ctrl+B, Escape)
 * - Context provider for child components
 *
 * @param props.children - Child components to render
 */
export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  // ============================================================================
  // State Management
  // ============================================================================

  // Desktop sidebar collapsed state (persisted)
  const [sidebarCollapsed, setSidebarCollapsedState] = useState<boolean>(() =>
    getSavedSidebarState()
  );

  // Mobile sidebar open state (session only)
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Responsive breakpoint state
  const [windowWidth, setWindowWidth] = useState<number>(() => {
    // SSR safety check
    if (typeof window !== "undefined") {
      return window.innerWidth;
    }
    return BREAKPOINTS.tablet; // Default to desktop for SSR
  });

  // ============================================================================
  // Derived State
  // ============================================================================

  const { isMobile, isTablet, isDesktop } = useMemo(
    () => getResponsiveState(windowWidth),
    [windowWidth]
  );

  // ============================================================================
  // Sidebar State Handlers
  // ============================================================================

  /**
   * Set sidebar collapsed state and persist to localStorage
   */
  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setSidebarCollapsedState(collapsed);
    saveSidebarState(collapsed);

    // Announce state change to screen readers
    announceToScreenReader(
      collapsed ? "Sidebar collapsed" : "Sidebar expanded",
      "polite"
    );
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
    announceToScreenReader("Navigation menu opened", "polite");
  }, []);

  /**
   * Close mobile sidebar overlay
   */
  const closeMobileSidebar = useCallback(() => {
    setSidebarOpen(false);
    announceToScreenReader("Navigation menu closed", "polite");
  }, []);

  // ============================================================================
  // Responsive Breakpoint Detection
  // ============================================================================

  useEffect(() => {
    // SSR safety check
    if (typeof window === "undefined") return;

    // Debounced resize handler (150ms delay)
    const handleResize = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 150);

    // Set initial width
    setWindowWidth(window.innerWidth);

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // ============================================================================
  // Keyboard Shortcuts
  // ============================================================================

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+B (or Cmd+B on Mac) - Toggle sidebar
      if ((event.ctrlKey || event.metaKey) && event.key === "b") {
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
  }, [toggleSidebar, sidebarOpen, closeMobileSidebar]);

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
    ]
  );

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <AdminLayoutContext.Provider value={contextValue}>
      <div className="admin-layout min-h-screen bg-background">{children}</div>
    </AdminLayoutContext.Provider>
  );
};

export default AdminLayout;
