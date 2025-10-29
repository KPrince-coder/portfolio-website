import React, { useState } from "react";
import { Edit, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DestructiveButton } from "@/components/ui/destructive-button";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import type { SkillWithCategory } from "./types";

interface SkillsListProps {
  skills: SkillWithCategory[];
  loading: boolean;
  onEdit: (skill: SkillWithCategory) => void;
  onDelete: (id: string) => Promise<{ error: Error | null }>;
}

/**
 * SkillsList Component
 * Displays a list of skills with edit and delete actions
 */
const SkillsList: React.FC<SkillsListProps> = ({
  skills,
  loading,
  onEdit,
  onDelete,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleDeleteClick = (id: string, name: string) => {
    setSkillToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-muted-foreground">Loading skills...</p>
        </div>
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            No skills found. Add your first skill to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category_label;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, SkillWithCategory[]>);

  return (
    <>
      <div className="space-y-6">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category}>
            <h3 className="text-xl font-semibold mb-4">{category}</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categorySkills.map((skill) => (
                <Card
                  key={skill.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-lg">
                            {skill.name}
                          </h4>
                          {skill.is_featured && (
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        <Badge variant="secondary" className="mb-2">
                          {skill.proficiency}% Proficiency
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {skill.description}
                    </p>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(skill)}
                        aria-label={`Edit ${skill.name}`}
                      >
                        <Edit className="w-4 h-4 mr-1" aria-hidden="true" />
                        Edit
                      </Button>
                      <DestructiveButton
                        size="sm"
                        onClick={() => handleDeleteClick(skill.id, skill.name)}
                        aria-label={`Delete ${skill.name}`}
                      >
                        <Trash2 className="w-4 h-4 mr-1" aria-hidden="true" />
                        Delete
                      </DestructiveButton>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {skillToDelete && (
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Delete Skill"
          itemName={skillToDelete.name}
          itemType="skill"
          onConfirm={async () => await onDelete(skillToDelete.id)}
        />
      )}
    </>
  );
};

export default SkillsList;
