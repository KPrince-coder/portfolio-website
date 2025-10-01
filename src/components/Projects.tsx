import React, { useState, useEffect } from 'react';
import { ExternalLink, Github, Play, Brain, Database, Smartphone, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Database as SupabaseDatabase } from '@/integrations/supabase/types';

type ProjectRow = SupabaseDatabase['public']['Tables']['projects']['Row'];
type ProjectMetric = { label: string; value: string };

const Projects: React.FC = () => {
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(['All']); // Initialize with 'All'

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .order('sort_order', { ascending: true });

        if (projectsError) {
          throw projectsError;
        }
        setProjects(projectsData || []);

        const { data: categoriesData, error: categoriesError } = await supabase
          .from('projects_categories')
          .select('*') // Select all columns to get the icon
          .order('name', { ascending: true });

        if (categoriesError) {
          throw categoriesError;
        }
        setCategories(['All', ...(categoriesData?.map(cat => cat.name) || [])]);

        // Store category icons for later use
        const iconsMap = new Map<string, string>();
        categoriesData?.forEach(cat => {
          if (cat.name && cat.icon) {
            iconsMap.set(cat.name, cat.icon);
          }
        });
        setCategoryIcons(iconsMap);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [activeCategory, setActiveCategory] = useState('All');
  const [categoryIcons, setCategoryIcons] = useState<Map<string, string>>(new Map());

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  const getCategoryIcon = (categoryName: string) => {
    const iconName = categoryIcons.get(categoryName);
    switch (iconName) {
      case 'Brain': return Brain;
      case 'Smartphone': return Smartphone;
      case 'Database': return Database;
      case 'Play': return Play;
      case 'TrendingUp': return TrendingUp;
      case 'Award': return Award;
      case 'Github': return Github;
      case 'ExternalLink': return ExternalLink;
      default: return Award; // Default icon
    }
  };

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg text-muted-foreground">Loading projects...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="py-20 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg text-destructive">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="heading-xl mb-6">
            Featured <span className="text-neural">Projects</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-secondary mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Showcasing innovative solutions that bridge the gap between cutting-edge AI research 
            and real-world applications. Each project demonstrates scalability, performance, 
            and measurable business impact.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className={`neural-glow ${activeCategory === category ? 'shadow-glow-secondary' : ''}`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProjects.map((project, index) => {
            const CategoryIcon = getCategoryIcon(project.category);
            
            return (
              <Card 
                key={project.id} 
                className={`card-neural neural-glow group hover:scale-105 transition-all duration-500 cursor-pointer relative overflow-hidden border border-primary/20 shadow-lg hover:shadow-xl hover:border-secondary animate-fadeInUp ${
                  project.featured ? 'md:col-span-2 lg:col-span-2 xl:col-span-2' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setActiveProject(activeProject === project.id ? null : project.id)}
              >
                <div className="relative overflow-hidden h-56">
                  <img
                    src={project.image_url || '/placeholder.svg'} // Use image_url from DB
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Project Status & Category Badge */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-success/20 text-success border-success/50 backdrop-blur-sm"
                    >
                      {project.status}
                    </Badge>
                    {project.featured && (
                      <Badge
                        variant="secondary"
                        className="bg-accent/20 text-accent border-accent/50 backdrop-blur-sm"
                      >
                        Featured
                      </Badge>
                    )}
                    {project.duration && (
                      <Badge
                        variant="secondary"
                        className="bg-warning/20 text-warning border-warning/50 backdrop-blur-sm"
                      >
                        {project.duration} days
                      </Badge>
                    )}
                  </div>

                  {/* Category Icon */}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-neural rounded-lg flex items-center justify-center shadow-glow-secondary">
                    <CategoryIcon className="w-5 h-5 text-white" />
                  </div>

                  {/* Overlay with quick actions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <div className="flex gap-3">
                      {project.github_url && (
                        <Button size="sm" variant="neural" onClick={(e) => { e.stopPropagation(); window.open(project.github_url!, '_blank'); }}>
                          <Github className="w-4 h-4 mr-2" />
                          Code
                        </Button>
                      )}
                      {project.demo_url && (
                        <Button size="sm" variant="accent" onClick={(e) => { e.stopPropagation(); window.open(project.demo_url!, '_blank'); }}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Demo
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold group-hover:text-secondary transition-colors">
                      {project.title}
                    </h3>
                    <TrendingUp className="w-5 h-5 text-success" />
                  </div>
                  <p className="text-sm text-secondary font-medium mb-2">{project.category}</p>
                  {project.start_date && project.end_date && (
                    <p className="text-xs text-muted-foreground mb-2">
                      {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
                    </p>
                  )}
                  <p className="text-muted-foreground leading-relaxed">
                    {activeProject === project.id ? project.long_description : project.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    {(project.metrics as ProjectMetric[] || []).map((metric, idx) => (
                      <div key={idx} className="text-center p-3 rounded-lg bg-background/50">
                        <div className="text-lg font-bold text-neural">{metric.value}</div>
                        <div className="text-xs text-muted-foreground">{metric.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Technologies */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {(project.technologies || []).map((tech) => (
                        <Badge 
                          key={tech} 
                          variant="outline" 
                          className="text-xs border-secondary/30 hover:border-secondary transition-colors"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    {project.github_url && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(project.github_url!, '_blank');
                        }}
                      >
                        <Github className="w-4 h-4 mr-2" />
                        View Code
                      </Button>
                    )}
                    {project.demo_url && (
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(project.demo_url!, '_blank');
                        }}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Live Demo
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="card-neural max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="heading-md mb-4">Want to see more?</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                These projects represent just a fraction of my work. I'm constantly experimenting 
                with new technologies and building solutions that push the boundaries of what's possible.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="neural" size="lg">
                  <Github className="w-5 h-5 mr-2" />
                  View All Projects
                </Button>
                <Button variant="outline" size="lg">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Case Studies
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Projects;
