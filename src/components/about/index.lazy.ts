/**
 * About Section Components (Lazy Loaded)
 *
 * Code-split versions of About components for improved performance.
 * Use these imports for route-level code splitting to reduce initial bundle size.
 *
 * @module components/about/lazy
 *
 * @example
 * ```tsx
 * import { Suspense } from "react";
 * import { About, AboutSkeleton } from "@/components/about/index.lazy";
 *
 * function Page() {
 *   return (
 *     <Suspense fallback={<AboutSkeleton />}>
 *       <About />
 *     </Suspense>
 *   );
 * }
 * ```
 */

import { lazy } from "react";

// ============================================
// Lazy-Loaded Components
// ============================================
export const About = lazy(() => import("./About"));
export const AboutHeader = lazy(() => import("./AboutHeader"));
export const ExperienceTimeline = lazy(() => import("./ExperienceTimeline"));
export const ImpactMetricsCard = lazy(() => import("./ImpactMetricsCard"));
export const PhilosophyCard = lazy(() => import("./PhilosophyCard"));
export const ProfileCard = lazy(() => import("./ProfileCard"));

// AboutSkeleton should NOT be lazy-loaded (it's the loading fallback)
export { default as AboutSkeleton } from "./AboutSkeleton";

// ============================================
// Types (Not Lazy-Loaded)
// ============================================
export * from "./types";

// ============================================
// Hooks (Not Lazy-Loaded)
// ============================================
export * from "./hooks/useProfile";

// ============================================
// Utilities (Not Lazy-Loaded)
// ============================================
export { getIcon } from "./utils/iconHelper";
export { generateStructuredData } from "./utils/structuredData";
