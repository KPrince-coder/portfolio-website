import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ResumeManagement from "./ResumeManagement";

/**
 * ResumeManagementRouter Component
 * Handles routing for resume management pages
 */
const ResumeManagementRouter: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ResumeManagement />} />
      <Route path="*" element={<Navigate to="/admin/resume" replace />} />
    </Routes>
  );
};

export default ResumeManagementRouter;
