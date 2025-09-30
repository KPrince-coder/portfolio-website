import React from 'react';
import { Database, Json } from '@/integrations/supabase/types';

// Helper types for Supabase table rows
type ProjectRow = Database['public']['Tables']['projects']['Row'];

export interface User {
  id: string;
  email?: string;
}

// Aligning interfaces with Supabase Row types
export interface ContactMessage {
  admin_notes: string | null;
  archived: boolean | null;
  category: string | null;
  created_at: string;
  email: string;
  id: string;
  ip_address: string | null;
  is_replied: boolean | null;
  message: string;
  name: string;
  priority: string | null;
  reply_content: string | null;
  reply_sent_at: string | null;
  status: string | null;
  subject: string;
  tags: string[] | null;
  updated_at: string;
  user_agent: string | null;
}

export interface MessageNotification {
  content: string;
  created_at: string;
  error_message: string | null;
  id: string;
  message_id: string;
  notification_type: string;
  recipient_email: string;
  sent_at: string | null;
  status: string;
  subject: string;
  updated_at: string;
}

export interface EmailTemplate {
  created_at: string;
  html_content: string;
  id: string;
  is_active: boolean | null;
  name: string;
  subject: string;
  template_type: string;
  text_content: string | null;
  updated_at: string;
  variables: Json | null;
}

export interface MessageAnalytics {
  admin_user_id: string | null;
  created_at: string;
  id: string;
  message_id: string;
  opened_at: string | null;
  replied_at: string | null;
  response_time_hours: number | null;
}

export interface BrandSettings {
  created_at: string;
  description: string | null;
  id: string;
  setting_key: string;
  setting_value: Json;
  updated_at: string;
}

export interface Project extends ProjectRow {
  completion_date?: string | null; // Added for project duration
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
  onBulkAction: (messageIds: string[], action: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReplyToMessage: (messageId: string) => void;
  onUpdateStatus: (messageId: string, updates: Partial<ContactMessage>) => void;
  onUpdatePriority: (messageId: string, priority: ContactMessage['priority']) => void;
  loading?: boolean;
}

export interface MessageFilters {
  status?: ContactMessage['status'] | 'all';
  priority?: ContactMessage['priority'] | 'all';
  category?: string | 'all';
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

export interface MessageReplyProps {
  message: ContactMessage;
  onSendReply: (replyContent: string) => Promise<void>;
  onSaveDraft: (replyContent: string) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export interface MessageStatsProps {
  totalMessages: number;
  unreadMessages: number;
  repliedMessages: number;
  averageResponseTime: number;
  messagesThisWeek: number;
  messagesThisMonth: number;
}

export interface ProjectsManagementProps {
  projects: Project[];
}

// Email template related interfaces
export interface EmailTemplateFormProps {
  template?: EmailTemplate;
  onSave: (template: Partial<EmailTemplate>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export interface BrandSettingsProps {
  settings: BrandSettings[];
  onUpdateSetting: (key: string, value: Json) => Promise<void>;
  loading?: boolean;
}
