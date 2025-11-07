/**
 * FooterSocialLinks Component
 *
 * Displays social media links in footer
 */

import { GithubIcon, LinkedinIcon, TwitterIcon, Mail } from "lucide-react";
import type { SocialLinks } from "./types";

interface FooterSocialLinksProps {
  socialLinks: SocialLinks;
}

export function FooterSocialLinks({ socialLinks }: FooterSocialLinksProps) {
  const links = [
    {
      icon: GithubIcon,
      url: socialLinks.githubUrl,
      label: "GitHub",
    },
    {
      icon: LinkedinIcon,
      url: socialLinks.linkedinUrl,
      label: "LinkedIn",
    },
    {
      icon: TwitterIcon,
      url: socialLinks.twitterUrl,
      label: "Twitter",
    },
    {
      icon: Mail,
      url: socialLinks.email ? `mailto:${socialLinks.email}` : undefined,
      label: "Email",
    },
  ].filter((link) => link.url);

  if (links.length === 0) return null;

  return (
    <div className="flex gap-4">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.url}
          target={link.label !== "Email" ? "_blank" : undefined}
          rel={link.label !== "Email" ? "noopener noreferrer" : undefined}
          className="text-muted-foreground hover:text-primary transition-colors"
          aria-label={link.label}
        >
          <link.icon className="w-5 h-5" />
        </a>
      ))}
    </div>
  );
}
