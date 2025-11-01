/**
 * Author Card Component
 *
 * Displays blog post author information with:
 * - Author avatar
 * - Name and bio
 * - Social links
 * - Link to author's posts
 *
 * @module blog/AuthorCard
 */

import React from "react";
import { Link } from "react-router-dom";
import { User, Mail, Globe, Twitter, Linkedin, Github } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ============================================================================
// TYPES
// ============================================================================

interface AuthorCardProps {
  author: {
    id: string;
    full_name?: string | null;
    avatar_url?: string | null;
    bio?: string | null;
    email?: string | null;
    website?: string | null;
    twitter?: string | null;
    linkedin?: string | null;
    github?: string | null;
  };
  postCount?: number;
  variant?: "default" | "compact";
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const AuthorCard = React.memo<AuthorCardProps>(function AuthorCard({
  author,
  postCount,
  variant = "default",
  className = "",
}) {
  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const authorName = author.full_name || "Anonymous";
  const authorInitials = authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const hasSocialLinks = Boolean(
    author.website || author.twitter || author.linkedin || author.github
  );

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderSocialLinks = () => {
    if (!hasSocialLinks) return null;

    const links = [];

    if (author.website) {
      links.push(
        <Button
          key="website"
          variant="ghost"
          size="sm"
          asChild
          className="h-8 w-8 p-0"
        >
          <a
            href={author.website}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Website"
          >
            <Globe className="h-4 w-4" />
          </a>
        </Button>
      );
    }

    if (author.twitter) {
      links.push(
        <Button
          key="twitter"
          variant="ghost"
          size="sm"
          asChild
          className="h-8 w-8 p-0"
        >
          <a
            href={`https://twitter.com/${author.twitter}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <Twitter className="h-4 w-4" />
          </a>
        </Button>
      );
    }

    if (author.linkedin) {
      links.push(
        <Button
          key="linkedin"
          variant="ghost"
          size="sm"
          asChild
          className="h-8 w-8 p-0"
        >
          <a
            href={`https://linkedin.com/in/${author.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </Button>
      );
    }

    if (author.github) {
      links.push(
        <Button
          key="github"
          variant="ghost"
          size="sm"
          asChild
          className="h-8 w-8 p-0"
        >
          <a
            href={`https://github.com/${author.github}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
        </Button>
      );
    }

    if (author.email) {
      links.push(
        <Button
          key="email"
          variant="ghost"
          size="sm"
          asChild
          className="h-8 w-8 p-0"
        >
          <a href={`mailto:${author.email}`} aria-label="Email">
            <Mail className="h-4 w-4" />
          </a>
        </Button>
      );
    }

    return <div className="flex items-center gap-1">{links}</div>;
  };

  // ============================================================================
  // RENDER COMPACT VARIANT
  // ============================================================================

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Avatar className="h-10 w-10">
          <AvatarImage src={author.avatar_url || undefined} alt={authorName} />
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{authorName}</p>
          {postCount !== undefined && (
            <p className="text-xs text-muted-foreground">
              {postCount} {postCount === 1 ? "post" : "posts"}
            </p>
          )}
        </div>
        {hasSocialLinks && (
          <div className="flex items-center gap-1">{renderSocialLinks()}</div>
        )}
      </div>
    );
  }

  // ============================================================================
  // RENDER DEFAULT VARIANT
  // ============================================================================

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={author.avatar_url || undefined}
              alt={authorName}
            />
            <AvatarFallback className="text-lg">
              {authorInitials}
            </AvatarFallback>
          </Avatar>

          {/* Author Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-1">{authorName}</h3>

            {author.bio && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {author.bio}
              </p>
            )}

            {/* Social Links */}
            {hasSocialLinks && (
              <div className="flex items-center gap-1 mb-3">
                {renderSocialLinks()}
              </div>
            )}

            {/* View Posts Link */}
            {postCount !== undefined && postCount > 0 && (
              <Button variant="outline" size="sm" asChild>
                <Link to={`/blog?author=${author.id}`}>
                  View all {postCount} {postCount === 1 ? "post" : "posts"}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

AuthorCard.displayName = "AuthorCard";
