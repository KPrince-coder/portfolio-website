import React, { useState } from "react";
import { Edit, Trash2, Award, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DestructiveButton } from "@/components/ui/destructive-button";
import type { ResumeCertification } from "./types";

interface CertificationsListProps {
  certifications: ResumeCertification[];
  onEdit: (certification: ResumeCertification) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const CertificationsList: React.FC<CertificationsListProps> = ({
  certifications,
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

  const formatDate = (date?: string) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const isExpired = (cert: ResumeCertification) => {
    if (cert.does_not_expire || !cert.expiry_date) return false;
    return new Date(cert.expiry_date) < new Date();
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">Loading...</div>
    );
  }

  if (certifications.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No certifications yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {certifications.map((cert) => (
        <Card key={cert.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">{cert.name}</h3>
                  {isExpired(cert) && (
                    <Badge variant="destructive">Expired</Badge>
                  )}
                  {!cert.is_visible && <Badge variant="outline">Hidden</Badge>}
                </div>

                <div className="space-y-1 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span className="font-medium">
                      {cert.issuing_organization}
                    </span>
                  </div>

                  {cert.issue_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Issued {formatDate(cert.issue_date)}
                        {cert.does_not_expire
                          ? " • No Expiration"
                          : cert.expiry_date
                          ? ` • Expires ${formatDate(cert.expiry_date)}`
                          : ""}
                      </span>
                    </div>
                  )}

                  {cert.credential_id && (
                    <div className="text-xs">
                      Credential ID: {cert.credential_id}
                    </div>
                  )}

                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View Credential</span>
                    </a>
                  )}
                </div>

                {cert.description && (
                  <p className="text-sm text-muted-foreground">
                    {cert.description}
                  </p>
                )}
              </div>

              <div className="flex gap-2 ml-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(cert)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <DestructiveButton
                  variant="outline"
                  size="icon"
                  onConfirm={() => handleDelete(cert.id)}
                  disabled={deletingId === cert.id}
                  title="Delete Certification"
                  description="Are you sure you want to delete this certification? This action cannot be undone."
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

export default CertificationsList;
