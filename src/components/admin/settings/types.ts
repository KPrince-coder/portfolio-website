export interface SecuritySettings {
  email: string;
  currentPassword: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  messageAlerts: boolean;
  projectUpdates: boolean;
  weeklyDigest: boolean;
}

export interface PreferencesSettings {
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
  dateFormat: string;
}

export interface SessionInfo {
  lastLogin: string;
  ipAddress: string;
  device: string;
  location: string;
}
