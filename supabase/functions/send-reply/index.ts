// import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// import { Resend } from 'https://esm.sh/resend@2.0.0';

// const corsHeaders = {
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
// };

// interface ReplyRequest {
//   message_id: string;
//   reply_content: string;
//   admin_name?: string;
// }

// serve(async (req) => {
//   // Handle CORS preflight requests
//   if (req.method === 'OPTIONS') {
//     return new Response('ok', { headers: corsHeaders });
//   }

//   try {
//     // Initialize Supabase client
//     const supabaseClient = createClient(
//       Deno.env.get('SUPABASE_URL') ?? '',
//       Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
//     );

//     const { message_id, reply_content, admin_name } = await req.json() as ReplyRequest;

//     if (!message_id || !reply_content) {
//       return new Response(
//         JSON.stringify({ error: 'Message ID and reply content are required' }),
//         { 
//           status: 400, 
//           headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
//         }
//       );
//     }

//     // Get message details
//     const { data: message, error: messageError } = await supabaseClient
//       .from('contact_messages')
//       .select('*')
//       .eq('id', message_id)
//       .single();

//     if (messageError || !message) {
//       return new Response(
//         JSON.stringify({ error: 'Message not found' }),
//         { 
//           status: 404, 
//           headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
//         }
//       );
//     }

//     // Get email template
//     const { data: template, error: templateError } = await supabaseClient
//       .from('email_templates')
//       .select('*')
//       .eq('template_type', 'reply_to_sender')
//       .eq('is_active', true)
//       .single();

//     if (templateError || !template) {
//       return new Response(
//         JSON.stringify({ error: 'Reply email template not found' }),
//         { 
//           status: 404, 
//           headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
//         }
//       );
//     }

//     // Get brand settings
//     const { data: brandSettings } = await supabaseClient
//       .from('brand_settings')
//       .select('*')
//       .in('setting_key', ['email_branding', 'notification_settings']);

//     const emailBranding = brandSettings?.find(s => s.setting_key === 'email_branding')?.setting_value || {};
//     const notificationSettings = brandSettings?.find(s => s.setting_key === 'notification_settings')?.setting_value || {};

//     // Prepare template variables
//     const variables = {
//       sender_name: message.name,
//       reply_content: reply_content,
//       original_message: message.message,
//       original_subject: message.subject,
//       admin_name: admin_name || notificationSettings.reply_from_name || 'Support Team',
//     };

//     // Replace variables in template
//     let emailSubject = template.subject;
//     let emailHtml = template.html_content;
//     let emailText = template.text_content || '';

//     Object.entries(variables).forEach(([key, value]) => {
//       const placeholder = `{{${key}}}`;
//       emailSubject = emailSubject.replace(new RegExp(placeholder, 'g'), value);
//       emailHtml = emailHtml.replace(new RegExp(placeholder, 'g'), value);
//       emailText = emailText.replace(new RegExp(placeholder, 'g'), value);
//     });

//     // Send email using Resend package
//     const resendApiKey = Deno.env.get('RESEND_API_KEY');
//     if (!resendApiKey) {
//       throw new Error('Resend API key not configured');
//     }

//     const resend = new Resend(resendApiKey);

//     const emailPayload = {
//       from: `${variables.admin_name} <${emailBranding.company_email || 'noreply@example.com'}>`,
//       to: message.email,
//       subject: emailSubject,
//       html: emailHtml,
//       text: emailText,
//       reply_to: emailBranding.company_email || 'noreply@example.com',
//     };

//     const { data: resendResult, error: resendError } = await resend.emails.send(emailPayload);

//     if (resendError) {
//       throw new Error(`Resend API error: ${resendError.message}`);
//     }

//     // Update message with reply
//     const now = new Date().toISOString();
//     const { error: updateError } = await supabaseClient
//       .from('contact_messages')
//       .update({
//         reply_content: reply_content,
//         reply_sent_at: now,
//         is_replied: true,
//         status: 'replied',
//         updated_at: now,
//       })
//       .eq('id', message_id);

//     if (updateError) {
//       console.error('Failed to update message:', updateError);
//     }

//     // Log notification
//     const { error: notificationError } = await supabaseClient
//       .from('message_notifications')
//       .insert({
//         message_id: message.id,
//         notification_type: 'reply_sent',
//         recipient_email: message.email,
//         subject: emailSubject,
//         content: emailHtml,
//         status: 'sent',
//         sent_at: now,
//       });

//     if (notificationError) {
//       console.error('Failed to log notification:', notificationError);
//     }

//     // Log analytics
//     const { error: analyticsError } = await supabaseClient
//       .from('message_analytics')
//       .insert({
//         message_id: message.id,
//         replied_at: now,
//         response_time_hours: Math.round(
//           (new Date(now).getTime() - new Date(message.created_at).getTime()) / (1000 * 60 * 60)
//         ),
//       });

//     if (analyticsError) {
//       console.error('Failed to log analytics:', analyticsError);
//     }

