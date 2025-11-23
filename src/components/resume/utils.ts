/**
 * Resume Utility Functions
 * Helper functions for formatting and processing resume data
 */

/**
 * Format date period for display
 */
export const formatPeriod = (
  startDate?: string,
  endDate?: string,
  isCurrent?: boolean
): string => {
  if (!startDate && !endDate) return "";

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  if (isCurrent) {
    return `${formatDate(startDate!)} - Present`;
  }

  if (startDate && endDate) {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }

  if (startDate) {
    return formatDate(startDate);
  }

  if (endDate) {
    return formatDate(endDate);
  }

  return "";
};

/**
 * Format education period (year only)
 */
export const formatEducationPeriod = (
  startDate?: string,
  endDate?: string
): string => {
  if (!startDate && !endDate) return "";

  const getYear = (date: string) => new Date(date).getFullYear();

  if (startDate && endDate) {
    return `${getYear(startDate)} - ${getYear(endDate)}`;
  }

  if (endDate) {
    return getYear(endDate).toString();
  }

  if (startDate) {
    return getYear(startDate).toString();
  }

  return "";
};

/**
 * Check if certification is expired
 */
export const isCertificationExpired = (
  expiryDate?: string,
  doesNotExpire?: boolean
): boolean => {
  if (doesNotExpire || !expiryDate) return false;
  return new Date(expiryDate) < new Date();
};

/**
 * Format certification date
 */
export const formatCertificationDate = (date?: string): string => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

/**
 * Split title into main part and highlight
 * Highlights the last word by default
 */
export const splitTitle = (
  fullTitle: string
): { title: string; titleHighlight: string } => {
  const words = fullTitle.trim().split(" ");

  if (words.length === 1) {
    return { title: fullTitle, titleHighlight: "" };
  }

  const titleHighlight = words[words.length - 1];
  const title = words.slice(0, -1).join(" ");

  return { title, titleHighlight };
};
