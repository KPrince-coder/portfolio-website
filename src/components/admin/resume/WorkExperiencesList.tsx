import React, { useState } from "react";
import { Edit, Trash2, Briefcase, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DestructiveButton } from "@/components/ui/destructive-button";
import type { ResumeWorkExperience } from "./types";

interface WorkExperiencesListProps {
  experiences: ResumeWorkExperience[];
  onEdit: (experience: ResumeWorkExperience) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const WorkExperiencesList: React.FC<WorkExperiencesListProps> = ({
  experiences,
  onEdit,
  onDelete,
  loading,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  const formatPeriod = (
    startDate: string,
    endDate?: string,
    isCurrent?: boolean
  ) => {
    const start = new Date(startDate).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    if (isCurrent) return `${start} - Present`;
    if (!endDate) return start;
    const end = new Date(endDate).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    return `${start} - ${end}`;
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">Loading...</div>
    );
  }

  if (experiences.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No work experiences yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {experiences.map((experience) => (
        <Card key={experience.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">{experience.title}</h3>
                  {experience.is_current && (
                    <Badge variant="secondary">Current</Badge>
                  )}
                  {experience.is_featured && (
                    <Badge variant="default">Featured</Badge>
                  )}
                  {!experience.is_visible && (
                    <Badge variant="outline">Hidden</Badge>
                  )}
                </div>

                <div className="space-y-1 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span className="font-medium">{experience.company}</span>
                    {experience.employment_type && (
                      <Badge variant="outline" className="text-xs">
                        {experience.employment_type}
                      </Badge>
                    )}
                  </div>
                  {experience.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{experience.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formatPeriod(
                        experience.start_date,
                        experience.end_date,
                        experience.is_current
                      )}
                    </span>
                  </div>
                </div>

                {experience.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {experience.description}
                  </p>
                )}

                {experience.achievements &&
                  experience.achievements.length > 0 && (
                    <ul className="space-y-1">
                      {experience.achievements
                        .slice(0, 3)
                        .map((achievement, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-muted-foreground flex items-start gap-2"
                          >
                            <span className="text-primary mt-1">•</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      {experience.achievements.length > 3 && (
                        <li className="text-sm text-muted-foreground italic">
                          +{experience.achievements.length - 3} more
                        </li>
                      )}
                    </ul>
                  )}
              </div>

              <div className="flex gap-2 ml-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(experience)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <DestructiveButton
                  variant="outline"
                  size="icon"
                  onConfirm={() => handleDelete(experience.id)}
                  disabled={deletingId === experience.id}
                  title="Delete Work Experience"
                  description="Are you sure you want to delete this work experience? This action cannot be undone."
                >
                  <Trash2 className="w-4 h-4" />
                </DestructiveButton>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WorkExperiencesList;
