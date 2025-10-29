import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DestructiveButtonProps extends Omit<ButtonProps, "variant"> {
  children: React.ReactNode;
}

/**
 * DestructiveButton Component
 * A reusable button with destructive styling (outline variant with red colors)
 * Used for delete actions across the application
 */
export const DestructiveButton = React.forwardRef<
  HTMLButtonElement,
  DestructiveButtonProps
>(({ className, children, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="outline"
      className={cn(
        "text-destructive hover:text-destructive hover:bg-destructive/10",
        "border-destructive/50 hover:border-destructive",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
});

DestructiveButton.displayName = "DestructiveButton";
