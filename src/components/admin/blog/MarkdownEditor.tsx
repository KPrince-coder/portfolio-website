/**
 * Markdown Editor Component
 *
 * Split-view Markdown editor with:
 * - Live preview
 * - Syntax highlighting
 * - Toolbar with formatting options
 * - Image insertion
 * - Code block support
 *
 * @module blog/MarkdownEditor
 */

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

// ============================================================================
// TYPES
// ============================================================================

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageInsert?: () => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
}

interface ToolbarButton {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  action: () => void;
  separator?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function MarkdownEditor({
  value,
  onChange,
  onImageInsert,
  placeholder = "Write your post content in Markdown...",
  minHeight = "600px",
  maxHeight = "600px",
}: MarkdownEditorProps) {
  const [view, setView] = useState<"edit" | "preview" | "split">("split");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewValue, setPreviewValue] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ============================================================================
  // DEBOUNCED PREVIEW
  // ============================================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviewValue(value);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [value]);

  // ============================================================================
  // MARKDOWN HELPERS
  // ============================================================================

  const insertMarkdown = useCallback(
    (before: string, after: string = "", placeholder: string = "") => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      const textToInsert = selectedText || placeholder;

      const newValue =
        value.substring(0, start) +
        before +
        textToInsert +
        after +
        value.substring(end);

      onChange(newValue);

      // Set cursor position with better focus management
      requestAnimationFrame(() => {
        textarea.focus();
        const newCursorPos = start + before.length + textToInsert.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      });
    },
    [value, onChange]
  );

  // ============================================================================
  // KEYBOARD SHORTCUTS
  // ============================================================================

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC = Exit fullscreen
      if (e.key === "Escape" && isFullscreen) {
        e.preventDefault();
        setIsFullscreen(false);
        return;
      }

      // Ctrl/Cmd + B = Bold
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        insertMarkdown("**", "**", "bold text");
      }

      // Ctrl/Cmd + I = Italic
      if ((e.ctrlKey || e.metaKey) && e.key === "i") {
        e.preventDefault();
        insertMarkdown("*", "*", "italic text");
      }

      // Ctrl/Cmd + K = Link
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        insertMarkdown("[", "](url)", "link text");
      }

      // Ctrl/Cmd + Shift + C = Code block
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "C") {
        e.preventDefault();
        insertMarkdown("```\n", "\n```", "code");
      }
    };

    // Add global listener for ESC in fullscreen
    if (isFullscreen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener("keydown", handleKeyDown);
      return () => textarea.removeEventListener("keydown", handleKeyDown);
    }
  }, [insertMarkdown, isFullscreen]);

  // ============================================================================
  // TOOLBAR ACTIONS
  // ============================================================================

  const toolbarButtons: ToolbarButton[] = useMemo(
    () => [
      {
        icon: Bold,
        label: "Bold",
        action: () => insertMarkdown("**", "**", "bold text"),
      },
      {
        icon: Italic,
        label: "Italic",
        action: () => insertMarkdown("*", "*", "italic text"),
      },
      {
        icon: Heading1,
        label: "Heading 1",
        action: () => insertMarkdown("# ", "", "Heading 1"),
        separator: true,
      },
      {
        icon: Heading2,
        label: "Heading 2",
        action: () => insertMarkdown("## ", "", "Heading 2"),
      },
      {
        icon: Heading3,
        label: "Heading 3",
        action: () => insertMarkdown("### ", "", "Heading 3"),
        separator: true,
      },
      {
        icon: List,
        label: "Bullet List",
        action: () => insertMarkdown("- ", "", "List item"),
      },
      {
        icon: ListOrdered,
        label: "Numbered List",
        action: () => insertMarkdown("1. ", "", "List item"),
        separator: true,
      },
      {
        icon: Link,
        label: "Link",
        action: () => insertMarkdown("[", "](url)", "link text"),
      },
      {
        icon: Image,
        label: "Image",
        action: () => {
          if (onImageInsert) {
            onImageInsert();
          } else {
            insertMarkdown("![", "](image-url)", "alt text");
          }
        },
        separator: true,
      },
      {
        icon: Code,
        label: "Code Block",
        action: () => insertMarkdown("```\n", "\n```", "code"),
      },
    ],
    [insertMarkdown, onImageInsert]
  );

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderToolbar = () => (
    <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
      {toolbarButtons.map((button, index) => (
        <React.Fragment key={index}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={button.action}
            title={button.label}
            aria-label={button.label}
            className="h-8 w-8 p-0"
          >
            <button.icon className="h-4 w-4" aria-hidden="true" />
          </Button>
          {button.separator && <div className="h-6 w-px bg-border mx-1" />}
        </React.Fragment>
      ))}

      <div className="flex-1" />

      {/* View Toggle */}
      <div className="flex items-center gap-1 border-l pl-2 ml-2">
        <Button
          type="button"
          variant={view === "edit" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setView("edit")}
          className="h-8 px-2"
        >
          Edit
        </Button>
        <Button
          type="button"
          variant={view === "split" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setView("split")}
          className="h-8 px-2"
        >
          Split
        </Button>
        <Button
          type="button"
          variant={view === "preview" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setView("preview")}
          className="h-8 px-2"
        >
          Preview
        </Button>
      </div>

      {/* Fullscreen Toggle */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setIsFullscreen(!isFullscreen)}
        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        className="h-8 w-8 p-0 ml-2"
      >
        {isFullscreen ? (
          <Minimize2 className="h-4 w-4" />
        ) : (
          <Maximize2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );

  const renderEditor = () => (
    <div className="relative flex-1 flex flex-col">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full flex-1 resize-none border-0 focus-visible:ring-0 font-mono text-sm"
        style={{
          minHeight: isFullscreen ? "80vh" : minHeight,
          maxHeight: isFullscreen ? "80vh" : maxHeight,
          height: isFullscreen ? "80vh" : maxHeight,
        }}
      />
    </div>
  );

  // Memoized preview component for better performance - matches PostContent styling
  const MarkdownPreview = useMemo(
    () => (
      <div
        className="prose prose-slate dark:prose-invert max-w-none p-4 overflow-auto flex-1"
        style={{
          minHeight: isFullscreen ? "80vh" : minHeight,
          maxHeight: isFullscreen ? "80vh" : maxHeight,
          height: isFullscreen ? "80vh" : maxHeight,
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Code blocks with syntax highlighting - matches PostContent
            code: ({ inline, className, children, ...props }: any) => {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "";

              if (!inline && language) {
                return (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={language}
                    PreTag="div"
                    className="rounded-lg my-4 !bg-[#1e1e1e]"
                    showLineNumbers
                    customStyle={{
                      margin: "1rem 0",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                    }}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                );
              }

              return (
                <code
                  className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            },

            // Headings with proper styling
            h1: ({ children, ...props }: any) => (
              <h1 className="text-3xl font-bold mt-8 mb-4" {...props}>
                {children}
              </h1>
            ),
            h2: ({ children, ...props }: any) => (
              <h2 className="text-2xl font-bold mt-6 mb-3" {...props}>
                {children}
              </h2>
            ),
            h3: ({ children, ...props }: any) => (
              <h3 className="text-xl font-semibold mt-4 mb-2" {...props}>
                {children}
              </h3>
            ),

            // Images with lazy loading
            img: ({ src, alt, ...props }: any) => (
              <img
                src={src}
                alt={alt || ""}
                loading="lazy"
                className="rounded-lg w-full h-auto my-4"
                {...props}
              />
            ),

            // Links
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

            // Lists
            ul: ({ children, ...props }: any) => (
              <ul className="list-disc list-inside my-4 space-y-2" {...props}>
                {children}
              </ul>
            ),
            ol: ({ children, ...props }: any) => (
              <ol
                className="list-decimal list-inside my-4 space-y-2"
                {...props}
              >
                {children}
              </ol>
            ),

            // Paragraphs
            p: ({ children, ...props }: any) => (
              <p className="my-4 leading-7" {...props}>
                {children}
              </p>
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
          }}
        >
          {previewValue ||
            "*No content yet. Start writing to see the preview.*"}
        </ReactMarkdown>
      </div>
    ),
    [previewValue, isFullscreen, minHeight, maxHeight]
  );

  const renderPreview = () => MarkdownPreview;

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <>
      {/* Fullscreen Backdrop */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-background/95 backdrop-blur-sm z-40"
          onClick={() => setIsFullscreen(false)}
          aria-label="Exit fullscreen"
        />
      )}

      {/* Editor Container */}
      <div
        className={`border rounded-lg overflow-hidden transition-all ${
          isFullscreen
            ? "fixed inset-4 z-50 bg-background shadow-2xl"
            : "relative"
        }`}
      >
        {renderToolbar()}

        <div className="flex">
          {/* Edit View */}
          {(view === "edit" || view === "split") && (
            <div
              className={`${view === "split" ? "w-1/2 border-r" : "w-full"}`}
            >
              {renderEditor()}
            </div>
          )}

          {/* Preview View */}
          {(view === "preview" || view === "split") && (
            <div
              className={`${view === "split" ? "w-1/2" : "w-full"} bg-muted/10`}
            >
              {renderPreview()}
            </div>
          )}
        </div>

        {/* Fullscreen Hint */}
        {isFullscreen && (
          <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg text-xs text-muted-foreground border">
            Press <kbd className="px-1.5 py-0.5 bg-muted rounded">ESC</kbd> to
            exit fullscreen
          </div>
        )}
      </div>
    </>
  );
}
