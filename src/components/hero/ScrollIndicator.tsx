import React from "react";

/**
 * ScrollIndicator Component
 * Displays an animated scroll indicator at the bottom of the hero section
 */
const ScrollIndicator: React.FC = () => {
  return (
    <div
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-secondary animate-bounce"
      role="presentation"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center space-y-2">
        <div className="w-6 h-10 border-2 border-secondary rounded-full relative">
          <div className="w-1 h-3 bg-secondary rounded-full absolute top-2 left-1/2 transform -translate-x-1/2 animate-pulse" />
        </div>
        <span className="text-xs uppercase tracking-wider">Scroll</span>
      </div>
    </div>
  );
};

export default React.memo(ScrollIndicator);
