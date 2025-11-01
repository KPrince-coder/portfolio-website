/**
 * Sitemap Page
 *
 * Generates and serves XML sitemap for SEO
 * This component can be used as a route handler
 *
 * @module pages/Sitemap
 */

import { useEffect, useState } from "react";
import { generateSitemap } from "@/lib/sitemapGenerator";

export function Sitemap() {
  const [sitemap, setSitemap] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSitemap() {
      try {
        const xml = await generateSitemap({
          baseUrl: window.location.origin,
          includeStaticPages: true,
          includeBlogPosts: true,
        });
        setSitemap(xml);
      } catch (error) {
        console.error("Failed to generate sitemap:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSitemap();
  }, []);

  if (loading) {
    return <div>Generating sitemap...</div>;
  }

  return (
    <pre
      style={{
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
        fontFamily: "monospace",
        fontSize: "12px",
        padding: "20px",
      }}
    >
      {sitemap}
    </pre>
  );
}
