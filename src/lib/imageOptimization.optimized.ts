/**
 * Image Optimization Utility - Optimized Version
 *
 * Modern, high-performance image optimization with:
 * - Client-side compression before upload
 * - Multiple size generation (thumbnail, medium, large)
 * - WebP conversion for modern browsers
 * - Automatic format detection
 * - Progress tracking with safe callbacks
 * - Error handling with retry logic
 * - Auto-cleanup to prevent memory leaks
 * - Cancellation support via AbortSignal
 * - Result caching for repeated operations
 *
 * @module imageOptimization
 */

import imageCompression from "browser-image-compression";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type ImageFormat = "jpeg" | "jpg" | "png" | "webp" | "gif";

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1
  format?: "webp" | "jpeg" | "png";
  generateThumbnail?: boolean;
  generateResponsive?: boolean;
  onProgress?: (progress: number) => void;
  signal?: AbortSignal; // Cancellation support
  maxRetries?: number; // Retry logic
}

export interface OptimizedImageSize {
  file: File;
  url: string;
  width: number;
  height: number;
  size: number; // bytes
  format: ImageFormat;
}

export interface OptimizedImageResult {
  original: OptimizedImageSize;
  optimized: OptimizedImageSize;
  thumbnail?: OptimizedImageSize;
  medium?: OptimizedImageSize;
  large?: OptimizedImageSize;
  webp?: OptimizedImageSize;
  metadata: {
    originalSize: number;
    optimizedSize: number;
    compressionRatio: number;
    dimensions: { width: number; height: number };
    format: ImageFormat;
    mimeType: string;
  };
}

export interface ImageDimensions {
  width: number;
  height: number;
}

// Result type for better error handling
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// ============================================================================
// RESOURCE MANAGEMENT - Auto-cleanup
// ============================================================================

/**
 * Managed optimized image with automatic cleanup
 * Prevents memory leaks by auto-revoking object URLs
 */
export class ManagedOptimizedImage implements OptimizedImageResult {
  private urls: string[] = [];
  private cleaned = false;

  constructor(public readonly result: OptimizedImageResult) {
    this.urls = [
      result.original.url,