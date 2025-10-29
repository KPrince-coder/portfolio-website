import React, { useState, useMemo, useCallback } from "react";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { availableIcons, type IconName } from "@/lib/icons";
import * as Icons from "lucide-react";

type LucideIcon = React.ComponentType<{ className?: string }>;

interface IconPickerProps {
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  id?: string;
  placeholder?: string;
}

/**
 * Helper function to safely get an icon component
 */
const getIconComponent = (iconName: string): LucideIcon | null => {
  if (!iconName) return null;
  const Icon = Icons[iconName as keyof typeof Icons];
  return (Icon as LucideIcon | undefined) || null;
};

/**
 * IconPicker Component
 * A searchable dropdown for selecting Lucide icons
 *
 * @example
 * ```tsx
 * <IconPicker
 *   value={formData.icon}
 *   onValueChange={(value) => setFormData({ ...formData, icon: value })}
 *   label="Icon"
 *   id="skill-icon"
 * />
 * ```
 */
export const IconPicker: React.FC<IconPickerProps> = ({
  value,
  onValueChange,
  label,
  id,
  placeholder = "Select an icon",
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter icons based on search term
  const filteredIcons = useMemo(() => {
    if (!searchTerm) return availableIcons;
    return availableIcons.filter((icon) =>
      icon.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Memoize search handler
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  // Get the icon component for preview
  const IconComponent = useMemo(() => getIconComponent(value), [value]);

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id} aria-label={label || "Select an icon"}>
          <SelectValue placeholder={placeholder}>
            {value && (
              <div className="flex items-center gap-2">
                {IconComponent && (
                  <IconComponent className="w-4 h-4" aria-hidden="true" />
                )}
                <span>{value}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {/* Search Input */}
          <div className="p-2 border-b sticky top-0 bg-background z-10">
            <div className="relative">
              <Search
                className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                placeholder="Search icons..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-8"
                onClick={(e) => e.stopPropagation()}
                aria-label="Search icons"
                role="searchbox"
              />
            </div>
          </div>

          {/* Icon List */}
          <div
            className="max-h-[300px] overflow-y-auto"
            role="listbox"
            aria-label="Available icons"
          >
            {filteredIcons.length > 0 ? (
              filteredIcons.map((iconName) => {
                const Icon = getIconComponent(iconName);
                return (
                  <SelectItem key={iconName} value={iconName}>
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="w-4 h-4" aria-hidden="true" />}
                      <span>{iconName}</span>
                    </div>
                  </SelectItem>
                );
              })
            ) : (
              <div
                className="p-4 text-center text-sm text-muted-foreground"
                role="status"
              >
                No icons found matching "{searchTerm}"
              </div>
            )}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
};
