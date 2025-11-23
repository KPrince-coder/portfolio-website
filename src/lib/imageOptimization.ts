/**
 * Image Optimization Utility - Fully Optimized Version
 *
 * Modern, high-performance image optimization with:
 * - Auto-cleanup with Symbol.dispose (prevents memory leaks)
 * - AbortController support (cancellation)
 * - Retry logic for network failures
 * - Result caching for repeated operations
 * - Parallel batch processing with concurrency control
 * - Comprehensive error handling
 * - Progress tracking
 * - TypeScript strict mode compliance
 *
 * @module imageOptimization
 */

import imageCompression from "browser-image-compression";

// ============================================================================
// POLYFILL FOR SYMBOL.DISPOSE
// ============================================================================

// Add Symbol.dispose polyfill for older browsers
if (typeof Symbol.dispose === "undefined") {
  (Symbol as any).dispose = Symbol("Symbol.dispose");
}

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
  signal?: AbortSignal; // NEW: Cancellation support
  maxRetries?: number; // NEW: Retry logic
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

// NEW: Result type for better error handling
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// ============================================================================
// CONSTANTS
// ============================================================================

const THUMBNAIL_SIZE = 300;
const MEDIUM_SIZE = 800;
const LARGE_SIZE = 1200;
const DEFAULT_QUALITY = 0.85;
const MAX_FILE_SIZE_MB = 50;
const DEFAULT_MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const COMPRESSION_OPTIONS = {
  maxSizeMB: MAX_FILE_SIZE_MB,
  useWebWorker: true, // Use web worker for better performance
  preserveExif: false, // Remove EXIF data for privacy
};

// ============================================================================
// RESOURCE MANAGEMENT - AUTO-CLEANUP
// ============================================================================

/**
 * Managed optimized image with automatic cleanup
 * Implements Symbol.dispose for explicit resource management
 */
export class ManagedOptimizedImage implements OptimizedImageResult {
  private urls: string[] = [];
  private disposed = false;

  constructor(public readonly result: OptimizedImageResult) {
    this.urls = [
      result.original.url,
      result.optimized.url,
      result.thumbnail?.url,
      result.medium?.url,
      result.large?.url,
      result.webp?.url,
    ].filter(Boolean) as string[];
  }

  get original() {
    return this.result.original;
  }
  get optimized() {
    return this.result.optimized;
  }
  get thumbnail() {
    return this.result.thumbnail;
  }
  get medium() {
    return this.result.medium;
  }
  get large() {
    return this.result.large;
  }
  get webp() {
    return this.result.webp;
  }
  get metadata() {
    return this.result.metadata;
  }

  /**
   * Manually cleanup all object URLs
   */
  cleanup(): void {
    if (this.disposed) return;

    this.urls.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (error) {
        console.warn("Failed to revoke URL:", url, error);
      }
    });

    this.urls = [];
    this.disposed = true;
  }

  /**
   * Symbol.dispose implementation for automatic cleanup
   * Usage: using result = await optimizeImage(file);
   */
  [Symbol.dispose](): void {
    this.cleanup();
  }
}

// ============================================================================
// CACHING
// ============================================================================

/**
 * LRU cache for optimization results
 */
class ImageOptimizationCache {
  private cache = new Map<string, OptimizedImageResult>();
  private readonly maxSize = 50;

  get(
    file: File,
    options: ImageOptimizationOptions
  ): OptimizedImageResult | null {
    const key = this.getKey(file, options);
    const cached = this.cache.get(key);

    if (cached) {
      // Move to end (LRU)
      this.cache.delete(key);
      this.cache.set(key, cached);
    }

    return cached || null;
  }

  set(
    file: File,
    options: ImageOptimizationOptions,
    result: OptimizedImageResult
  ): void {
    const key = this.getKey(file, options);

    // Remove oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, result);
  }

