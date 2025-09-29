export interface User {
  id: string;
  email?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  status: string;
  featured: boolean;
  published: boolean;
  created_at: string;
}

export interface AdminTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface AdminAuthProps {
  email: string;
  password: string;
  isSigningIn: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSignIn: () => void;
}

export interface AdminHeaderProps {
  user: User;
  onSignOut: () => void;
}

export interface AdminSidebarProps {
  activeTab: string;
  unreadMessages: number;
  onTabChange: (tabId: string) => void;
}

export interface AdminDashboardProps {
  contactMessages: ContactMessage[];
  projects: Project[];
  unreadMessages: number;
}

export interface ContactMessagesProps {
  contactMessages: ContactMessage[];
  onMarkAsRead: (messageId: string) => void;
}

export interface ProjectsManagementProps {
  projects: Project[];
}
