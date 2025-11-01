/**
 * RSS Feed Page
 *
 * Generates and serves RSS feed for blog posts
 * This component can be used as a route handler
 *
 * @module pages/RSSFeed
 */

import { useEffect, useState } from "react";
import { generateRSSFeed } from "@/lib/rssFeedGenerator";

export function RSSFeed() {
  const [feed, setFeed] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeed() {
      try {
        const xml = await generateRSSFeed({
          baseUrl: window.location.origin,
          title: "Your Blog",
          description: "Latest blog posts and articles",
          maxItems: 50,
          includeFullContent: false,
        });
        setFeed(xml);
      } catch (error) {
        console.error("Failed to generate RSS feed:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeed();
  }, []);

  if (loading) {
    return <div>Generating RSS feed...</div>;
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
      {feed}
    </pre>
  );
}
