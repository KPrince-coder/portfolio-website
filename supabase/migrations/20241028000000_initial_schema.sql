-- =====================================================
-- Initial Database Schema Migration
-- Portfolio CMS with Blog, Projects, Skills, and Contact Management
-- =====================================================

-- =====================================================
-- SECTION 1: Core Utility Functions
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- =====================================================
-- SECTION 2: User Profile Management
-- =====================================================

CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  website_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);

CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- SECTION 3: Skills Management
-- =====================================================

CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency INTEGER CHECK (proficiency >= 0 AND proficiency <= 100),
  description TEXT,
  icon_name TEXT,
  color_class TEXT,
  sort_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_skills_category ON public.skills(category);
CREATE INDEX idx_skills_visible ON public.skills(visible);
CREATE INDEX idx_skills_sort_order ON public.skills(sort_order);

CREATE TRIGGER update_skills_updated_at 
  BEFORE UPDATE ON public.skills 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- SECTION 4: Projects Management
-- =====================================================

-- Projects Categories Table
CREATE TABLE public.projects_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_projects_categories_slug ON public.projects_categories(slug);

CREATE TRIGGER update_projects_categories_updated_at 
  BEFORE UPDATE ON public.projects_categories 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Main Projects Table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  long_description TEXT,
  excerpt TEXT,
  category TEXT NOT NULL,
  image_url TEXT,
  technologies TEXT[] DEFAULT '{}',
  github_url TEXT,
  demo_url TEXT,
  status TEXT DEFAULT 'Planning' CHECK (status IN ('Planning', 'In Progress', 'Completed', 'On Hold', 'Archived')),
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  metrics JSONB,
  sort_order INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  duration INTEGER,
  assets TEXT[] DEFAULT '{}',
  seo_title TEXT,
  seo_description TEXT,
  author_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_projects_slug ON public.projects(slug);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_category ON public.projects(category);
CREATE INDEX idx_projects_featured ON public.projects(featured);
CREATE INDEX idx_projects_published ON public.projects(published);
CREATE INDEX idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX idx_projects_technologies ON public.projects USING GIN(technologies);

CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON public.projects 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Project Analytics Table
CREATE TABLE public.project_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  view_count INTEGER NOT NULL DEFAULT 0,
  last_viewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id)
);

CREATE INDEX idx_project_analytics_project_id ON public.project_analytics(project_id);

-- =====================================================
-- SECTION 5: Blog Management
-- =====================================================

CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  featured_image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  reading_time INTEGER,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published);
CREATE INDEX idx_blog_posts_published_at ON public.blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_tags ON public.blog_posts USING GIN(tags);

CREATE TRIGGER update_blog_posts_updated_at 
  BEFORE UPDATE ON public.blog_posts 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- SECTION 6: Contact Messages System
-- =====================================================

-- Main Contact Messages Table
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived', 'spam')),
  replied BOOLEAN DEFAULT false,
  is_replied BOOLEAN DEFAULT false,
  reply_content TEXT,
  reply_sent_at TIMESTAMP WITH TIME ZONE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  category TEXT DEFAULT 'general',
  tags TEXT[],
  archived BOOLEAN DEFAULT false,
  admin_notes TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX idx_contact_messages_email ON public.contact_messages(email);
CREATE INDEX idx_contact_messages_priority ON public.contact_messages(priority);
CREATE INDEX idx_contact_messages_category ON public.contact_messages(category);
CREATE INDEX idx_contact_messages_archived ON public.contact_messages(archived);
CREATE INDEX idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

CREATE TRIGGER update_contact_messages_updated_at 
  BEFORE UPDATE ON public.contact_messages 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Message Notifications Table
CREATE TABLE public.message_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES public.contact_messages(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('new_message', 'reply_sent', 'admin_notification')),
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_message_notifications_message_id ON public.message_notifications(message_id);
CREATE INDEX idx_message_notifications_status ON public.message_notifications(status);

CREATE TRIGGER update_message_notifications_updated_at 
  BEFORE UPDATE ON public.message_notifications 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Email Templates Table
CREATE TABLE public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  template_type TEXT NOT NULL CHECK (template_type IN ('new_message_notification', 'reply_to_sender', 'auto_reply')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TRIGGER update_email_templates_updated_at 
  BEFORE UPDATE ON public.email_templates 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Message Analytics Table
CREATE TABLE public.message_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES public.contact_messages(id) ON DELETE CASCADE,
  opened_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE,
  response_time_hours INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(message_id)
);

CREATE INDEX idx_message_analytics_message_id ON public.message_analytics(message_id);

CREATE TRIGGER update_message_analytics_updated_at 
  BEFORE UPDATE ON public.message_analytics 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- SECTION 7: Site Settings
-- =====================================================

CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_site_settings_key ON public.site_settings(key);

CREATE TRIGGER update_site_settings_updated_at 
  BEFORE UPDATE ON public.site_settings 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Brand Settings Table
CREATE TABLE public.brand_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_brand_settings_key ON public.brand_settings(setting_key);

CREATE TRIGGER update_brand_settings_updated_at 
  BEFORE UPDATE ON public.brand_settings 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- SECTION 8: Row Level Security (RLS) Setup
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_settings ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public read access for profiles" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can manage own profile" 
  ON public.profiles FOR ALL USING (auth.uid() = user_id);

-- Skills Policies
CREATE POLICY "Public read visible skills" 
  ON public.skills FOR SELECT USING (visible = true);

CREATE POLICY "Authenticated users can manage skills" 
  ON public.skills FOR ALL USING (auth.uid() IS NOT NULL);

-- Projects Categories Policies
CREATE POLICY "Public read projects categories" 
  ON public.projects_categories FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage categories" 
  ON public.projects_categories FOR ALL USING (auth.uid() IS NOT NULL);

