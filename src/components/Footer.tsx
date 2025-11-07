/**
 * Footer Component
 *
 * Dynamic footer with CMS-managed content
 */

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useBrandIdentity } from "@/hooks/useBrandIdentity";
import { Github, Linkedin, Twitter, Mail, ArrowUp } from "lucide-react";

interface FooterSettings {
  copyright_text: string;
  company_name: string;
  tagline: string;
  show_tagline: boolean;
  show_social_links: boolean;
  links: Array<{
    label: string;
    url: string;
    is_active: boolean;
  }>;
  layout: string;
  show_back_to_top: boolean;
  background_style: string;
}

export function Footer() {
  const { brandIdentity } = useBrandIdentity();
  const [settings, setSettings] = useState<FooterSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from("footer_settings")
        .select("*")
        .eq("is_active", true)
        .single();

      if (data) setSettings(data);
    };

    fetchSettings();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Replace variables in copyright text
  const getCopyrightText = () => {
    if (!settings)
      return `© ${new Date().getFullYear()} ${brandIdentity?.logo_text || "Your Company"}`;

    return settings.copyright_text
      .replace("{year}", new Date().getFullYear().toString())
      .replace(
        "{company}",
        settings.company_name || brandIdentity?.logo_text || "Your Company"
      );
  };

  const activeLinks = settings?.links?.filter((link) => link.is_active) || [];

  return (
    <footer className="bg-primary/5 border-t border-border py-8 relative">
      <div className="container mx-auto px-6">
        <div
          className={`flex flex-col ${settings?.layout === "center" ? "items-center text-center" : "items-start"} gap-6`}
        >
          {/* Social Links */}
          {settings?.show_social_links && brandIdentity && (
            <div className="flex gap-4">
              {brandIdentity.github_url && (
                <a
                  href={brandIdentity.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {brandIdentity.linkedin_url && (
                <a
                  href={brandIdentity.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {brandIdentity.twitter_url && (
                <a
                  href={brandIdentity.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {brandIdentity.email && (
                <a
                  href={`mailto:${brandIdentity.email}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </div>
          )}

          {/* Custom Links */}
          {activeLinks.length > 0 && (
            <nav className="flex flex-wrap gap-4 justify-center">
              {activeLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {/* Copyright & Tagline */}
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">
              {getCopyrightText()}
            </p>
            {settings?.show_tagline && settings.tagline && (
              <p className="text-muted-foreground text-sm">
                {settings.tagline}
              </p>
            )}
          </div>
        </div>

        {/* Back to Top Button */}
        {settings?.show_back_to_top && (
          <button
            onClick={scrollToTop}
            className="absolute right-6 bottom-6 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>
    </footer>
  );
}
