import React, { useState } from "react";
import { Edit, Trash2, GraduationCap, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DestructiveButton } from "@/components/ui/destructive-button";
import type { ResumeEducation } from "./types";

interface EducationListProps {
  education: ResumeEducation[];
  onEdit: (education: ResumeEducation) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const EducationList: React.FC<EducationListProps> = ({
  education,
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

  const formatPeriod = (startDate?: string, endDate?: string) => {
    if (!startDate && !endDate) return null;
    const start = startDate ? new Date(startDate).getFullYear() : null;
    const end = endDate ? new Date(endDate).getFullYear() : "Present";
    if (start && end) return `${start} - ${end}`;
    if (end) return end;
    return start;
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">Loading...</div>
    );
  }

  if (education.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No education records yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {education.map((edu) => (
        <Card key={edu.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">{edu.degree}</h3>
                  {!edu.is_visible && <Badge variant="outline">Hidden</Badge>}
                </div>

                {edu.field_of_study && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {edu.field_of_study}
                  </p>
                )}

                <div className="space-y-1 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span className="font-medium">{edu.school}</span>
                  </div>
                  {edu.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{edu.location}</span>
                    </div>
                  )}
                  {(edu.start_date || edu.end_date) && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatPeriod(edu.start_date, edu.end_date)}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mb-3">
                  {edu.gpa && <Badge variant="secondary">GPA: {edu.gpa}</Badge>}
                  {edu.grade && <Badge variant="secondary">{edu.grade}</Badge>}
                </div>

                {edu.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {edu.description}
                  </p>
                )}

                {edu.activities && edu.activities.length > 0 && (
                  <ul className="space-y-1">
                    {edu.activities.slice(0, 3).map((activity, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <span className="text-primary mt-1">•</span>
                        <span>{activity}</span>
                      </li>
                    ))}
                    {edu.activities.length > 3 && (
                      <li className="text-sm text-muted-foreground italic">
                        +{edu.activities.length - 3} more
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <div className="flex gap-2 ml-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(edu)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <DestructiveButton
                  variant="outline"
                  size="icon"
                  onConfirm={() => handleDelete(edu.id)}
                  disabled={deletingId === edu.id}
                  title="Delete Education"
                  description="Are you sure you want to delete this education record? This action cannot be undone."
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

export default EducationList;
