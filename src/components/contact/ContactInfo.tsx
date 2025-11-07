/**
 * ContactInfo Component
 *
 * Displays contact information and social links
 */

import React from "react";
import { Mail, MessageSquare, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SOCIAL_LINKS, CONTACT_INFO } from "./constants";

// ============================================================================
// COMPONENT
// ============================================================================

export function ContactInfo() {
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
                <p className="text-sm text-muted-foreground">
                  {CONTACT_INFO.email}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MessageSquare className="w-5 h-5 text-accent flex-shrink-0" />
              <div>
                <p className="font-medium">Response Time</p>
                <p className="text-sm text-muted-foreground">
                  {CONTACT_INFO.responseTime}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h4 className="font-medium mb-3">Connect on Social</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SOCIAL_LINKS.map((social) => (
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
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0" />
              <span>Detailed discussion about your project requirements</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
              <span>Technical feasibility assessment and recommendations</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-success rounded-full mt-2 flex-shrink-0" />
              <span>Transparent timeline and cost estimates</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-warning rounded-full mt-2 flex-shrink-0" />
              <span>Ongoing support and collaboration approach</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
