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
  status: 'unread' | 'read' | 'replied' | 'archived' | 'spam';
  created_at: string;
  updated_at?: string;
  reply_content?: string;
  reply_sent_at?: string;
  is_replied: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  tags?: string[];
  archived: boolean;
  admin_notes?: string;
  ip_address?: string;
  user_agent?: string;
}

export interface MessageNotification {
  id: string;
  message_id: string;
  notification_type: 'new_message' | 'reply_sent' | 'admin_notification';
  recipient_email: string;
  subject: string;
  content: string;
  status: 'pending' | 'sent' | 'failed' | 'bounced';
  sent_at?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  text_content?: string;
  template_type: 'new_message_notification' | 'reply_to_sender' | 'auto_reply';
  variables: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MessageAnalytics {
  id: string;
  message_id: string;
  opened_at?: string;
  replied_at?: string;
  response_time_hours?: number;
  admin_user_id?: string;
  created_at: string;
}

export interface BrandSettings {
  id: string;
  setting_key: string;
  setting_value: Record<string, any>;
  description?: string;
  created_at: string;
  updated_at: string;
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
  onBulkAction: (messageIds: string[], action: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReplyToMessage: (messageId: string) => void;
  onUpdateStatus: (messageId: string, status: ContactMessage['status']) => void;
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
  onUpdateSetting: (key: string, value: any) => Promise<void>;
  loading?: boolean;
}
