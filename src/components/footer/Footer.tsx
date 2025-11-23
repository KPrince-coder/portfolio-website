/**
 * Footer Component
 *
 * Dynamic footer with CMS-managed content
 * Follows modular architecture with separate components for each section
 */

import { useState, useEffect } from "react";
import { useFooterSettings } from "./hooks/useFooterSettings";
import { useSocialLinks } from "./hooks/useSocialLinks";
import { useBrandIdentity } from "@/hooks/useBrandIdentity";
import { FooterSocialLinks } from "./FooterSocialLinks";
import { FooterLinks } from "./FooterLinks";
import { FooterCopyright } from "./FooterCopyright";
import { BackToTopButton } from "./BackToTopButton";
import { formatCopyrightText, getActiveLinks } from "./utils";

export function Footer() {
  const { settings, loading: settingsLoading } = useFooterSettings();
  const { socialLinks, loading: socialLoading } = useSocialLinks();
  const { brandIdentity } = useBrandIdentity();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show minimal footer while loading
  if (settingsLoading || socialLoading) {
    return (
      <footer className="bg-primary/5 border-t border-border py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center gap-6">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()}{" "}
              {brandIdentity?.logo_text || "Your Company"}
            </p>
          </div>
        </div>
      </footer>
    );
  }

  // Get formatted copyright text
  const copyrightText = settings
    ? formatCopyrightText(
        settings.copyright_text,
        settings.company_name,
        brandIdentity?.logo_text
      )
    : `© ${new Date().getFullYear()} ${brandIdentity?.logo_text || "Your Company"}`;

  // Get active links
  const activeLinks = getActiveLinks(settings);

  // Determine layout alignment
  const layoutClass =
    settings?.layout === "center"
      ? "items-center text-center"
      : settings?.layout === "right"
        ? "items-end text-right"
        : "items-start";

  return (
    <footer className="bg-primary/5 border-t border-border py-8 relative overflow-hidden">
      {/* Subtle background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-50" />

      <div className="container mx-auto px-6 relative z-10">
        <div
          className={`flex flex-col ${layoutClass} gap-6 transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Social Links */}
          {settings?.show_social_links && socialLinks && (
            <FooterSocialLinks socialLinks={socialLinks} />
          )}

          {/* Custom Links */}
          {activeLinks.length > 0 && <FooterLinks links={activeLinks} />}

          {/* Copyright & Tagline */}
          <FooterCopyright
            copyrightText={copyrightText}
            tagline={settings?.tagline}
            showTagline={settings?.show_tagline || false}
          />
        </div>

        {/* Back to Top Button */}
        {settings?.show_back_to_top && <BackToTopButton />}
      </div>
    </footer>
  );
}
