/**
 * Icon Selector Component
 *
 * Similar to the experience section icon selector
 */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import * as LucideIcons from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

interface IconSelectorProps {
  value: string;
  onChange: (icon: string) => void;
  color?: string;
}

// ============================================================================
// POPULAR ICONS FOR PORTFOLIOS
// ============================================================================

const POPULAR_ICONS = [
  "Brain",
  "Code",
  "Database",
  "Cpu",
  "Zap",
  "Target",
  "Rocket",
  "Star",
  "Heart",
  "Lightbulb",
  "Atom",
  "Layers",
  "Hexagon",
  "Triangle",
  "Circle",
  "Square",
  "Diamond",
  "Sparkles",
  "Flame",
  "Leaf",
];

// ============================================================================
// COMPONENT
// ============================================================================

export function IconSelector({
  value,
  onChange,
  color = "#667eea",
}: IconSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Get all available Lucide icons
  const allIcons = Object.keys(LucideIcons).filter(
    (name) => name !== "default" && name !== "createLucideIcon"
  );

  // Filter icons based on search
  const filteredIcons = search
    ? allIcons.filter((name) =>
        name.toLowerCase().includes(search.toLowerCase())
      )
    : POPULAR_ICONS;

  // Get the current icon component
  const CurrentIcon = (LucideIcons as any)[value] || LucideIcons.Brain;

  const handleIconSelect = (iconName: string) => {
    onChange(iconName);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-2">
          <CurrentIcon className="w-4 h-4" style={{ color }} />
          {value}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Select Icon</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Popular Icons */}
          {!search && (
            <div>
              <h4 className="text-sm font-medium mb-2">Popular Icons</h4>
              <div className="grid grid-cols-8 gap-2">
                {POPULAR_ICONS.map((iconName) => {
                  const IconComponent = (LucideIcons as any)[iconName];
                  if (!IconComponent) return null;

                  return (
                    <Button
                      key={iconName}
                      variant={value === iconName ? "default" : "outline"}
                      size="sm"
                      className="h-10 w-10 p-0"
                      onClick={() => handleIconSelect(iconName)}
                      title={iconName}
                    >
                      <IconComponent className="w-4 h-4" />
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* All Icons */}
          <div className="max-h-96 overflow-y-auto">
            <h4 className="text-sm font-medium mb-2">
              {search
                ? `Search Results (${filteredIcons.length})`
                : "All Icons"}
            </h4>
            <div className="grid grid-cols-8 gap-2">
              {filteredIcons.map((iconName) => {
                const IconComponent = (LucideIcons as any)[iconName];
                if (!IconComponent) return null;

                return (
                  <Button
                    key={iconName}
                    variant={value === iconName ? "default" : "outline"}
                    size="sm"
                    className="h-10 w-10 p-0"
                    onClick={() => handleIconSelect(iconName)}
                    title={iconName}
                  >
                    <IconComponent className="w-4 h-4" />
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Current Selection */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Selected:</span>
              <Badge variant="secondary" className="gap-1">
                <CurrentIcon className="w-3 h-3" style={{ color }} />
                {value}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
