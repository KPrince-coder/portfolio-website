/**
 * Send Message Notification Edge Function
 *
 * Sends email notification to admin when a new contact message is received
 *
 * Modern implementation with:
 * - TypeScript strict types
 * - Comprehensive error handling
 * - Email logging and tracking
 * - Rate limiting
 * - Retry logic
 * - Proper validation
 *
 * @module send-message-notification
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "https://esm.sh/resend@2.0.0";

import type {
  SendNotificationRequest,
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

    const body = (await req.json()) as SendNotificationRequest;
    const { message_id, admin_email } = body;

    // Validate required fields
    const validation = validateRequired(body, ["message_id"]);
    if (!validation.valid) {
      logError("Validation failed", { missing: validation.missing });
      return errorResponse(
        "Missing required fields",
        { missing: validation.missing },
        400
      );
    }

    // Validate admin email if provided
    if (admin_email && !validateEmail(admin_email)) {
      return errorResponse("Invalid admin email format", null, 400);
    }

    // Rate limiting (10 requests per minute per message)
    const rateLimit = checkRateLimit(`notification:${message_id}`, 10, 60000);
    if (!rateLimit.allowed) {
      logError("Rate limit exceeded", { message_id });
      return errorResponse(
        "Rate limit exceeded",
        { resetAt: new Date(rateLimit.resetAt).toISOString() },
        429
      );
    }

    logInfo("Processing notification request", { message_id, admin_email });

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

    // ============================================================================
    // 4. FETCH EMAIL TEMPLATE
    // ============================================================================

    const { data: template, error: templateError } = await supabase
      .from("react_email_templates")
      .select("*")
      .eq("template_type", "new_message_notification")
      .eq("is_active", true)
      .single<EmailTemplate>();

    if (templateError || !template) {
      logError("Template not found", { error: templateError });
      return errorResponse(
        "Email template not configured",
        { template_type: "new_message_notification" },
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
      senderName: message.name,
      senderEmail: message.email,
      subject: message.subject,
      message: message.message,
      priority: message.priority,
      category: message.category,
      createdAt: new Date(message.created_at).toLocaleString("en-US", {
        dateStyle: "full",
        timeStyle: "short",
      }),
      adminUrl: `${config.adminUrl}/messages?id=${message.id}`,
      messageId: message.id,
      companyName: emailBranding.company_name || "CodePrince",
    };

    // ============================================================================
    // 7. RENDER TEMPLATE
    // ============================================================================

    const rendered = renderTemplate(template, variables);

    // ============================================================================
    // 8. PREPARE EMAIL PAYLOAD
    // ============================================================================

    const recipientEmail =
      admin_email || notificationSettings.admin_email || "admin@example.com";

    const fromName = emailBranding.company_name || "Portfolio";
    const fromEmail = config.fromEmail;

    const emailPayload = {
      from: `${fromName} <${fromEmail}>`,
      to: recipientEmail,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
      tags: [
        { name: "type", value: "notification" },
        { name: "message_id", value: message.id },
      ],
    };

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

    logInfo("Email sent successfully", {
      email_id: resendResult?.id,
      recipient: recipientEmail,
    });

    // ============================================================================
    // 10. LOG EMAIL
    // ============================================================================

    const emailLog = createEmailLog({
      messageId: message.id,
      templateId: template.id,
      emailType: "new_message_notification",
      fromEmail,
      fromName,
      toEmail: recipientEmail,
      subject: rendered.subject,
      htmlContent: rendered.html,
      textContent: rendered.text,
      templateVariables: variables,
      status: "sent",
      metadata: {
        resend_email_id: resendResult?.id,
        priority: message.priority,
        category: message.category,
      },
    });

    const { data: logData, error: emailLogError } = await supabase
      .from("email_logs")
      .insert({
        ...emailLog,
        resend_email_id: resendResult?.id,
        sent_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (emailLogError) {
      logError("Failed to create email log", emailLogError);
    }

    // ============================================================================
    // 11. CREATE NOTIFICATION RECORD
    // ============================================================================

    await supabase.from("message_notifications").insert({
      message_id: message.id,
      email_log_id: logData?.id,
      notification_type: "new_message",
      recipient_email: recipientEmail,
      subject: rendered.subject,
      content: rendered.html,
      status: "sent",
      sent_at: new Date().toISOString(),
    });

    // ============================================================================
    // 12. RETURN SUCCESS RESPONSE
    // ============================================================================

    const duration = Date.now() - startTime;

    logInfo("Notification sent successfully", {
      message_id,
      email_id: resendResult?.id,
      duration_ms: duration,
    });

    return successResponse({
      success: true,
      email_id: resendResult?.id,
      message: "Notification sent successfully",
      duration_ms: duration,
    } as EmailResponse);
  } catch (error) {
    // ============================================================================
    // ERROR HANDLING
    // ============================================================================

    const duration = Date.now() - startTime;

    logError("Failed to send notification", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      duration_ms: duration,
    });

    return errorResponse(
      "Failed to send notification",
      error instanceof Error ? error.message : "Unknown error",
      500
    );
  }
});

/**
 * Deployment Instructions:
 *
 * 1. Install Supabase CLI: npm install -g supabase
 * 2. Deploy function: supabase functions deploy send-message-notification
 * 3. Set environment variables:
 *    - SUPABASE_URL
 *    - SUPABASE_SERVICE_ROLE_KEY
 *    - RESEND_API_KEY
 *    - FROM_EMAIL (optional, defaults to onboarding@resend.dev)
 *    - ADMIN_URL (optional, defaults to https://yoursite.com/admin)
 *    - ENVIRONMENT (optional, defaults to production)
 *
 * 4. Test function:
 *    curl -X POST https://your-project.supabase.co/functions/v1/send-message-notification \
 *      -H "Authorization: Bearer YOUR_ANON_KEY" \
 *      -H "Content-Type: application/json" \
 *      -d '{"message_id": "uuid-here"}'
 */
