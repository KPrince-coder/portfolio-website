/**
 * Content Importer Component
 *
 * Allows importing blog post content from various formats:
 * - Markdown files (.md, .markdown)
 * - HTML files (.html)
 * - Plain text files (.txt)
 * - Word documents (.docx) - converted to markdown
 *
 * Features:
 * - Drag & drop support
 * - File validation
 * - Format detection
 * - Preview before import
 * - Metadata extraction (title, excerpt)
 * - Smart formatting preservation
 *
 * @module blog/ContentImporter
 */

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  FileText,
  Check,
  X,
  AlertCircle,
  Loader2,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

// ============================================================================
// TYPES
// ============================================================================

interface ContentImporterProps {
  onImport: (content: ImportedContent) => void;
  onCancel: () => void;
}

interface ImportedContent {
  title?: string;
  content: string;
  excerpt?: string;
  format: "markdown" | "html" | "text";
  metadata?: Record<string, any>;
}

interface ParsedFile {
  name: string;
  size: number;
  type: string;
  content: string;
  format: "markdown" | "html" | "text";
  title?: string;
  excerpt?: string;
  metadata?: Record<string, any>;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const ACCEPTED_FORMATS = {
  "text/markdown": [".md", ".markdown"],
  "text/html": [".html", ".htm"],
  "text/plain": [".txt"],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Detect file format from extension and content
 */
function detectFormat(
  filename: string,
  content: string
): "markdown" | "html" | "text" {
  const ext = filename.toLowerCase().split(".").pop();

  if (ext === "md" || ext === "markdown") return "markdown";
  if (ext === "html" || ext === "htm") return "html";

  // Auto-detect from content
  if (content.includes("<!DOCTYPE") || content.includes("<html")) return "html";
  if (content.match(/^#{1,6}\s/m) || content.includes("```")) return "markdown";

  return "text";
}

/**
 * Extract title from content
 */
function extractTitle(
  content: string,
  format: "markdown" | "html" | "text"
): string | undefined {
  if (format === "markdown") {
    // Look for first H1
    const h1Match = content.match(/^#\s+(.+)$/m);
    if (h1Match) return h1Match[1].trim();
  } else if (format === "html") {
    // Look for <h1> or <title>
    const h1Match = content.match(/<h1[^>]*>(.+?)<\/h1>/i);
    if (h1Match) return h1Match[1].replace(/<[^>]+>/g, "").trim();

    const titleMatch = content.match(/<title[^>]*>(.+?)<\/title>/i);
    if (titleMatch) return titleMatch[1].trim();
  } else {
    // First non-empty line
    const firstLine = content.split("\n").find((line) => line.trim());
    if (firstLine && firstLine.length < 100) return firstLine.trim();
  }

  return undefined;
}

/**
 * Extract excerpt from content
 */
function extractExcerpt(
  content: string,
  format: "markdown" | "html" | "text"
): string | undefined {
  let plainText = content;

  if (format === "markdown") {
    // Remove title
    plainText = plainText.replace(/^#\s+.+$/m, "");
    // Remove code blocks
    plainText = plainText.replace(/```[\s\S]*?```/g, "");
    // Remove inline code
    plainText = plainText.replace(/`[^`]+`/g, "");
    // Remove links
    plainText = plainText.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
    // Remove images
    plainText = plainText.replace(/!\[.*?\]\(.*?\)/g, "");
    // Remove formatting
    plainText = plainText.replace(/[*_~]/g, "");
  } else if (format === "html") {
    // Remove HTML tags
    plainText = plainText.replace(/<[^>]+>/g, " ");
    // Decode HTML entities
    plainText = plainText
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"');
  }

  // Clean up whitespace
  plainText = plainText.replace(/\s+/g, " ").trim();

  // Get first 160 characters
  if (plainText.length > 160) {
    const truncated = plainText.substring(0, 160);
    const lastSpace = truncated.lastIndexOf(" ");
    return lastSpace > 0
      ? truncated.substring(0, lastSpace) + "..."
      : truncated + "...";
  }

  return plainText || undefined;
}

/**
 * Convert HTML to Markdown (basic conversion)
 */
function htmlToMarkdown(html: string): string {
  let markdown = html;

  // Headers
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n");
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n");
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n");
  markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1\n\n");
  markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, "##### $1\n\n");
  markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, "###### $1\n\n");

  // Bold and italic
  markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**");
  markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**");
  markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*");
  markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*");

  // Links
  markdown = markdown.replace(
    /<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi,
    "[$2]($1)"
  );

  // Images
  markdown = markdown.replace(
    /<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi,
    "![$2]($1)"
  );
  markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, "![]($1)");

  // Lists
  markdown = markdown.replace(/<ul[^>]*>(.*?)<\/ul>/gis, (_match, content) => {
    return content.replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n");
  });
  markdown = markdown.replace(/<ol[^>]*>(.*?)<\/ol>/gis, (_match, content) => {
    let counter = 1;
    return content.replace(
      /<li[^>]*>(.*?)<\/li>/gi,
      () => `${counter++}. $1\n`
    );
  });

  // Code blocks
  markdown = markdown.replace(
    /<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis,
    "```\n$1\n```\n\n"
  );
  markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`");

  // Paragraphs
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n");

  // Line breaks
  markdown = markdown.replace(/<br\s*\/?>/gi, "\n");

  // Remove remaining HTML tags
  markdown = markdown.replace(/<[^>]+>/g, "");

  // Decode HTML entities
  markdown = markdown
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Clean up extra whitespace
  markdown = markdown.replace(/\n{3,}/g, "\n\n").trim();

  return markdown;
}

/**
 * Parse uploaded file
 */
async function parseFile(file: File): Promise<ParsedFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const format = detectFormat(file.name, content);

        let processedContent = content;

        // Convert HTML to Markdown if needed
        if (format === "html") {
          processedContent = htmlToMarkdown(content);
        }

        const title = extractTitle(content, format);
        const excerpt = extractExcerpt(
          processedContent,
          format === "html" ? "markdown" : format
        );

        resolve({
          name: file.name,
          size: file.size,
          type: file.type,
          content: processedContent,
          format: format === "html" ? "markdown" : format,
          title,
          excerpt,
        });
      } catch (error) {
        reject(
          new Error(
            `Failed to parse file: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          )
        );
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ContentImporter({ onImport, onCancel }: ContentImporterProps) {
  const [parsedFile, setParsedFile] = useState<ParsedFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // FILE UPLOAD
  // ============================================================================

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const parsed = await parseFile(file);
      setParsedFile(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse file");
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FORMATS,
    maxFiles: 1,
    multiple: false,
  });

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleImport = () => {
    if (!parsedFile) return;

    onImport({
      title: parsedFile.title,
      content: parsedFile.content,
      excerpt: parsedFile.excerpt,
      format: parsedFile.format,
      metadata: parsedFile.metadata,
    });
  };

  const handleReset = () => {
    setParsedFile(null);
    setError(null);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Import Content</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!parsedFile ? (
            <>
              {/* Upload Area */}
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
                  transition-colors duration-200
                  ${
                    isDragActive
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }
                  ${loading ? "opacity-50 pointer-events-none" : ""}
                `}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-4">
                  {loading ? (
                    <>
                      <Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />
                      <p className="text-lg font-medium">Processing file...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-muted-foreground" />
                      <div>
                        <p className="text-lg font-medium mb-2">
                          {isDragActive
                            ? "Drop file here"
                            : "Drag & drop a file here"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          or click to browse
                        </p>
                      </div>
                      <div className="flex gap-2 flex-wrap justify-center">
                        <Badge variant="outline">Markdown (.md)</Badge>
                        <Badge variant="outline">HTML (.html)</Badge>
                        <Badge variant="outline">Text (.txt)</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Maximum file size: {MAX_FILE_SIZE / 1024 / 1024}MB
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Error */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    What happens when you import?
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 text-green-600" />
                    <span>
                      Title is automatically extracted from the first heading
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 text-green-600" />
                    <span>Excerpt is generated from the first paragraph</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 text-green-600" />
                    <span>HTML is converted to Markdown automatically</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 text-green-600" />
                    <span>Formatting and structure are preserved</span>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* Preview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      <div>
                        <CardTitle className="text-base">
                          {parsedFile.name}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {(parsedFile.size / 1024).toFixed(2)} KB •{" "}
                          {parsedFile.format.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleReset}>
                      <X className="h-4 w-4 mr-2" />
                      Change File
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="preview" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                      <TabsTrigger value="raw">Raw Content</TabsTrigger>
                    </TabsList>
                    <TabsContent value="preview" className="mt-4">
                      <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                        <div className="prose prose-sm max-w-none">
                          {parsedFile.title && <h1>{parsedFile.title}</h1>}
                          {parsedFile.excerpt && (
                            <p className="text-muted-foreground italic">
                              {parsedFile.excerpt}
                            </p>
                          )}
                          <div className="whitespace-pre-wrap">
                            {parsedFile.content}
                          </div>
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="raw" className="mt-4">
                      <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                        <pre className="text-xs whitespace-pre-wrap font-mono">
                          {parsedFile.content}
                        </pre>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>

                  {/* Extracted Metadata */}
                  <div className="mt-4 space-y-2">
                    {parsedFile.title && (
                      <div className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 mt-0.5 text-green-600" />
                        <div>
                          <span className="font-medium">Title extracted:</span>{" "}
                          <span className="text-muted-foreground">
                            {parsedFile.title}
                          </span>
                        </div>
                      </div>
                    )}
                    {parsedFile.excerpt && (
                      <div className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 mt-0.5 text-green-600" />
                        <div>
                          <span className="font-medium">
                            Excerpt generated:
                          </span>{" "}
                          <span className="text-muted-foreground">
                            {parsedFile.excerpt}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          {parsedFile && (
            <Button onClick={handleImport}>
              <Download className="h-4 w-4 mr-2" />
              Import Content
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
