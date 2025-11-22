-- ============================================================================
-- Fix Email Template Variables
-- Updates template placeholders from snake_case to camelCase
-- ============================================================================

-- Update all react_email_templates to use camelCase variables
UPDATE public.react_email_templates
SET 
  html_template = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    COALESCE(html_template, ''),
    '{{sender_name}}', '{{senderName}}'),
    '{{sender_email}}', '{{senderEmail}}'),
    '{{created_at}}', '{{createdAt}}'),
    '{{admin_url}}', '{{adminUrl}}'),
    '{{message_id}}', '{{messageId}}'),
    '{{company_name}}', '{{companyName}}'),
    '{{reply_content}}', '{{replyContent}}'),
    '{{original_message}}', '{{originalMessage}}'),
    '{{original_subject}}', '{{originalSubject}}'),
    '{{admin_name}}', '{{adminName}}'),
  text_template = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    COALESCE(text_template, ''),
    '{{sender_name}}', '{{senderName}}'),
    '{{sender_email}}', '{{senderEmail}}'),
    '{{created_at}}', '{{createdAt}}'),
    '{{admin_url}}', '{{adminUrl}}'),
    '{{message_id}}', '{{messageId}}'),
    '{{company_name}}', '{{companyName}}'),
    '{{reply_content}}', '{{replyContent}}'),
    '{{original_message}}', '{{originalMessage}}'),
    '{{original_subject}}', '{{originalSubject}}'),
    '{{admin_name}}', '{{adminName}}'),
  updated_at = now()
WHERE template_type IN ('new_message_notification', 'reply_to_sender', 'auto_reply');



-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON COLUMN public.react_email_templates.html_template IS 'HTML template content with camelCase variables: {{senderName}}, {{senderEmail}}, {{createdAt}}, {{adminUrl}}, {{messageId}}, {{companyName}}, {{replyContent}}, {{originalMessage}}, {{originalSubject}}, {{adminName}}';
