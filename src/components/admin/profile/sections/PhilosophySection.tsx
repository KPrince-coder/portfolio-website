import React from "react";
import { Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { PhilosophySectionProps } from "./types";

const PhilosophySection: React.FC<PhilosophySectionProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <Card className="card-neural">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Award className="w-5 h-5" />
          <span>Philosophy</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="philosophy_quote">Philosophy Quote</Label>
          <Textarea
            id="philosophy_quote"
            value={formData.philosophy_quote || ""}
            onChange={(e) => onInputChange("philosophy_quote", e.target.value)}
            placeholder="Your personal philosophy, mission statement, or professional motto..."
            rows={4}
          />
          <p className="text-xs text-muted-foreground mt-1">
            This will be displayed as a blockquote in the About section
          </p>
        </div>

        <div>
          <Label htmlFor="philosophy_author">Author Attribution</Label>
          <Input
            id="philosophy_author"
            value={formData.philosophy_author || ""}
            onChange={(e) => onInputChange("philosophy_author", e.target.value)}
            placeholder="Your Name"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Usually your name or professional title
          </p>
        </div>

        {/* Preview */}
        {formData.philosophy_quote && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">Preview:</p>
            <blockquote className="text-sm italic text-muted-foreground leading-relaxed border-l-4 border-secondary pl-4">
              "{formData.philosophy_quote}"
            </blockquote>
            {formData.philosophy_author && (
              <div className="mt-2 text-sm">
                <span className="font-semibold">
                  — {formData.philosophy_author}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PhilosophySection;
