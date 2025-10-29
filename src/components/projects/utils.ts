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
