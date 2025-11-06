-- ============================================================================
-- React Email Templates & Email Logs Migration
-- Adds support for React Email templates and comprehensive email tracking
-- ============================================================================

-- Create react_email_templates table
-- Stores React Email component templates with metadata
CREATE TABLE IF NOT EXISTS public.react_email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Template identification
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  template_type TEXT NOT NULL CHECK (template_type IN (
    'new_message_notification',
    'reply_to_sender',
    'auto_reply',
    'welcome',
    'password_reset',
    'custom'
  )),
  
  -- Template content
  component_name TEXT NOT NULL, -- React component name
  props_schema JSONB, -- JSON schema for template props
  default_props JSONB, -- Default prop values
  
  -- Rendered versions (cached)
  html_template TEXT, -- Rendered HTML with {{variables}}
  text_template TEXT, -- Plain text version
  
  -- Metadata
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false, -- Default template for this type
  
  -- Variables documentation
  available_variables JSONB, -- List of available variables with descriptions
  required_variables TEXT[], -- Required variable names
  
  -- Preview
  preview_props JSONB, -- Sample props for preview
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create indexes for react_email_templates
CREATE INDEX idx_react_email_templates_type ON public.react_email_templates(template_type);
CREATE INDEX idx_react_email_templates_active ON public.react_email_templates(is_active);
CREATE INDEX idx_react_email_templates_default ON public.react_email_templates(is_default);
CREATE INDEX idx_react_email_templates_name ON public.react_email_templates(name);

-- Create unique constraint for default templates per type
CREATE UNIQUE INDEX idx_react_email_templates_default_per_type 
  ON public.react_email_templates(template_type) 
  WHERE is_default = true;

-- ============================================================================
-- Email Logs Table
-- Comprehensive email delivery tracking and analytics
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Email identification
  resend_email_id TEXT, -- Resend's email ID
  message_id UUID REFERENCES public.contact_messages(id) ON DELETE SET NULL,
  template_id UUID REFERENCES public.react_email_templates(id) ON DELETE SET NULL,
  
  -- Email details
  email_type TEXT NOT NULL CHECK (email_type IN (
    'new_message_notification',
    'reply_to_sender',
    'auto_reply',
    'custom'
  )),
  
  -- Recipients
  from_email TEXT NOT NULL,
  from_name TEXT,
  to_email TEXT NOT NULL,
  to_name TEXT,
  reply_to TEXT,
  cc TEXT[],
  bcc TEXT[],
  
  -- Content
  subject TEXT NOT NULL,
  html_content TEXT,
  text_content TEXT,
  
  -- Template variables used
  template_variables JSONB,
  
  -- Delivery status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending',
    'sent',
    'delivered',
    'bounced',
    'failed',
    'complained',
    'opened',
    'clicked'
  )),
  
  -- Delivery tracking
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  bounced_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  
  -- Error tracking
  error_message TEXT,
  error_code TEXT,
  retry_count INTEGER DEFAULT 0,
  
  -- Analytics
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  
  -- Metadata
  metadata JSONB, -- Additional custom data
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for email_logs
CREATE INDEX idx_email_logs_message_id ON public.email_logs(message_id);
CREATE INDEX idx_email_logs_template_id ON public.email_logs(template_id);
CREATE INDEX idx_email_logs_resend_id ON public.email_logs(resend_email_id);
CREATE INDEX idx_email_logs_status ON public.email_logs(status);
CREATE INDEX idx_email_logs_email_type ON public.email_logs(email_type);
CREATE INDEX idx_email_logs_to_email ON public.email_logs(to_email);
CREATE INDEX idx_email_logs_created_at ON public.email_logs(created_at DESC);
CREATE INDEX idx_email_logs_sent_at ON public.email_logs(sent_at DESC);

-- ============================================================================
-- Email Analytics View
-- Aggregated email statistics
-- ============================================================================

CREATE OR REPLACE VIEW public.email_analytics AS
SELECT
  email_type,
  COUNT(*) as total_sent,
  COUNT(*) FILTER (WHERE status = 'delivered') as delivered_count,
  COUNT(*) FILTER (WHERE status = 'bounced') as bounced_count,
  COUNT(*) FILTER (WHERE status = 'failed') as failed_count,
  COUNT(*) FILTER (WHERE opened_at IS NOT NULL) as opened_count,
  COUNT(*) FILTER (WHERE clicked_at IS NOT NULL) as clicked_count,
  ROUND(
    (COUNT(*) FILTER (WHERE opened_at IS NOT NULL)::NUMERIC / 
    NULLIF(COUNT(*) FILTER (WHERE status = 'delivered'), 0)) * 100, 
    2
  ) as open_rate,
  ROUND(
    (COUNT(*) FILTER (WHERE clicked_at IS NOT NULL)::NUMERIC / 
    NULLIF(COUNT(*) FILTER (WHERE opened_at IS NOT NULL), 0)) * 100, 
    2
  ) as click_rate,
  AVG(
    EXTRACT(EPOCH FROM (delivered_at - sent_at))
  ) as avg_delivery_time_seconds
FROM public.email_logs
WHERE sent_at >= NOW() - INTERVAL '30 days'
GROUP BY email_type;

-- ============================================================================
-- Message Notifications Table (Enhanced)
-- Links messages to email logs for tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.message_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  message_id UUID NOT NULL REFERENCES public.contact_messages(id) ON DELETE CASCADE,
  email_log_id UUID REFERENCES public.email_logs(id) ON DELETE SET NULL,
  
  -- Notification details
  notification_type TEXT NOT NULL CHECK (notification_type IN (
    'new_message',
    'reply_sent',
    'auto_reply',
    'status_update'
  )),
  
  -- Recipient
  recipient_email TEXT NOT NULL,
  
  -- Content (for backward compatibility)
  subject TEXT,
  content TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending',
    'sent',
    'failed'
  )),
  
  -- Timestamps
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for message_notifications
CREATE INDEX idx_message_notifications_message_id ON public.message_notifications(message_id);
CREATE INDEX idx_message_notifications_email_log_id ON public.message_notifications(email_log_id);
CREATE INDEX idx_message_notifications_type ON public.message_notifications(notification_type);
CREATE INDEX idx_message_notifications_status ON public.message_notifications(status);

