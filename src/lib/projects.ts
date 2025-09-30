import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { Project } from '@/components/admin/types';

type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export class ProjectsAPI {
  // Fetch all projects (admin view)
  static async getAllProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch projects: ${error.message}`);
    }

    return (data || []) as Project[];
  }

  // Fetch published projects (public view)
  static async getPublishedProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch published projects: ${error.message}`);
    }

    return (data || []) as Project[];
  }

  // Get single project by slug
  static async getProjectBySlug(slug: string): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      throw new Error(`Failed to fetch project: ${error.message}`);
    }

    return data as Project;
  }

  // Get single project by ID
  static async getProjectById(id: string): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch project: ${error.message}`);
    }

    return data as Project;
  }

  // Create new project
  static async createProject(project: ProjectInsert): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create project: ${error.message}`);
    }

    // Create analytics record
    await supabase
      .from('project_analytics')
      .insert({ project_id: data.id });

    return data as Project;
  }

  // Update project
  static async updateProject(id: string, updates: ProjectUpdate): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update project: ${error.message}`);
    }

    return data as Project;
  }

  // Delete project
  static async deleteProject(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete project: ${error.message}`);
    }
  }

  // Generate unique slug
  static async generateSlug(title: string): Promise<string> {
    const { data, error } = await supabase.functions.invoke('generate-slug', {
      body: { title },
    });

    if (error) {
      throw new Error(`Failed to generate slug: ${error.message}`);
    }

    return data.slug;
  }

  // Calculate project duration
  static async calculateDuration(startDate: string, endDate?: string): Promise<number> {
    const { data, error } = await supabase.functions.invoke('calculate-duration', {
      body: { start_date: startDate, end_date: endDate },
    });

    if (error) {
      throw new Error(`Failed to calculate duration: ${error.message}`);
    }

    return data.duration;
  }

  // Track project view
  static async trackView(projectId: string): Promise<void> {
    await supabase.functions.invoke('track-view', {
      body: { project_id: projectId },
    });
  }

  // Get project analytics
  static async getProjectAnalytics(projectId: string) {
    const { data, error } = await supabase
      .from('project_analytics')
      .select('*')
      .eq('project_id', projectId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch analytics: ${error.message}`);
    }

    return data;
  }
}