//     return new Response(
//       JSON.stringify({ 
//         success: true, 
//         email_id: resendResult?.id,
//         message: 'Reply sent successfully' 
//       }),
//       { 
//         status: 200, 
//         headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
//       }
//     );

//   } catch (error) {
//     console.error('Error sending reply:', error);
    
//     return new Response(
//       JSON.stringify({ 
//         error: 'Failed to send reply',
//         details: error.message 
//       }),
//       { 
//         status: 500, 
//         headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
//       }
//     );
//   }
// });

// /* To deploy this function:
// 1. Make sure you have the Supabase CLI installed
// 2. Run: supabase functions deploy send-reply
// 3. Set the required environment variables:
//    - RESEND_API_KEY
// */



import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'https://esm.sh/resend@2.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReplyRequest {
  message_id: string;
  reply_content: string;
  admin_name?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { message_id, reply_content, admin_name } = await req.json() as ReplyRequest;

    if (!message_id || !reply_content) {
      return new Response(
        JSON.stringify({ error: 'Message ID and reply content are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get message details
    const { data: message, error: messageError } = await supabaseClient
      .from('contact_messages')
      .select('id, name, email, subject, message, created_at') // Corrected column names
      .eq('id', message_id)
      .single();

    if (messageError || !message) {
      console.error('Message query error:', messageError);
      return new Response(
        JSON.stringify({ error: 'Message not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate email
    if (!message.email) {
      console.error('Missing email for message ID:', message_id);
      return new Response(
        JSON.stringify({ error: 'Message is missing sender email' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get email template
    const { data: template, error: templateError } = await supabaseClient
      .from('email_templates')
      .select('*')
      .eq('template_type', 'reply_to_sender')
      .eq('is_active', true)
      .single();

    if (templateError || !template) {
      console.error('Template query error:', templateError);
      return new Response(
        JSON.stringify({ error: 'Reply email template not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get brand settings
    const { data: brandSettings, error: brandSettingsError } = await supabaseClient
      .from('brand_settings')
      .select('*')
      .in('setting_key', ['email_branding', 'notification_settings']);

    if (brandSettingsError) {
      console.error('Brand settings error:', brandSettingsError);
    }

    const emailBranding = brandSettings?.find(s => s.setting_key === 'email_branding')?.setting_value || {};
    const notificationSettings = brandSettings?.find(s => s.setting_key === 'notification_settings')?.setting_value || {};

    // Use a verified email for localhost testing. IMPORTANT: Replace with your verified email or Resend's default (e.g., noreply@youraccount.onresend.com)
    const fromEmail = 'onboarding@resend.dev'; // Updated to use Resend's default test domain

    // Prepare template variables
    const variables = {
      sender_name: message.name || 'Unknown', // Corrected column name
      reply_content,
      original_message: message.message || '', // Corrected column name
      original_subject: message.subject || 'No Subject',
      admin_name: admin_name || notificationSettings.reply_from_name || 'Support Team',
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

    const resend = new Resend(resendApiKey);

    const emailPayload = {
      from: `${variables.admin_name} <${fromEmail}>`,
      to: message.email, // Corrected column name
      subject: emailSubject,
      html: emailHtml,
      text: emailText,
      reply_to: fromEmail,
    };

    console.log('Email payload:', JSON.stringify(emailPayload, null, 2));

    const { data: resendResult, error: resendError } = await resend.emails.send(emailPayload);

    if (resendError) {
      console.error('Resend API error:', resendError);
      throw new Error(`Resend API error: ${resendError.message}`);
    }

    // Update message with reply
    const now = new Date().toISOString();
    const { error: updateError } = await supabaseClient
      .from('contact_messages')
      .update({
        reply_content,
        reply_sent_at: now,
        is_replied: true,
        status: 'replied',
        updated_at: now,
      })
      .eq('id', message_id);

    if (updateError) {
      console.error('Failed to update message:', updateError);
    }

    // Log notification
    const { error: notificationError } = await supabaseClient
      .from('message_notifications')
      .insert({
        message_id,
        notification_type: 'reply_sent',
        recipient_email: message.email, // Corrected column name
        subject: emailSubject,
        content: emailHtml,
        status: 'sent',
        sent_at: now,
      });

    if (notificationError) {
      console.error('Failed to log notification:', notificationError);
    }

    // Log analytics (upsert to avoid duplicate key errors)
    const { error: analyticsError } = await supabaseClient
      .from('message_analytics')
      .upsert(
        {
          message_id,
          replied_at: now,
          response_time_hours: Math.round(
            (new Date(now).getTime() - new Date(message.created_at).getTime()) / (1000 * 60 * 60)
          ),
        },
        { onConflict: 'message_id' } // Specify conflict target
      );

    if (analyticsError) {
      console.error('Failed to log analytics:', analyticsError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        email_id: resendResult?.id,
        message: 'Reply sent successfully',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending reply:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to send reply',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
