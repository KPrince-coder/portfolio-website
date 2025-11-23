/**
 * ContactSettingsSection Component
 *
 * Manages contact page settings (title, description, response time, expectations)
 *
 * @module messages/sections/ContactSettingsSection
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Save, Plus, X, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useContactSettings } from "../hooks/useContactSettings";
import { CONTACT_COLOR_OPTIONS } from "../constants";
import type { ExpectationItem } from "../types";

// ============================================================================
// COMPONENT
// ============================================================================

export function ContactSettingsSection() {
  const { toast } = useToast();
  const {
    settings,
    loading,
    saving,
    updateSettings,
    saveSettings,
    addExpectation,
    removeExpectation,
    updateExpectation,
  } = useContactSettings();

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleSave = async () => {
    try {
      await saveSettings();
      toast({
        title: "Settings saved",
        description: "Contact page settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to save settings",
        description: "Please try again.",
      });
    }
  };

  const handleExpectationChange = (
    index: number,
    field: keyof ExpectationItem,
    value: string
  ) => {
    updateExpectation(index, field, value);
  };

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No settings found.</p>
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
          <h2 className="text-2xl font-bold">Contact Page Settings</h2>
          <p className="text-muted-foreground">
            Manage contact page title, description, and expectations
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="neural-glow">
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Header Section */}
      <Card className="card-neural">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Header Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Contact Page Title</Label>
            <Input
              id="title"
              value={settings.title}
              onChange={(e) => updateSettings({ title: e.target.value })}
              placeholder="Let's Connect"
            />
            <p className="text-xs text-muted-foreground">
              Full title - last word will be highlighted (e.g., "Let's Connect")
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={settings.description}
              onChange={(e) => updateSettings({ description: e.target.value })}
              placeholder="Description text..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Description displayed below the title on contact page
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="response_time">Response Time</Label>
            <Input
              id="response_time"
              value={settings.response_time}
              onChange={(e) =>
                updateSettings({ response_time: e.target.value })
              }
              placeholder="Within 24 hours"
            />
            <p className="text-xs text-muted-foreground">
              Expected response time shown to visitors
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Expectations Section */}
      <Card className="card-neural">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>What to Expect</CardTitle>
            <Button
              onClick={addExpectation}
              size="sm"
              variant="outline"
              className="neural-glow"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Expectation
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.expectations.map((expectation, index) => (
            <div
              key={index}
              className="flex gap-4 items-start p-4 border border-border rounded-lg"
            >
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Label>Text</Label>
                  <Input
                    value={expectation.text}
                    onChange={(e) =>
                      handleExpectationChange(index, "text", e.target.value)
                    }
                    placeholder="Expectation description..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex gap-2">
                    {CONTACT_COLOR_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          handleExpectationChange(index, "color", option.value)
                        }
                        className={`w-8 h-8 rounded-full ${option.color} ${
                          expectation.color === option.value
                            ? "ring-2 ring-primary ring-offset-2"
                            : ""
                        }`}
                        title={option.label}
                      />
                    ))}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {CONTACT_COLOR_OPTIONS.find(
                      (c) => c.value === expectation.color
                    )?.label || expectation.color}
                  </Badge>
                </div>
              </div>

              <Button
                onClick={() => removeExpectation(index)}
                size="icon"
                variant="ghost"
                className="text-destructive hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}

          {settings.expectations.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No expectations added yet. Click "Add Expectation" to get started.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
