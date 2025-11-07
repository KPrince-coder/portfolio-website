/**
 * FooterLinks Component
 *
 * Displays custom footer navigation links
 */

import type { FooterLink } from "./types";

interface FooterLinksProps {
  links: FooterLink[];
}

export function FooterLinks({ links }: FooterLinksProps) {
  if (links.length === 0) return null;

  return (
    <nav className="flex flex-wrap gap-4 justify-center">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
