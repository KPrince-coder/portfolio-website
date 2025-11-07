/**
 * ContactInfo Component
 *
 * Displays contact information and social links from backend
 */

import React from "react";
import {
  Mail,
  MessageSquare,
  CheckCircle,
  Linkedin,
  Github,
  Twitter,
  Globe,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// ============================================================================
// TYPES
// ============================================================================

interface ContactInfoProps {
  email: string;
  responseTime: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  expectations: Array<{
    text: string;
    color: string;
  }>;
  loading?: boolean;
}

// ============================================================================
// COLOR MAP
// ============================================================================

const COLOR_MAP: Record<string, string> = {
  secondary: "bg-secondary",
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  primary: "bg-primary",
};

// ============================================================================
// COMPONENT
// ============================================================================

export function ContactInfo({
  email,
  responseTime,
  githubUrl,
  linkedinUrl,
  twitterUrl,
  websiteUrl,
  expectations,
  loading = false,
}: ContactInfoProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="card-neural neural-glow">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
        <Card className="card-neural neural-glow">
          <CardContent className="p-6">
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Build social links array from backend data
  const socialLinks = [
    linkedinUrl && {
      icon: Linkedin,
      label: "LinkedIn",
      href: linkedinUrl,
      color: "text-blue-500 hover:text-blue-400",
    },
    githubUrl && {
      icon: Github,
      label: "GitHub",
      href: githubUrl,
      color: "text-secondary hover:text-secondary-glow",
    },
    twitterUrl && {
      icon: Twitter,
      label: "Twitter",
      href: twitterUrl,
      color: "text-blue-400 hover:text-blue-300",
    },
    websiteUrl && {
      icon: Globe,
      label: "Website",
      href: websiteUrl,
      color: "text-accent hover:text-accent-glow",
    },
    {
      icon: Mail,
      label: "Email",
      href: `mailto:${email}`,
      color: "text-accent hover:text-accent-glow",
    },
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Direct Contact Card */}
      <Card className="card-neural neural-glow">
        <CardHeader>
          <CardTitle className="text-lg">Direct Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-secondary flex-shrink-0" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MessageSquare className="w-5 h-5 text-accent flex-shrink-0" />
              <div>
                <p className="font-medium">Response Time</p>
                <p className="text-sm text-muted-foreground">{responseTime}</p>
              </div>
            </div>
          </div>

          {socialLinks.length > 0 && (
            <div className="border-t border-border pt-4">
              <h4 className="font-medium mb-3">Connect on Social</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {socialLinks.map((social: any) => (
                  <Button
                    key={social.label}
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(social.href, "_blank")}
                    className="justify-start neural-glow w-full"
                  >
                    <social.icon
                      className={`w-4 h-4 mr-2 flex-shrink-0 ${social.color}`}
                    />
                    <span className="truncate">{social.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* What to Expect Card */}
      <Card className="card-neural neural-glow">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3 flex items-center">
            <CheckCircle className="w-5 h-5 text-success mr-2 flex-shrink-0" />
            What to Expect
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {expectations.map((expectation, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div
                  className={`w-1.5 h-1.5 ${
                    COLOR_MAP[expectation.color] || "bg-secondary"
                  } rounded-full mt-2 flex-shrink-0`}
                />
                <span>{expectation.text}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
