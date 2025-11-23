import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCertifications } from "../hooks";
import CertificationsList from "../CertificationsList";
import CertificationForm from "../CertificationForm";
import type { ResumeCertification } from "../types";

const CertificationsSection: React.FC = () => {
  const {
    certifications,
    loading,
    createCertification,
    updateCertification,
    deleteCertification,
  } = useCertifications();

  const [showForm, setShowForm] = useState(false);
  const [editingCertification, setEditingCertification] =
    useState<ResumeCertification | null>(null);

  const handleEdit = (cert: ResumeCertification) => {
    setEditingCertification(cert);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingCertification(null);
  };

  const handleSave = async (data: any) => {
    if (editingCertification) {
      return await updateCertification(editingCertification.id, data);
    }
    return await createCertification(data);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Certifications</CardTitle>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Certification
        </Button>
      </CardHeader>
      <CardContent>
        <CertificationsList
          certifications={certifications}
          onEdit={handleEdit}
          onDelete={deleteCertification}
          loading={loading}
        />
      </CardContent>

      {showForm && (
        <CertificationForm
          certification={editingCertification || undefined}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </Card>
  );
};

export default CertificationsSection;
