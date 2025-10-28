-- Enhanced Contact Messages System Migration
-- This migration enhances the existing contact_messages table and adds supporting tables
-- First, let's enhance the existing contact_messages table
ALTER TABLE public.contact_messages
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    ADD COLUMN IF NOT EXISTS reply_content TEXT,
    ADD COLUMN IF NOT EXISTS reply_sent_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS is_replied BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general',
    ADD COLUMN IF NOT EXISTS tags TEXT [],
    ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS admin_notes TEXT,
    ADD COLUMN IF NOT EXISTS ip_address INET,
    ADD COLUMN IF NOT EXISTS user_agent TEXT;
-- Update the status column to include more statuses
ALTER TABLE public.contact_messages DROP CONSTRAINT IF EXISTS contact_messages_status_check;
ALTER TABLE public.contact_messages
ADD CONSTRAINT contact_messages_status_check CHECK (
        status IN ('unread', 'read', 'replied', 'archived', 'spam')
    );
-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();
RETURN NEW;
END;
$$ language 'plpgsql';
CREATE TRIGGER update_contact_messages_updated_at BEFORE
UPDATE ON public.contact_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Create message_notifications table for tracking email notifications
CREATE TABLE IF NOT EXISTS public.message_notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID NOT NULL REFERENCES public.contact_messages(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL CHECK (
        notification_type IN (
            'new_message',
            'reply_sent',
            'admin_notification'
        )
    ),
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (
        status IN ('pending', 'sent', 'failed', 'bounced')
    ),
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Create email_templates table for customizable email templates
CREATE TABLE IF NOT EXISTS public.email_templates (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    subject TEXT NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT,
    template_type TEXT NOT NULL CHECK (
        template_type IN (
            'new_message_notification',
            'reply_to_sender',
            'auto_reply'
        )
    ),
    variables JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Create message_analytics table for tracking response times and statistics
CREATE TABLE IF NOT EXISTS public.message_analytics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID NOT NULL REFERENCES public.contact_messages(id) ON DELETE CASCADE,
    opened_at TIMESTAMP WITH TIME ZONE,
    replied_at TIMESTAMP WITH TIME ZONE,
    response_time_hours INTEGER,
    admin_user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Create brand_settings table for email branding
CREATE TABLE IF NOT EXISTS public.brand_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Add triggers for updated_at columns
CREATE TRIGGER update_message_notifications_updated_at BEFORE
UPDATE ON public.message_notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE
UPDATE ON public.email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_brand_settings_updated_at BEFORE
UPDATE ON public.brand_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON public.contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_priority ON public.contact_messages(priority);
CREATE INDEX IF NOT EXISTS idx_contact_messages_category ON public.contact_messages(category);
CREATE INDEX IF NOT EXISTS idx_contact_messages_archived ON public.contact_messages(archived);
CREATE INDEX IF NOT EXISTS idx_message_notifications_message_id ON public.message_notifications(message_id);
CREATE INDEX IF NOT EXISTS idx_message_notifications_status ON public.message_notifications(status);
CREATE INDEX IF NOT EXISTS idx_message_analytics_message_id ON public.message_analytics(message_id);
-- Insert default email templates
INSERT INTO public.email_templates (
        name,
        subject,
        html_content,
        text_content,
        template_type,
        variables
    )
VALUES (
        'new_message_notification',
        'New Contact Form Message: {{subject}}',
        '<h2>New Contact Form Message</h2>
  <p><strong>From:</strong> {{sender_name}} &lt;{{sender_email}}&gt;</p>
  <p><strong>Subject:</strong> {{subject}}</p>
  <p><strong>Message:</strong></p>
  <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
    {{message}}
  </div>
  <p><strong>Received:</strong> {{created_at}}</p>
  <p><a href="{{admin_url}}/messages/{{message_id}}">View in Admin Panel</a></p>',
        'New Contact Form Message: {{subject}}

From: {{sender_name}} <{{sender_email}}>
Subject: {{subject}}

Message:
{{message}}

Received: {{created_at}}
View in Admin Panel: {{admin_url}}/messages/{{message_id}}',
        'new_message_notification',
        '{"sender_name": "", "sender_email": "", "subject": "", "message": "", "created_at": "", "admin_url": "", "message_id": ""}'
    ),
    (
        'reply_to_sender',
        'Re: {{original_subject}}',
        '<h2>Thank you for contacting me!</h2>
  <p>Hi {{sender_name}},</p>
  <p>{{reply_content}}</p>
  <hr>
  <p><strong>Your original message:</strong></p>
  <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
    {{original_message}}
  </div>
  <p>Best regards,<br>{{admin_name}}</p>',
        'Hi {{sender_name}},

{{reply_content}}

---
Your original message:
{{original_message}}

Best regards,
{{admin_name}}',
        'reply_to_sender',
        '{"sender_name": "", "reply_content": "", "original_message": "", "original_subject": "", "admin_name": ""}'
    );
-- Insert default brand settings
INSERT INTO public.brand_settings (setting_key, setting_value, description)
VALUES (
        'email_branding',
        '{
   "company_name": "Neural Portfolio",
   "company_email": "hello@neuralportfolio.dev",
   "company_website": "https://neuralportfolio.dev",
   "logo_url": "",
   "primary_color": "#00D4FF",
   "secondary_color": "#FF6B6B",
   "font_family": "Space Grotesk, Inter, sans-serif"
 }',
        'Email branding settings for consistent visual identity'
    ),
    (
        'notification_settings',
        '{
   "admin_email": "admin@neuralportfolio.dev",
   "notify_on_new_message": true,
   "auto_reply_enabled": false,
   "reply_from_name": "Neural Portfolio",
   "signature": "Best regards,\\nThe Neural Portfolio Team"
 }',
        'Email notification and auto-reply settings'
    );
