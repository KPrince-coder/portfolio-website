/**
 * Send Reply Edge Function
 *
 * Sends email reply to contact message sender
 *
 * Modern implementation with:
 * - TypeScript strict types
 * - Comprehensive error handling
 * - Email logging and tracking
 * - Rate limiting
 * - Retry logic
 * - Proper validation
 * - Message status updates
 * - Analytics tracking
 *
 * @module send-reply
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "https://esm.sh/resend@2.0.0";

import type {
  SendReplyRequest,
  EmailResponse,
  ContactMessage,
  EmailTemplate,
} from "../_shared/types.ts";

import {
  corsHeaders,
  corsResponse,
  successResponse,
  errorResponse,
  renderTemplate,
  validateRequired,
  validateEmail,
  logInfo,
  logError,
  checkRateLimit,
  getEnvConfig,
  createEmailLog,
  retryOperation,
} from "../_shared/utils.ts";

// ============================================================================
// MAIN HANDLER
// ============================================================================

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return corsResponse();
  }

  const startTime = Date.now();

  try {
    // ============================================================================
    // 1. PARSE AND VALIDATE REQUEST
    // ============================================================================

    const body = (await req.json()) as SendReplyRequest;
    const { message_id, reply_content, admin_name } = body;

    // Validate required fields
    const validation = validateRequired(body, ["message_id", "reply_content"]);
    if (!validation.valid) {
      logError("Validation failed", { missing: validation.missing });
      return errorResponse(
        "Missing required fields",
        { missing: validation.missing },
        400
      );
    }

    // Validate reply content length
    if (reply_content.trim().length < 10) {
      return errorResponse(
        "Reply content too short (minimum 10 characters)",
        null,
        400
      );
    }

    // Rate limiting (5 replies per minute per message)
    const rateLimit = checkRateLimit(`reply:${message_id}`, 5, 60000);
    if (!rateLimit.allowed) {
      logError("Rate limit exceeded", { message_id });
      return errorResponse(
        "Rate limit exceeded",
        { resetAt: new Date(rateLimit.resetAt).toISOString() },
        429
      );
    }

    logInfo("Processing reply request", { message_id });

    // ============================================================================
    // 2. INITIALIZE CLIENTS
    // ============================================================================

    const config = getEnvConfig();

    const supabase = createClient(
      config.supabaseUrl,
      config.supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const resend = new Resend(config.resendApiKey);

    // ============================================================================
    // 3. FETCH MESSAGE
    // ============================================================================

    const { data: message, error: messageError } = await supabase
      .from("contact_messages")
      .select("*")
      .eq("id", message_id)
      .single<ContactMessage>();

    if (messageError || !message) {
      logError("Message not found", { message_id, error: messageError });
      return errorResponse("Message not found", null, 404);
    }

    // Validate sender email
    if (!message.email || !validateEmail(message.email)) {
      logError("Invalid sender email", { message_id, email: message.email });
      return errorResponse("Message has invalid sender email", null, 400);
    }

    // ============================================================================
    // 4. FETCH EMAIL TEMPLATE
    // ============================================================================

    const { data: template, error: templateError } = await supabase
      .from("react_email_templates")
      .select("*")
      .eq("template_type", "reply_to_sender")
      .eq("is_active", true)
      .single<EmailTemplate>();

    if (templateError || !template) {
      logError("Template not found", { error: templateError });
      return errorResponse(
        "Reply email template not configured",
        { template_type: "reply_to_sender" },
        404
      );
    }

    // ============================================================================
    // 5. FETCH BRAND SETTINGS
    // ============================================================================

    const { data: brandSettings } = await supabase
      .from("brand_settings")
      .select("*")
      .in("setting_key", ["email_branding", "notification_settings"]);

    const emailBranding =
      brandSettings?.find((s) => s.setting_key === "email_branding")
        ?.setting_value || {};

    const notificationSettings =
      brandSettings?.find((s) => s.setting_key === "notification_settings")
        ?.setting_value || {};

    // ============================================================================
    // 6. PREPARE TEMPLATE VARIABLES
    // ============================================================================

    const variables = {
      sender_name: message.name,
      reply_content,
      original_message: message.message,
      original_subject: message.subject,
      admin_name:
        admin_name || notificationSettings.reply_from_name || "Support Team",
      company_name: emailBranding.company_name || "Portfolio",
      company_email: emailBranding.company_email || config.fromEmail,
    };

    // ============================================================================
    // 7. RENDER TEMPLATE
    // ============================================================================

    const rendered = renderTemplate(template, variables);

    // ============================================================================
    // 8. PREPARE EMAIL PAYLOAD
    // ============================================================================

    const fromName = variables.admin_name;
    const fromEmail = config.fromEmail;
    const replyToEmail = emailBranding.company_email || fromEmail;

    const emailPayload = {
      from: `${fromName} <${fromEmail}>`,
      to: message.email,
      reply_to: replyToEmail,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
      tags: [
        { name: "type", value: "reply" },
        { name: "message_id", value: message.id },
      ],
    };

    logInfo("Sending reply email", {
      to: message.email,
      subject: rendered.subject,
    });

    // ============================================================================
    // 9. SEND EMAIL WITH RETRY
    // ============================================================================

    const sendEmail = async () => {
      const result = await resend.emails.send(emailPayload);
      if (result.error) {
        throw new Error(`Resend API error: ${result.error.message}`);
      }
      return result.data;
    };

    const resendResult = await retryOperation(sendEmail, 3, 1000);

    logInfo("Reply email sent successfully", {
      email_id: resendResult?.id,
      recipient: message.email,
    });

    // ============================================================================
    // 10. UPDATE MESSAGE
    // ============================================================================

    const now = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("contact_messages")
      .update({
        reply_content,
        reply_sent_at: now,
        is_replied: true,
        status: "replied",
        updated_at: now,
      })
      .eq("id", message_id);

    if (updateError) {
      logError("Failed to update message", updateError);
      // Don't fail the request, email was sent successfully
    }

    // ============================================================================
    // 11. LOG EMAIL
    // ============================================================================

    const emailLog = createEmailLog({
      messageId: message.id,
      templateId: template.id,
      emailType: "reply_to_sender",
      fromEmail,
      fromName,
      toEmail: message.email,
      toName: message.name,
      replyTo: replyToEmail,
      subject: rendered.subject,
      htmlContent: rendered.html,
      textContent: rendered.text,
      templateVariables: variables,
      status: "sent",
      metadata: {
        resend_email_id: resendResult?.id,
        admin_name: variables.admin_name,
      },
    });

    const { data: logData, error: emailLogError } = await supabase
      .from("email_logs")
      .insert({
        ...emailLog,
        resend_email_id: resendResult?.id,
        sent_at: now,
      })
      .select()
      .single();

    if (emailLogError) {
      logError("Failed to create email log", emailLogError);
    }

    // ============================================================================
    // 12. CREATE NOTIFICATION RECORD
    // ============================================================================

    await supabase.from("message_notifications").insert({
      message_id: message.id,
      email_log_id: logData?.id,
      notification_type: "reply_sent",
      recipient_email: message.email,
      subject: rendered.subject,
      content: rendered.html,
      status: "sent",
      sent_at: now,
    });

    // ============================================================================
    // 13. UPDATE ANALYTICS
    // ============================================================================

    const responseTimeHours = Math.round(
      (new Date(now).getTime() - new Date(message.created_at).getTime()) /
        (1000 * 60 * 60)
    );

    const responseTimeMinutes = Math.round(
      (new Date(now).getTime() - new Date(message.created_at).getTime()) /
        (1000 * 60)
    );

    await supabase.from("message_analytics").upsert(
      {
        message_id: message.id,
        replied_at: now,
        response_time_hours: responseTimeHours,
        response_time_minutes: responseTimeMinutes,
        reply_email_sent_at: now,
      },
      { onConflict: "message_id" }
    );

    // ============================================================================
    // 14. RETURN SUCCESS RESPONSE
    // ============================================================================

    const duration = Date.now() - startTime;

    logInfo("Reply sent successfully", {
      message_id,
      email_id: resendResult?.id,
      response_time_hours: responseTimeHours,
      duration_ms: duration,
    });

    return successResponse({
      success: true,
      email_id: resendResult?.id,
      message: "Reply sent successfully",
      response_time_hours: responseTimeHours,
      duration_ms: duration,
    } as EmailResponse);
  } catch (error) {
    // ============================================================================
    // ERROR HANDLING
    // ============================================================================

    const duration = Date.now() - startTime;

    logError("Failed to send reply", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      duration_ms: duration,
    });

    return errorResponse(
      "Failed to send reply",
      error instanceof Error ? error.message : "Unknown error",
      500
    );
  }
});

/**
 * Deployment Instructions:
 *
 * 1. Install Supabase CLI: npm install -g supabase
 * 2. Deploy function: supabase functions deploy send-reply
 * 3. Set environment variables:
 *    - SUPABASE_URL
 *    - SUPABASE_SERVICE_ROLE_KEY
 *    - RESEND_API_KEY
 *    - FROM_EMAIL (optional, defaults to onboarding@resend.dev)
 *    - ADMIN_URL (optional)
 *    - ENVIRONMENT (optional, defaults to production)
 *
 * 4. Test function:
 *    curl -X POST https://your-project.supabase.co/functions/v1/send-reply \
 *      -H "Authorization: Bearer YOUR_ANON_KEY" \
 *      -H "Content-Type: application/json" \
 *      -d '{"message_id": "uuid-here", "reply_content": "Thank you for your message!"}'
 */
