-- ============================================================================
-- Cleanup React Email System
-- Removes React Email and Resend related tables, views, and functions
-- Keeps message_analytics for message tracking
-- Date: November 22, 2024
-- Reason: Migrated to EmailJS (client-side email service)
-- ============================================================================

-- Drop views first (they depend on tables)
DROP VIEW IF EXISTS public.email_analytics CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_email_log_status(TEXT, TEXT, TIMESTAMPTZ) CASCADE;
DROP FUNCTION IF EXISTS get_email_statistics(INTEGER) CASCADE;

-- Drop tables (in reverse dependency order)
-- Note: Keeping message_analytics for message tracking
DROP TABLE IF EXISTS public.message_notifications CASCADE;
DROP TABLE IF EXISTS public.email_logs CASCADE;
DROP TABLE IF EXISTS public.react_email_templates CASCADE;

-- Clean up message_analytics columns that referenced email_logs
-- Remove email-specific tracking columns (no longer used with EmailJS)
ALTER TABLE IF EXISTS public.message_analytics 
  DROP COLUMN IF EXISTS notification_sent_at,
  DROP COLUMN IF EXISTS notification_opened_at,
  DROP COLUMN IF EXISTS reply_email_sent_at,
  DROP COLUMN IF EXISTS reply_email_opened_at;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE public.message_analytics IS 'Tracks message response metrics and admin engagement (EmailJS compatible)';
COMMENT ON SCHEMA public IS 'Cleaned up React Email system - migrated to EmailJS';

-- ============================================================================
-- IMPORTANT NOTES
-- ============================================================================
-- After running this migration:
-- 1. The Email Templates section in admin panel will no longer work
-- 2. Email templates are now managed in EmailJS dashboard (https://dashboard.emailjs.com)
-- 3. Consider removing EmailTemplatesSection component from admin UI
-- 4. Files to potentially remove:
--    - src/components/admin/messages/sections/EmailTemplatesSection.tsx
--    - src/components/admin/messages/hooks/useEmailTemplates.ts
--    - src/components/admin/EmailTemplateForm.tsx

