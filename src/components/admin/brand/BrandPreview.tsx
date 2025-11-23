/**
 * Brand Preview Component
 *
 * Shows live preview of brand changes
 */

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as LucideIcons from "lucide-react";
import type { BrandIdentityFormData } from "@/hooks/useBrandIdentity";

// ============================================================================
// TYPES
// ============================================================================

interface BrandPreviewProps {
  brandData: BrandIdentityFormData;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function BrandPreview({ brandData }: BrandPreviewProps) {
  const IconComponent =
    (LucideIcons as any)[brandData.logo_icon] || LucideIcons.Brain;

  return (
    <div className="space-y-4">
      {/* Navigation Preview */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconComponent
                className="w-6 h-6"
                style={{ color: brandData.logo_icon_color }}
              />
              <span className="font-bold text-lg">{brandData.logo_text}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>About</span>
              <span>Projects</span>
              <span>Contact</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Preview */}
      <Card>
        <CardContent className="p-0">
          <div className="space-y-0">
            {/* Email Header */}
            <div
              className="p-4 text-center text-white"
              style={{ backgroundColor: brandData.email_header_color }}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <IconComponent className="w-5 h-5" />
                <h3 className="font-bold">{brandData.logo_text}</h3>
              </div>
              <p className="text-sm opacity-90">New Contact Message</p>
            </div>

            {/* Email Body */}
            <div className="p-4 bg-gray-50">
              <p className="text-sm text-gray-600">
                Hi there! You have a new message from your portfolio contact
                form.
              </p>
            </div>

            {/* Email Footer */}
            <div className="p-3 text-center text-xs text-gray-500 border-t">
              {brandData.email_footer_text}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Palette */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Color Palette</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <div
                className="w-full h-8 rounded mb-1"
                style={{ backgroundColor: brandData.primary_color }}
              />
              <Badge variant="secondary" className="text-xs">
                Primary
              </Badge>
            </div>
            <div className="text-center">
              <div
                className="w-full h-8 rounded mb-1"
                style={{ backgroundColor: brandData.secondary_color }}
              />
              <Badge variant="secondary" className="text-xs">
                Secondary
              </Badge>
            </div>
            <div className="text-center">
              <div
                className="w-full h-8 rounded mb-1"
                style={{ backgroundColor: brandData.accent_color }}
              />
              <Badge variant="secondary" className="text-xs">
                Accent
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
