/**
 * Post Form Hook
 *
 * Manages blog post form state with:
 * - Form validation
 * - Auto-save functionality
 * - Slug generation
 * - Image management
 * - Draft/publish handling
 *
 * @module blog/hooks/usePostForm
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  createPost,
  updatePost,
  getPostById,
  publishPost,
  unpublishPost,
} from "@/services/blogService";
import type {
  BlogPost,
  BlogPostStatus,
  BlogImage,
  CreateBlogPostData,
  UpdateBlogPostData,
} from "../types";

// ============================================================================
// TYPES
// ============================================================================

export interface PostFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: BlogPostStatus;
  featured_image_id?: string;
  category_ids: string[];
  tag_ids: string[];
  scheduled_at?: string;
  allow_comments: boolean;
  is_featured: boolean;
}

export interface UsePostFormOptions {
  postId?: string;
  autoSave?: boolean;
  autoSaveInterval?: number;
}

export interface UsePostFormReturn {
  // Form data
  formData: PostFormData;
  setFormData: React.Dispatch<React.SetStateAction<PostFormData>>;
  updateField: <K extends keyof PostFormData>(
    field: K,
    value: PostFormData[K]
  ) => void;

  // State
  loading: boolean;
  saving: boolean;
  error: string | null;
  isDirty: boolean;
  lastSaved: Date | null;

  // Actions
  loadPost: (id: string) => Promise<void>;
  saveDraft: () => Promise<void>;
  publish: () => Promise<void>;
  unpublish: () => Promise<void>;
  reset: () => void;

  // Slug
  generateSlug: (title: string) => string;

  // Validation
  validate: () => boolean;
  errors: Record<string, string>;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const INITIAL_FORM_DATA: PostFormData = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  status: "draft",
  category_ids: [],
  tag_ids: [],
  allow_comments: true,
  is_featured: false,
};

const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

function extractExcerpt(content: string, maxLength: number = 160): string {
  // Remove markdown formatting
  const plainText = content
    .replace(/#{1,6}\s/g, "") // Remove headers
    .replace(/\*\*(.+?)\*\*/g, "$1") // Remove bold
    .replace(/\*(.+?)\*/g, "$1") // Remove italic
    .replace(/\[(.+?)\]\(.+?\)/g, "$1") // Remove links
    .replace(/`(.+?)`/g, "$1") // Remove inline code
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.substring(0, maxLength).trim() + "...";
}

// ============================================================================
// HOOK
// ============================================================================

