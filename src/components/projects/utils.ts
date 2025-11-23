/**
 * Splits a title string into main title and highlighted portion
 * Looks for text after the last space to use as highlight
 *
 * @param fullTitle - The complete title string
 * @returns Object with title and titleHighlight
 *
 * @example
 * splitTitle("Featured Projects") // { title: "Featured", titleHighlight: "Projects" }
 * splitTitle("My Work") // { title: "My", titleHighlight: "Work" }
 * splitTitle("Projects") // { title: "Projects", titleHighlight: "" }
 */
export const splitTitle = (
  fullTitle: string
): { title: string; titleHighlight: string } => {
  const lastSpaceIndex = fullTitle.lastIndexOf(" ");

  if (lastSpaceIndex === -1) {
    // No space found, return full title with no highlight
    return { title: fullTitle, titleHighlight: "" };
  }

  return {
    title: fullTitle.substring(0, lastSpaceIndex),
    titleHighlight: fullTitle.substring(lastSpaceIndex + 1),
  };
};

/**
 * Groups projects by category
 *
 * @param projects - Array of projects with category information
 * @returns Object with category labels as keys and arrays of projects as values
 */
export const groupProjectsByCategory = <T extends { category_label: string }>(
  projects: T[]
): Record<string, T[]> => {
  return projects.reduce((acc, project) => {
    const category = project.category_label;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(project);
    return acc;
  }, {} as Record<string, T[]>);
};

/**
 * Filters projects by status
 *
 * @param projects - Array of projects
 * @param status - Status to filter by
 * @returns Filtered array of projects
 */
export const filterProjectsByStatus = <T extends { status: string }>(
  projects: T[],
  status: string
): T[] => {
  if (status === "all") return projects;
  return projects.filter((project) => project.status === status);
};

/**
 * Filters projects by featured status
 *
 * @param projects - Array of projects
 * @param featured - Whether to show only featured projects
 * @returns Filtered array of projects
 */
export const filterFeaturedProjects = <T extends { is_featured: boolean }>(
  projects: T[],
  featured: boolean = true
): T[] => {
  return projects.filter((project) => project.is_featured === featured);
};

/**
 * Formats a date string to a readable format
 *
 * @param dateString - ISO date string or date object
 * @returns Formatted date string (e.g., "January 2024")
 */
export const formatDate = (dateString: string | Date): string => {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
};

/**
 * Calculates project duration in months
 *
 * @param startDate - Project start date
 * @param endDate - Project end date (optional, uses current date if not provided)
 * @returns Duration string (e.g., "3 months", "1 year 2 months")
 */
export const calculateProjectDuration = (
  startDate: string | Date,
  endDate?: string | Date | null
): string => {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = endDate
    ? typeof endDate === "string"
      ? new Date(endDate)
      : endDate
    : new Date();

  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  if (months < 1) return "Less than a month";
  if (months === 1) return "1 month";
  if (months < 12) return `${months} months`;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths === 0) {
    return years === 1 ? "1 year" : `${years} years`;
  }

  return `${years} ${years === 1 ? "year" : "years"} ${remainingMonths} ${
    remainingMonths === 1 ? "month" : "months"
  }`;
};
