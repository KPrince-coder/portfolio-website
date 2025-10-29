import React from "react";
import {
  ResumeHeaderSection,
  WorkExperiencesSection,
  EducationSection,
  CertificationsSection,
} from "./sections";

/**
 * ResumeManagement Component
 * Main component for managing resume data including work experiences, education, and certifications
 */
const ResumeManagement: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Resume Management</h1>
        <p className="text-muted-foreground">
          Manage your professional resume including work experiences, education,
          and certifications
        </p>
      </div>

      <ResumeHeaderSection />
      <WorkExperiencesSection />
      <EducationSection />
      <CertificationsSection />
    </div>
  );
};

export default ResumeManagement;
