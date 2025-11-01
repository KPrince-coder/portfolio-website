/**
 * Blog SEO Component - Optimized Version
 *
 * Comprehensive SEO component with:
 * - Dynamic meta tags
 * - Enhanced Open Graph tags
 * - Twitter Card tags
 * - Rich structured data (Schema.org)
 * - Canonical URLs
 * - Image optimization
 * - Type safety
 * - Configuration management
 *
 * @module blog/BlogSEO
 */

import React from "react";
import { Helmet } from "react-helmet-async";
import { SEO_CONFIG } from "@/config/seo.config";

// ============================================================================
// TYPES
// ============================================================================

interface BaseSEOProps {
  title: string;
  description: string;
  canonicalUrl: string;
  image?: string;
  keywords?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

interface WebsiteSEOProps extends BaseSEOProps {
  type: "website";
}

interface ArticleSEOProps extends BaseSEOProps {
  type: "article";
  author: string;
  publishedTime: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  readingTime?: number;
  wordCount?: number;
}

export type BlogSEOProps = WebsiteSEOProps | ArticleSEOProps;

interface SEOImage {
  url: string;
  width: number;
  height: number;
  type: string;
}

// ============================================================================
// UTILITIES
// ============================================================================

function isArticleSEO(props: BlogSEOProps): props is ArticleSEOProps {
  return props.type === "article";
}

function validateOGImage(imageUrl?: string): SEOImage | null {
  if (!imageUrl) return null;

  const url = imageUrl.startsWith("http")
    ? imageUrl
    : `${SEO_CONFIG.siteUrl}${imageUrl}`;

  return {
    url,
    width: 1200,
    height: 630,
    type: "image/jpeg",
  };
}

function getDefaultOGImage(): SEOImage {
  return {
    url: `${SEO_CONFIG.siteUrl}${SEO_CONFIG.defaultImage}`,
    width: 1200,
    height: 630,
    type: "image/jpeg",
  };
}

// ============================================================================
// COMPONENT
// ============================================================================

export const BlogSEO = React.memo<BlogSEOProps>(function BlogSEO(props) {
  const {
    title,
    description,
    canonicalUrl,
    type,
    image,
    keywords,
    noindex = false,
    nofollow = false,
  } = props;

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const fullTitle = React.useMemo(() => {
    return title.includes(SEO_CONFIG.siteName)
      ? title
      : `${title} | ${SEO_CONFIG.siteName}`;
  }, [title]);

  const robotsMeta = React.useMemo(() => {
    const robots = [];
    if (noindex) robots.push("noindex");
    else robots.push("index");
    if (nofollow) robots.push("nofollow");
    else robots.push("follow");
    return robots.join(", ");
  }, [noindex, nofollow]);

  const ogImage = React.useMemo(() => {
    return validateOGImage(image) || getDefaultOGImage();
  }, [image]);

  // Memoize author schema separately
  const authorSchema = React.useMemo(() => {
    if (!isArticleSEO(props)) return undefined;
    return {
      "@type": "Person" as const,
      name: props.author,
      url: `${SEO_CONFIG.siteUrl}/about`,
    };
  }, [props]);

  // Memoize publisher schema (static)
  const publisherSchema = React.useMemo(
    () => ({
      "@type": "Organization" as const,
      name: SEO_CONFIG.siteName,
      logo: {
        "@type": "ImageObject" as const,
        url: `${SEO_CONFIG.siteUrl}/logo.png`,
        width: 600,
        height: 60,
      },
    }),
    []
  );

  // Memoize breadcrumb schema
  const breadcrumbSchema = React.useMemo(() => {
    if (!isArticleSEO(props)) return undefined;

    return {
      "@type": "BreadcrumbList" as const,
      itemListElement: [
        {
          "@type": "ListItem" as const,
          position: 1,
          name: "Home",
          item: SEO_CONFIG.siteUrl,
        },
        {
          "@type": "ListItem" as const,
          position: 2,
          name: "Blog",
          item: `${SEO_CONFIG.siteUrl}/blog`,
        },
        {
          "@type": "ListItem" as const,
          position: 3,
          name: title,
          item: canonicalUrl,
        },
      ],
    };
  }, [props, title, canonicalUrl]);

  const structuredData = React.useMemo(() => {
    if (isArticleSEO(props)) {
      return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description,
        image: {
          "@type": "ImageObject",
          url: ogImage.url,
          width: ogImage.width,
          height: ogImage.height,
        },
        datePublished: props.publishedTime,
        dateModified: props.modifiedTime || props.publishedTime,
        author: authorSchema,
        publisher: publisherSchema,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonicalUrl,
        },
        keywords: keywords || undefined,
        articleSection: props.section || undefined,
        wordCount: props.wordCount,
        timeRequired: props.readingTime ? `PT${props.readingTime}M` : undefined,
        inLanguage: SEO_CONFIG.locale.split("_")[0],
        isAccessibleForFree: true,
        breadcrumb: breadcrumbSchema,
      };
    }

    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SEO_CONFIG.siteName,
      description,
      url: canonicalUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SEO_CONFIG.siteUrl}/blog?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    };
  }, [
    props,
    title,
    description,
    ogImage,
    canonicalUrl,
    keywords,
    authorSchema,
    publisherSchema,
    breadcrumbSchema,
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
      <meta property="og:site_name" content={SEO_CONFIG.siteName} />
      <meta property="og:locale" content={SEO_CONFIG.locale} />
      <meta property="og:image" content={ogImage.url} />
      <meta property="og:image:width" content={ogImage.width.toString()} />
      <meta property="og:image:height" content={ogImage.height.toString()} />
      <meta property="og:image:type" content={ogImage.type} />
      <meta property="og:image:alt" content={title} />

      {/* Article-specific Open Graph Tags */}
      {isArticleSEO(props) && (
        <>
          <meta
            property="article:published_time"
            content={props.publishedTime}
          />
          {props.modifiedTime && (
            <meta
              property="article:modified_time"
              content={props.modifiedTime}
            />
          )}
          <meta property="article:author" content={props.author} />
          {props.section && (
            <meta property="article:section" content={props.section} />
          )}
          {props.tags?.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={SEO_CONFIG.twitterCardType} />
      <meta name="twitter:site" content={SEO_CONFIG.twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage.url} />
      <meta name="twitter:image:alt" content={title} />
      {isArticleSEO(props) && (
        <meta name="twitter:creator" content={SEO_CONFIG.twitterHandle} />
      )}

      {/* RSS Feed */}
      <link
        rel="alternate"
        type="application/rss+xml"
        title={`${SEO_CONFIG.siteName} RSS Feed`}
        href={`${SEO_CONFIG.siteUrl}/rss.xml`}
      />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
});

BlogSEO.displayName = "BlogSEO";
