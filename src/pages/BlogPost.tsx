/**
 * Blog Post Page Component
 *
 * Single blog post view with:
 * - SEO optimization (meta tags, structured data)
 * - Reading progress bar
 * - Share buttons
 * - Author card
 * - Related posts
 * - View count tracking
 *
 * @module pages/BlogPost
 */

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import {
  Clock,
  Eye,
  Calendar,
  ArrowLeft,
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  Link as LinkIcon,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { PostContent } from "@/components/blog/PostContent";
import { AuthorCard } from "@/components/blog/AuthorCard";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { getPostBySlug, incrementViewCount } from "@/services/blogService";
import { calculateReadTime } from "@/lib/seoUtils";
import type { BlogPostWithRelations } from "@/components/admin/blog/types";

// ============================================================================
// CONSTANTS
// ============================================================================

const SITE_NAME = "Your Blog";
const SITE_URL = "https://yourdomain.com";

// ============================================================================
// COMPONENT
// ============================================================================

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // ============================================================================
  // STATE
  // ============================================================================

  const [post, setPost] = useState<BlogPostWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  // ============================================================================
  // FETCH POST
  // ============================================================================

  const fetchPost = useCallback(async () => {
    if (!slug) {
      setError("No post slug provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const postData = await getPostBySlug(slug);

      if (!postData) {
        setError("Post not found");
        setLoading(false);
        return;
      }

      setPost(postData);

      // Increment view count (fire and forget)
      incrementViewCount(postData.id).catch((err) =>
        console.warn("Failed to increment view count:", err)
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch post";
      setError(errorMessage);
      console.error("Failed to fetch post:", err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  // ============================================================================
  // READING PROGRESS
  // ============================================================================

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollPercentage =
        (scrollTop / (documentHeight - windowHeight)) * 100;

      setReadingProgress(Math.min(100, Math.max(0, scrollPercentage)));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const readTime = React.useMemo(() => {
    return post ? calculateReadTime(post.content) : 0;
  }, [post]);

  const publishedDate = React.useMemo(() => {
    if (!post) return "";
    const date = post.published_at || post.created_at;
    return format(new Date(date), "MMMM d, yyyy");
  }, [post]);

  const postUrl = `${SITE_URL}/blog/${slug}`;

  // ============================================================================
  // SHARE HANDLERS
  // ============================================================================

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Post link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard",
        variant: "destructive",
      });
    }
  }, [postUrl, toast]);

  const handleShareTwitter = useCallback(() => {
    const text = `Check out: ${post?.title}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(postUrl)}`;
    window.open(url, "_blank", "width=550,height=420");
  }, [post?.title, postUrl]);

  const handleShareLinkedIn = useCallback(() => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      postUrl
    )}`;
    window.open(url, "_blank", "width=550,height=420");
  }, [postUrl]);

  const handleShareFacebook = useCallback(() => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      postUrl
    )}`;
    window.open(url, "_blank", "width=550,height=420");
  }, [postUrl]);

  // ============================================================================
  // SEO META TAGS
  // ============================================================================

  const metaTags = React.useMemo(() => {
    if (!post) {
      return {
        title: SITE_NAME,
        description: "",
        canonicalUrl: postUrl,
      };
    }

    return {
      title: `${post.title} - ${SITE_NAME}`,
      description: post.excerpt || post.seo_metadata?.meta_description || "",
      canonicalUrl: postUrl,
      ogTitle: post.seo_metadata?.meta_title || post.title,
      ogDescription: post.seo_metadata?.meta_description || post.excerpt || "",
      ogImage: post.seo_metadata?.og_image || post.featured_image || "",
      ogType: "article",
      twitterCard: "summary_large_image",
      keywords: Array.isArray(post.seo_metadata?.keywords)
        ? post.seo_metadata.keywords.join(", ")
        : "",
    };
  }, [post, postUrl]);

  // ============================================================================
  // RENDER LOADING
  // ============================================================================

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Skeleton className="aspect-video w-full mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER ERROR
  // ============================================================================

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Card className="text-center py-12">
          <CardContent>
            <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error || "The post you are looking for does not exist."}
            </p>
            <Button onClick={() => navigate("/blog")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============================================================================
  // RENDER POST
  // ============================================================================

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
        <link rel="canonical" href={metaTags.canonicalUrl} />

        {/* Keywords */}
        {metaTags.keywords && (
          <meta name="keywords" content={metaTags.keywords} />
        )}

        {/* Open Graph */}
        <meta property="og:title" content={metaTags.ogTitle} />
        <meta property="og:description" content={metaTags.ogDescription} />
        <meta property="og:type" content={metaTags.ogType} />
        <meta property="og:url" content={metaTags.canonicalUrl} />
        {metaTags.ogImage && (
          <meta property="og:image" content={metaTags.ogImage} />
        )}
        <meta
          property="article:published_time"
          content={post.published_at || post.created_at}
        />
        {post.categories && post.categories.length > 0 && (
          <meta property="article:section" content={post.categories[0].name} />
        )}

        {/* Twitter Card */}
        <meta name="twitter:card" content={metaTags.twitterCard} />
        <meta name="twitter:title" content={metaTags.ogTitle} />
        <meta name="twitter:description" content={metaTags.ogDescription} />
        {metaTags.ogImage && (
          <meta name="twitter:image" content={metaTags.ogImage} />
        )}

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            image: post.featured_image,
            datePublished: post.published_at || post.created_at,
            dateModified: post.updated_at,
            author: {
              "@type": "Person",
              name: post.author?.full_name || "Anonymous",
            },
            publisher: {
              "@type": "Organization",
              name: SITE_NAME,
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": postUrl,
            },
          })}
        </script>
      </Helmet>

      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-150"
        style={{ width: `${readingProgress}%` }}
      />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/blog")}
          className="mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Button>

        {/* Post Header */}
        <header className="mb-8">
          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((category) => (
                <Badge key={category.id} variant="secondary">
                  <Link to={`/blog?category=${category.id}`}>
                    {category.name}
                  </Link>
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.published_at || post.created_at}>
                {publishedDate}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{readTime} min read</span>
            </div>
            {post.view_count > 0 && (
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{post.view_count.toLocaleString()} views</span>
              </div>
            )}
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">Share:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareTwitter}
              aria-label="Share on Twitter"
            >
              <Twitter className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareLinkedIn}
              aria-label="Share on LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareFacebook}
              aria-label="Share on Facebook"
            >
              <Facebook className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              aria-label="Copy link"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <LinkIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </header>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-auto"
              loading="eager"
            />
          </div>
        )}

        {/* Post Content */}
        <PostContent content={post.content} showTableOfContents />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8">
            <Separator className="mb-6" />
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground mr-2">Tags:</span>
              {post.tags.map((tag) => (
                <Badge key={tag.id} variant="outline">
                  <Link to={`/blog?tag=${tag.id}`}>#{tag.name}</Link>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Author Card */}
        {post.author && (
          <div className="mt-12">
            <Separator className="mb-8" />
            <AuthorCard author={post.author} />
          </div>
        )}

        {/* Related Posts */}
        <div className="mt-16">
          <Separator className="mb-12" />
          <RelatedPosts
            currentPostId={post.id}
            categoryIds={post.categories?.map((c) => c.id)}
            tagIds={post.tags?.map((t) => t.id)}
            limit={3}
          />
        </div>
      </div>
    </>
  );
}
