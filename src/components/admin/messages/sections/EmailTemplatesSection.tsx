/**
 * EmailTemplatesSection Component
 *
 * Manages email templates for automated responses
 *
 * @module messages/sections/EmailTemplatesSection
 */

import React, { useState, useCallback } from "react";
import { Plus, Edit, Trash2, Mail, Power, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useEmailTemplates } from "../hooks/useEmailTemplates";
import EmailTemplateForm from "@/components/admin/EmailTemplateForm";
import type { EmailTemplate, EmailTemplateFormData } from "../types";

// ============================================================================
// COMPONENT
// ============================================================================

export function EmailTemplatesSection() {
  const { toast } = useToast();
  const { templates, loading, createTemplate, updateTemplate, deleteTemplate } =
    useEmailTemplates();

  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(
    null
  );
  const [showForm, setShowForm] = useState(false);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleCreateTemplate = useCallback(() => {
    setEditingTemplate(null);
    setShowForm(true);
  }, []);

  const handleEditTemplate = useCallback((template: EmailTemplate) => {
    setEditingTemplate(template);
    setShowForm(true);
  }, []);

  const handleSaveTemplate = useCallback(
    async (data: EmailTemplateFormData) => {
      try {
        if (editingTemplate) {
          await updateTemplate(editingTemplate.id, data);
          toast({
            title: "Template updated",
            description: "Email template has been updated successfully.",
          });
        } else {
          await createTemplate(data);
          toast({
            title: "Template created",
            description: "Email template has been created successfully.",
          });
        }
        setShowForm(false);
        setEditingTemplate(null);
      } catch (error) {
        console.error("Save template error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save template. Please try again.",
        });
        throw error;
      }
    },
    [editingTemplate, createTemplate, updateTemplate, toast]
  );

  const handleDeleteTemplate = useCallback(
    async (id: string) => {
      if (!confirm("Are you sure you want to delete this template?")) return;

      try {
        await deleteTemplate(id);
        toast({
          title: "Template deleted",
          description: "Email template has been deleted successfully.",
        });
      } catch (error) {
        console.error("Delete template error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete template. Please try again.",
        });
      }
    },
    [deleteTemplate, toast]
  );

  const handleToggleActive = useCallback(
    async (template: EmailTemplate) => {
      try {
        await updateTemplate(template.id, {
          is_active: !template.is_active,
        });
        toast({
          title: template.is_active
            ? "Template deactivated"
            : "Template activated",
          description: `Template has been ${
            template.is_active ? "deactivated" : "activated"
          }.`,
        });
      } catch (error) {
        console.error("Toggle active error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update template status.",
        });
      }
    },
    [updateTemplate, toast]
  );

  const handleCancelForm = useCallback(() => {
    setShowForm(false);
    setEditingTemplate(null);
  }, []);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const getTemplateTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      new_message_notification: "New Message",
      reply_to_sender: "Reply",
      auto_reply: "Auto Reply",
    };
    return labels[type] || type;
  };

  const getTemplateTypeBadgeVariant = (type: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      new_message_notification: "default",
      reply_to_sender: "secondary",
      auto_reply: "outline",
    };
    return variants[type] || "default";
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Email Templates</h2>
          <p className="text-sm text-muted-foreground">
            Manage automated email templates for messages
          </p>
        </div>
        <Button
          onClick={handleCreateTemplate}
          className="neural-glow w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Templates Grid */}
      {templates.length === 0 ? (
        <Card className="card-neural">
          <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 px-4">
            <Mail className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              No templates yet
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-3 sm:mb-4 max-w-md">
              Create your first email template to automate responses
            </p>
            <Button
              onClick={handleCreateTemplate}
              className="neural-glow w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="card-neural">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base sm:text-lg mb-2 break-words">
                      {template.name}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={getTemplateTypeBadgeVariant(
                          template.template_type
                        )}
                        className="text-xs"
                      >
                        {getTemplateTypeLabel(template.template_type)}
                      </Badge>
                      {template.is_active ? (
                        <Badge
                          variant="default"
                          className="bg-green-500 text-xs"
                        >
                          <Power className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          <PowerOff className="w-3 h-3 mr-1" />
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                    Subject:
                  </p>
                  <p className="text-sm break-words">{template.subject}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditTemplate(template)}
                    className="flex-1 min-w-[80px]"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(template)}
                    className="flex-1 min-w-[100px]"
                  >
                    {template.is_active ? (
                      <>
                        <PowerOff className="w-3 h-3 mr-1" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Power className="w-3 h-3 mr-1" />
                        Activate
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="text-destructive hover:text-destructive min-w-[44px]"
                    aria-label="Delete template"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Template Form Modal */}
      {showForm && (
        <EmailTemplateForm
          template={editingTemplate}
          onSave={handleSaveTemplate}
          onCancel={handleCancelForm}
          loading={loading}
        />
      )}
    </div>
  );
}
