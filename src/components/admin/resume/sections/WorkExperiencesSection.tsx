import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkExperiences } from "../hooks";
import WorkExperiencesList from "../WorkExperiencesList";
import WorkExperienceForm from "../WorkExperienceForm";
import type { ResumeWorkExperience } from "../types";

const WorkExperiencesSection: React.FC = () => {
  const {
    experiences,
    loading,
    createExperience,
    updateExperience,
    deleteExperience,
  } = useWorkExperiences();

  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] =
    useState<ResumeWorkExperience | null>(null);

  const handleEdit = (experience: ResumeWorkExperience) => {
    setEditingExperience(experience);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingExperience(null);
  };

  const handleSave = async (data: any) => {
    if (editingExperience) {
      return await updateExperience(editingExperience.id, data);
    }
    return await createExperience(data);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Work Experiences</CardTitle>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </CardHeader>
      <CardContent>
        <WorkExperiencesList
          experiences={experiences}
          onEdit={handleEdit}
          onDelete={deleteExperience}
          loading={loading}
        />
      </CardContent>

      {showForm && (
        <WorkExperienceForm
          experience={editingExperience || undefined}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </Card>
  );
};

export default WorkExperiencesSection;
