/**
 * Blog SEO Component
 *
 * Reusable SEO component for blog pages with:
 * - Dynamic meta tags
 * - Open Graph tags
 * - Twitter Card tags
 * - Structured data (Schema.org)
 * - Canonical URLs
 *
 * @module blog/BlogSEO
 */

import React from "react";
import { Helmet } from "react-helmet-async";

// ============================================================================
// TYPES
// ============================================================================

interface BlogSEOProps {
  title: string;
  description: string;
  canonicalUrl: string;
  type?: "website" | "article";
  image?: string;
  keywords?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  nofollow?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const SITE_NAME = "Your Blog";
const TWITTER_HANDLE = "@yourblog";

// ============================================================================
// COMPONENT
// ============================================================================

export const BlogSEO = React.memo<BlogSEOProps>(function BlogSEO({
  title,
  description,
  canonicalUrl,
  type = "website",
  image,
  keywords,
  author,
  publishedTime,
  modifiedTime,
  section,
  tags,
  noindex = false,
  nofollow = false,
}) {
  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} - ${SITE_NAME}`;

  const robotsMeta = React.useMemo(() => {
    const robots = [];
    if (noindex) robots.push("noindex");
    if (nofollow) robots.push("nofollow");
    return robots.length > 0 ? robots.join(", ") : "index, follow";
  }, [noindex, nofollow]);

  const structuredData = React.useMemo(() => {
    if (type === "article") {
      return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description,
        image: image || undefined,
        datePublished: publishedTime,
        dateModified: modifiedTime || publishedTime,
        author: author
          ? {
              "@type": "Person",
              name: author,
            }
          : undefined,
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonicalUrl,
        },
        keywords: keywords || undefined,
        articleSection: section || undefined,
      };
    }

    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      description,
      url: canonicalUrl,
    };
  }, [
    type,
    title,
    description,
    image,
    publishedTime,
    modifiedTime,
    author,
    canonicalUrl,
    keywords,
    section,
  ]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content={robotsMeta} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      {image && <meta property="og:image" content={image} />}
      {image && <meta property="og:image:alt" content={title} />}

      {/* Article-specific Open Graph Tags */}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}
      {type === "article" && section && (
        <meta property="article:section" content={section} />
      )}
      {type === "article" &&
        tags &&
        tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      {image && <meta name="twitter:image:alt" content={title} />}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
});

BlogSEO.displayName = "BlogSEO";
