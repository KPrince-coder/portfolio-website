/**
 * About Section Components
 *
 * A collection of components for displaying professional profile information,
 * including experience timeline, impact metrics, and philosophy.
 *
 * @module components/about
 */

// ============================================
// Main Component (Default Export)
// ============================================
export { default } from "./About";

// ============================================
// Sub-Components (Named Exports)
// ============================================
export { default as AboutHeader } from "./AboutHeader";
export { default as AboutSkeleton } from "./AboutSkeleton";
export { default as ExperienceTimeline } from "./ExperienceTimeline";
export { default as ImpactMetricsCard } from "./ImpactMetricsCard";
export { default as PhilosophyCard } from "./PhilosophyCard";
export { default as ProfileCard } from "./ProfileCard";

// ============================================
// Types
// ============================================
export * from "./types";

// ============================================
// Hooks
// ============================================
export * from "./hooks/useProfile";

// ============================================
// Utilities
// ============================================
export { getIcon } from "./utils/iconHelper";
export { generateStructuredData } from "./utils/structuredData";
