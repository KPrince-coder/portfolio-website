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

import React, { useState, useCallback, useMemo } from "react";
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
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  minHeight = "400px",
  maxHeight = "800px",
}: MarkdownEditorProps) {
  const [view, setView] = useState<"edit" | "preview" | "split">("split");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ============================================================================
  // MARKDOWN HELPERS
  // ============================================================================

  const insertMarkdown = useCallback(
    (before: string, after: string = "", placeholder: string = "") => {
      const textarea = document.querySelector(
        "textarea"
      ) as HTMLTextAreaElement;
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

      // Set cursor position
      setTimeout(() => {
        const newCursorPos = start + before.length + textToInsert.length;
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    },
    [value, onChange]
  );

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
            className="h-8 w-8 p-0"
          >
            <button.icon className="h-4 w-4" />
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
    <div className="relative flex-1">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-full resize-none border-0 focus-visible:ring-0 font-mono text-sm"
        style={{
          minHeight: isFullscreen ? "80vh" : minHeight,
          maxHeight: isFullscreen ? "80vh" : maxHeight,
        }}
      />
    </div>
  );

  const renderPreview = () => (
    <div
      className="prose prose-sm max-w-none p-4 overflow-auto"
      style={{
        minHeight: isFullscreen ? "80vh" : minHeight,
        maxHeight: isFullscreen ? "80vh" : maxHeight,
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {value || "*No content yet. Start writing to see the preview.*"}
      </ReactMarkdown>
    </div>
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div
      className={`border rounded-lg overflow-hidden ${
        isFullscreen
          ? "fixed inset-4 z-50 bg-background shadow-2xl"
          : "relative"
      }`}
    >
      {renderToolbar()}

      <div className="flex">
        {/* Edit View */}
        {(view === "edit" || view === "split") && (
          <div className={`${view === "split" ? "w-1/2 border-r" : "w-full"}`}>
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
    </div>
  );
}
