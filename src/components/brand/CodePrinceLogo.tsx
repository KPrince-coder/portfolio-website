/**
 * CodePrince Logo Component
 *
 * A modern, professional logo featuring the "CP" initials
 * with gradient styling and multiple size variants
 *
 * Features:
 * - Multiple size variants (sm, md, lg, xl)
 * - Three display modes (default, icon-only, text-only)
 * - Memoized for performance
 * - Accessible with ARIA labels
 * - Unique gradient IDs to prevent conflicts
 */

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

export interface CodePrinceLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  variant?: "default" | "icon-only" | "text-only";
  interactive?: boolean;
  onClick?: () => void;
}

const sizeMap = {
  sm: { width: 32, height: 32, fontSize: "text-sm" },
  md: { width: 48, height: 48, fontSize: "text-base" },
  lg: { width: 64, height: 64, fontSize: "text-xl" },
  xl: { width: 96, height: 96, fontSize: "text-3xl" },
} as const;

export const CodePrinceLogo = React.memo<CodePrinceLogoProps>(
  function CodePrinceLogo({
    size = "md",
    className = "",
    variant = "default",
    interactive = false,
    onClick,
  }) {
    const { width, height, fontSize } = sizeMap[size];

    // Generate unique gradient IDs to prevent conflicts when multiple logos exist
    const gradientId = useMemo(
      () => `cpGradient-${Math.random().toString(36).substr(2, 9)}`,
      []
    );
    const textGradientId = useMemo(
      () => `cpTextGradient-${Math.random().toString(36).substr(2, 9)}`,
      []
    );

    // Text-only variant
    if (variant === "text-only") {
      return (
        <span
          className={cn(
            "font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent",
            fontSize,
            interactive && "cursor-pointer transition-opacity hover:opacity-80",
            className
          )}
          onClick={onClick}
          role={interactive ? "button" : undefined}
          tabIndex={interactive ? 0 : undefined}
          onKeyDown={(e) => {
            if (
              interactive &&
              onClick &&
              (e.key === "Enter" || e.key === " ")
            ) {
              e.preventDefault();
              onClick();
            }
          }}
        >
          CodePrince
        </span>
      );
    }

    // Memoized SVG icon
    const IconSVG = useMemo(
      () => (
        <svg
          width={width}
          height={height}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={variant === "icon-only" ? className : undefined}
          aria-label="CodePrince Logo"
          role="img"
        >
          <title>CodePrince</title>

          {/* Gradient Definitions */}
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#0EA5E9" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <linearGradient
              id={textGradientId}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E0F2FE" />
            </linearGradient>
          </defs>

          {/* Outer Circle */}
          <circle cx="50" cy="50" r="48" fill={`url(#${gradientId})`} />

          {/* Inner Shadow Circle */}
          <circle cx="50" cy="50" r="44" fill="rgba(0,0,0,0.1)" />

          {/* "C" Letter */}
          <path
            d="M 35 30 Q 25 30 25 40 L 25 60 Q 25 70 35 70 L 45 70 L 45 62 L 35 62 Q 33 62 33 60 L 33 40 Q 33 38 35 38 L 45 38 L 45 30 Z"
            fill={`url(#${textGradientId})`}
          />

          {/* "P" Letter */}
          <path
            d="M 55 30 L 55 70 L 63 70 L 63 55 L 70 55 Q 75 55 75 50 L 75 35 Q 75 30 70 30 Z M 63 38 L 70 38 Q 71 38 71 40 L 71 48 Q 71 49 70 49 L 63 49 Z"
            fill={`url(#${textGradientId})`}
          />

          {/* Accent Dot */}
          <circle cx="50" cy="85" r="2" fill="#FFFFFF" opacity="0.6" />
        </svg>
      ),
      [width, height, gradientId, textGradientId, variant, className]
    );

    // Icon-only variant
    if (variant === "icon-only") {
      return interactive ? (
        <button
          onClick={onClick}
          className={cn(
            "transition-transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded",
            className
          )}
          aria-label="CodePrince Logo"
        >
          {IconSVG}
        </button>
      ) : (
        IconSVG
      );
    }

    // Default variant with icon and text
    const content = (
      <>
        {IconSVG}
        <span
          className={cn(
            "font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent",
            fontSize
          )}
          aria-hidden="true"
        >
          CodePrince
        </span>
      </>
    );

    return interactive ? (
      <button
        onClick={onClick}
        className={cn(
          "flex items-center gap-2 transition-transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded",
          className
        )}
        aria-label="CodePrince Logo"
      >
        {content}
      </button>
    ) : (
      <div
        className={cn("flex items-center gap-2", className)}
        role="img"
        aria-label="CodePrince Logo"
      >
        {content}
      </div>
    );
  }
);

export default CodePrinceLogo;
