import React, { lazy, Suspense, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import ParticleSystem from "@/components/ParticleSystem";
import Navigation from "@/components/Navigation";
import Hero from "@/components/hero";
import { Footer } from "@/components/footer";
import { usePublicBrandIdentity } from "@/hooks/useBrandIdentity";
import { useOGImageSettings } from "@/hooks/useOGImageSettings";
import { SEO_CONFIG } from "@/config/seo.config";

// Lazy load below-the-fold components for better performance
const About = lazy(() => import("@/components/about"));
const Skills = lazy(() => import("@/components/skills"));
const Projects = lazy(() =>
  import("@/components/projects").then((module) => ({
    default: module.Projects,
  }))
);
const Resume = lazy(() =>
  import("@/components/resume").then((module) => ({
    default: module.Resume,
  }))
);
const Contact = lazy(() =>
  import("@/components/contact").then((module) => ({
    default: module.Contact,
  }))
);

const Index: React.FC = () => {
  const { brandIdentity } = usePublicBrandIdentity();
  const { getOGImageUrl } = useOGImageSettings();

  // SEO meta tags with brand identity
  const metaTitle =
    brandIdentity?.meta_title || `${SEO_CONFIG.siteName} - Portfolio`;
  const metaDescription =
    brandIdentity?.meta_description ||
    "Professional portfolio showcasing projects, skills, and experience in software development.";
  const metaKeywords =
    brandIdentity?.meta_keywords?.join(", ") ||
    "portfolio, software developer, web development, projects";

  // Dynamic OG image URL
  const ogImageUrl = getOGImageUrl();

  // Update favicon if provided
  useEffect(() => {
    if (brandIdentity?.favicon_url) {
      const link = document.querySelector(
        "link[rel='icon']"
      ) as HTMLLinkElement;
      if (link) {
        link.href = brandIdentity.favicon_url;
      } else {
        const newLink = document.createElement("link");
        newLink.rel = "icon";
        newLink.href = brandIdentity.favicon_url;
        document.head.appendChild(newLink);
      }
    }
  }, [brandIdentity?.favicon_url]);

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        <link rel="canonical" href={SEO_CONFIG.siteUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SEO_CONFIG.siteUrl} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={metaTitle} />
        <meta
          property="og:site_name"
          content={brandIdentity?.logo_text || SEO_CONFIG.siteName}
        />
        <meta property="og:locale" content={SEO_CONFIG.locale} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImageUrl} />
        {SEO_CONFIG.twitterHandle && (
          <meta name="twitter:site" content={SEO_CONFIG.twitterHandle} />
        )}

        {/* Additional Meta Tags */}
        <meta name="author" content={SEO_CONFIG.defaultAuthor} />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        {/* Particle Background */}
        <ParticleSystem />

        {/* Navigation */}
        <Navigation />

        {/* Main Content */}
        <main>
          <Hero />
          <Suspense fallback={<div className="min-h-screen" />}>
            <About />
            <Skills />
            <Projects />
            <Resume />
            <Contact />
          </Suspense>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default Index;
