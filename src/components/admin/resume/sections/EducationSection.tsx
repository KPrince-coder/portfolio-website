import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEducation } from "../hooks";
import EducationList from "../EducationList";
import EducationForm from "../EducationForm";
import type { ResumeEducation } from "../types";

const EducationSection: React.FC = () => {
  const {
    education,
    loading,
    createEducation,
    updateEducation,
    deleteEducation,
  } = useEducation();

  const [showForm, setShowForm] = useState(false);
  const [editingEducation, setEditingEducation] =
    useState<ResumeEducation | null>(null);

  const handleEdit = (edu: ResumeEducation) => {
    setEditingEducation(edu);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingEducation(null);
  };

  const handleSave = async (data: any) => {
    if (editingEducation) {
      return await updateEducation(editingEducation.id, data);
    }
    return await createEducation(data);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Education</CardTitle>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </CardHeader>
      <CardContent>
        <EducationList
          education={education}
          onEdit={handleEdit}
          onDelete={deleteEducation}
          loading={loading}
        />
      </CardContent>

      {showForm && (
        <EducationForm
          education={editingEducation || undefined}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </Card>
  );
};

export default EducationSection;
