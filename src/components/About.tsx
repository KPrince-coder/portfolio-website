import React from 'react';
import { Code, Database, Brain, Smartphone, Award, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const About: React.FC = () => {
  const experiences = [
    {
      year: '2024',
      title: 'Senior AI Engineer',
      company: 'TechFlow AI',
      description: 'Leading development of large-scale machine learning pipelines processing 10TB+ daily data',
      icon: Brain,
      color: 'text-secondary'
    },
    {
      year: '2022',
      title: 'Data Engineering Lead',
      company: 'DataCorp Solutions',
      description: 'Built real-time analytics platforms serving 1M+ users with 99.9% uptime',
      icon: Database,
      color: 'text-accent'
    },
    {
      year: '2020',
      title: 'Full-Stack Developer',
      company: 'InnovateX',
      description: 'Developed AI-powered mobile applications with advanced computer vision capabilities',
      icon: Smartphone,
      color: 'text-success'
    },
    {
      year: '2019',
      title: 'Software Engineer',
      company: 'StartupHub',
      description: 'Created scalable web applications using React, Node.js, and cloud technologies',
      icon: Code,
      color: 'text-warning'
    }
  ];

  const achievements = [
    { label: 'AI Models Deployed', value: '50+' },
    { label: 'Data Processed (TB)', value: '100+' },
    { label: 'Projects Completed', value: '75+' },
    { label: 'Years Experience', value: '5+' }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="heading-xl mb-6">
            About <span className="text-neural">Alex</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-secondary mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            I'm passionate about turning complex data challenges into elegant, scalable solutions. 
            With expertise spanning from neural network architectures to distributed systems, 
            I bridge the gap between cutting-edge research and production-ready applications.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Experience Timeline */}
          <div className="space-y-8">
            <h3 className="heading-md text-center lg:text-left mb-8">Professional Journey</h3>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary via-accent to-success"></div>
              
              {experiences.map((exp, index) => (
                <div key={index} className="relative flex items-start space-x-6 pb-8 last:pb-0">
                  <div className={`relative z-10 w-16 h-16 rounded-full bg-gradient-neural flex items-center justify-center shadow-glow-secondary`}>
                    <exp.icon className={`w-8 h-8 ${exp.color}`} />
                  </div>
                  
                  <div className="flex-1 pt-2">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm font-mono text-secondary bg-secondary/10 px-3 py-1 rounded-full">
                        {exp.year}
                      </span>
                      <MapPin className="w-4 h-4 text-muted" />
                    </div>
                    <h4 className="text-xl font-semibold text-foreground mb-1">{exp.title}</h4>
                    <p className="text-secondary font-medium mb-2">{exp.company}</p>
                    <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats & Philosophy */}
          <div className="space-y-8">
            <Card className="card-neural neural-glow">
              <CardContent className="p-8">
                <h3 className="heading-md text-center mb-8">Impact Metrics</h3>
                <div className="grid grid-cols-2 gap-6">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="text-center p-4 rounded-lg bg-background/50">
                      <div className="text-3xl font-bold text-neural mb-2">{achievement.value}</div>
                      <div className="text-sm text-muted-foreground">{achievement.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="card-neural neural-glow">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Award className="w-6 h-6 text-accent" />
                  <h3 className="text-xl font-semibold">Philosophy</h3>
                </div>
                <blockquote className="text-lg italic text-muted-foreground leading-relaxed border-l-4 border-secondary pl-6">
                  "The future belongs to those who can seamlessly blend human creativity 
                  with artificial intelligence. I strive to create systems that don't 
                  just process data, but augment human potential."
                </blockquote>
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                  <div className="text-sm text-muted">
                    <div className="font-semibold text-foreground">Alex Neural</div>
                    <div>Data & AI Engineer</div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;