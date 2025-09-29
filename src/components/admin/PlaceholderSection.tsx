import React from 'react';

interface PlaceholderSectionProps {
  title: string;
  description: string;
}

const PlaceholderSection: React.FC<PlaceholderSectionProps> = ({ title, description }) => {
  return (
    <div className="space-y-6">
      <h2 className="heading-lg">{title}</h2>
      <div className="text-center py-12">
        <p className="text-muted-foreground">{description} coming soon...</p>
      </div>
    </div>
  );
};

export default PlaceholderSection;
