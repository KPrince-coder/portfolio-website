/**
 * FooterCopyright Component
 *
 * Displays copyright text and optional tagline with subtle animations
 */

interface FooterCopyrightProps {
  copyrightText: string;
  tagline?: string;
  showTagline: boolean;
}

export function FooterCopyright({
  copyrightText,
  tagline,
  showTagline,
}: FooterCopyrightProps) {
  return (
    <div className="space-y-2">
      <p className="text-muted-foreground text-sm transition-colors duration-300 hover:text-foreground/80">
        {copyrightText}
      </p>
      {showTagline && tagline && (
        <p className="text-muted-foreground text-sm transition-colors duration-300 hover:text-foreground/80">
          {tagline}
        </p>
      )}
    </div>
  );
}
