/**
 * Hero Section Components
 *
 * A collection of components for the hero/landing section,
 * including background effects, social links, and typewriter animations.
 *
 * @module components/hero
 */

// ============================================
// Main Component (Default Export)
// ============================================
export { default } from "./Hero";

// ============================================
// Sub-Components (Named Exports)
// ============================================
export { default as HeroBackground } from "./HeroBackground";
export { default as HeroSkeleton } from "./HeroSkeleton";
export { default as ScrollIndicator } from "./ScrollIndicator";
export { default as SocialLinks } from "./SocialLinks";

// ============================================
// Types
// ============================================
export * from "./types";

// ============================================
// Hooks
// ============================================
export * from "./hooks/useHeroData";
export * from "./hooks/useTypewriter";
