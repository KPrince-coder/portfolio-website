import React, { useState, useMemo } from "react";
import { Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SkillsList from "../SkillsList";
import SkillForm from "../SkillForm";
import { useSkills } from "../hooks/useSkills";
import { useSkillCategories } from "../hooks/useSkillCategories";
import type { Skill } from "../types";

/**
 * SkillsListSection Component
 * Manages the list of skills with CRUD operations
 */
const SkillsListSection: React.FC = () => {
  const { skills, loading, createSkill, updateSkill, deleteSkill } =
    useSkills();
  const { categories } = useSkillCategories();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [featuredFilter, setFeaturedFilter] = useState("All");

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingSkill(null);
  };

  const handleSave = async (data: any) => {
    if (editingSkill) {
      return await updateSkill(editingSkill.id, data);
    }
    return await createSkill(data);
  };

  // Filter skills based on search and filters
  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      // Search filter
      const matchesSearch =
        !searchTerm ||
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory =
        categoryFilter === "All" || skill.category_id === categoryFilter;

      // Featured filter
      const matchesFeatured =
        featuredFilter === "All" ||
        (featuredFilter === "true" && skill.is_featured) ||
        (featuredFilter === "false" && !skill.is_featured);

      return matchesSearch && matchesCategory && matchesFeatured;
    });
  }, [skills, searchTerm, categoryFilter, featuredFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Skills</h2>
          <p className="text-muted-foreground mt-2">
            Manage your technical skills and proficiency levels
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search skills..."
            className="pl-9 pr-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 p-0 text-muted-foreground hover:bg-transparent"
              onClick={() => setSearchTerm("")}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Category Filter */}
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {categories
              .filter((cat) => cat.name !== "all")
              .map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.label}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {/* Featured Filter */}
        <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Featured" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Skills</SelectItem>
            <SelectItem value="true">Featured Only</SelectItem>
            <SelectItem value="false">Non-Featured</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredSkills.length} of {skills.length} skills
      </div>

      <SkillsList
        skills={filteredSkills}
        loading={loading}
        onEdit={handleEdit}
        onDelete={deleteSkill}
      />

      {isFormOpen && (
        <SkillForm
          skill={editingSkill}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default SkillsListSection;
