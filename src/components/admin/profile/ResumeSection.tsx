import React, { useState } from "react";
import { Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

interface ResumeSectionProps {
  formData: Partial<ProfileUpdate>;
  onInputChange: (field: keyof ProfileUpdate, value: any) => void;
}

const ResumeSection: React.FC<ResumeSectionProps> = ({
  formData,
  onInputChange,
}) => {
  const [uploadingResume, setUploadingResume] = useState(false);
  const { toast } = useToast();

  const handleResumeUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a PDF file",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Resume must be less than 10MB",
      });
      return;
    }

    setUploadingResume(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileName = `${user.id}/resume.pdf`;

      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("resumes")
        .getPublicUrl(fileName);

      onInputChange("resume_url", urlData.publicUrl);
      onInputChange("resume_file_name", file.name);
      onInputChange("resume_updated_at", new Date().toISOString());

      toast({
        title: "Resume uploaded",
        description: "Your resume has been uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "Failed to upload resume",
      });
    } finally {
      setUploadingResume(false);
    }
  };

  return (
    <Card className="card-neural">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="w-5 h-5" />
          <span>Resume</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Upload Resume (PDF)</Label>
          <Input
            type="file"
            accept="application/pdf"
            onChange={handleResumeUpload}
            disabled={uploadingResume}
            className="cursor-pointer mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Max 10MB. PDF only
          </p>
        </div>

        {formData.resume_url && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium">Current Resume</p>
            <p className="text-sm text-muted-foreground">
              {formData.resume_file_name}
            </p>
            {formData.resume_updated_at && (
              <p className="text-xs text-muted-foreground mt-1">
                Updated:{" "}
                {new Date(formData.resume_updated_at).toLocaleDateString()}
              </p>
            )}
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              onClick={() => window.open(formData.resume_url!, "_blank")}
            >
              View Resume
            </Button>
          </div>
        )}

        <div>
          <Label htmlFor="resume_url_manual">Or Enter Resume URL</Label>
          <Input
            id="resume_url_manual"
            type="url"
            value={formData.resume_url || ""}
            onChange={(e) => onInputChange("resume_url", e.target.value)}
            placeholder="https://example.com/resume.pdf"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Use this if your resume is hosted elsewhere
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeSection;
