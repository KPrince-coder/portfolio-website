/**
 * BackToTopButton Component
 *
 * Smooth scroll to top button with tooltip and animations
 */

import { ArrowUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function BackToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={scrollToTop}
            className="absolute right-6 bottom-6 p-3 rounded-full bg-primary text-primary-foreground neural-glow group transition-all duration-300 hover:scale-110"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-1" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" className="neural-glow">
          <p>Back to top</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
