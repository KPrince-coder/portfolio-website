/**
 * Shared Utilities for Supabase Edge Functions
 *
 * Common utility functions for email operations
 */

import type { EmailTemplate, EmailLog, EmailError } from "./types.ts";

// ============================================================================
// CORS Headers
// ============================================================================

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ============================================================================
// Response Helpers
// ============================================================================

export function successResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function errorResponse(
  error: string,
  details?: any,
  status = 500
): Response {
  return new Response(
    JSON.stringify({
      error,
      details,
      timestamp: new Date().toISOString(),
    }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

export function corsResponse(): Response {
  return new Response("ok", { headers: corsHeaders });
}

// ============================================================================
// Template Variable Replacement
// ============================================================================

export function replaceTemplateVariables(
  template: string,
  variables: Record<string, any>
): string {
  let result = template;

  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    const regex = new RegExp(
      placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "g"
    );
    result = result.replace(regex, String(value ?? ""));
  });

  return result;
}

export function renderTemplate(
  template: EmailTemplate,
  variables: Record<string, any>
): {
  subject: string;
  html: string;
  text: string;
} {
  return {
    subject: replaceTemplateVariables(template.subject, variables),
    html: replaceTemplateVariables(template.html_content, variables),
    text: replaceTemplateVariables(template.text_content || "", variables),
  };
}

// ============================================================================
// Validation
// ============================================================================

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateRequired(
  data: Record<string, any>,
  requiredFields: string[]
): { valid: boolean; missing: string[] } {
  const missing = requiredFields.filter((field) => !data[field]);
  return {
    valid: missing.length === 0,
    missing,
  };
}

// ============================================================================
// Logging
// ============================================================================

export function logInfo(message: string, data?: any): void {
  console.log(
    JSON.stringify({
      level: "info",
      message,
      data,
      timestamp: new Date().toISOString(),
    })
  );
}

export function logError(message: string, error?: any): void {
  console.error(
    JSON.stringify({
      level: "error",
      message,
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
      timestamp: new Date().toISOString(),
    })
  );
}

export function logWarning(message: string, data?: any): void {
  console.warn(
    JSON.stringify({
      level: "warning",
      message,
      data,
      timestamp: new Date().toISOString(),
    })
  );
}

// ============================================================================
// Email Log Creation
// ============================================================================

export function createEmailLog(params: {
  messageId?: string;
  templateId?: string;
  emailType: string;
  fromEmail: string;
  fromName?: string;
  toEmail: string;
  toName?: string;
  replyTo?: string;
  subject: string;
  htmlContent?: string;
  textContent?: string;
  templateVariables?: Record<string, any>;
  status?: string;
  metadata?: Record<string, any>;
}): Omit<EmailLog, "id"> {
  return {
    message_id: params.messageId,
    template_id: params.templateId,
    email_type: params.emailType,
    from_email: params.fromEmail,
    from_name: params.fromName,
    to_email: params.toEmail,
    to_name: params.toName,
    reply_to: params.replyTo,
    subject: params.subject,
    html_content: params.htmlContent,
    text_content: params.textContent,
    template_variables: params.templateVariables,
    status: (params.status as any) || "pending",
    metadata: params.metadata,
  };
}

// ============================================================================
// Rate Limiting (Simple Implementation)
// ============================================================================

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests = 10,
  windowMs = 60000
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetAt) {
    const resetAt = now + windowMs;
    rateLimitMap.set(identifier, { count: 1, resetAt });
    return { allowed: true, remaining: maxRequests - 1, resetAt };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count++;
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetAt: record.resetAt,
  };
}

// ============================================================================
// Environment Variables
// ============================================================================

export function getEnvVar(name: string, required = true): string {
  const value = Deno.env.get(name);
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value || "";
}

export function getEnvConfig() {
  return {
    supabaseUrl: getEnvVar("SUPABASE_URL"),
    supabaseServiceKey: getEnvVar("SUPABASE_SERVICE_ROLE_KEY"),
    resendApiKey: getEnvVar("RESEND_API_KEY"),
    adminUrl: getEnvVar("ADMIN_URL", false) || "https://yoursite.com/admin",
    fromEmail: getEnvVar("FROM_EMAIL", false) || "onboarding@resend.dev",
    environment: getEnvVar("ENVIRONMENT", false) || "production",
  };
}

// ============================================================================
// Retry Logic
// ============================================================================

export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      logWarning(`Operation failed (attempt ${attempt}/${maxRetries})`, {
        error: lastError.message,
      });

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  throw lastError || new Error("Operation failed after retries");
}
