import React, { useState } from 'react';
import { ExternalLink, Github, Play, Brain, Database, Smartphone, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Import project images
import neuralDashboard from '@/assets/project-neural-dashboard.jpg';
import aiAssistant from '@/assets/project-ai-assistant.jpg';
import dataPipeline from '@/assets/project-data-pipeline.jpg';

const Projects: React.FC = () => {
  const [activeProject, setActiveProject] = useState<number | null>(null);

  const projects = [
    {
      id: 1,
      title: 'Neural Analytics Dashboard',
      category: 'AI/ML',
      description: 'Real-time machine learning insights platform processing 10TB+ daily data with advanced neural network visualization and predictive analytics.',
      longDescription: 'Built a comprehensive analytics platform that transforms complex ML model outputs into intuitive visualizations. Features real-time data processing with Apache Spark, custom neural network architectures for anomaly detection, and interactive dashboards built with React and D3.js. Achieved 40% improvement in decision-making speed for data science teams.',
      image: neuralDashboard,
      technologies: ['Python', 'TensorFlow', 'React', 'Apache Spark', 'PostgreSQL', 'Docker'],
      metrics: [
        { label: 'Data Processed', value: '10TB/day' },
        { label: 'Model Accuracy', value: '94.2%' },
        { label: 'Response Time', value: '<200ms' },
        { label: 'Users', value: '1000+' }
      ],
      github: 'https://github.com/alexneural/neural-dashboard',
      demo: 'https://neural-dashboard.alexneural.dev',
      featured: true,
      status: 'Production'
    },
    {
      id: 2,
      title: 'AI-Powered Personal Assistant',
      category: 'Mobile/AI',
      description: 'Cross-platform mobile application with advanced NLP capabilities, voice recognition, and smart home integration using Flutter and custom ML models.',
      longDescription: 'Developed an intelligent mobile assistant that understands natural language commands and integrates with IoT devices. Implemented custom transformer models for intent recognition, real-time speech processing, and context-aware responses. The app features offline capabilities and privacy-first design with on-device ML processing.',
      image: aiAssistant,
      technologies: ['Flutter', 'PyTorch', 'Node.js', 'TensorFlow Lite', 'Firebase', 'WebRTC'],
      metrics: [
        { label: 'Recognition Accuracy', value: '97.5%' },
        { label: 'Response Time', value: '1.2s' },
        { label: 'Downloads', value: '50K+' },
        { label: 'Rating', value: '4.8/5' }
      ],
      github: 'https://github.com/alexneural/ai-assistant',
      demo: 'https://apps.apple.com/ai-assistant',
      featured: true,
      status: 'Production'
    },
    {
      id: 3,
      title: 'Distributed Data Pipeline',
      category: 'Data Engineering',
      description: 'Scalable real-time data processing system using Apache Kafka, handling millions of events per second with fault tolerance and monitoring.',
      longDescription: 'Architected and implemented a robust data pipeline capable of processing streaming data from multiple sources. Built with microservices architecture, featuring automated scaling, dead letter queues, and comprehensive monitoring. Reduced data processing latency by 75% and improved system reliability to 99.95% uptime.',
      image: dataPipeline,
      technologies: ['Apache Kafka', 'Python', 'Kubernetes', 'Elasticsearch', 'Redis', 'Grafana'],
      metrics: [
        { label: 'Events/Second', value: '2M+' },
        { label: 'Latency Reduction', value: '75%' },
        { label: 'Uptime', value: '99.95%' },
        { label: 'Cost Savings', value: '$100K/yr' }
      ],
      github: 'https://github.com/alexneural/data-pipeline',
      demo: 'https://pipeline-demo.alexneural.dev',
      featured: false,
      status: 'Production'
    }
  ];

  const categories = ['All', 'AI/ML', 'Mobile/AI', 'Data Engineering'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI/ML': return Brain;
      case 'Mobile/AI': return Smartphone;
      case 'Data Engineering': return Database;
      default: return Award;
    }
  };

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
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => {
            const CategoryIcon = getCategoryIcon(project.category);
            
            return (
              <Card 
                key={project.id} 
                className={`card-neural neural-glow group hover:scale-105 transition-all duration-500 cursor-pointer ${
                  project.featured ? 'lg:col-span-2 xl:col-span-2' : ''
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
                onClick={() => setActiveProject(activeProject === project.id ? null : project.id)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
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
                  </div>

                  {/* Category Icon */}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-neural rounded-lg flex items-center justify-center shadow-glow-secondary">
                    <CategoryIcon className="w-5 h-5 text-white" />
                  </div>

                  {/* Overlay with quick actions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <div className="flex gap-3">
                      <Button size="sm" variant="neural">
                        <Github className="w-4 h-4 mr-2" />
                        Code
                      </Button>
                      <Button size="sm" variant="accent">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Demo
                      </Button>
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
                  <p className="text-muted-foreground leading-relaxed">
                    {activeProject === project.id ? project.longDescription : project.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    {project.metrics.map((metric, idx) => (
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
                      {project.technologies.map((tech) => (
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.github, '_blank');
                      }}
                    >
                      <Github className="w-4 h-4 mr-2" />
                      View Code
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.demo, '_blank');
                      }}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Live Demo
                    </Button>
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