import React from "react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * ProjectsListSection Component
 * Manages the list of projects with CRUD operations
 * TODO: Implement full functionality in Phase 4
 */
const ProjectsListSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Projects</h2>
        <p className="text-muted-foreground mt-2">
          Manage your project portfolio
        </p>
      </div>

      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">
            Projects list functionality will be implemented in Phase 4
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectsListSection;
