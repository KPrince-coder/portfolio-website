export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      learning_goals: {
        Row: {
          color: string
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          status: string
          title: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          about_description: string | null
          about_highlights: string[] | null
          about_title: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          experiences: Json | null
          full_name: string | null
          github_url: string | null
          hero_subtitle: string | null
          hero_tagline: string | null
          hero_title: string | null
          id: string
          impact_metrics: Json | null
          linkedin_url: string | null
          location: string | null
          philosophy_author: string | null
          philosophy_quote: string | null
          phone: string | null
          projects_completed: number | null
          projects_description: string | null
          projects_title: string | null
          resume_description: string | null
          resume_file_name: string | null
          resume_title: string | null
          resume_updated_at: string | null
          resume_url: string | null
          show_resume_stats: boolean | null
          skills_description: string | null
          skills_title: string | null
          technologies_mastered: number | null
          twitter_url: string | null
          updated_at: string
          user_id: string
          website_url: string | null
          years_of_experience: number | null
        }
        Insert: {
          about_description?: string | null
          about_highlights?: string[] | null
          about_title?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          experiences?: Json | null
          full_name?: string | null
          github_url?: string | null
          hero_subtitle?: string | null
          hero_tagline?: string | null
          hero_title?: string | null
          id?: string
          impact_metrics?: Json | null
          linkedin_url?: string | null
          location?: string | null
          philosophy_author?: string | null
          philosophy_quote?: string | null
          phone?: string | null
          projects_completed?: number | null
          projects_description?: string | null
          projects_title?: string | null
          resume_description?: string | null
          resume_file_name?: string | null
          resume_title?: string | null
          resume_updated_at?: string | null
          resume_url?: string | null
          show_resume_stats?: boolean | null
          skills_description?: string | null
          skills_title?: string | null
          technologies_mastered?: number | null
          twitter_url?: string | null
          updated_at?: string
          user_id: string
          website_url?: string | null
          years_of_experience?: number | null
        }
        Update: {
          about_description?: string | null
          about_highlights?: string[] | null
          about_title?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          experiences?: Json | null
          full_name?: string | null
          github_url?: string | null
          hero_subtitle?: string | null
          hero_tagline?: string | null
          hero_title?: string | null
          id?: string
          impact_metrics?: Json | null
          linkedin_url?: string | null
          location?: string | null
          philosophy_author?: string | null
          philosophy_quote?: string | null
          phone?: string | null
          projects_completed?: number | null
          projects_description?: string | null
          projects_title?: string | null
          resume_description?: string | null
          resume_file_name?: string | null
          resume_title?: string | null
          resume_updated_at?: string | null
          resume_url?: string | null
          show_resume_stats?: boolean | null
          skills_description?: string | null
          skills_title?: string | null
          technologies_mastered?: number | null
          twitter_url?: string | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
          years_of_experience?: number | null
        }
        Relationships: []
      }
      project_categories: {
        Row: {
          color: string
          created_at: string
          description: string | null
          display_order: number
          icon: string
          id: string
          is_active: boolean
          label: string
          name: string
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string
          id?: string
          is_active?: boolean
          label: string
          name: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string
          id?: string
          is_active?: boolean
          label?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_technologies: {
        Row: {
          created_at: string
          project_id: string
          technology_id: string
        }
        Insert: {
          created_at?: string
          project_id: string
          technology_id: string
        }
        Update: {
          created_at?: string
          project_id?: string
          technology_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_technologies_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_technologies_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects_with_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_technologies_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects_with_tech_count"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_technologies_technology_id_fkey"
            columns: ["technology_id"]
            isOneToOne: false
            referencedRelation: "technologies"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category_id: string
          created_at: string
          demo_url: string | null
          description: string
          display_order: number
          end_date: string | null
          forks: number | null
          github_url: string | null
          id: string
          image_url: string | null
          is_featured: boolean
          long_description: string | null
          slug: string
          stars: number | null
          start_date: string | null
          status: string
          tags: string[] | null
          technologies: string[]
          title: string
          updated_at: string
          views: number | null
        }
        Insert: {
          category_id: string
          created_at?: string
          demo_url?: string | null
          description: string
          display_order?: number
          end_date?: string | null
          forks?: number | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          long_description?: string | null
          slug: string
          stars?: number | null
          start_date?: string | null
          status?: string
          tags?: string[] | null
          technologies?: string[]
          title: string
          updated_at?: string
          views?: number | null
        }
        Update: {
          category_id?: string
          created_at?: string
          demo_url?: string | null
          description?: string
          display_order?: number
          end_date?: string | null
          forks?: number | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          long_description?: string | null
          slug?: string
          stars?: number | null
          start_date?: string | null
          status?: string
          tags?: string[] | null
          technologies?: string[]
          title?: string
          updated_at?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "project_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_certifications: {
        Row: {
          created_at: string
          credential_id: string | null
          credential_url: string | null
          description: string | null
          display_order: number | null
          does_not_expire: boolean | null
          expiry_date: string | null
          id: string
          is_visible: boolean | null
          issue_date: string | null
          issuing_organization: string
          logo_url: string | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          description?: string | null
          display_order?: number | null
          does_not_expire?: boolean | null
          expiry_date?: string | null
          id?: string
          is_visible?: boolean | null
          issue_date?: string | null
          issuing_organization: string
          logo_url?: string | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          description?: string | null
          display_order?: number | null
          does_not_expire?: boolean | null
          expiry_date?: string | null
          id?: string
          is_visible?: boolean | null
          issue_date?: string | null
          issuing_organization?: string
          logo_url?: string | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      resume_education: {
        Row: {
          activities: string[] | null
          created_at: string
          degree: string
          description: string | null
          display_order: number | null
          end_date: string | null
          field_of_study: string | null
          gpa: string | null
          grade: string | null
          id: string
          is_visible: boolean | null
          location: string | null
          school: string
          school_logo_url: string | null
          school_url: string | null
          start_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          activities?: string[] | null
          created_at?: string
          degree: string
          description?: string | null
          display_order?: number | null
          end_date?: string | null
          field_of_study?: string | null
          gpa?: string | null
          grade?: string | null
          id?: string
          is_visible?: boolean | null
          location?: string | null
          school: string
          school_logo_url?: string | null
          school_url?: string | null
          start_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          activities?: string[] | null
          created_at?: string
          degree?: string
          description?: string | null
          display_order?: number | null
          end_date?: string | null
          field_of_study?: string | null
          gpa?: string | null
          grade?: string | null
          id?: string
          is_visible?: boolean | null
          location?: string | null
          school?: string
          school_logo_url?: string | null
          school_url?: string | null
          start_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      resume_work_experiences: {
        Row: {
          achievements: string[] | null
          company: string
          company_logo_url: string | null
          company_url: string | null
          created_at: string
          description: string | null
          display_order: number | null
          employment_type: string | null
          end_date: string | null
          id: string
          is_current: boolean | null
          is_featured: boolean | null
          is_visible: boolean | null
          location: string | null
          start_date: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          achievements?: string[] | null
          company: string
          company_logo_url?: string | null
          company_url?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          employment_type?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          is_featured?: boolean | null
          is_visible?: boolean | null
          location?: string | null
          start_date: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          achievements?: string[] | null
          company?: string
          company_logo_url?: string | null
          company_url?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          employment_type?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          is_featured?: boolean | null
          is_visible?: boolean | null
          location?: string | null
          start_date?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      skill_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          icon: string
          id: string
          is_active: boolean
          label: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon: string
          id?: string
          is_active?: boolean
          label: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string
          id?: string
          is_active?: boolean
          label?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category_id: string
          color: string
          created_at: string
          description: string | null
          display_order: number
          icon: string
          id: string
          is_featured: boolean
          name: string
          proficiency: number
          updated_at: string
        }
        Insert: {
          category_id: string
          color?: string
          created_at?: string
          description?: string | null
          display_order?: number
          icon: string
          id?: string
          is_featured?: boolean
          name: string
          proficiency: number
          updated_at?: string
        }
        Update: {
          category_id?: string
          color?: string
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string
          id?: string
          is_featured?: boolean
          name?: string
          proficiency?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "skill_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      technologies: {
        Row: {
          category: string | null
          color: string
          created_at: string
          display_order: number
          icon: string
          id: string
          is_active: boolean
          label: string
          name: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          color?: string
          created_at?: string
          display_order?: number
          icon?: string
          id?: string
          is_active?: boolean
          label: string
          name: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          color?: string
          created_at?: string
          display_order?: number
          icon?: string
          id?: string
          is_active?: boolean
          label?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      projects_with_categories: {
        Row: {
          category_color: string | null
          category_icon: string | null
          category_id: string | null
          category_label: string | null
          category_name: string | null
          created_at: string | null
          demo_url: string | null
          description: string | null
          display_order: number | null
          end_date: string | null
          forks: number | null
          github_url: string | null
          id: string | null
          image_url: string | null
          is_featured: boolean | null
          long_description: string | null
          slug: string | null
          stars: number | null
          start_date: string | null
          status: string | null
          tags: string[] | null
          technologies: string[] | null
          title: string | null
          updated_at: string | null
          views: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "project_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      projects_with_tech_count: {
        Row: {
          category_id: string | null
          created_at: string | null
          demo_url: string | null
          description: string | null
          display_order: number | null
          end_date: string | null
          forks: number | null
          github_url: string | null
          id: string | null
          image_url: string | null
          is_featured: boolean | null
          long_description: string | null
          slug: string | null
          stars: number | null
          start_date: string | null
          status: string | null
          tags: string[] | null
          technologies: string[] | null
          technology_count: number | null
          title: string | null
          updated_at: string | null
          views: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "project_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_active_certifications: {
        Row: {
          created_at: string | null
          credential_id: string | null
          credential_url: string | null
          description: string | null
          display_order: number | null
          does_not_expire: boolean | null
          expiry_date: string | null
          id: string | null
          is_active: boolean | null
          is_visible: boolean | null
          issue_date: string | null
          issuing_organization: string | null
          logo_url: string | null
          name: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          credential_id?: string | null
          credential_url?: string | null
          description?: string | null
          display_order?: number | null
          does_not_expire?: boolean | null
          expiry_date?: string | null
          id?: string | null
          is_active?: never
          is_visible?: boolean | null
          issue_date?: string | null
          issuing_organization?: string | null
          logo_url?: string | null
          name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          credential_id?: string | null
          credential_url?: string | null
          description?: string | null
          display_order?: number | null
          does_not_expire?: boolean | null
          expiry_date?: string | null
          id?: string | null
          is_active?: never
          is_visible?: boolean | null
          issue_date?: string | null
          issuing_organization?: string | null
          logo_url?: string | null
          name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      resume_current_work_experience: {
        Row: {
          achievements: string[] | null
          company: string | null
          company_logo_url: string | null
          company_url: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          employment_type: string | null
          end_date: string | null
          id: string | null
          is_current: boolean | null
          is_featured: boolean | null
          is_visible: boolean | null
          location: string | null
          start_date: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
          years_in_role: number | null
        }
        Insert: {
          achievements?: string[] | null
          company?: string | null
          company_logo_url?: string | null
          company_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          employment_type?: string | null
          end_date?: string | null
          id?: string | null
          is_current?: boolean | null
          is_featured?: boolean | null
          is_visible?: boolean | null
          location?: string | null
          start_date?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          years_in_role?: never
        }
        Update: {
          achievements?: string[] | null
          company?: string | null
          company_logo_url?: string | null
          company_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          employment_type?: string | null
          end_date?: string | null
          id?: string | null
          is_current?: boolean | null
          is_featured?: boolean | null
          is_visible?: boolean | null
          location?: string | null
          start_date?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          years_in_role?: never
        }
        Relationships: []
      }
      resume_education_with_period: {
        Row: {
          activities: string[] | null
          created_at: string | null
          degree: string | null
          description: string | null
          display_order: number | null
          end_date: string | null
          field_of_study: string | null
          gpa: string | null
          grade: string | null
          id: string | null
          is_visible: boolean | null
          location: string | null
          period: string | null
          school: string | null
          school_logo_url: string | null
          school_url: string | null
          start_date: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          activities?: string[] | null
          created_at?: string | null
          degree?: string | null
          description?: string | null
          display_order?: number | null
          end_date?: string | null
          field_of_study?: string | null
          gpa?: string | null
          grade?: string | null
          id?: string | null
          is_visible?: boolean | null
          location?: string | null
          period?: never
          school?: string | null
          school_logo_url?: string | null
          school_url?: string | null
          start_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          activities?: string[] | null
          created_at?: string | null
          degree?: string | null
          description?: string | null
          display_order?: number | null
          end_date?: string | null
          field_of_study?: string | null
          gpa?: string | null
          grade?: string | null
          id?: string | null
          is_visible?: boolean | null
          location?: string | null
          period?: never
          school?: string | null
          school_logo_url?: string | null
          school_url?: string | null
          start_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      resume_work_experiences_with_duration: {
        Row: {
          achievements: string[] | null
          company: string | null
          company_logo_url: string | null
          company_url: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          employment_type: string | null
          end_date: string | null
          id: string | null
          is_current: boolean | null
          is_featured: boolean | null
          is_visible: boolean | null
          location: string | null
          months_duration: number | null
          period: string | null
          start_date: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          achievements?: string[] | null
          company?: string | null
          company_logo_url?: string | null
          company_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          employment_type?: string | null
          end_date?: string | null
          id?: string | null
          is_current?: boolean | null
          is_featured?: boolean | null
          is_visible?: boolean | null
          location?: string | null
          months_duration?: never
          period?: never
          start_date?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          achievements?: string[] | null
          company?: string | null
          company_logo_url?: string | null
          company_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          employment_type?: string | null
          end_date?: string | null
          id?: string | null
          is_current?: boolean | null
          is_featured?: boolean | null
          is_visible?: boolean | null
          location?: string | null
          months_duration?: never
          period?: never
          start_date?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      skills_section_settings: {
        Row: {
          id: string | null
          skills_description: string | null
          skills_title: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string | null
          skills_description?: string | null
          skills_title?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string | null
          skills_description?: string | null
          skills_title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      skills_with_categories: {
        Row: {
          category_icon: string | null
          category_label: string | null
          category_name: string | null
          color: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: string | null
          is_featured: boolean | null
          name: string | null
          proficiency: number | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_active_categories_count: { Args: never; Returns: number }
      get_featured_projects: {
        Args: { limit_count?: number }
        Returns: {
          category_color: string | null
          category_icon: string | null
          category_id: string | null
          category_label: string | null
          category_name: string | null
          created_at: string | null
          demo_url: string | null
          description: string | null
          display_order: number | null
          end_date: string | null
          forks: number | null
          github_url: string | null
          id: string | null
          image_url: string | null
          is_featured: boolean | null
          long_description: string | null
          slug: string | null
          stars: number | null
          start_date: string | null
          status: string | null
          tags: string[] | null
          technologies: string[] | null
          title: string | null
          updated_at: string | null
          views: number | null
        }[]
        SetofOptions: {
          from: "*"
          to: "projects_with_categories"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_projects_by_category: {
        Args: { category_name: string }
        Returns: {
          category_color: string | null
          category_icon: string | null
          category_id: string | null
          category_label: string | null
          category_name: string | null
          created_at: string | null
          demo_url: string | null
          description: string | null
          display_order: number | null
          end_date: string | null
          forks: number | null
          github_url: string | null
          id: string | null
          image_url: string | null
          is_featured: boolean | null
          long_description: string | null
          slug: string | null
          stars: number | null
          start_date: string | null
          status: string | null
          tags: string[] | null
          technologies: string[] | null
          title: string | null
          updated_at: string | null
          views: number | null
        }[]
        SetofOptions: {
          from: "*"
          to: "projects_with_categories"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      search_projects: {
        Args: { search_term: string }
        Returns: {
          category_color: string | null
          category_icon: string | null
          category_id: string | null
          category_label: string | null
          category_name: string | null
          created_at: string | null
          demo_url: string | null
          description: string | null
          display_order: number | null
          end_date: string | null
          forks: number | null
          github_url: string | null
          id: string | null
          image_url: string | null
          is_featured: boolean | null
          long_description: string | null
          slug: string | null
          stars: number | null
          start_date: string | null
          status: string | null
          tags: string[] | null
          technologies: string[] | null
          title: string | null
          updated_at: string | null
          views: number | null
        }[]
        SetofOptions: {
          from: "*"
          to: "projects_with_categories"
          isOneToOne: false
          isSetofReturn: true
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
