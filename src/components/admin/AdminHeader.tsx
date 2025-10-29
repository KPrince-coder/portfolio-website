import React from "react";
import { Shield, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminHeaderProps } from "./types";
import { useAdminLayout } from "./AdminLayout";
import { cn } from "@/lib/utils";

/**
 * AdminHeader - Fixed header component for admin panel
 *
 * Features:
 * - Fixed positioning at viewport top (z-index: 50)
 * - Consistent 64px height across all screen sizes
 * - Mobile menu button (visible only on screens <1024px)
 * - Full viewport width
 * - User controls and branding
 *
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 4.2
 */
const AdminHeader: React.FC<AdminHeaderProps> = ({ user, onSignOut }) => {
  const { openMobileSidebar, isMobile, isTablet } = useAdminLayout();

  // Show mobile menu button on mobile and tablet (< 1024px)
  const showMobileMenu = isMobile || isTablet;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background border-b border-border">
      <div className="h-full px-4 sm:px-6">
        <div className="flex items-center justify-between h-full">
          {/* Left section: Mobile menu + Branding */}
          <div className="flex items-center space-x-3">
            {/* Mobile menu button - visible only on screens < 1024px */}
            {showMobileMenu && (
              <Button
                variant="ghost"
                size="icon"
                onClick={openMobileSidebar}
                aria-label="Open navigation menu"
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}

            {/* Branding */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-neural rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">Portfolio CMS</p>
              </div>
            </div>
          </div>

          {/* Right section: User controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="text-sm text-muted-foreground hidden md:inline">
              {user.email}
            </span>
            <Button variant="outline" size="sm" onClick={onSignOut}>
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
