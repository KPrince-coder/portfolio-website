import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, X, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  EmailTemplateFormProps,
  EmailTemplateFormData,
} from "./messages/types";

const emailTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  subject: z.string().min(1, "Subject is required"),
  html_content: z.string().min(1, "HTML content is required"),
  text_content: z.string().optional(),
  template_type: z.enum([
    "new_message_notification",
    "reply_to_sender",
    "auto_reply",
  ]),
  is_active: z.boolean(),
});

const EmailTemplateForm: React.FC<EmailTemplateFormProps> = ({
  template,
  onSave,
  onCancel,
  loading = false,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EmailTemplateFormData>({
    resolver: zodResolver(emailTemplateSchema),
    defaultValues: {
      name: template?.name || "",
      subject: template?.subject || "",
      html_content: template?.html_content || "",
      text_content: template?.text_content || "",
      template_type:
        (template?.template_type as
          | "new_message_notification"
          | "reply_to_sender"
          | "auto_reply") || "reply_to_sender",
      is_active: template?.is_active ?? true,
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (template) {
      setValue("name", template.name);
      setValue("subject", template.subject);
      setValue("html_content", template.html_content);
      setValue("text_content", template.text_content || "");
      setValue(
        "template_type",
        template.template_type as
          | "new_message_notification"
          | "reply_to_sender"
          | "auto_reply"
      );
      setValue("is_active", template.is_active);
    }
  }, [template, setValue]);

  const onSubmit = async (data: EmailTemplateFormData) => {
    setIsSaving(true);
    try {
      await onSave(data);
      toast({
        title: "Template saved successfully",
        description: "Your email template has been saved.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to save template",
        description: "Please try again or contact support.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const templateTypeLabels = {
    new_message_notification: "New Message Notification",
    reply_to_sender: "Reply to Sender",
    auto_reply: "Auto Reply",
  };

  const availableVariables = {
    new_message_notification: [
      "{{sender_name}}",
      "{{sender_email}}",
      "{{subject}}",
      "{{message}}",
      "{{created_at}}",
      "{{admin_url}}",
      "{{message_id}}",
    ],
    reply_to_sender: [
      "{{sender_name}}",
      "{{reply_content}}",
      "{{original_message}}",
      "{{original_subject}}",
      "{{admin_name}}",
    ],
    auto_reply: [
      "{{sender_name}}",
      "{{subject}}",
      "{{admin_name}}",
      "{{company_name}}",
    ],
  };

  const currentVariables =
    availableVariables[watchedValues.template_type] || [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="card-neural w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>{template ? "Edit" : "Create"} Email Template</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="e.g., Welcome Email"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="template_type">Template Type</Label>
                <Select
                  value={watchedValues.template_type}
                  onValueChange={(value) =>
                    setValue("template_type", value as any)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(templateTypeLabels).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject</Label>
              <Input
                id="subject"
                {...register("subject")}
                placeholder="e.g., Thank you for your message"
              />
              {errors.subject && (
                <p className="text-sm text-destructive">
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={watchedValues.is_active}
                onCheckedChange={(checked) => setValue("is_active", checked)}
              />
              <Label>Active Template</Label>
            </div>

            {/* Available Variables */}
            <div className="space-y-2">
              <Label>Available Variables</Label>
              <div className="flex flex-wrap gap-2">
                {currentVariables.map((variable) => (
                  <Badge key={variable} variant="outline" className="text-xs">
                    {variable}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="html" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="html">HTML Content</TabsTrigger>
                <TabsTrigger value="text">Text Content</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="html" className="space-y-2">
                <Label htmlFor="html_content">HTML Content</Label>
                <Textarea
                  id="html_content"
                  {...register("html_content")}
                  placeholder="Enter HTML email content..."
                  className="min-h-[300px] font-mono text-sm"
                />
                {errors.html_content && (
                  <p className="text-sm text-destructive">
                    {errors.html_content.message}
                  </p>
                )}
              </TabsContent>

              <TabsContent value="text" className="space-y-2">
                <Label htmlFor="text_content">Text Content (Optional)</Label>
                <Textarea
                  id="text_content"
                  {...register("text_content")}
                  placeholder="Enter plain text email content..."
                  className="min-h-[300px]"
                />
              </TabsContent>

              <TabsContent value="preview" className="space-y-2">
                <Label>Email Preview</Label>
                <div className="border border-border rounded-md p-4 bg-background/50 min-h-[300px]">
                  <div className="mb-4 pb-2 border-b border-border">
                    <p className="text-sm text-muted-foreground">Subject:</p>
                    <p className="font-medium">
                      {watchedValues.subject || "No subject"}
                    </p>
                  </div>
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: watchedValues.html_content || "<p>No content</p>",
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving || loading}
                className="neural-glow"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save Template"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailTemplateForm;
