import React from "react";
import { MapPin } from "lucide-react";
import type { Experience } from "./types";
import { getIcon } from "./utils/iconHelper";

interface ExperienceTimelineProps {
  experiences: Experience[];
}

/**
 * ExperienceTimeline Component
 * Displays professional journey in a timeline format
 */
const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({
  experiences,
}) => {
  return (
    <article className="space-y-8">
      <h3 className="heading-md text-center lg:text-left mb-8">
        Professional Journey
      </h3>
      <div
        className="relative"
        role="list"
        aria-label="Professional experience timeline"
      >
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary via-accent to-success"></div>

        {experiences.map((exp, index) => {
          const IconComponent = getIcon(exp.icon);
          return (
            <div
              key={index}
              className="relative flex items-start space-x-6 pb-8 last:pb-0"
              role="listitem"
            >
              <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-neural flex items-center justify-center shadow-glow-secondary">
                <IconComponent
                  className={`w-8 h-8 ${exp.color}`}
                  aria-hidden="true"
                />
              </div>

              <div className="flex-1 pt-2">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-sm font-mono text-secondary bg-secondary/10 px-3 py-1 rounded-full">
                    {exp.year}
                  </span>
                  <MapPin className="w-4 h-4 text-muted" aria-hidden="true" />
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-1">
                  {exp.title}
                </h4>
                <p className="text-secondary font-medium mb-2">{exp.company}</p>
                <p className="text-muted-foreground leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
};

export default React.memo(ExperienceTimeline);
