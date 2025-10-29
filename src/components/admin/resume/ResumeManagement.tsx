import React from "react";
import {
  ResumeHeaderSection,
  WorkExperiencesSection,
  EducationSection,
  CertificationsSection,
} from "./sections";
import type { ResumeManagementProps } from "./types";

/**
 * ResumeManagement Component
 * Main component for managing resume data including work experiences, education, and certifications
 */
const ResumeManagement: React.FC<ResumeManagementProps> = ({ activeTab }) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Resume Management</h1>
        <p className="text-muted-foreground">
          Manage your professional resume including work experiences, education,
          and certifications
        </p>
      </div>

      {activeTab === "resume-header" && <ResumeHeaderSection />}
      {activeTab === "resume-experiences" && <WorkExperiencesSection />}
      {activeTab === "resume-education" && <EducationSection />}
      {activeTab === "resume-certifications" && <CertificationsSection />}
    </div>
  );
};

export default ResumeManagement;
