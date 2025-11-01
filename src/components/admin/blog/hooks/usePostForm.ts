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
import type { BlogPostStatus, CreateBlogPostInput } from "../types";

// ============================================================================
// TYPES
// ============================================================================

export interface PostFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: BlogPostStatus;
  featured_image?: string;
  category_ids: string[];
  tag_ids: string[];
  scheduled_for?: string;
  comments_enabled: boolean;
  is_featured: boolean;
  seo_metadata?: {
    meta_title?: string;
    meta_description?: string;
    og_image?: string;
    keywords?: string[];
    canonical_url?: string;
    robots_meta?: string;
  };
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
  comments_enabled: true,
  is_featured: false,
  seo_metadata: {
    robots_meta: "index,follow",
  },
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
    postId: initialPostId,
    autoSave = true,
    autoSaveInterval = AUTO_SAVE_INTERVAL,
  } = options;

  // ============================================================================
  // STATE
  // ============================================================================

  const [postId, setPostId] = useState<string | undefined>(initialPostId);
  const [formData, setFormData] = useState<PostFormData>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const initialDataRef = useRef<PostFormData>(INITIAL_FORM_DATA);
  const autoSaveTimerRef = useRef<NodeJS.Timeout>();
  const userEditedSlugRef = useRef(false);
  const userEditedExcerptRef = useRef(false);

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
        featured_image: post.featured_image,
        category_ids: post.categories?.map((c) => c.id) || [],
        tag_ids: post.tags?.map((t) => t.id) || [],
        scheduled_for: post.scheduled_for,
        comments_enabled: post.comments_enabled,
        is_featured: post.is_featured,
        seo_metadata: post.seo_metadata || { robots_meta: "index,follow" },
      };

      setFormData(loadedData);
      initialDataRef.current = loadedData;
      setIsDirty(false);

      // Don't mark as user-edited when loading - allow auto-generation to continue
      userEditedSlugRef.current = false;
      userEditedExcerptRef.current = false;
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
    if (initialPostId) {
      setPostId(initialPostId);
      loadPost(initialPostId);
    }
  }, [initialPostId, loadPost]);

  // ============================================================================
  // UPDATE FIELD
  // ============================================================================

  const updateField = useCallback(
    <K extends keyof PostFormData>(field: K, value: PostFormData[K]) => {
      // Track manual edits to slug and excerpt
      if (field === "slug") {
        userEditedSlugRef.current = true;
      }
      if (field === "excerpt") {
        userEditedExcerptRef.current = true;
      }

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

  // Auto-generate slug from title with debouncing (unless user manually edited it)
  const debouncedTitle = useDebounce(formData.title, 300);
  useEffect(() => {
    if (debouncedTitle && !userEditedSlugRef.current) {
      const newSlug = generateSlugFromTitle(debouncedTitle);
      setFormData((prev) => ({ ...prev, slug: newSlug }));
    }
  }, [debouncedTitle]);

  // Auto-generate excerpt from content with debouncing (unless user manually edited it)
  const debouncedContent = useDebounce(formData.content, 500);
  useEffect(() => {
    if (debouncedContent && !userEditedExcerptRef.current) {
      const newExcerpt = extractExcerpt(debouncedContent);
      setFormData((prev) => ({ ...prev, excerpt: newExcerpt }));
    }
  }, [debouncedContent]);

  // ============================================================================
  // VALIDATION
  // ============================================================================

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    // Slug validation removed - database trigger generates it automatically

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    if (formData.status === "scheduled" && !formData.scheduled_for) {
      newErrors.scheduled_for =
        "Scheduled date is required for scheduled posts";
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

      const postData: CreateBlogPostInput = {
        title: formData.title,
        slug: formData.slug, // Include slug for updates
        content: formData.content,
        excerpt: formData.excerpt,
        status: "draft",
        featured_image: formData.featured_image,
        category_ids: formData.category_ids,
        tag_ids: formData.tag_ids,
        comments_enabled: formData.comments_enabled,
        is_featured: formData.is_featured,
        seo_metadata: formData.seo_metadata,
      };

      let savedPostId: string;

      if (postId) {
        await updatePost({ ...postData, id: postId });
        savedPostId = postId;
      } else {
        const newPost = await createPost(postData);
        savedPostId = newPost.id;
        // Update postId state so subsequent saves are updates, not creates
        setPostId(newPost.id);
        // Update URL
        window.history.replaceState(null, "", `/admin/blog/${newPost.id}/edit`);
      }

      // Reload post to get auto-generated values (slug, excerpt, read_time)
      const savedPost = await getPostById(savedPostId);
      const updatedData: PostFormData = {
        title: savedPost.title,
        slug: savedPost.slug,
        content: savedPost.content,
        excerpt: savedPost.excerpt || "",
        status: savedPost.status,
        featured_image: savedPost.featured_image,
        category_ids: savedPost.categories?.map((c) => c.id) || [],
        tag_ids: savedPost.tags?.map((t) => t.id) || [],
        scheduled_for: savedPost.scheduled_for,
        comments_enabled: savedPost.comments_enabled,
        is_featured: savedPost.is_featured,
        seo_metadata: savedPost.seo_metadata || { robots_meta: "index,follow" },
      };

      setFormData(updatedData);
      setLastSaved(new Date());
      setIsDirty(false);
      initialDataRef.current = updatedData;

      // Reset user-edited flags after save to allow auto-generation to continue
      userEditedSlugRef.current = false;
      userEditedExcerptRef.current = false;
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

      const postData: CreateBlogPostInput = {
        title: formData.title,
        slug: formData.slug, // Include slug for updates
        content: formData.content,
        excerpt: formData.excerpt,
        status: formData.status === "scheduled" ? "scheduled" : "published",
        featured_image: formData.featured_image,
        category_ids: formData.category_ids,
        tag_ids: formData.tag_ids,
        scheduled_for: formData.scheduled_for,
        comments_enabled: formData.comments_enabled,
        is_featured: formData.is_featured,
        seo_metadata: formData.seo_metadata,
      };

      let currentPostId = postId;

      if (postId) {
        await updatePost({ ...postData, id: postId });
      } else {
        const newPost = await createPost(postData);
        currentPostId = newPost.id;
        // Update postId state
        setPostId(newPost.id);
        window.history.replaceState(null, "", `/admin/blog/${newPost.id}/edit`);
      }

      if (currentPostId && formData.status !== "scheduled") {
        await publishPost(currentPostId);
      }

      // Reload post to get auto-generated values (slug, excerpt, read_time)
      if (currentPostId) {
        const savedPost = await getPostById(currentPostId);
        const updatedData: PostFormData = {
          title: savedPost.title,
          slug: savedPost.slug,
          content: savedPost.content,
          excerpt: savedPost.excerpt || "",
          status: savedPost.status,
          featured_image: savedPost.featured_image,
          category_ids: savedPost.categories?.map((c) => c.id) || [],
          tag_ids: savedPost.tags?.map((t) => t.id) || [],
          scheduled_for: savedPost.scheduled_for,
          comments_enabled: savedPost.comments_enabled,
          is_featured: savedPost.is_featured,
          seo_metadata: savedPost.seo_metadata || {
            robots_meta: "index,follow",
          },
        };

        setFormData(updatedData);
        initialDataRef.current = updatedData;

        // Reset user-edited flags after save to allow auto-generation to continue
        userEditedSlugRef.current = false;
        userEditedExcerptRef.current = false;
      }

      setLastSaved(new Date());
      setIsDirty(false);
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
