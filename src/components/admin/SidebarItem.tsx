import React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// ============================================================================
// Types and Interfaces
// ============================================================================

export interface SidebarItemProps {
  /** Icon component to display */
  icon: LucideIcon;
  /** Label text for the navigation item */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Whether the sidebar is collapsed (icon-only mode) */
  collapsed?: boolean;
  /** Whether this item is currently active */
  active?: boolean;
  /** Optional badge count for notifications */
  badge?: number;
  /** Optional variant for the button */
  variant?: "default" | "ghost" | "secondary";
  /** Optional size for the button */
  size?: "default" | "sm" | "lg" | "icon";
  /** Optional additional CSS classes */
  className?: string;
  /** Optional title attribute (overrides tooltip) */
  title?: string;
}

// ============================================================================
// SidebarItem Component
// ============================================================================

/**
 * SidebarItem - Individual navigation item with collapse support
 *
 * Features:
 * - Icon display (always visible)
 * - Label display (fades with collapse state)
 * - Tooltip when sidebar is collapsed
 * - Active state styling using Neural Theme colors
 * - Hover states with consistent transitions (200ms)
 * - Optional badge display for notifications
 *
 * Requirements: 3.3, 3.4, 6.1, 6.2, 6.3, 10.3
 */
export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  onClick,
  collapsed = false,
  active = false,
  badge,
  variant,
  size = "default",
  className,
  title,
}) => {
  // Determine button variant based on active state
  const buttonVariant = variant || (active ? "default" : "ghost");

  // Button content
  const buttonContent = (
    <Button
      variant={buttonVariant}
      size={size}
      className={cn(
        "w-full transition-all duration-200",
        collapsed ? "justify-center px-0" : "justify-start",
        className
      )}
      onClick={onClick}
      title={!collapsed ? title : undefined}
    >
      {/* Icon - always visible */}
      <Icon className={cn("w-4 h-4 flex-shrink-0", !collapsed && "mr-2")} />

      {/* Label - fades out when collapsed */}
      <span
        className={cn(
          "transition-opacity duration-200",
          collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
        )}
      >
        {label}
      </span>

      {/* Badge - fades out when collapsed */}
      {badge !== undefined && badge > 0 && (
        <Badge
          variant="accent"
          className={cn(
            "ml-auto transition-opacity duration-200",
            collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
          )}
        >
          {badge}
        </Badge>
      )}
    </Button>
  );

  // If collapsed, wrap in tooltip
  if (collapsed) {
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            <p>{title || label}</p>
            {badge !== undefined && badge > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {badge} notification{badge !== 1 ? "s" : ""}
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // If not collapsed, return button without tooltip
  return buttonContent;
};

export default SidebarItem;