  private getKey(file: File, options: ImageOptimizationOptions): string {
    const optionsKey = JSON.stringify({
      quality: options.quality,
      format: options.format,
      generateThumbnail: options.generateThumbnail,
      generateResponsive: options.generateResponsive,
    });
    return `${file.name}-${file.size}-${file.lastModified}-${optionsKey}`;
  }

  clear(): void {
    this.cache.clear();
  }
}

const cache = new ImageOptimizationCache();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Safe progress callback that won't crash if callback throws
 */
function safeProgress(
  callback: ((progress: number) => void) | undefined,
  progress: number
): void {
  if (!callback) return;

  try {
    callback(progress);
  } catch (error) {
    console.warn("Progress callback error:", error);
  }
}

/**
 * Retry logic wrapper
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = DEFAULT_MAX_RETRIES,
  delay: number = RETRY_DELAY_MS
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry if it's an AbortError
      if (error instanceof DOMException && error.name === "AbortError") {
        throw error;
      }

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, delay * (attempt + 1))
        );
      }
    }
  }

  throw lastError || new Error("Operation failed after retries");
}

/**
 * Sanitize filename for safe storage
 */
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, "_") // Replace invalid chars
    .replace(/_{2,}/g, "_") // Remove duplicate underscores
    .substring(0, 255); // Limit length
}

/**
 * Check if operation was cancelled
 */
function checkCancellation(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw new DOMException("Operation cancelled", "AbortError");
  }
}

// Cache for image dimensions
const dimensionsCache = new WeakMap<File, ImageDimensions>();

/**
 * Get image dimensions from file (with caching)
 */
async function getImageDimensions(file: File): Promise<ImageDimensions> {
  // Check cache first
  const cached = dimensionsCache.get(file);
  if (cached) return cached;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const dimensions = { width: img.width, height: img.height };
      dimensionsCache.set(file, dimensions);
      resolve(dimensions);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

/**
 * Convert file to specific format
 */
async function convertImageFormat(
  file: File,
  format: "webp" | "jpeg" | "png",
  quality: number = DEFAULT_QUALITY,
  signal?: AbortSignal
): Promise<File> {
  return new Promise((resolve, reject) => {
    checkCancellation(signal);

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      try {
        checkCancellation(signal);

        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // Handle context loss
        canvas.addEventListener("webglcontextlost", (event) => {
          event.preventDefault();
          reject(new Error("Canvas context lost during processing"));
        });

        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to convert image"));
              return;
            }

            const convertedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, `.${format}`),
              { type: `image/${format}` }
            );

            resolve(convertedFile);
          },
          `image/${format}`,
          quality
        );
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for conversion"));
    };

    img.src = url;
  });
}

/**
 * Resize image to specific dimensions
 */
async function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number = DEFAULT_QUALITY
): Promise<File> {
  const options = {
    ...COMPRESSION_OPTIONS,
    maxWidthOrHeight: Math.max(maxWidth, maxHeight),
    initialQuality: quality,
  };

  return await imageCompression(file, options);
}

/**
 * Create optimized image size variant
 */
async function createImageVariant(
  file: File,
  maxSize: number,
  quality: number,
  suffix: string,
  signal?: AbortSignal
): Promise<OptimizedImageSize> {
  checkCancellation(signal);

  const resized = await resizeImage(file, maxSize, maxSize, quality);

  checkCancellation(signal);

  const dimensions = await getImageDimensions(resized);
  const url = URL.createObjectURL(resized);

  return {
    file: resized,
    url,
    width: dimensions.width,
    height: dimensions.height,
    size: resized.size,
    format: resized.type.split("/")[1] as ImageFormat,
  };
}

// ============================================================================
// MAIN OPTIMIZATION FUNCTIONS
// ============================================================================

