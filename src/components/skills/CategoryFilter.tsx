import React from "react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SkillCategory } from "./types";

interface CategoryFilterProps {
  categories: SkillCategory[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

/**
 * CategoryFilter Component
 * Displays category filter buttons
 */
const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  const getIcon = (iconName: string) => {
    const Icon = Icons[iconName as keyof typeof Icons] as React.ComponentType<{
      className?: string;
    }>;
    return Icon || Icons.Code;
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {categories.map((category) => {
        const CategoryIcon = getIcon(category.icon);
        return (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            onClick={() => onCategoryChange(category.id)}
            className={`neural-glow ${
              activeCategory === category.id ? "shadow-glow-secondary" : ""
            }`}
          >
            <CategoryIcon className="w-4 h-4 mr-2" />
            {category.label}
          </Button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
