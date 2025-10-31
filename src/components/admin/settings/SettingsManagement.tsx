import React from "react";
import { SecuritySection } from "./sections/SecuritySection";
import { User } from "@supabase/supabase-js";

interface SettingsManagementProps {
  user: User;
}

/**
 * SettingsManagement - Security settings management for admin panel
 *
 * Features:
 * - Security settings (email, password)
 * - Account information
 * - Password verification for sensitive changes
 */
export const SettingsManagement: React.FC<SettingsManagementProps> = ({
  user,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account security and information
        </p>
      </div>

      <SecuritySection user={user} />
    </div>
  );
};

export default SettingsManagement;
