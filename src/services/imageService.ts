/**
 * Image Service
 *
 * Handles image upload, optimization, and storage management with Supabase.
 * Features:
 * - Automatic optimization before upload
 * - Multiple size variants
 * - Progress tracking
 * - Error handling with retry logic
 * - Metadata management
 *
 * @module imageService
 */

import { supabase } from "@/integrations/supabase/client";
import {
  optimizeImage,
  optimizeImageFromUrl,
  type OptimizedImageResult,
  type ImageOptimizationOptions,
  ManagedOptimizedImage,
} from "@/lib/imageOptimization";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface BlogImage {
  id: string;
  post_id?: string;
  original_url: string;
  storage_path: string;
  optimized_url: string;
  thumbnail_url?: string;
  medium_url?: string;
  large_url?: string;
  webp_url?: string;
  alt_text?: string;
  caption?: string;
  width?: number;
  height?: number;
  file_size?: number;
  optimized_size?: number;
  format?: string;
  compression_ratio?: number;
  is_featured: boolean;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

export interface UploadImageOptions extends ImageOptimizationOptions {
  postId?: string;
  altText?: string;
  caption?: string;
  isFeatured?: boolean;
}

export interface UploadProgress {
  stage: "optimizing" | "uploading" | "saving" | "complete";
  progress: number;
  message: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_BUCKET = "blog-images";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate unique file path for storage
 */
function generateStoragePath(
  postId: string | undefined,
  filename: string,
  suffix?: string
): string {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(7);
  const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const suffixPart = suffix ? `-${suffix}` : "";

  if (postId) {
    return `posts/${postId}/${timestamp}-${randomId}${suffixPart}-${cleanFilename}`;
  }

  return `uploads/${timestamp}-${randomId}${suffixPart}-${cleanFilename}`;
}

/**
 * Get public URL for storage file
 */
function getPublicUrl(path: string): string {
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Upload file with retry logic
 */
async function uploadWithRetry(
  path: string,
  file: File,
  retries: number = MAX_RETRIES
): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;
      return data.path;
    } catch (error) {
      if (attempt === retries) {
        throw new Error(
          `Failed to upload after ${retries} attempts: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }

      // Wait before retry
      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_DELAY * attempt)
      );
    }
  }

  throw new Error("Upload failed");
}

// ============================================================================
// MAIN SERVICE FUNCTIONS
// ============================================================================

/**
 * Upload and optimize image from local file
 *
 * @param file - Image file to upload
 * @param options - Upload and optimization options
 * @param onProgress - Progress callback
 * @returns Uploaded image metadata
 *
 * @example
 * ```typescript
 * const image = await uploadImage(file, {
 *   postId: 'post-123',
 *   altText: 'Blog post cover',
 *   isFeatured: true,
 *   onProgress: (progress) => console.log(progress)
 * });
 * ```
 */
export async function uploadImage(
  file: File,
  options: UploadImageOptions = {},
  onProgress?: (progress: UploadProgress) => void
): Promise<BlogImage> {
  const {
    postId,
    altText,
    caption,
    isFeatured = false,
    ...optimizationOptions
  } = options;

  try {
    // Stage 1: Optimize image
    onProgress?.({
      stage: "optimizing",
      progress: 0,
      message: "Optimizing image...",
    });

    const optimized = await optimizeImage(file, {
      ...optimizationOptions,
      generateThumbnail: true,
      generateResponsive: true,
      onProgress: (progress) => {
        onProgress?.({
          stage: "optimizing",
          progress: progress * 0.4, // 0-40%
          message: `Optimizing image... ${progress}%`,
        });
      },
    });

    // Stage 2: Upload files
    onProgress?.({
      stage: "uploading",
      progress: 40,
      message: "Uploading optimized images...",
    });

    const filename = file.name;
    const uploadPromises: Promise<{ key: string; path: string }>[] = [];

    // Upload original
    uploadPromises.push(
      uploadWithRetry(
        generateStoragePath(postId, filename, "original"),
        optimized.original.file
      ).then((path) => ({ key: "original", path }))
    );

    // Upload optimized
    uploadPromises.push(
      uploadWithRetry(
        generateStoragePath(postId, filename, "optimized"),
        optimized.optimized.file
      ).then((path) => ({ key: "optimized", path }))
    );

    // Upload thumbnail
    if (optimized.thumbnail) {
      uploadPromises.push(
        uploadWithRetry(
          generateStoragePath(postId, filename, "thumbnail"),
          optimized.thumbnail.file
        ).then((path) => ({ key: "thumbnail", path }))
      );
    }

    // Upload medium
    if (optimized.medium) {
      uploadPromises.push(
        uploadWithRetry(
          generateStoragePath(postId, filename, "medium"),
          optimized.medium.file
        ).then((path) => ({ key: "medium", path }))
      );
    }

    // Upload large
    if (optimized.large) {
      uploadPromises.push(
        uploadWithRetry(
          generateStoragePath(postId, filename, "large"),
          optimized.large.file
        ).then((path) => ({ key: "large", path }))
      );
    }

    // Upload WebP
    if (optimized.webp) {
      uploadPromises.push(
        uploadWithRetry(
          generateStoragePath(postId, filename, "webp"),
          optimized.webp.file
        ).then((path) => ({ key: "webp", path }))
      );
    }

    const uploadResults = await Promise.all(uploadPromises);
    const paths = Object.fromEntries(
      uploadResults.map(({ key, path }) => [key, path])
    );

    onProgress?.({
      stage: "uploading",
      progress: 80,
      message: "Upload complete",
    });

    // Stage 3: Save metadata to database
    onProgress?.({
      stage: "saving",
      progress: 85,
      message: "Saving metadata...",
    });

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error("User not authenticated");
    }

    // Get user's profile ID (blog_images.uploaded_by references profiles.id)
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.user.id)
      .single();

    if (!profile) {
      throw new Error("User profile not found");
    }

    const { data: imageData, error: dbError } = await supabase
      .from("blog_images")
      .insert({
        post_id: postId,
        original_url: getPublicUrl(paths.original),
        storage_path: paths.optimized,
        optimized_url: getPublicUrl(paths.optimized),
        thumbnail_url: paths.thumbnail ? getPublicUrl(paths.thumbnail) : null,
        medium_url: paths.medium ? getPublicUrl(paths.medium) : null,
        large_url: paths.large ? getPublicUrl(paths.large) : null,
        webp_url: paths.webp ? getPublicUrl(paths.webp) : null,
        alt_text: altText,
        caption,
        width: optimized.metadata.dimensions.width,
        height: optimized.metadata.dimensions.height,
        file_size: optimized.metadata.originalSize,
        optimized_size: optimized.metadata.optimizedSize,
        format: optimized.metadata.format,
        compression_ratio: optimized.metadata.compressionRatio,
        is_featured: isFeatured,
        uploaded_by: profile.id,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    // Cleanup object URLs (auto-cleanup with ManagedOptimizedImage)
    optimized.cleanup();

    onProgress?.({
      stage: "complete",
      progress: 100,
      message: "Image uploaded successfully",
    });

    return imageData;
  } catch (error) {
    throw new Error(
      `Failed to upload image: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Upload and optimize image from external URL
 *
 * @param url - External image URL
 * @param options - Upload and optimization options
 * @param onProgress - Progress callback
 * @returns Uploaded image metadata
 */
export async function uploadImageFromUrl(
  url: string,
  options: UploadImageOptions = {},
  onProgress?: (progress: UploadProgress) => void
): Promise<BlogImage> {
  try {
    // Download and optimize
    onProgress?.({
      stage: "optimizing",
      progress: 0,
      message: "Downloading and optimizing image...",
    });

    const optimized = await optimizeImageFromUrl(url, {
      ...options,
      generateThumbnail: true,
      generateResponsive: true,
      onProgress: (progress) => {
        onProgress?.({
          stage: "optimizing",
          progress: progress * 0.4,
          message: `Optimizing image... ${progress}%`,
        });
      },
    });

    // Upload using main function
    return await uploadImage(optimized.optimized.file, options, (progress) => {
      // Adjust progress to account for download phase
      onProgress?.({
        ...progress,
        progress: 40 + progress.progress * 0.6,
      });
    });
  } catch (error) {
    throw new Error(
      `Failed to upload image from URL: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Get images for a specific post
 */
export async function getImagesByPost(postId: string): Promise<BlogImage[]> {
  const { data, error } = await supabase
    .from("blog_images")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get single image by ID
 */
export async function getImageById(imageId: string): Promise<BlogImage | null> {
  const { data, error } = await supabase
    .from("blog_images")
    .select("*")
    .eq("id", imageId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update image metadata
 */
export async function updateImageMetadata(
  imageId: string,
  updates: {
    altText?: string;
    caption?: string;
    isFeatured?: boolean;
  }
): Promise<BlogImage> {
  const { data, error } = await supabase
    .from("blog_images")
    .update({
      alt_text: updates.altText,
      caption: updates.caption,
      is_featured: updates.isFeatured,
    })
    .eq("id", imageId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete image and all its variants
 */
export async function deleteImage(imageId: string): Promise<void> {
  // Get image data
  const image = await getImageById(imageId);
  if (!image) throw new Error("Image not found");

  // Delete from storage
  const pathsToDelete: string[] = [image.storage_path];

  // Extract paths from URLs (they contain the full path)
  if (image.thumbnail_url) {
    const path = new URL(image.thumbnail_url).pathname.split("/").slice(-1)[0];
    pathsToDelete.push(path);
  }
  if (image.medium_url) {
    const path = new URL(image.medium_url).pathname.split("/").slice(-1)[0];
    pathsToDelete.push(path);
  }
  if (image.large_url) {
    const path = new URL(image.large_url).pathname.split("/").slice(-1)[0];
    pathsToDelete.push(path);
  }
  if (image.webp_url) {
    const path = new URL(image.webp_url).pathname.split("/").slice(-1)[0];
    pathsToDelete.push(path);
  }

  // Delete files from storage
  const { error: storageError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove(pathsToDelete);

  if (storageError) {
    console.error("Failed to delete some files from storage:", storageError);
  }

  // Delete from database
  const { error: dbError } = await supabase
    .from("blog_images")
    .delete()
    .eq("id", imageId);

  if (dbError) throw dbError;
}

/**
 * Get all images uploaded by current user
 */
export async function getUserImages(): Promise<BlogImage[]> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("blog_images")
    .select("*")
    .eq("uploaded_by", user.user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Set image as featured for a post
 */
export async function setFeaturedImage(
  postId: string,
  imageId: string
): Promise<void> {
  // Unset all featured images for this post
  await supabase
    .from("blog_images")
    .update({ is_featured: false })
    .eq("post_id", postId);

  // Set new featured image
  const { error } = await supabase
    .from("blog_images")
    .update({ is_featured: true })
    .eq("id", imageId);

  if (error) throw error;
}
