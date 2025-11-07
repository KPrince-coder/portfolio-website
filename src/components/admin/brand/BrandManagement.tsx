/**
 * Brand Management Component
 *
 * Allows admin to manage portfolio branding (logo, colors, SEO)
 * Note: Contact info and social links are managed in Profile section
 */

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Save, Palette, Globe, Eye, Info } from "lucide-react";
import {
  useBrandIdentity,
  type BrandIdentityFormData,
} from "@/hooks/useBrandIdentity";
import { IconSelector } from "./IconSelector";
import { ColorPicker } from "./ColorPicker";
import { BrandPreview } from "./BrandPreview";
import { Alert, AlertDescription } from "@/components/ui/alert";

// ============================================================================
// COMPONENT
// ============================================================================

export function BrandManagement() {
  const { brandIdentity, loading, updateBrandIdentity } = useBrandIdentity();
  const [formData, setFormData] = useState<BrandIdentityFormData | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // Initialize form data when brand identity loads
  React.useEffect(() => {
    if (brandIdentity && !formData) {
      setFormData({
        logo_text: brandIdentity.logo_text,
        logo_icon: brandIdentity.logo_icon,
        logo_icon_color: brandIdentity.logo_icon_color,
        primary_color: brandIdentity.primary_color,
        secondary_color: brandIdentity.secondary_color,
        accent_color: brandIdentity.accent_color,
        meta_title: brandIdentity.meta_title || "",
        meta_description: brandIdentity.meta_description || "",
        meta_keywords: brandIdentity.meta_keywords || [],
        favicon_url: brandIdentity.favicon_url || "",
        email_header_color: brandIdentity.email_header_color,
        email_footer_text: brandIdentity.email_footer_text,
      });
    }
  }, [brandIdentity, formData]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleInputChange = (
    field: keyof BrandIdentityFormData,
    value: any
  ) => {
    if (!formData) return;
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    if (!formData) return;

    try {
      setSaving(true);
      await updateBrandIdentity(formData);
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleKeywordsChange = (value: string) => {
    const keywords = value
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    handleInputChange("meta_keywords", keywords);
  };

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  if (loading || !formData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground">
            Loading brand settings...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Brand Management</h2>
          <p className="text-muted-foreground">
            Customize your portfolio logo, colors, and SEO settings
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="neural-glow">
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Contact information and social links are managed in the{" "}
          <strong>Profile</strong> section.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Logo & Branding</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Logo & Branding */}
            <Card className="card-neural">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Logo Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="logo_text">Logo Text</Label>
                  <Input
                    id="logo_text"
                    value={formData.logo_text}
                    onChange={(e) =>
                      handleInputChange("logo_text", e.target.value)
                    }
                    placeholder="Your brand name"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Displayed next to the logo icon in navigation
                  </p>
                </div>

                <div>
                  <Label>Logo Icon</Label>
                  <IconSelector
                    value={formData.logo_icon}
                    onChange={(icon) => handleInputChange("logo_icon", icon)}
                    color={formData.logo_icon_color}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Choose from Lucide icons library
                  </p>
                </div>

                <div>
                  <Label>Icon Color</Label>
                  <ColorPicker
                    value={formData.logo_icon_color}
                    onChange={(color) =>
                      handleInputChange("logo_icon_color", color)
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Color of the logo icon
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className="card-neural">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BrandPreview brandData={formData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-6">
          <Card className="card-neural">
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Primary Color</Label>
                  <ColorPicker
                    value={formData.primary_color}
                    onChange={(color) =>
                      handleInputChange("primary_color", color)
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Main brand color
                  </p>
                </div>

                <div>
                  <Label>Secondary Color</Label>
                  <ColorPicker
                    value={formData.secondary_color}
                    onChange={(color) =>
                      handleInputChange("secondary_color", color)
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Gradient and accents
                  </p>
                </div>

                <div>
                  <Label>Accent Color</Label>
                  <ColorPicker
                    value={formData.accent_color}
                    onChange={(color) =>
                      handleInputChange("accent_color", color)
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Highlights and CTAs
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Email Header Color</Label>
                  <ColorPicker
                    value={formData.email_header_color}
                    onChange={(color) =>
                      handleInputChange("email_header_color", color)
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Email template header background
                  </p>
                </div>

                <div>
                  <Label htmlFor="email_footer_text">Email Footer Text</Label>
                  <Input
                    id="email_footer_text"
                    value={formData.email_footer_text}
                    onChange={(e) =>
                      handleInputChange("email_footer_text", e.target.value)
                    }
                    placeholder="Footer message for emails"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Displayed at the bottom of email templates
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6">
          <Card className="card-neural">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                SEO Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) =>
                    handleInputChange("meta_title", e.target.value)
                  }
                  placeholder="Your Portfolio - Professional Title"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Appears in browser tabs and search results
                </p>
              </div>

              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) =>
                    handleInputChange("meta_description", e.target.value)
                  }
                  placeholder="Brief description of your portfolio and expertise"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Appears in search engine results (150-160 characters
                  recommended)
                </p>
              </div>

              <div>
                <Label htmlFor="meta_keywords">Keywords</Label>
                <Input
                  id="meta_keywords"
                  value={formData.meta_keywords?.join(", ") || ""}
                  onChange={(e) => handleKeywordsChange(e.target.value)}
                  placeholder="data engineer, AI, machine learning, python"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Comma-separated keywords for SEO
                </p>
                {formData.meta_keywords &&
                  formData.meta_keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData.meta_keywords.map((keyword, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  )}
              </div>

              <div>
                <Label htmlFor="favicon_url">Favicon URL</Label>
                <Input
                  id="favicon_url"
                  value={formData.favicon_url}
                  onChange={(e) =>
                    handleInputChange("favicon_url", e.target.value)
                  }
                  placeholder="https://yoursite.com/favicon.ico"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Small icon that appears in browser tabs
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
