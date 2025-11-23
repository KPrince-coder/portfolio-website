/**
 * Color Picker Component
 *
 * Simple color picker with preset colors and custom input
 */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// ============================================================================
// TYPES
// ============================================================================

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

// ============================================================================
// PRESET COLORS
// ============================================================================

const PRESET_COLORS = [
  // Blues
  "#667eea",
  "#3b82f6",
  "#1e40af",
  "#0ea5e9",
  "#06b6d4",

  // Purples
  "#764ba2",
  "#8b5cf6",
  "#7c3aed",
  "#a855f7",
  "#c084fc",

  // Greens
  "#10b981",
  "#059669",
  "#16a34a",
  "#22c55e",
  "#84cc16",

  // Reds
  "#ef4444",
  "#dc2626",
  "#f97316",
  "#ea580c",
  "#f59e0b",

  // Grays
  "#6b7280",
  "#4b5563",
  "#374151",
  "#1f2937",
  "#111827",
];

// ============================================================================
// COMPONENT
// ============================================================================

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [customColor, setCustomColor] = useState(value);
  const [open, setOpen] = useState(false);

  const handlePresetSelect = (color: string) => {
    onChange(color);
    setCustomColor(color);
    setOpen(false);
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    if (isValidHexColor(color)) {
      onChange(color);
    }
  };

  const isValidHexColor = (color: string): boolean => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-2">
          <div
            className="w-4 h-4 rounded border"
            style={{ backgroundColor: value }}
          />
          {value}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-4">
          {/* Custom Color Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Custom Color</label>
            <div className="flex gap-2">
              <Input
                value={customColor}
                onChange={(e) => handleCustomColorChange(e.target.value)}
                placeholder="#667eea"
                className="font-mono"
              />
              <input
                type="color"
                value={value}
                onChange={(e) => {
                  const color = e.target.value;
                  onChange(color);
                  setCustomColor(color);
                }}
                className="w-10 h-10 rounded border cursor-pointer"
              />
            </div>
          </div>

          {/* Preset Colors */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Preset Colors</label>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_COLORS.map((color) => (
                <Button
                  key={color}
                  variant="outline"
                  size="sm"
                  className={`h-8 w-8 p-0 border-2 ${
                    value === color ? "border-primary" : "border-border"
                  }`}
                  onClick={() => handlePresetSelect(color)}
                  title={color}
                >
                  <div
                    className="w-full h-full rounded"
                    style={{ backgroundColor: color }}
                  />
                </Button>
              ))}
            </div>
          </div>

          {/* Color Preview */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Preview</label>
            <div className="flex items-center gap-2 p-3 rounded border">
              <div
                className="w-6 h-6 rounded border"
                style={{ backgroundColor: value }}
              />
              <span className="font-mono text-sm">{value}</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
