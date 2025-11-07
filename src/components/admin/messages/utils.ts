/**
 * Messages Module Utilities
 *
 * Helper functions for the messages module
 *
 * @module messages/utils
 */

// ============================================================================
// TITLE UTILITIES
// ============================================================================

/**
 * Splits a title string into main title and highlight
 * Intelligently finds the last word to use as highlight
 *
 * @param fullTitle - The complete title string
 * @returns Object with title and titleHighlight
 *
 * @example
 * splitTitle("Contact Messages")
 * // Returns: { title: "Contact", titleHighlight: "Messages" }
 *
 * splitTitle("Inbox Messages")
 * // Returns: { title: "Inbox", titleHighlight: "Messages" }
 *
 * splitTitle("Messages")
 * // Returns: { title: "Messages", titleHighlight: undefined }
 */
export function splitTitle(fullTitle: string): {
  title: string;
  titleHighlight?: string;
} {
  if (!fullTitle || typeof fullTitle !== "string") {
    return { title: "Contact", titleHighlight: "Messages" };
  }

  const trimmedTitle = fullTitle.trim();
  const words = trimmedTitle.split(/\s+/);

  if (words.length === 1) {
    return { title: trimmedTitle, titleHighlight: undefined };
  }

  // Split into main title (all but last word) and highlight (last word)
  const titleHighlight = words[words.length - 1];
  const title = words.slice(0, -1).join(" ");

  return { title, titleHighlight };
}
