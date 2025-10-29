import React from "react";

interface AboutHeaderProps {
  title: string;
  fullName: string;
  description: string;
}

/**
 * AboutHeader Component
 * Displays the section title and description
 */
const AboutHeader: React.FC<AboutHeaderProps> = ({
  title,
  fullName,
  description,
}) => {
  return (
    <header className="text-center mb-16">
      <h2 id="about-heading" className="heading-xl mb-6">
        {title} <span className="text-neural">{fullName}</span>
      </h2>
      <div className="w-24 h-1 bg-gradient-secondary mx-auto mb-8"></div>
      <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
        {description}
      </p>
    </header>
  );
};

export default React.memo(AboutHeader);