export function usePostForm(
  options: UsePostFormOptions = {}
): UsePostFormReturn {
  const {
    postId,
    autoSave = true,
    autoSaveInterval = AUTO_SAVE_INTERVAL,
  } = options;

  // ============================================================================
  // STATE
  // ============================================================================

  const [formData, setFormData] = useState<PostFormData>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const initialDataRef = useRef<PostFormData>(INITIAL_FORM_DATA);
  const autoSaveTimerRef = useRef<NodeJS.Timeout>();

  // ============================================================================
  // DEBOUNCED VALUES
  // ============================================================================

  const debouncedFormData = useDebounce(formData, 1000);

  // ============================================================================
  // LOAD POST
  // ============================================================================

  const loadPost = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const post = await getPostById(id);

      const loadedData: PostFormData = {
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt || "",
        status: post.status,
        featured_image_id: post.featured_image_id,
        category_ids: post.categories?.map((c) => c.id) || [],
        tag_ids: post.tags?.map((t) => t.id) || [],
        scheduled_at: post.scheduled_at,
        allow_comments: post.allow_comments,
        is_featured: post.is_featured,
      };

      setFormData(loadedData);
      initialDataRef.current = loadedData;
      setIsDirty(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load post";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================================================
  // LOAD EFFECT
  // ============================================================================

  useEffect(() => {
    if (postId) {
      loadPost(postId);
    }
  }, [postId, loadPost]);

  // ============================================================================
  // UPDATE FIELD
  // ============================================================================

  const updateField = useCallback(
    <K extends keyof PostFormData>(field: K, value: PostFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setIsDirty(true);
    },
    []
  );

  // ============================================================================
  // SLUG GENERATION
  // ============================================================================

  const generateSlug = useCallback((title: string) => {
    return generateSlugFromTitle(title);
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const newSlug = generateSlugFromTitle(formData.title);
      setFormData((prev) => ({ ...prev, slug: newSlug }));
    }
  }, [formData.title, formData.slug]);

  // Auto-generate excerpt from content
  useEffect(() => {
    if (formData.content && !formData.excerpt) {
      const newExcerpt = extractExcerpt(formData.content);
      setFormData((prev) => ({ ...prev, excerpt: newExcerpt }));
    }
  }, [formData.content, formData.excerpt]);

  // ============================================================================
  // VALIDATION
  // ============================================================================

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    if (formData.status === "scheduled" && !formData.scheduled_at) {
      newErrors.scheduled_at = "Scheduled date is required for scheduled posts";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // ============================================================================
  // SAVE DRAFT
  // ============================================================================

  const saveDraft = useCallback(async () => {
    try {
      setSaving(true);
      setError(null);

      if (!validate()) {
        throw new Error("Please fix validation errors");
      }

      const postData: CreateBlogPostData | UpdateBlogPostData = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        excerpt: formData.excerpt,
        status: "draft",
        featured_image_id: formData.featured_image_id,
        category_ids: formData.category_ids,
        tag_ids: formData.tag_ids,
        allow_comments: formData.allow_comments,
        is_featured: formData.is_featured,
      };

      if (postId) {
        await updatePost(postId, postData);
      } else {
        const newPost = await createPost(postData);
        // Update URL or state with new post ID if needed
        window.history.replaceState(null, "", `/admin/blog/${newPost.id}/edit`);
      }

      setLastSaved(new Date());
      setIsDirty(false);
      initialDataRef.current = formData;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save draft";
      setError(errorMessage);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [formData, postId, validate]);

  // ============================================================================
  // PUBLISH
  // ============================================================================

  const publish = useCallback(async () => {
    try {
      setSaving(true);
      setError(null);

      if (!validate()) {
        throw new Error("Please fix validation errors");
      }

      const postData: CreateBlogPostData | UpdateBlogPostData = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        excerpt: formData.excerpt,
        status: formData.status === "scheduled" ? "scheduled" : "published",
        featured_image_id: formData.featured_image_id,
        category_ids: formData.category_ids,
        tag_ids: formData.tag_ids,
        scheduled_at: formData.scheduled_at,
        allow_comments: formData.allow_comments,
        is_featured: formData.is_featured,
      };

      let currentPostId = postId;

      if (postId) {
        await updatePost(postId, postData);
      } else {
        const newPost = await createPost(postData);
        currentPostId = newPost.id;
        window.history.replaceState(null, "", `/admin/blog/${newPost.id}/edit`);
      }

      if (currentPostId && formData.status !== "scheduled") {
        await publishPost(currentPostId);
      }

      setLastSaved(new Date());
      setIsDirty(false);
      initialDataRef.current = formData;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to publish post";
      setError(errorMessage);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [formData, postId, validate]);

  // ============================================================================
  // UNPUBLISH
  // ============================================================================

  const unpublish = useCallback(async () => {
    if (!postId) return;

    try {
      setSaving(true);
      setError(null);

      await unpublishPost(postId);

      setFormData((prev) => ({ ...prev, status: "draft" }));
      setLastSaved(new Date());
      setIsDirty(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to unpublish post";
      setError(errorMessage);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [postId]);

  // ============================================================================
  // RESET
  // ============================================================================

  const reset = useCallback(() => {
    setFormData(initialDataRef.current);
    setIsDirty(false);
    setError(null);
    setErrors({});
  }, []);

  // ============================================================================
  // AUTO-SAVE
  // ============================================================================

  useEffect(() => {
    if (!autoSave || !isDirty || saving) return;

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Set new timer
    autoSaveTimerRef.current = setTimeout(() => {
      saveDraft().catch((err) => {
        console.error("Auto-save failed:", err);
      });
    }, autoSaveInterval);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [
    debouncedFormData,
    isDirty,
    saving,
    autoSave,
    autoSaveInterval,
    saveDraft,
  ]);

  // ============================================================================
  // CLEANUP
  // ============================================================================

  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Form data
    formData,
    setFormData,
    updateField,

    // State
    loading,
    saving,
    error,
    isDirty,
    lastSaved,

    // Actions
    loadPost,
    saveDraft,
    publish,
    unpublish,
    reset,

    // Slug
    generateSlug,

    // Validation
    validate,
    errors,
  };
}
