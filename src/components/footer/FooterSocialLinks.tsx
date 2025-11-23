/**
 * FooterSocialLinks Component
 *
 * Displays social media links in footer with neural-glow hover effects
 */

import { GithubIcon, LinkedinIcon, TwitterIcon, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="flex gap-3" role="list">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Button
            key={link.label}
            variant="outline"
            size="icon"
            className="neural-glow transition-all duration-300 hover:scale-110"
            asChild
            role="listitem"
          >
            <a
              href={link.url}
              target={link.label !== "Email" ? "_blank" : undefined}
              rel={link.label !== "Email" ? "noopener noreferrer" : undefined}
              aria-label={link.label}
            >
              <Icon className="w-5 h-5" />
            </a>
          </Button>
        );
      })}
    </div>
  );
}
