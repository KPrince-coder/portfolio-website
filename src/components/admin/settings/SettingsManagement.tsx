import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Settings2, Bell } from "lucide-react";
import { SecuritySection } from "./sections/SecuritySection";
import { PreferencesSection } from "./sections/PreferencesSection";
import { User } from "@supabase/supabase-js";

interface SettingsManagementProps {
  user: User;
}

/**
 * SettingsManagement - Comprehensive settings management for admin panel
 *
 * Features:
 * - Security settings (email, password)
 * - Preferences (theme, language, timezone)
 * - Notification settings
 * - Responsive tabbed interface
 * - Password verification for sensitive changes
 */
export const SettingsManagement: React.FC<SettingsManagementProps> = ({
  user,
}) => {
  const [activeTab, setActiveTab] = useState("security");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
          <TabsTrigger value="security" className="space-x-2">
            <Shield className="w-4 h-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="space-x-2">
            <Settings2 className="w-4 h-4" />
            <span>Preferences</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="space-y-6">
          <SecuritySection user={user} />
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <PreferencesSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsManagement;
