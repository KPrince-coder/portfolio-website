/**
 * FooterLinks Component
 *
 * Displays custom footer navigation links with enhanced hover effects
 */

import type { FooterLink } from "./types";

interface FooterLinksProps {
  links: FooterLink[];
}

export function FooterLinks({ links }: FooterLinksProps) {
  if (links.length === 0) return null;

  return (
    <nav className="flex flex-wrap gap-6 justify-center">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          className="relative text-sm text-muted-foreground hover:text-secondary transition-all duration-300 group"
        >
          <span className="relative z-10">{link.label}</span>
          <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-secondary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          <span className="absolute inset-0 bg-secondary/10 rounded blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </a>
      ))}
    </nav>
  );
}
