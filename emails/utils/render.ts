/**
 * Email Rendering Utilities
 *
 * Functions to render React Email components to HTML and text
 */

import { render } from "@react-email/render";
import * as React from "react";

/**
 * Render a React Email component to HTML
 */
export async function renderToHtml(
  component: React.ReactElement
): Promise<string> {
  return render(component, {
    pretty: false,
  });
}

/**
 * Render a React Email component to plain text
 */
export async function renderToText(
  component: React.ReactElement
): Promise<string> {
  return render(component, {
    plainText: true,
  });
}

/**
 * Render a React Email component to both HTML and text
 */
export async function renderEmail(component: React.ReactElement): Promise<{
  html: string;
  text: string;
}> {
  const [html, text] = await Promise.all([
    renderToHtml(component),
    renderToText(component),
  ]);

  return { html, text };
}
