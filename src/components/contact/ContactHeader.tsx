/**
 * ContactHeader Component
 *
 * Header section for the contact page with dynamic content
 */

import React from "react";

interface ContactHeaderProps {
  title: string;
  titleHighlight: string;
  description: string;
}

export function ContactHeader({
  title,
  titleHighlight,
  description,
}: ContactHeaderProps) {
  // Split title to find the highlight
  const titleParts = title.split(titleHighlight);

  return (
    <div className="text-center mb-16">
      <h2 className="heading-xl mb-6">
        {titleParts[0]}
        <span className="text-neural">{titleHighlight}</span>
        {titleParts[1]}
      </h2>
      <div className="w-24 h-1 bg-gradient-secondary mx-auto mb-8" />
      <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
        {description}
      </p>
    </div>
  );
}
