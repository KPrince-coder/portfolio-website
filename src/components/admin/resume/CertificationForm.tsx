import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { CertificationFormProps, CertificationFormData } from "./types";

const CertificationForm: React.FC<CertificationFormProps> = ({
  certification,
  onClose,
  onSave,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CertificationFormData>({
    name: certification?.name || "",
    issuing_organization: certification?.issuing_organization || "",
    issue_date: certification?.issue_date || "",
    expiry_date: certification?.expiry_date || "",
    does_not_expire: certification?.does_not_expire ?? true,
    credential_id: certification?.credential_id || "",
    credential_url: certification?.credential_url || "",
    description: certification?.description || "",
    logo_url: certification?.logo_url || "",
    display_order: certification?.display_order || 0,
    is_visible: certification?.is_visible ?? true,
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const result = await onSave(formData);
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error saving certification",
          description: result.error.message,
        });
      } else {
        toast({
          title: "Certification saved",
          description: `Successfully ${
            certification ? "updated" : "created"
          } certification`,
        });
        onClose();
      }
    } catch (error) {
      console.error("Error saving certification:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while saving",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {certification ? "Edit Certification" : "Add Certification"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Certification Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issuing_organization">
                Issuing Organization *
              </Label>
              <Input
                id="issuing_organization"
                value={formData.issuing_organization}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    issuing_organization: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issue_date">Issue Date</Label>
                <Input
                  id="issue_date"
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => {
                    const newIssueDate = e.target.value;
                    setFormData((prev) => {
                      if (
                        !prev.does_not_expire &&
                        prev.expiry_date &&
                        newIssueDate > prev.expiry_date
                      ) {
                        return {
                          ...prev,
                          issue_date: newIssueDate,
                          expiry_date: "",
                        };
                      }
                      return { ...prev, issue_date: newIssueDate };
                    });
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry_date">Expiry Date</Label>
                <Input
                  id="expiry_date"
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) =>
                    setFormData({ ...formData, expiry_date: e.target.value })
                  }
                  min={formData.issue_date || undefined}
                  disabled={formData.does_not_expire}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="does_not_expire"
                checked={formData.does_not_expire}
                onCheckedChange={(checked) => {
                  setFormData({
                    ...formData,
                    does_not_expire: checked,
                    expiry_date: checked ? "" : formData.expiry_date,
                  });
                }}
              />
              <Label htmlFor="does_not_expire">Does not expire</Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="credential_id">Credential ID</Label>
                <Input
                  id="credential_id"
                  value={formData.credential_id}
                  onChange={(e) =>
                    setFormData({ ...formData, credential_id: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="credential_url">Credential URL</Label>
                <Input
                  id="credential_url"
                  type="url"
                  value={formData.credential_url}
                  onChange={(e) =>
                    setFormData({ ...formData, credential_url: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    display_order: parseInt(e.target.value) || 0,
                  })
                }
                min="0"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_visible"
                checked={formData.is_visible}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_visible: checked })
                }
              />
              <Label htmlFor="is_visible">Visible</Label>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : certification ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificationForm;
