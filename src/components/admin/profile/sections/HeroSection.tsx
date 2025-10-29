import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { HeroSectionProps } from "./types";

const HeroSection: React.FC<HeroSectionProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <Card className="card-neural">
      <CardHeader>
        <CardTitle>Hero Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="hero_title">Hero Title</Label>
          <Input
            id="hero_title"
            value={formData.hero_title || ""}
            onChange={(e) => onInputChange("hero_title", e.target.value)}
            placeholder="Your Name"
          />
        </div>

        <div>
          <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
          <Input
            id="hero_subtitle"
            value={formData.hero_subtitle || ""}
            onChange={(e) => onInputChange("hero_subtitle", e.target.value)}
            placeholder="Your Role/Title"
          />
        </div>

        <div>
          <Label htmlFor="hero_tagline">Hero Tagline</Label>
          <Input
            id="hero_tagline"
            value={formData.hero_tagline || ""}
            onChange={(e) => onInputChange("hero_tagline", e.target.value)}
            placeholder="Your Tagline"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroSection;
