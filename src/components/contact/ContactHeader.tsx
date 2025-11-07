/**
 * ContactHeader Component
 *
 * Header section for the contact page
 */

import React from "react";

export function ContactHeader() {
  return (
    <div className="text-center mb-16">
      <h2 className="heading-xl mb-6">
        Let's <span className="text-neural">Connect</span>
      </h2>
      <div className="w-24 h-1 bg-gradient-secondary mx-auto mb-8" />
      <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
        Ready to discuss your next AI project? I'm always excited to collaborate
        on innovative solutions that push the boundaries of what's possible with
        data and artificial intelligence.
      </p>
    </div>
  );
}
