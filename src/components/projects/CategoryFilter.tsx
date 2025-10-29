import React from "react";
import { Button } from "@/components/ui/button";
import type { CategoryFilterProps } from "./types";

/**
 * CategoryFilter Component
 * Displays category filter buttons for projects
 */
const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-12">
      <Button
        variant={activeCategory === "all" ? "default" : "outline"}
        onClick={() => onCategoryChange("all")}
        className={
          activeCategory === "all"
            ? "neural-glow"
            : "hover:border-neural/50 transition-colors"
        }
      >
        All Projects
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={activeCategory === category.id ? "default" : "outline"}
          onClick={() => onCategoryChange(category.id)}
          className={
            activeCategory === category.id
              ? "neural-glow"
              : "hover:border-neural/50 transition-colors"
          }
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
