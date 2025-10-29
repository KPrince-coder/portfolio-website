import React, { useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { getIcon } from "./utils";
import type { CategoryFilterProps } from "./types";

/**
 * CategoryFilter Component
 * Displays category filter buttons with accessibility and performance optimizations
 */
const CategoryFilter: React.FC<CategoryFilterProps> = React.memo(
  ({ categories, activeCategory, onCategoryChange }) => {
    // Memoize the All icon to prevent re-creation on every render
    const AllIcon = useMemo(() => getIcon("Grid"), []);

    // Filter out the "all" category from database (we render it manually)
    const filteredCategories = useMemo(
      () => categories.filter((cat) => cat.name !== "all" && cat.id !== "all"),
      [categories]
    );

    // Memoize category icons to prevent repeated getIcon calls
    const categoryIcons = useMemo(() => {
      return filteredCategories.reduce((acc, category) => {
        acc[category.id] = getIcon(category.icon);
        return acc;
      }, {} as Record<string, React.ComponentType<any>>);
    }, [filteredCategories]);

    // Memoize click handler to prevent function recreation
    const handleCategoryChange = useCallback(
      (categoryId: string) => {
        onCategoryChange(categoryId);
      },
      [onCategoryChange]
    );

    return (
      <nav
        className="flex flex-wrap justify-center gap-4 mb-12"
        role="navigation"
        aria-label="Skills category filter"
      >
        {/* All Skills Button */}
        <Button
          variant={activeCategory === "all" ? "default" : "outline"}
          onClick={() => handleCategoryChange("all")}
          className={`neural-glow ${
            activeCategory === "all" ? "shadow-glow-secondary" : ""
          }`}
          aria-pressed={activeCategory === "all"}
          aria-label="Show all skills"
        >
          <AllIcon className="w-4 h-4 mr-2" aria-hidden="true" />
          All Skills
        </Button>

        {/* Category Buttons */}
        {filteredCategories.map((category) => {
          const CategoryIcon = categoryIcons[category.id];
          return (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => handleCategoryChange(category.id)}
              className={`neural-glow ${
                activeCategory === category.id ? "shadow-glow-secondary" : ""
              }`}
              aria-pressed={activeCategory === category.id}
              aria-label={`Filter by ${category.label}`}
            >
              <CategoryIcon className="w-4 h-4 mr-2" aria-hidden="true" />
              {category.label}
            </Button>
          );
        })}
      </nav>
    );
  }
);

CategoryFilter.displayName = "CategoryFilter";

export default CategoryFilter;
