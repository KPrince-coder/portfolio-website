import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types'; // Import Database
import { ContactMessage, MessageNotification, EmailTemplate, MessageAnalytics } from '@/components/admin/types';

export class MessageService {
  // Get all messages with optional filtering
  static async getMessages(filters?: {
    status?: string;
    priority?: string;
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ data: ContactMessage[]; count: number }> {
    let query = supabase
      .from('contact_messages')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.priority && filters.priority !== 'all') {
      query = query.eq('priority', filters.priority);
    }

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,subject.ilike.%${filters.search}%,message.ilike.%${filters.search}%`);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }

    return { data: data || [], count: count || 0 };
  }

  // Get a single message by ID
  static async getMessage(id: string): Promise<ContactMessage> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch message: ${error.message}`);
    }

    return data;
  }

  // Update message status
  static async updateMessageStatus(id: string, status: ContactMessage['status']): Promise<void> {
    const updates: Partial<ContactMessage> = {
      status,
      updated_at: new Date().toISOString(),
    };

    // Set 'archived' status based on the new status
    if (status === 'archived' || status === 'spam') {
      updates.archived = true;
    } else {
      updates.archived = false;
    }

    const { error } = await supabase
      .from('contact_messages')
      .update(updates)
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to update message status: ${error.message}`);
    }
  }

  // Update message priority
  static async updateMessagePriority(id: string, priority: ContactMessage['priority']): Promise<void> {
    const { error } = await supabase
      .from('contact_messages')
      .update({ 
        priority, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to update message priority: ${error.message}`);
    }
  }

  // Mark message as read
  static async markAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from('contact_messages')
      .update({ 
        status: 'read', 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to mark message as read: ${error.message}`);
    }

    // Log analytics
    await this.logMessageAnalytics(id, { opened_at: new Date().toISOString() });
  }

  // Bulk update messages
  static async bulkUpdateMessages(ids: string[], updates: Partial<ContactMessage>): Promise<void> {
    const { error } = await supabase
      .from('contact_messages')
      .update({ 
        ...updates, 
        updated_at: new Date().toISOString() 
      })
      .in('id', ids);

    if (error) {
      throw new Error(`Failed to bulk update messages: ${error.message}`);
    }
  }

  // Delete message
  static async deleteMessage(id: string): Promise<void> {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete message: ${error.message}`);
    }
  }

  // Save reply draft
  static async saveReplyDraft(id: string, replyContent: string): Promise<void> {
    const { error } = await supabase
      .from('contact_messages')
      .update({ 
        reply_content: replyContent,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to save reply draft: ${error.message}`);
    }
  }

  // Send reply via Edge Function
  static async sendReply(messageId: string, replyContent: string, adminName?: string): Promise<void> {
    const { data, error } = await supabase.functions.invoke('send-reply', {
      body: {
        message_id: messageId,
        reply_content: replyContent,
        admin_name: adminName,
      },
    });

    if (error) {
      throw new Error(`Failed to send reply: ${error.message}`);
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to send reply');
    }
  }

  // Send new message notification
  static async sendNewMessageNotification(messageId: string, adminEmail?: string): Promise<void> {
    const { data, error } = await supabase.functions.invoke('send-message-notification', {
      body: {
        message_id: messageId,
        admin_email: adminEmail,
      },
    });

    if (error) {
      throw new Error(`Failed to send notification: ${error.message}`);
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to send notification');
    }
  }

  // Get message statistics
  static async getMessageStats(): Promise<{
    totalMessages: number;
    unreadMessages: number;
    repliedMessages: number;
    averageResponseTime: number;
    messagesThisWeek: number;
    messagesThisMonth: number;
  }> {
    // Get total counts
    const { count: totalMessages } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true });

    const { count: unreadMessages } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'unread');

    const { count: repliedMessages } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_replied', true);

    // Get messages from this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const { count: messagesThisWeek } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneWeekAgo.toISOString());

    // Get messages from this month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const { count: messagesThisMonth } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneMonthAgo.toISOString());

    // Calculate average response time
    const { data: analytics } = await supabase
      .from('message_analytics')
      .select('response_time_hours')
      .not('response_time_hours', 'is', null);

    const averageResponseTime = analytics && analytics.length > 0
      ? analytics.reduce((sum, item) => sum + (item.response_time_hours || 0), 0) / analytics.length
      : 0;

    return {
      totalMessages: totalMessages || 0,
      unreadMessages: unreadMessages || 0,
      repliedMessages: repliedMessages || 0,
      averageResponseTime,
      messagesThisWeek: messagesThisWeek || 0,
      messagesThisMonth: messagesThisMonth || 0,
    };
  }

  // Log message analytics
  static async logMessageAnalytics(messageId: string, data: Partial<MessageAnalytics>): Promise<void> {
    const { error } = await supabase
      .from('message_analytics')
      .upsert({
        message_id: messageId,
        ...data,
      });

    if (error) {
      console.error('Failed to log message analytics:', error);
    }
  }

  // Get email templates
  static async getEmailTemplates(): Promise<EmailTemplate[]> {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch email templates: ${error.message}`);
    }

    return data || [];
  }

  // Save email template
  static async saveEmailTemplate(template: Partial<EmailTemplate>): Promise<EmailTemplate> {
    const now = new Date().toISOString();

    if (!template.id) {
      // This is an insert operation, so required fields must be present.
      if (!template.html_content || !template.name || !template.subject || !template.template_type) {
        throw new Error('Missing required fields for new email template: html_content, name, subject, template_type.');
      }
      // Cast to Insert type to satisfy TypeScript, as we've checked for required fields.
      const insertData: Database['public']['Tables']['email_templates']['Insert'] = {
        ...template,
        html_content: template.html_content,
        name: template.name,
        subject: template.subject,
        template_type: template.template_type,
        updated_at: now,
      };
      const { data, error } = await supabase
        .from('email_templates')
        .insert(insertData) // Use insert directly
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to save email template: ${error.message}`);
      }
      return data;

    } else {
      // This is an update operation.
      const updateData: Database['public']['Tables']['email_templates']['Update'] = {
        ...template,
        updated_at: now,
      };
      const { data, error } = await supabase
        .from('email_templates')
        .update(updateData) // Use update directly
        .eq('id', template.id) // Specify the record to update
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to save email template: ${error.message}`);
      }
      return data;
    }
  }
}
