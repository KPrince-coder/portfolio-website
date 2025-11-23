import React from "react";
import heroBackground from "@/assets/hero-bg.jpg";

/**
 * HeroBackground Component
 * Renders the background image with overlay and animated floating elements
 */
const HeroBackground: React.FC = () => {
  return (
    <>
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
        role="presentation"
      />
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-96 h-96 rounded-full opacity-10 animate-float"
            style={{
              background: `radial-gradient(circle, hsl(191, 100%, 50%) 0%, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${6 + i}s`,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default React.memo(HeroBackground);