-- ============================================================================
-- Message Analytics Table (Enhanced)
-- Tracks message response metrics
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.message_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Reference
  message_id UUID NOT NULL UNIQUE REFERENCES public.contact_messages(id) ON DELETE CASCADE,
  
  -- Response metrics
  replied_at TIMESTAMPTZ,
  response_time_hours INTEGER,
  response_time_minutes INTEGER,
  
  -- Email metrics
  notification_sent_at TIMESTAMPTZ,
  notification_opened_at TIMESTAMPTZ,
  reply_email_sent_at TIMESTAMPTZ,
  reply_email_opened_at TIMESTAMPTZ,
  
  -- Engagement
  admin_views INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for message_analytics
CREATE INDEX idx_message_analytics_message_id ON public.message_analytics(message_id);
CREATE INDEX idx_message_analytics_replied_at ON public.message_analytics(replied_at);

-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE public.react_email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for react_email_templates
CREATE POLICY "Authenticated users can view templates"
  ON public.react_email_templates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage templates"
  ON public.react_email_templates
  FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for email_logs
CREATE POLICY "Authenticated users can view email logs"
  ON public.email_logs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can manage email logs"
  ON public.email_logs
  FOR ALL
  TO service_role
  USING (true);

-- RLS Policies for message_notifications
CREATE POLICY "Authenticated users can view notifications"
  ON public.message_notifications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can manage notifications"
  ON public.message_notifications
  FOR ALL
  TO service_role
  USING (true);

-- RLS Policies for message_analytics
CREATE POLICY "Authenticated users can view analytics"
  ON public.message_analytics
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can manage analytics"
  ON public.message_analytics
  FOR ALL
  TO service_role
  USING (true);

-- ============================================================================
-- Triggers
-- ============================================================================

-- Add updated_at triggers
CREATE TRIGGER update_react_email_templates_updated_at
  BEFORE UPDATE ON public.react_email_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_logs_updated_at
  BEFORE UPDATE ON public.email_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_message_analytics_updated_at
  BEFORE UPDATE ON public.message_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Functions
-- ============================================================================

-- Function to update email log status from webhook
CREATE OR REPLACE FUNCTION update_email_log_status(
  p_resend_email_id TEXT,
  p_status TEXT,
  p_timestamp TIMESTAMPTZ DEFAULT NOW()
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.email_logs
  SET
    status = p_status,
    updated_at = NOW(),
    delivered_at = CASE WHEN p_status = 'delivered' THEN p_timestamp ELSE delivered_at END,
    opened_at = CASE WHEN p_status = 'opened' THEN p_timestamp ELSE opened_at END,
    clicked_at = CASE WHEN p_status = 'clicked' THEN p_timestamp ELSE clicked_at END,
    bounced_at = CASE WHEN p_status = 'bounced' THEN p_timestamp ELSE bounced_at END,
    failed_at = CASE WHEN p_status = 'failed' THEN p_timestamp ELSE failed_at END,
    open_count = CASE WHEN p_status = 'opened' THEN open_count + 1 ELSE open_count END,
    click_count = CASE WHEN p_status = 'clicked' THEN click_count + 1 ELSE click_count END
  WHERE resend_email_id = p_resend_email_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get email statistics
CREATE OR REPLACE FUNCTION get_email_statistics(
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  total_sent BIGINT,
  delivered BIGINT,
  bounced BIGINT,
  failed BIGINT,
  opened BIGINT,
  clicked BIGINT,
  open_rate NUMERIC,
  click_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_sent,
    COUNT(*) FILTER (WHERE status = 'delivered')::BIGINT as delivered,
    COUNT(*) FILTER (WHERE status = 'bounced')::BIGINT as bounced,
    COUNT(*) FILTER (WHERE status = 'failed')::BIGINT as failed,
    COUNT(*) FILTER (WHERE opened_at IS NOT NULL)::BIGINT as opened,
    COUNT(*) FILTER (WHERE clicked_at IS NOT NULL)::BIGINT as clicked,
    ROUND(
      (COUNT(*) FILTER (WHERE opened_at IS NOT NULL)::NUMERIC / 
      NULLIF(COUNT(*) FILTER (WHERE status = 'delivered'), 0)) * 100, 
      2
    ) as open_rate,
    ROUND(
      (COUNT(*) FILTER (WHERE clicked_at IS NOT NULL)::NUMERIC / 
      NULLIF(COUNT(*) FILTER (WHERE opened_at IS NOT NULL), 0)) * 100, 
      2
    ) as click_rate
  FROM public.email_logs
  WHERE created_at >= NOW() - (p_days || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE public.react_email_templates IS 'Stores React Email component templates with metadata and caching';
COMMENT ON TABLE public.email_logs IS 'Comprehensive email delivery tracking and analytics';
COMMENT ON TABLE public.message_notifications IS 'Links messages to email logs for notification tracking';
COMMENT ON TABLE public.message_analytics IS 'Tracks message response metrics and engagement';
COMMENT ON VIEW public.email_analytics IS 'Aggregated email statistics by type';
COMMENT ON FUNCTION update_email_log_status IS 'Updates email log status from Resend webhooks';
COMMENT ON FUNCTION get_email_statistics IS 'Returns email statistics for the specified number of days';

