/**
 * FooterCopyright Component
 *
 * Displays copyright text and optional tagline
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
      <p className="text-muted-foreground text-sm">{copyrightText}</p>
      {showTagline && tagline && (
        <p className="text-muted-foreground text-sm">{tagline}</p>
      )}
    </div>
  );
}