/**
 * Optimize a single image with multiple size variants
 *
 * Features:
 * - Automatic cleanup with Symbol.dispose
 * - Cancellation support via AbortSignal
 * - Retry logic for network failures
 * - Result caching for repeated operations
 * - Progress tracking
 *
 * @param file - Image file to optimize
 * @param options - Optimization options
 * @returns Managed optimized image result with auto-cleanup
 *
 * @example
 * ```typescript
 * // With auto-cleanup
 * {
 *   using result = await optimizeImage(file, {
 *     quality: 0.85,
 *     generateThumbnail: true,
 *     maxRetries: 3
 *   });
 *   console.log(result.optimized.url);
 * } // Automatically cleaned up
 *
 * // With cancellation
 * const controller = new AbortController();
 * const result = await optimizeImage(file, {
 *   signal: controller.signal
 * });
 *
 * // Cancel if needed
 * controller.abort();
 * ```
 */
export async function optimizeImage(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<ManagedOptimizedImage> {
  const {
    quality = DEFAULT_QUALITY,
    generateThumbnail = true,
    generateResponsive = true,
    format,
    onProgress,
    signal,
    maxRetries = 0,
  } = options;

  // Check cache first
  const cached = cache.get(file, options);
  if (cached) {
    safeProgress(onProgress, 100);
    return new ManagedOptimizedImage(cached);
  }

  // Wrap in retry logic if maxRetries > 0
  const optimizeFn = async (): Promise<OptimizedImageResult> => {
    try {
      // Validate file
      checkCancellation(signal);

      if (!file.type.startsWith("image/")) {
        throw new Error("File must be an image");
      }

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        throw new Error(`File size must be less than ${MAX_FILE_SIZE_MB}MB`);
      }

      // Get original dimensions
      safeProgress(onProgress, 10);
      checkCancellation(signal);

      const originalDimensions = await getImageDimensions(file);

      safeProgress(onProgress, 20);
      checkCancellation(signal);

      // Compress original with more aggressive settings
      const compressed = await imageCompression(file, {
        ...COMPRESSION_OPTIONS,
        initialQuality: quality,
        maxWidthOrHeight: options.maxWidth || options.maxHeight || 1920, // Limit dimensions
        fileType: format ? `image/${format}` : undefined, // Convert format if specified
      });

      safeProgress(onProgress, 40);
      checkCancellation(signal);

      // Create original size variant
      const original: OptimizedImageSize = {
        file,
        url: URL.createObjectURL(file),
        width: originalDimensions.width,
        height: originalDimensions.height,
        size: file.size,
        format: file.type.split("/")[1] as ImageFormat,
      };

      // Create optimized variant
      const optimized: OptimizedImageSize = {
        file: compressed,
        url: URL.createObjectURL(compressed),
        width: originalDimensions.width,
        height: originalDimensions.height,
        size: compressed.size,
        format: compressed.type.split("/")[1] as ImageFormat,
      };

      safeProgress(onProgress, 50);

      const result: OptimizedImageResult = {
        original,
        optimized,
        metadata: {
          originalSize: file.size,
          optimizedSize: compressed.size,
          compressionRatio: compressed.size / file.size,
          dimensions: originalDimensions,
          format: file.type.split("/")[1] as ImageFormat,
          mimeType: file.type,
        },
      };

      // Generate thumbnail
      if (generateThumbnail) {
        result.thumbnail = await createImageVariant(
          compressed,
          THUMBNAIL_SIZE,
          quality,
          "thumbnail",
          signal
        );
        safeProgress(onProgress, 60);
      }

      // Generate responsive sizes
      if (generateResponsive) {
        result.medium = await createImageVariant(
          compressed,
          MEDIUM_SIZE,
          quality,
          "medium",
          signal
        );
        safeProgress(onProgress, 70);

        result.large = await createImageVariant(
          compressed,
          LARGE_SIZE,
          quality,
          "large",
          signal
        );
        safeProgress(onProgress, 80);
      }

      // Generate WebP version
      if (format === "webp" || generateResponsive) {
        const webpFile = await convertImageFormat(
          compressed,
          "webp",
          quality,
          signal
        );
        const webpDimensions = await getImageDimensions(webpFile);
        result.webp = {
          file: webpFile,
          url: URL.createObjectURL(webpFile),
          width: webpDimensions.width,
          height: webpDimensions.height,
          size: webpFile.size,
          format: "webp",
        };
        safeProgress(onProgress, 90);
      }

      safeProgress(onProgress, 100);

      // Cache result
      cache.set(file, options, result);

      return result;
    } catch (error) {
      throw new Error(
        `Image optimization failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  // Apply retry logic if requested
  const result =
    maxRetries > 0
      ? await withRetry(optimizeFn, maxRetries)
      : await optimizeFn();

  return new ManagedOptimizedImage(result);
}

/**
 * Optimize image with Result type for better error handling
 */
export async function optimizeImageSafe(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<Result<ManagedOptimizedImage>> {
  try {
    const data = await optimizeImage(file, options);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

/**
 * Optimize image from external URL
 * Downloads the image and runs through optimization pipeline
 *
 * @param url - External image URL
 * @param options - Optimization options
 * @returns Optimized image result
 */
export async function optimizeImageFromUrl(
  url: string,
  options: ImageOptimizationOptions = {}
): Promise<ManagedOptimizedImage> {
  const { signal, maxRetries = DEFAULT_MAX_RETRIES } = options;

  const fetchAndOptimize = async (): Promise<ManagedOptimizedImage> => {
    checkCancellation(signal);

    // Fetch image
    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    checkCancellation(signal);

    // Convert to blob
    const blob = await response.blob();

    // Get filename from URL or use default
    const rawFilename = url.split("/").pop() || "image.jpg";
    const filename = sanitizeFilename(decodeURIComponent(rawFilename));

    // Create file from blob
    const file = new File([blob], filename, { type: blob.type });

    // Optimize using main function
    return await optimizeImage(file, options);
  };

  return await withRetry(fetchAndOptimize, maxRetries);
}

/**
 * Batch optimize multiple images with improved parallel processing
 * Processes images in parallel with concurrency limit using p-limit pattern
 *
 * @param files - Array of image files
 * @param options - Optimization options
 * @param concurrency - Max parallel operations (default: 3)
 * @returns Array of optimized results
 */
export async function optimizeImages(
  files: File[],
  options: ImageOptimizationOptions = {},
  concurrency: number = 3
): Promise<ManagedOptimizedImage[]> {
  const results: ManagedOptimizedImage[] = [];
  const executing: Set<Promise<void>> = new Set();

  for (const file of files) {
    checkCancellation(options.signal);

    const promise = optimizeImage(file, options)
      .then((result) => {
        results.push(result);
      })
      .finally(() => {
        executing.delete(promise);
      });

    executing.add(promise);

    if (executing.size >= concurrency) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}

/**
 * Calculate compression ratio as percentage
 */
export function getCompressionPercentage(
  originalSize: number,
  optimizedSize: number
): number {
  return Math.round((1 - optimizedSize / originalSize) * 100);
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "File must be an image" };
  }

  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return {
      valid: false,
      error: `File size must be less than ${MAX_FILE_SIZE_MB}MB`,
    };
  }

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "File type not supported. Use JPEG, PNG, WebP, or GIF",
    };
  }

  return { valid: true };
}

/**
 * Cleanup object URLs to prevent memory leaks
 * @deprecated Use ManagedOptimizedImage with Symbol.dispose instead
 */
export function cleanupImageUrls(result: OptimizedImageResult): void {
  URL.revokeObjectURL(result.original.url);
  URL.revokeObjectURL(result.optimized.url);
  if (result.thumbnail) URL.revokeObjectURL(result.thumbnail.url);
  if (result.medium) URL.revokeObjectURL(result.medium.url);
  if (result.large) URL.revokeObjectURL(result.large.url);
  if (result.webp) URL.revokeObjectURL(result.webp.url);
}

/**
 * Clear the optimization cache
 */
export function clearOptimizationCache(): void {
  cache.clear();
}
