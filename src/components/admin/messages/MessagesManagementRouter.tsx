/**
 * MessagesManagementRouter Component
 *
 * Routes between different message management views based on activeSubTab
 *
 * @module messages/MessagesManagementRouter
 */

import { MessagesManagement } from "./MessagesManagement";

// ============================================================================
// TYPES
// ============================================================================

interface MessagesManagementRouterProps {
  activeSubTab: string;
  onTabChange?: (tab: string) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function MessagesManagementRouter({
  activeSubTab,
  onTabChange,
}: MessagesManagementRouterProps) {
  // Map admin tab names to internal tab names
  const getInternalTab = (adminTab: string): string => {
    if (adminTab === "messages") return "messages";
    if (adminTab === "messages-stats") return "stats";
    if (adminTab === "messages-templates") return "templates";
    if (adminTab === "messages-contact") return "contact";
    return "messages";
  };

  // Map internal tab names back to admin tab names
  const handleTabChange = (internalTab: string) => {
    if (!onTabChange) return;

    const adminTabMap: Record<string, string> = {
      messages: "messages",
      stats: "messages-stats",
      templates: "messages-templates",
      contact: "messages-contact",
    };

    onTabChange(adminTabMap[internalTab] || "messages");
  };

  const currentTab = getInternalTab(activeSubTab);

  return (
    <MessagesManagement activeTab={currentTab} onTabChange={handleTabChange} />
  );
}

export default MessagesManagementRouter;