-- Projects Policies
CREATE POLICY "Public read published projects" 
  ON public.projects FOR SELECT USING (published = true);

CREATE POLICY "Authenticated users can manage projects" 
  ON public.projects FOR ALL USING (auth.uid() IS NOT NULL);

-- Project Analytics Policies
CREATE POLICY "Public can view analytics for published projects" 
  ON public.project_analytics FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_analytics.project_id 
        AND projects.published = true
    )
  );

CREATE POLICY "Authenticated users can manage project analytics" 
  ON public.project_analytics FOR ALL USING (auth.uid() IS NOT NULL);

-- Blog Posts Policies
CREATE POLICY "Public read published blog posts" 
  ON public.blog_posts FOR SELECT USING (published = true);

CREATE POLICY "Authenticated users can manage blog posts" 
  ON public.blog_posts FOR ALL USING (auth.uid() IS NOT NULL);

-- Contact Messages Policies
CREATE POLICY "Anyone can insert contact messages" 
  ON public.contact_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can read contact messages" 
  ON public.contact_messages FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update contact messages" 
  ON public.contact_messages FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete contact messages" 
  ON public.contact_messages FOR DELETE USING (auth.uid() IS NOT NULL);

-- Message Notifications Policies
CREATE POLICY "Authenticated users can manage message notifications" 
  ON public.message_notifications FOR ALL USING (auth.uid() IS NOT NULL);

-- Email Templates Policies
CREATE POLICY "Authenticated users can manage email templates" 
  ON public.email_templates FOR ALL USING (auth.uid() IS NOT NULL);

-- Message Analytics Policies
CREATE POLICY "Authenticated users can manage message analytics" 
  ON public.message_analytics FOR ALL USING (auth.uid() IS NOT NULL);

-- Site Settings Policies
CREATE POLICY "Public read site settings" 
  ON public.site_settings FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage site settings" 
  ON public.site_settings FOR ALL USING (auth.uid() IS NOT NULL);

-- Brand Settings Policies
CREATE POLICY "Authenticated users can manage brand settings" 
  ON public.brand_settings FOR ALL USING (auth.uid() IS NOT NULL);

-- =====================================================
-- SECTION 9: Triggers and Functions
-- =====================================================

-- Function to trigger notification on new contact message
CREATE OR REPLACE FUNCTION trigger_new_message_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Log the notification event
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
    COALESCE(
      (SELECT setting_value->>'admin_email' 
       FROM brand_settings 
       WHERE setting_key = 'notification_settings'),
      'admin@example.com'
    ),
    'New Contact Message: ' || NEW.subject,
    'A new message has been received from ' || NEW.name || ' (' || NEW.email || ')',
    'pending',
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_contact_message
  AFTER INSERT ON contact_messages
  FOR EACH ROW EXECUTE FUNCTION trigger_new_message_notification();

-- =====================================================
-- SECTION 10: Initial Seed Data
-- =====================================================

-- Seed Skills
INSERT INTO public.skills (name, category, proficiency, description, icon_name, color_class, sort_order) VALUES
('TensorFlow', 'ai', 95, 'Deep learning models and neural networks', 'Brain', 'text-secondary', 1),
('PyTorch', 'ai', 90, 'Research-focused ML and computer vision', 'Brain', 'text-accent', 2),
('Apache Spark', 'data', 92, 'Large-scale data processing and analytics', 'Zap', 'text-secondary', 3),
('React', 'frontend', 93, 'Modern UI development and state management', 'Code', 'text-secondary', 4),
('React Native', 'mobile', 82, 'Cross-platform mobile development', 'Smartphone', 'text-secondary', 5);

-- Seed Site Settings
INSERT INTO public.site_settings (key, value, description) VALUES
('hero_title', '"Alex Neural"', 'Main hero title'),
('hero_subtitle', '"Data & AI Engineer | Crafting Intelligent Systems"', 'Hero subtitle/tagline'),
('site_title', '"Alex Neural - Data & AI Engineer Portfolio"', 'Site meta title'),
('site_description', '"Data & AI Engineer specializing in machine learning, neural networks, and scalable intelligent systems."', 'Site meta description');

-- Seed Projects Categories
INSERT INTO public.projects_categories (name, slug, icon) VALUES
('AI/ML', 'ai-ml', 'Brain'),
('Mobile/AI', 'mobile-ai', 'Smartphone'),
('Data Engineering', 'data-engineering', 'Database'),
('Frontend Development', 'frontend-development', 'Play'),
('Backend Development', 'backend-development', 'Database'),
('DevOps', 'devops', 'TrendingUp');

-- Seed Email Templates
INSERT INTO public.email_templates (name, subject, html_content, text_content, template_type) VALUES
(
  'new_message_notification',
  'New Contact Form Message: {{subject}}',
  '<h2>New Contact Form Message</h2>
  <p><strong>From:</strong> {{sender_name}} &lt;{{sender_email}}&gt;</p>
  <p><strong>Subject:</strong> {{subject}}</p>
  <p><strong>Message:</strong></p>
  <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
    {{message}}
  </div>
  <p><strong>Received:</strong> {{created_at}}</p>',
  'New Contact Form Message: {{subject}}

From: {{sender_name}} <{{sender_email}}>
Subject: {{subject}}

Message:
{{message}}

Received: {{created_at}}',
  'new_message_notification'
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
  <p>Best regards</p>',
  'Hi {{sender_name}},

{{reply_content}}

---
Your original message:
{{original_message}}

Best regards',
  'reply_to_sender'
);

-- Seed Brand Settings
INSERT INTO public.brand_settings (setting_key, setting_value, description) VALUES
(
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
