import React from "react";
import { Github, Linkedin, Mail, Globe, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocialLinksProps {
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  email?: string | null;
  websiteUrl?: string | null;
  twitterUrl?: string | null;
}

/**
 * SocialLinks Component
 * Displays social media and contact links as icon buttons
 */
const SocialLinks: React.FC<SocialLinksProps> = ({
  githubUrl,
  linkedinUrl,
  email,
  websiteUrl,
  twitterUrl,
}) => {
  const links = [
    {
      icon: Github,
      url: githubUrl,
      label: "GitHub Profile",
    },
    {
      icon: Linkedin,
      url: linkedinUrl,
      label: "LinkedIn Profile",
    },
    {
      icon: Twitter,
      url: twitterUrl,
      label: "Twitter Profile",
    },
    {
      icon: Globe,
      url: websiteUrl,
      label: "Personal Website",
    },
    {
      icon: Mail,
      url: email ? `mailto:${email}` : null,
      label: "Email Contact",
    },
  ].filter((link) => link.url); // Only show links that have URLs

  if (links.length === 0) return null;

  return (
    <div className="flex items-center space-x-4" role="list">
      {links.map((link, index) => {
        const Icon = link.icon;
        return (
          <Button
            key={index}
            variant="outline"
            size="icon"
            className="neural-glow"
            asChild
            role="listitem"
          >
            <a
              href={link.url!}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
            >
              <Icon className="w-5 h-5" />
            </a>
          </Button>
        );
      })}
    </div>
  );
};

export default React.memo(SocialLinks);