-- Enable Row Level Security (RLS)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_settings ENABLE ROW LEVEL SECURITY;
-- RLS Policies for contact_messages
-- Allow public to insert new messages (contact form submissions)
CREATE POLICY "Allow public to insert contact messages" ON public.contact_messages FOR
INSERT WITH CHECK (true);
-- Allow authenticated users (admin) to view all messages
CREATE POLICY "Allow admin to view all contact messages" ON public.contact_messages FOR
SELECT USING (auth.role() = 'authenticated');
-- Allow authenticated users (admin) to update messages
CREATE POLICY "Allow admin to update contact messages" ON public.contact_messages FOR
UPDATE USING (auth.role() = 'authenticated');
-- Allow authenticated users (admin) to delete messages
CREATE POLICY "Allow admin to delete contact messages" ON public.contact_messages FOR DELETE USING (auth.role() = 'authenticated');
-- RLS Policies for message_notifications (admin only)
CREATE POLICY "Allow admin full access to message notifications" ON public.message_notifications FOR ALL USING (auth.role() = 'authenticated');
-- RLS Policies for email_templates (admin only)
CREATE POLICY "Allow admin full access to email templates" ON public.email_templates FOR ALL USING (auth.role() = 'authenticated');
-- RLS Policies for message_analytics (admin only)
CREATE POLICY "Allow admin full access to message analytics" ON public.message_analytics FOR ALL USING (auth.role() = 'authenticated');
-- RLS Policies for brand_settings (admin only)
CREATE POLICY "Allow admin full access to brand settings" ON public.brand_settings FOR ALL USING (auth.role() = 'authenticated');
-- Create function to trigger notification on new message
CREATE OR REPLACE FUNCTION trigger_new_message_notification() RETURNS TRIGGER AS $$ BEGIN -- Only trigger for new messages (INSERT)
    IF TG_OP = 'INSERT' THEN -- Log the notification event
INSERT INTO message_notifications (
        message_id,
        notification_type,
        recipient_email,
        subject,
        content,
        status,
        created_at
    )
VALUES (
        NEW.id,
        'new_message',
        (
            SELECT setting_value->>'admin_email'
            FROM brand_settings
            WHERE setting_key = 'notification_settings'
        ),
        'New Contact Message: ' || NEW.subject,
        'A new message has been received from ' || NEW.name || ' (' || NEW.email || ')',
        'pending',
        NOW()
    );
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Create trigger for new messages
CREATE TRIGGER on_new_contact_message
AFTER
INSERT ON contact_messages FOR EACH ROW EXECUTE FUNCTION trigger_new_message_notification();