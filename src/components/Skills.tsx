import React, { useState } from 'react';
import { 
  Database, 
  Brain, 
  Code, 
  Smartphone, 
  Cloud, 
  BarChart3,
  Zap,
  Shield,
  Cpu,
  GitBranch
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Skills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const skillCategories = [
    { id: 'all', label: 'All Skills', icon: Zap },
    { id: 'ai', label: 'AI & ML', icon: Brain },
    { id: 'data', label: 'Data Engineering', icon: Database },
    { id: 'frontend', label: 'Frontend', icon: Code },
    { id: 'mobile', label: 'Mobile', icon: Smartphone },
  ];

  const skills = [
    // AI & ML
    {
      category: 'ai',
      name: 'TensorFlow',
      proficiency: 95,
      description: 'Deep learning models and neural networks',
      icon: Brain,
      color: 'text-secondary'
    },
    {
      category: 'ai',
      name: 'PyTorch',
      proficiency: 90,
      description: 'Research-focused ML and computer vision',
      icon: Brain,
      color: 'text-accent'
    },
    {
      category: 'ai',
      name: 'Scikit-learn',
      proficiency: 88,
      description: 'Classical ML algorithms and preprocessing',
      icon: BarChart3,
      color: 'text-success'
    },
    
    // Data Engineering
    {
      category: 'data',
      name: 'Apache Spark',
      proficiency: 92,
      description: 'Large-scale data processing and analytics',
      icon: Zap,
      color: 'text-secondary'
    },
    {
      category: 'data',
      name: 'PostgreSQL',
      proficiency: 85,
      description: 'Advanced SQL and database optimization',
      icon: Database,
      color: 'text-accent'
    },
    {
      category: 'data',
      name: 'Apache Kafka',
      proficiency: 80,
      description: 'Real-time data streaming and messaging',
      icon: Cpu,
      color: 'text-warning'
    },
    
    // Frontend
    {
      category: 'frontend',
      name: 'React',
      proficiency: 93,
      description: 'Modern UI development and state management',
      icon: Code,
      color: 'text-secondary'
    },
    {
      category: 'frontend',
      name: 'TypeScript',
      proficiency: 87,
      description: 'Type-safe JavaScript development',
      icon: Shield,
      color: 'text-accent'
    },
    {
      category: 'frontend',
      name: 'Next.js',
      proficiency: 85,
      description: 'Full-stack React applications',
      icon: GitBranch,
      color: 'text-success'
    },
    
    // Mobile
    {
      category: 'mobile',
      name: 'React Native',
      proficiency: 82,
      description: 'Cross-platform mobile development',
      icon: Smartphone,
      color: 'text-secondary'
    },
    {
      category: 'mobile',
      name: 'Flutter',
      proficiency: 78,
      description: 'Beautiful native mobile apps',
      icon: Smartphone,
      color: 'text-accent'
    },
    
    // Cloud & DevOps
    {
      category: 'data',
      name: 'AWS',
      proficiency: 90,
      description: 'Cloud infrastructure and ML services',
      icon: Cloud,
      color: 'text-warning'
    }
  ];

  const filteredSkills = activeCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === activeCategory);

  return (
    <section id="skills" className="py-20 bg-gradient-to-b from-background/50 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="heading-xl mb-6">
            Technical <span className="text-neural">Expertise</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-secondary mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A comprehensive toolkit for building intelligent systems, from data pipelines 
            to user interfaces. Each skill represents hundreds of hours of hands-on experience 
            and continuous learning.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {skillCategories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className={`neural-glow ${activeCategory === category.id ? 'shadow-glow-secondary' : ''}`}
            >
              <category.icon className="w-4 h-4 mr-2" />
              {category.label}
            </Button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, index) => (
            <Card 
              key={skill.name} 
              className="card-neural neural-glow group hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-neural`}>
                      <skill.icon className={`w-6 h-6 ${skill.color}`} />
                    </div>
                    <span className="text-lg">{skill.name}</span>
                  </div>
                  <span className="text-sm font-mono text-secondary">
                    {skill.proficiency}%
                  </span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {skill.description}
                </p>
                
                {/* Proficiency Bar */}
                <div className="space-y-2">
                  <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-secondary rounded-full transition-all duration-1000 ease-out group-hover:shadow-glow-secondary"
                      style={{ 
                        width: `${skill.proficiency}%`,
                        animation: `data-flow 3s ease-in-out infinite`,
                        animationDelay: `${index * 0.2}s`
                      }}
                    />
                  </div>
                  
                  {/* Neural Network Visualization */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all duration-500 ${
                            i < Math.floor(skill.proficiency / 20) 
                              ? 'bg-secondary shadow-glow-secondary' 
                              : 'bg-border'
                          }`}
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-muted font-mono">
                      Expert Level
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <Card className="card-neural max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h3 className="heading-md mb-6">Continuous Learning</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The field of AI and data engineering evolves rapidly. I dedicate time each week 
                to exploring new frameworks, contributing to open source projects, and 
                experimenting with cutting-edge technologies.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center space-x-2 text-sm text-secondary">
                  <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                  <span>Currently learning: JAX & MLX</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-accent">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                  <span>Exploring: Rust for ML</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-success">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span>Researching: Edge AI</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Skills;