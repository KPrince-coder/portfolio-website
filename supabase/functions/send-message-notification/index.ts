import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  message_id: string;
  admin_email?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { message_id, admin_email } = await req.json() as NotificationRequest;

    if (!message_id) {
      return new Response(
        JSON.stringify({ error: 'Message ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get message details
    const { data: message, error: messageError } = await supabaseClient
      .from('contact_messages')
      .select('*')
      .eq('id', message_id)
      .single();

    if (messageError || !message) {
      return new Response(
        JSON.stringify({ error: 'Message not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get email template
    const { data: template, error: templateError } = await supabaseClient
      .from('email_templates')
      .select('*')
      .eq('template_type', 'new_message_notification')
      .eq('is_active', true)
      .single();

    if (templateError || !template) {
      return new Response(
        JSON.stringify({ error: 'Email template not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get brand settings
    const { data: brandSettings } = await supabaseClient
      .from('brand_settings')
      .select('*')
      .in('setting_key', ['email_branding', 'notification_settings']);

    const emailBranding = brandSettings?.find(s => s.setting_key === 'email_branding')?.setting_value || {};
    const notificationSettings = brandSettings?.find(s => s.setting_key === 'notification_settings')?.setting_value || {};

    // Prepare template variables
    const variables = {
      sender_name: message.name,
      sender_email: message.email,
      subject: message.subject,
      message: message.message,
      created_at: new Date(message.created_at).toLocaleString(),
      admin_url: Deno.env.get('ADMIN_URL') || 'https://yoursite.com/admin',
      message_id: message.id,
    };

    // Replace variables in template
    let emailSubject = template.subject;
    let emailHtml = template.html_content;
    let emailText = template.text_content || '';

    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      emailSubject = emailSubject.replace(new RegExp(placeholder, 'g'), value);
      emailHtml = emailHtml.replace(new RegExp(placeholder, 'g'), value);
      emailText = emailText.replace(new RegExp(placeholder, 'g'), value);
    });

    // Send email using Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('Resend API key not configured');
    }

    const emailPayload = {
      from: `${emailBranding.company_name || 'Portfolio'} <${emailBranding.company_email || 'noreply@example.com'}>`,
      to: admin_email || notificationSettings.admin_email || 'admin@example.com',
      subject: emailSubject,
      html: emailHtml,
      text: emailText,
    };

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    const resendResult = await resendResponse.json();

    if (!resendResponse.ok) {
      throw new Error(`Resend API error: ${resendResult.message}`);
    }

    // Log notification
    const { error: notificationError } = await supabaseClient
      .from('message_notifications')
      .insert({
        message_id: message.id,
        notification_type: 'new_message',
        recipient_email: emailPayload.to,
        subject: emailSubject,
        content: emailHtml,
        status: 'sent',
        sent_at: new Date().toISOString(),
      });

    if (notificationError) {
      console.error('Failed to log notification:', notificationError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        email_id: resendResult.id,
        message: 'Notification sent successfully' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error sending notification:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send notification',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

/* To deploy this function:
1. Make sure you have the Supabase CLI installed
2. Run: supabase functions deploy send-message-notification
3. Set the required environment variables:
   - RESEND_API_KEY
   - ADMIN_URL
*/
