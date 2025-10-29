/**
 * Utility functions for Skills component
 */

/**
 * Splits a title string into main title and highlight
 * Intelligently finds the last word to use as highlight
 *
 * @param fullTitle - The complete title string
 * @returns Object with title and titleHighlight
 *
 * @example
 * splitTitle("Technical Expertise")
 * // Returns: { title: "Technical", titleHighlight: "Expertise" }
 *
 * splitTitle("My Amazing Skills")
 * // Returns: { title: "My Amazing", titleHighlight: "Skills" }
 *
 * splitTitle("Skills")
 * // Returns: { title: "Skills", titleHighlight: undefined }
 */
export const splitTitle = (
  fullTitle: string
): { title: string; titleHighlight?: string } => {
  if (!fullTitle || typeof fullTitle !== "string") {
    return { title: "Technical", titleHighlight: "Expertise" };
  }

  const trimmedTitle = fullTitle.trim();

  // If title is a single word, return it as is
  const words = trimmedTitle.split(/\s+/);
  if (words.length === 1) {
    return { title: trimmedTitle, titleHighlight: undefined };
  }

  // Split into main title (all but last word) and highlight (last word)
  const titleHighlight = words[words.length - 1];
  const title = words.slice(0, -1).join(" ");

  return { title, titleHighlight };
};
