import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SocialLinksSectionProps } from "./types";

const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <Card className="card-neural">
      <CardHeader>
        <CardTitle>Social Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="website_url">Website</Label>
            <Input
              id="website_url"
              type="url"
              value={formData.website_url || ""}
              onChange={(e) => onInputChange("website_url", e.target.value)}
              placeholder="https://yourwebsite.com"
            />
          </div>
          <div>
            <Label htmlFor="github_url">GitHub</Label>
            <Input
              id="github_url"
              type="url"
              value={formData.github_url || ""}
              onChange={(e) => onInputChange("github_url", e.target.value)}
              placeholder="https://github.com/username"
            />
          </div>
          <div>
            <Label htmlFor="linkedin_url">LinkedIn</Label>
            <Input
              id="linkedin_url"
              type="url"
              value={formData.linkedin_url || ""}
              onChange={(e) => onInputChange("linkedin_url", e.target.value)}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div>
            <Label htmlFor="twitter_url">Twitter/X</Label>
            <Input
              id="twitter_url"
              type="url"
              value={formData.twitter_url || ""}
              onChange={(e) => onInputChange("twitter_url", e.target.value)}
              placeholder="https://twitter.com/username"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialLinksSection;
