/**
 * Post Content Component
 *
 * Renders blog post markdown content with:
 * - Syntax highlighting for code blocks
 * - Responsive images with lazy loading
 * - Auto-generated table of contents
 * - Anchor links to headings
 * - Optimized typography
 *
 * @module blog/PostContent
 */

import React, { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ============================================================================
// TYPES
// ============================================================================

interface PostContentProps {
  content: string;
  showTableOfContents?: boolean;
  className?: string;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Extract headings from markdown content for table of contents
 */
function extractHeadings(content: string): TocItem[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    headings.push({ id, text, level });
  }

  return headings;
}

/**
 * Scroll to heading with smooth behavior
 */
function scrollToHeading(id: string) {
  const element = document.getElementById(id);
  if (element) {
    const offset = 80; // Account for fixed header
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
}

// ============================================================================
// COMPONENT
// ============================================================================

export const PostContent = React.memo<PostContentProps>(function PostContent({
  content,
  showTableOfContents = true,
  className = "",
}) {
  const { toast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // ============================================================================
  // MEMOIZED VALUES
  // ============================================================================

  const headings = useMemo(() => extractHeadings(content), [content]);

  const hasTableOfContents = showTableOfContents && headings.length > 0;

  // ============================================================================
  // CODE COPY HANDLER
  // ============================================================================

  const handleCopyCode = async (code: string, language: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast({
        title: "Code copied!",
        description: `${language} code copied to clipboard`,
      });
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy code to clipboard",
        variant: "destructive",
      });
    }
  };

  // ============================================================================
  // MARKDOWN COMPONENTS
  // ============================================================================

  const components = useMemo(
    () => ({
      // Headings with anchor links
      h1: ({ children, ...props }: any) => {
        const text = children?.toString() || "";
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-");
        return (
          <h1 id={id} className="scroll-mt-20" {...props}>
            {children}
          </h1>
        );
      },
      h2: ({ children, ...props }: any) => {
        const text = children?.toString() || "";
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-");
        return (
          <h2 id={id} className="scroll-mt-20" {...props}>
            {children}
          </h2>
        );
      },
      h3: ({ children, ...props }: any) => {
        const text = children?.toString() || "";
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-");
        return (
          <h3 id={id} className="scroll-mt-20" {...props}>
            {children}
          </h3>
        );
      },

      // Code blocks with syntax highlighting and enhanced design
      code: ({ inline, className, children, ...props }: any) => {
        const matchResult = /language-(\w+)/.exec(className || "");
        const language = matchResult ? matchResult[1] : "";
        const codeString = String(children).replace(/\n$/, "");

        if (!inline && language) {
          const isCopied = copiedCode === codeString;

          return (
            <div className="relative group my-6">
              {/* Language Badge */}
              <div className="absolute top-0 left-0 px-3 py-1 bg-primary/10 text-primary text-xs font-mono rounded-br-lg rounded-tl-lg z-10">
                {language}
              </div>

              {/* Copy Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopyCode(codeString, language)}
                className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                title="Copy code"
              >
                {isCopied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>

              <SyntaxHighlighter
                style={vscDarkPlus}
                language={language}
                PreTag="div"
                className="!bg-[#1e1e1e] !m-0"
                showLineNumbers
                customStyle={{
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  padding: "1.5rem",
                  paddingTop: "2.5rem",
                }}
                codeTagProps={{
                  style: {
                    fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
                  },
                }}
                {...props}
              >
                {codeString}
              </SyntaxHighlighter>
            </div>
          );
        }

        return (
          <code
            className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary"
            {...props}
          >
            {children}
          </code>
        );
      },

      // Images with lazy loading and responsive sizing
      img: ({ src, alt, ...props }: any) => (
        <img
          src={src}
          alt={alt || ""}
          loading="lazy"
          decoding="async"
          className="rounded-lg w-full h-auto my-4"
          {...props}
        />
      ),

      // Links with external link handling
      a: ({ href, children, ...props }: any) => {
        const isExternal = href?.startsWith("http");
        return (
          <a
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="text-primary hover:underline"
            {...props}
          >
            {children}
          </a>
        );
      },

      // Blockquotes
      blockquote: ({ children, ...props }: any) => (
        <blockquote
          className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground"
          {...props}
        >
          {children}
        </blockquote>
      ),

      // Tables
      table: ({ children, ...props }: any) => (
        <div className="overflow-x-auto my-4">
          <table className="w-full border-collapse" {...props}>
            {children}
          </table>
        </div>
      ),
      th: ({ children, ...props }: any) => (
        <th
          className="border border-border bg-muted px-4 py-2 text-left font-semibold"
          {...props}
        >
          {children}
        </th>
      ),
      td: ({ children, ...props }: any) => (
        <td className="border border-border px-4 py-2" {...props}>
          {children}
        </td>
      ),

      // Lists
      ul: ({ children, ...props }: any) => (
        <ul className="list-disc list-inside my-4 space-y-2" {...props}>
          {children}
        </ul>
      ),
      ol: ({ children, ...props }: any) => (
        <ol className="list-decimal list-inside my-4 space-y-2" {...props}>
          {children}
        </ol>
      ),

      // Horizontal rule
      hr: (props: any) => <Separator className="my-8" {...props} />,

      // Paragraphs
      p: ({ children, ...props }: any) => (
        <p className="my-4 leading-7" {...props}>
          {children}
        </p>
      ),
    }),
    []
  );

  // ============================================================================
  // RENDER TABLE OF CONTENTS
  // ============================================================================

  const renderTableOfContents = () => {
    if (!hasTableOfContents) return null;

    return (
      <Card className="p-6 mb-8 sticky top-20">
        <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
        <nav className="space-y-2">
          {headings.map((heading) => (
            <button
              key={heading.id}
              onClick={() => scrollToHeading(heading.id)}
              className={`
                block w-full text-left text-sm hover:text-primary transition-colors
                ${heading.level === 1 ? "font-semibold" : ""}
                ${heading.level === 2 ? "pl-4" : ""}
                ${heading.level === 3 ? "pl-8 text-muted-foreground" : ""}
              `}
            >
              {heading.text}
            </button>
          ))}
        </nav>
      </Card>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-4 gap-8 ${className}`}>
      {/* Table of Contents - Desktop */}
      {hasTableOfContents && (
        <aside className="hidden lg:block lg:col-span-1">
          {renderTableOfContents()}
        </aside>
      )}

      {/* Main Content */}
      <article
        className={`
          prose prose-slate dark:prose-invert max-w-none
          ${hasTableOfContents ? "lg:col-span-3" : "lg:col-span-4"}
        `}
      >
        {/* Table of Contents - Mobile */}
        {hasTableOfContents && (
          <div className="lg:hidden mb-8">{renderTableOfContents()}</div>
        )}

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSlug]}
          components={components}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
});

PostContent.displayName = "PostContent";
