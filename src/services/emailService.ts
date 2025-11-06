/**
 * Email Service
 *
 * Handles email sending through Supabase Edge Functions
 * Integrates with send-message-notification and send-reply functions
 *
 * @module services/emailService
 */

import { supabase } from "@/integrations/supabase/client";
import type {
  SendNotificationParams,
  SendReplyParams,
  EmailResponse,
  EmailLog,
  EmailStatistics,
} from "@/components/admin/messages/types";

// ============================================================================
// EMAIL SERVICE
// ============================================================================

export class EmailService {
  /**
   * Send notification email to admin when new message is received
   */
  static async sendNotification(
    params: SendNotificationParams
  ): Promise<EmailResponse> {
    try {
      const { data, error } = await supabase.functions.invoke(
        "send-message-notification",
        {
          body: {
            message_id: params.messageId,
            admin_email: params.adminEmail,
          },
        }
      );

      if (error) {
        console.error("Notification function error:", error);
        throw new Error(error.message || "Failed to send notification");
      }

      return data as EmailResponse;
    } catch (error) {
      console.error("Send notification error:", error);
      throw error;
    }
  }

  /**
   * Send reply email to message sender
   */
  static async sendReply(params: SendReplyParams): Promise<EmailResponse> {
    try {
      const { data, error } = await supabase.functions.invoke("send-reply", {
        body: {
          message_id: params.messageId,
          reply_content: params.replyContent,
          admin_name: params.adminName,
        },
      });

      if (error) {
        console.error("Reply function error:", error);
        throw new Error(error.message || "Failed to send reply");
      }

      return data as EmailResponse;
    } catch (error) {
      console.error("Send reply error:", error);
      throw error;
    }
  }

  /**
   * Get email logs for a message
   *
   * Note: Requires email_logs table to be created via migration
   */
  static async getEmailLogs(messageId: string): Promise<EmailLog[]> {
    try {
      // TODO: Uncomment after migration is applied
      // const { data, error } = await supabase
      //   .from("email_logs")
      //   .select("*")
      //   .eq("message_id", messageId)
      //   .order("created_at", { ascending: false });

      // if (error) throw error;
      // return data || [];

      // Temporary: Return empty array until table exists
      console.warn("email_logs table not yet created. Run migration first.");
      return [];
    } catch (error) {
      console.error("Get email logs error:", error);
      throw error;
    }
  }

  /**
   * Get email statistics
   *
   * Note: Requires get_email_statistics RPC function via migration
   */
  static async getEmailStatistics(days = 30): Promise<EmailStatistics | null> {
    try {
      // TODO: Uncomment after migration is applied
      // const { data, error } = await supabase.rpc("get_email_statistics", {
      //   p_days: days,
      // });

      // if (error) throw error;
      // return data;

      // Temporary: Return null until function exists
      console.warn(
        "get_email_statistics function not yet created. Run migration first."
      );
      return null;
    } catch (error) {
      console.error("Get email statistics error:", error);
      throw error;
    }
  }

  /**
   * Get email analytics by type
   *
   * Note: Requires email_analytics view to be created via migration
   */
  static async getEmailAnalytics(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from("email_analytics")
        .select("*");

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Get email analytics error:", error);
      throw error;
    }
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Send notification email to admin
 */
export async function sendNotificationEmail(
  messageId: string,
  adminEmail?: string
): Promise<EmailResponse> {
  return EmailService.sendNotification({ messageId, adminEmail });
}

/**
 * Send reply email to sender
 */
export async function sendReplyEmail(
  messageId: string,
  replyContent: string,
  adminName?: string
): Promise<EmailResponse> {
  return EmailService.sendReply({ messageId, replyContent, adminName });
}

/**
 * Get email logs for a message
 */
export async function getMessageEmailLogs(
  messageId: string
): Promise<EmailLog[]> {
  return EmailService.getEmailLogs(messageId);
}

/**
 * Get email statistics
 */
export async function getEmailStatistics(
  days = 30
): Promise<EmailStatistics | null> {
  return EmailService.getEmailStatistics(days);
}

/**
 * Get email analytics
 */
export async function getEmailAnalytics(): Promise<any[]> {
  return EmailService.getEmailAnalytics();
}
