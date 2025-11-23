/**
 * Footer Management Component
 *
 * Admin interface for managing footer settings
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
import { Save, Plus, X, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFooterSettings } from "@/components/footer/hooks/useFooterSettings";
import {
  LAYOUT_OPTIONS,
  BACKGROUND_STYLES,
} from "@/components/footer/constants";
import type { FooterLink } from "@/components/footer/types";

export function FooterManagement() {
  const { toast } = useToast();
  const {
    settings,
    loading,
    saving,
    updateSettings,
    saveSettings,
    addLink,
    removeLink,
    updateLink,
  } = useFooterSettings();

  const handleSave = async () => {
    try {
      await saveSettings();
      toast({
        title: "Settings saved",
        description: "Footer settings updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to save",
        description: "Please try again.",
      });
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Footer Settings</h2>
          <p className="text-muted-foreground">
            Manage footer content, links, and layout
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="neural-glow">
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Copyright Section */}
      <Card className="card-neural">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Copyright & Company
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Company Name</Label>
            <Input
              value={settings.company_name}
              onChange={(e) => updateSettings({ company_name: e.target.value })}
              placeholder="Your Company"
            />
          </div>

          <div className="space-y-2">
            <Label>Copyright Text</Label>
            <Input
              value={settings.copyright_text}
              onChange={(e) =>
                updateSettings({ copyright_text: e.target.value })
              }
              placeholder="© {year} {company}. All rights reserved."
            />
            <p className="text-xs text-muted-foreground">
              Variables: {"{year}"} = current year, {"{company}"} = company name
            </p>
          </div>

          <div className="space-y-2">
            <Label>Tagline</Label>
            <Textarea
              value={settings.tagline}
              onChange={(e) => updateSettings({ tagline: e.target.value })}
              rows={2}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={settings.show_tagline}
              onCheckedChange={(checked) =>
                updateSettings({ show_tagline: checked })
              }
            />
            <Label>Show tagline</Label>
          </div>
        </CardContent>
      </Card>

      {/* Layout Options */}
      <Card className="card-neural">
        <CardHeader>
          <CardTitle>Layout & Display</CardTitle>
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

          <div className="space-y-2">
            <Label>Background Style</Label>
            <Select
              value={settings.background_style}
              onValueChange={(value) =>
                updateSettings({
                  background_style: value as typeof settings.background_style,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BACKGROUND_STYLES.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={settings.show_social_links}
              onCheckedChange={(checked) =>
                updateSettings({ show_social_links: checked })
              }
            />
            <Label>Show social media links</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={settings.show_back_to_top}
              onCheckedChange={(checked) =>
                updateSettings({ show_back_to_top: checked })
              }
            />
            <Label>Show back to top button</Label>
          </div>
        </CardContent>
      </Card>

      {/* Custom Links */}
      <Card className="card-neural">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Custom Links</CardTitle>
            <Button onClick={addLink} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Link
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.links.map((link: FooterLink, index: number) => (
            <div
              key={index}
              className="flex gap-4 items-start p-4 border rounded-lg"
            >
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={link.label}
                      onChange={(e) =>
                        updateLink(index, "label", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>URL</Label>
                    <Input
                      value={link.url}
                      onChange={(e) => updateLink(index, "url", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={link.is_active}
                    onCheckedChange={(checked) =>
                      updateLink(index, "is_active", checked)
                    }
                  />
                  <Label>Active</Label>
                </div>
              </div>
              <Button
                onClick={() => removeLink(index)}
                size="icon"
                variant="ghost"
                className="text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {settings.links.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No links added yet. Click "Add Link" to get started.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
