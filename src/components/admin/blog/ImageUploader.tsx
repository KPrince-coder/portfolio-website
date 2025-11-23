/**
 * Image Uploader Component
 *
 * Drag & drop image uploader with:
 * - Local file upload
 * - URL import
 * - Image optimization
 * - Progress tracking
 * - Preview
 * - Alt text and caption
 *
 * @module blog/ImageUploader
 */

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  Link as LinkIcon,
  X,
  Check,
  Loader2,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  uploadImage,
  uploadImageFromUrl,
  type BlogImage,
} from "@/services/imageService";

// ============================================================================
// TYPES
// ============================================================================

interface ImageUploaderProps {
  onUploadComplete: (image: BlogImage) => void;
  onCancel?: () => void;
  postId?: string;
  maxSizeMB?: number;
  acceptedFormats?: string[];
}

interface UploadState {
  status: "idle" | "uploading" | "optimizing" | "success" | "error";
  progress: number;
  error?: string;
  originalSize?: number;
  optimizedSize?: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_MAX_SIZE_MB = 10;
const DEFAULT_ACCEPTED_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

// ============================================================================
// COMPONENT
// ============================================================================

export function ImageUploader({
  onUploadComplete,
  onCancel,
  postId,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
}: ImageUploaderProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    status: "idle",
    progress: 0,
  });
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [imageUrl, setImageUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");

  // ============================================================================
  // FILE UPLOAD HANDLER
  // ============================================================================

  const handleFileUpload = useCallback(
    async (file: File) => {
      try {
        // Validate file size
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSizeMB) {
          setUploadState({
            status: "error",
            progress: 0,
            error: `File size (${fileSizeMB.toFixed(
              2
            )}MB) exceeds maximum allowed size (${maxSizeMB}MB)`,
          });
          return;
        }

        // Validate file type
        if (!acceptedFormats.includes(file.type)) {
          setUploadState({
            status: "error",
            progress: 0,
            error: `File type ${file.type} is not supported`,
          });
          return;
        }

        // Set preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Upload
        setUploadState({
          status: "uploading",
          progress: 30,
          originalSize: file.size,
        });

        setUploadState((prev) => ({
          ...prev,
          status: "optimizing",
          progress: 60,
        }));

        const uploadedImage = await uploadImage(file, {
          postId,
          altText,
          caption,
        });

        setUploadState({
          status: "success",
          progress: 100,
          originalSize: file.size,
          optimizedSize: uploadedImage.file_size,
        });

        // Call completion handler immediately - dialog will show success and Done button
        onUploadComplete(uploadedImage);
      } catch (error) {
        console.error("Upload failed:", error);
        setUploadState({
          status: "error",
          progress: 0,
          error: error instanceof Error ? error.message : "Upload failed",
        });
      }
    },
    [maxSizeMB, acceptedFormats, postId, altText, caption, onUploadComplete]
  );

  // ============================================================================
  // URL UPLOAD HANDLER
  // ============================================================================

  const handleUrlUpload = useCallback(async () => {
    if (!imageUrl.trim()) {
      setUploadState({
        status: "error",
        progress: 0,
        error: "Please enter a valid image URL",
      });
      return;
    }

    try {
      setUploadState({
        status: "uploading",
        progress: 30,
      });

      setPreviewUrl(imageUrl);

      setUploadState((prev) => ({
        ...prev,
        status: "optimizing",
        progress: 60,
      }));

      const uploadedImage = await uploadImageFromUrl(imageUrl, {
        postId,
        altText,
        caption,
      });

      setUploadState({
        status: "success",
        progress: 100,
        optimizedSize: uploadedImage.file_size,
      });

      onUploadComplete(uploadedImage);
    } catch (error) {
      console.error("URL upload failed:", error);
      setUploadState({
        status: "error",
        progress: 0,
        error: error instanceof Error ? error.message : "URL upload failed",
      });
    }
  }, [imageUrl, postId, altText, caption, onUploadComplete]);

  // ============================================================================
  // DROPZONE
  // ============================================================================

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleFileUpload(acceptedFiles[0]);
      }
    },
    accept: acceptedFormats.reduce((acc, format) => {
      acc[format] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize: maxSizeMB * 1024 * 1024,
    multiple: false,
  });

  // ============================================================================
  // RESET HANDLER
  // ============================================================================

  const handleReset = useCallback(() => {
    setUploadState({ status: "idle", progress: 0 });
    setPreviewUrl("");
    setImageUrl("");
    setAltText("");
    setCaption("");
  }, []);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderUploadStatus = () => {
    if (uploadState.status === "idle") return null;

    return (
      <div className="space-y-2">
        {uploadState.status === "uploading" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading image...
            </div>
            <Progress value={uploadState.progress} />
          </div>
        )}

        {uploadState.status === "optimizing" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Optimizing image...
            </div>
            <Progress value={uploadState.progress} />
          </div>
        )}

        {uploadState.status === "success" && (
          <Alert className="border-green-200 bg-green-50">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Image uploaded successfully!
              {uploadState.originalSize && uploadState.optimizedSize && (
                <span className="block text-xs mt-1">
                  Reduced from {(uploadState.originalSize / 1024).toFixed(0)}KB
                  to {(uploadState.optimizedSize / 1024).toFixed(0)}KB (
                  {(
                    ((uploadState.originalSize - uploadState.optimizedSize) /
                      uploadState.originalSize) *
                    100
                  ).toFixed(0)}
                  % smaller)
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {uploadState.status === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{uploadState.error}</AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  const renderPreview = () => {
    if (!previewUrl) return null;

    return (
      <div className="space-y-4">
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="alt-text">Alt Text *</Label>
            <Input
              id="alt-text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the image for accessibility"
              required
            />
            <p className="text-xs text-muted-foreground">
              Required for accessibility. Describe what's in the image.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="caption">Caption (Optional)</Label>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption for the image"
              rows={2}
            />
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="url">From URL</TabsTrigger>
          </TabsList>

          {/* File Upload Tab */}
          <TabsContent value="upload" className="space-y-4">
            {!previewUrl ? (
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                  transition-colors
                  ${
                    isDragActive
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-primary/50"
                  }
                `}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {isDragActive
                        ? "Drop the image here"
                        : "Drag & drop an image here"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Max size: {maxSizeMB}MB • Formats: JPG, PNG, WebP, GIF
                  </p>
                </div>
              </div>
            ) : (
              renderPreview()
            )}

            {renderUploadStatus()}

            {previewUrl && uploadState.status !== "success" && (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </TabsContent>

          {/* URL Upload Tab */}
          <TabsContent value="url" className="space-y-4">
            {!previewUrl ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-url">Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image-url"
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleUrlUpload}
                      disabled={
                        !imageUrl.trim() || uploadState.status === "uploading"
                      }
                    >
                      {uploadState.status === "uploading" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <LinkIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter a direct link to an image file
                  </p>
                </div>
              </div>
            ) : (
              renderPreview()
            )}

            {renderUploadStatus()}

            {previewUrl && uploadState.status !== "success" && (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {uploadState.status === "success" && onCancel && (
          <div className="flex gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Done
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
