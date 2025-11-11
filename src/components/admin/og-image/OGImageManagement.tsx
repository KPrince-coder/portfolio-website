/**
 * OG Image Management Component
 *
 * Admin interface for managing Open Graph image settings
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Save,
  Image,
  Eye,
  RefreshCw,
  Info,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOGImageSettings } from "@/hooks/useOGImageSettings";
import { useBrandIdentity } from "@/hooks/useBrandIdentity";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const LAYOUT_OPTIONS = [
  { value: "centered", label: "Centered" },
  { value: "left", label: "Left Aligned" },
  { value: "right", label: "Right Aligned" },
  { value: "split", label: "Split Layout" },
];

const PATTERN_OPTIONS = [
  { value: "none", label: "None" },
  { value: "dots", label: "Dots" },
  { value: "grid", label: "Grid" },
  { value: "waves", label: "Waves" },
];

export function OGImageManagement() {
  const { toast } = useToast();
  const {
    settings,
    loading,
    saving,
    updateSettings,
    saveSettings,
    getOGImageUrl,
  } = useOGImageSettings();
  const { brandIdentity } = useBrandIdentity();

  const [previewKey, setPreviewKey] = useState(0);
  const [testingEndpoint, setTestingEndpoint] = useState(false);
  const [endpointStatus, setEndpointStatus] = useState<
    "unknown" | "available" | "unavailable"
  >("unknown");

  const testEndpoint = async () => {
    setTestingEndpoint(true);
    try {
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const baseUrl = ogImageUrl.split("?")[0];
      const response = await fetch(baseUrl, {
        method: "HEAD",
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
        },
      });
      setEndpointStatus(response.ok ? "available" : "unavailable");
      if (response.ok) {
        toast({
          title: "Endpoint available",
          description: "OG image function is deployed and working.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Endpoint unavailable",
          description: `Status: ${response.status}. Please check function deployment.`,
        });
      }
    } catch (error) {
      setEndpointStatus("unavailable");
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: "Could not reach the OG image endpoint.",
      });
    } finally {
      setTestingEndpoint(false);
    }
  };

  const handleSave = async () => {
    try {
      await saveSettings();
      toast({
        title: "Settings saved",
        description: "OG image settings updated successfully.",
      });
      // Refresh preview
      setPreviewKey((prev) => prev + 1);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to save",
        description: "Please try again.",
      });
    }
  };

  const refreshPreview = () => {
    setPreviewKey((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No settings found.
      </div>
    );
  }

  const ogImageUrl = getOGImageUrl();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">OG Image Settings</h2>
          <p className="text-muted-foreground">
            Configure dynamic Open Graph images for social media sharing
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="neural-glow">
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="space-y-6">
          {/* Content Section */}
          <Card className="card-neural">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5" />
                Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={settings.title}
                  onChange={(e) => updateSettings({ title: e.target.value })}
                  placeholder="Portfolio"
                />
              </div>

              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input
                  value={settings.subtitle}
                  onChange={(e) => updateSettings({ subtitle: e.target.value })}
                  placeholder="Full Stack Developer"
                />
              </div>

              <div className="space-y-2">
                <Label>Tagline (Optional)</Label>
                <Textarea
                  value={settings.tagline || ""}
                  onChange={(e) => updateSettings({ tagline: e.target.value })}
                  rows={2}
                  placeholder="Building intelligent systems..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.show_logo}
                  onCheckedChange={(checked) =>
                    updateSettings({ show_logo: checked })
                  }
                />
                <Label>Show logo</Label>
              </div>

              {settings.show_logo && (
                <>
                  {brandIdentity && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Using logo from Brand Identity:{" "}
                        <strong>{brandIdentity.logo_text}</strong>
                        {brandIdentity.logo_icon && (
                          <span className="text-muted-foreground">
                            {" "}
                            ({brandIdentity.logo_icon})
                          </span>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label>
                      Logo Text Override{" "}
                      <span className="text-muted-foreground text-xs">
                        (optional)
                      </span>
                    </Label>
                    <Input
                      value={settings.logo_text || ""}
                      onChange={(e) =>
                        updateSettings({ logo_text: e.target.value })
                      }
                      placeholder={
                        brandIdentity?.logo_text ||
                        "Leave empty to use brand logo"
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave empty to automatically use logo from Brand Identity
                      settings
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Colors Section */}
          <Card className="card-neural">
            <CardHeader>
              <CardTitle>Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Background</Label>
                  <Input
                    type="color"
                    value={settings.background_color}
                    onChange={(e) =>
                      updateSettings({ background_color: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Gradient Start</Label>
                  <Input
                    type="color"
                    value={settings.background_gradient_start}
                    onChange={(e) =>
                      updateSettings({
                        background_gradient_start: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Gradient End</Label>
                  <Input
                    type="color"
                    value={settings.background_gradient_end}
                    onChange={(e) =>
                      updateSettings({
                        background_gradient_end: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Title Color</Label>
                  <Input
                    type="color"
                    value={settings.title_color}
                    onChange={(e) =>
                      updateSettings({ title_color: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Subtitle Color</Label>
                  <Input
                    type="color"
                    value={settings.subtitle_color}
                    onChange={(e) =>
                      updateSettings({ subtitle_color: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <Input
                    type="color"
                    value={settings.accent_color}
                    onChange={(e) =>
                      updateSettings({ accent_color: e.target.value })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Layout Section */}
          <Card className="card-neural">
            <CardHeader>
              <CardTitle>Layout & Style</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Layout</Label>
                <Select
                  value={settings.layout}
                  onValueChange={(value) =>
                    updateSettings({ layout: value as typeof settings.layout })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LAYOUT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title Font Size</Label>
                  <Input
                    type="number"
                    value={settings.title_font_size}
                    onChange={(e) =>
                      updateSettings({
                        title_font_size: parseInt(e.target.value),
                      })
                    }
                    min={40}
                    max={120}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Subtitle Font Size</Label>
                  <Input
                    type="number"
                    value={settings.subtitle_font_size}
                    onChange={(e) =>
                      updateSettings({
                        subtitle_font_size: parseInt(e.target.value),
                      })
                    }
                    min={20}
                    max={60}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.show_pattern}
                  onCheckedChange={(checked) =>
                    updateSettings({ show_pattern: checked })
                  }
                />
                <Label>Show background pattern</Label>
              </div>

              {settings.show_pattern && (
                <div className="space-y-2">
                  <Label>Pattern Type</Label>
                  <Select
                    value={settings.pattern_type}
                    onValueChange={(value) =>
                      updateSettings({
                        pattern_type: value as typeof settings.pattern_type,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PATTERN_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card className="card-neural neural-glow sticky top-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Preview
                </CardTitle>
                <Button
                  onClick={refreshPreview}
                  size="sm"
                  variant="outline"
                  className="neural-glow"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Setup Required:</strong> Deploy the Edge Function
                  first:{" "}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    supabase functions deploy og-image
                  </code>
                </AlertDescription>
              </Alert>

              <Button
                onClick={testEndpoint}
                disabled={testingEndpoint}
                size="sm"
                variant="outline"
                className="w-full"
              >
                {testingEndpoint ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Testing Endpoint...
                  </>
                ) : endpointStatus === "available" ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Endpoint Available
                  </>
                ) : endpointStatus === "unavailable" ? (
                  <>
                    <XCircle className="w-4 h-4 mr-2 text-red-500" />
                    Endpoint Unavailable - Deploy Function
                  </>
                ) : (
                  <>
                    <Info className="w-4 h-4 mr-2" />
                    Test Endpoint Connection
                  </>
                )}
              </Button>

              <div className="aspect-[1200/630] bg-muted rounded-lg overflow-hidden border border-border relative">
                <img
                  key={previewKey}
                  src={`${ogImageUrl.split("?")[0]}?t=${Date.now()}`}
                  alt="OG Image Preview"
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    console.error("Failed to load OG image preview");
                    // Show error message instead of broken image
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector(".error-message")) {
                      const errorDiv = document.createElement("div");
                      errorDiv.className =
                        "error-message absolute inset-0 flex flex-col items-center justify-center p-8 text-center";
                      errorDiv.innerHTML = `
                        <svg class="w-16 h-16 text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p class="text-sm text-muted-foreground mb-2">
                          <strong>Preview not available</strong>
                        </p>
                        <p class="text-xs text-muted-foreground">
                          Deploy the Edge Function first:<br/>
                          <code class="bg-muted px-2 py-1 rounded mt-2 inline-block">supabase functions deploy og-image</code>
                        </p>
                      `;
                      parent.appendChild(errorDiv);
                    }
                  }}
                  onLoad={() => {
                    // Remove error message if image loads successfully
                    const parent = document.querySelector(".error-message");
                    if (parent) parent.remove();
                  }}
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Endpoint URL:</strong>
                </p>
                <code className="block p-2 bg-muted rounded text-xs break-all">
                  {ogImageUrl}
                </code>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
