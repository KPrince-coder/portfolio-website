import React from 'react';
import { Download, MapPin, Calendar, Briefcase, GraduationCap, Award, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Resume: React.FC = () => {
  const experiences = [
    {
      title: "Senior Data Engineer",
      company: "TechCorp AI",
      location: "San Francisco, CA",
      period: "2022 - Present",
      description: "Led the development of ML pipelines processing 100TB+ daily data, reducing processing time by 60% through optimized Apache Spark jobs.",
      achievements: [
        "Built real-time streaming architecture using Kafka and Flink",
        "Implemented MLOps practices with Kubeflow and MLflow",
        "Mentored 3 junior engineers in data engineering best practices"
      ]
    },
    {
      title: "Data Scientist",
      company: "DataFlow Solutions",
      location: "New York, NY",
      period: "2020 - 2022",
      description: "Developed predictive models and data visualization dashboards that increased client revenue by 25% on average.",
      achievements: [
        "Created automated reporting systems using Python and Power BI",
        "Designed A/B testing framework for product optimization",
        "Built recommendation engine serving 1M+ users daily"
      ]
    },
    {
      title: "Frontend Developer",
      company: "WebTech Studio",
      location: "Remote",
      period: "2019 - 2020",
      description: "Built responsive web applications using React and modern JavaScript frameworks.",
      achievements: [
        "Developed 10+ client applications with 99.9% uptime",
        "Optimized application performance reducing load times by 40%",
        "Collaborated with UX/UI teams on user-centered design"
      ]
    }
  ];

  const education = [
    {
      degree: "Master of Science in Data Science",
      school: "Stanford University",
      location: "Stanford, CA",
      period: "2017 - 2019",
      gpa: "3.8/4.0"
    },
    {
      degree: "Bachelor of Science in Computer Science",
      school: "UC Berkeley",
      location: "Berkeley, CA",
      period: "2013 - 2017",
      gpa: "3.6/4.0"
    }
  ];

  const certifications = [
    "AWS Certified Solutions Architect - Professional",
    "Google Cloud Professional Data Engineer",
    "Certified Kubernetes Application Developer (CKAD)",
    "MongoDB Certified Developer Associate"
  ];

  return (
    <section id="resume" className="py-20 bg-card/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-4">Professional Resume</h2>
          <p className="text-muted text-lg max-w-2xl mx-auto mb-8">
            A comprehensive overview of my professional journey in data engineering, AI, and software development
          </p>
          <Button className="neural-glow" size="lg">
            <Download className="w-5 h-5 mr-2" />
            Download PDF Resume
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Experience */}
            <Card className="card-neural">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="w-6 h-6 text-secondary" />
                  <span>Professional Experience</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {experiences.map((exp, index) => (
                  <div key={index} className="relative">
                    {index !== experiences.length - 1 && (
                      <div className="absolute left-0 top-8 w-px h-full bg-border" />
                    )}
                    <div className="flex items-start space-x-4">
                      <div className="w-3 h-3 bg-secondary rounded-full mt-2 relative z-10" />
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                          <h3 className="font-semibold text-lg text-neural">{exp.title}</h3>
                          <div className="flex items-center space-x-2 text-sm text-muted">
                            <Calendar className="w-4 h-4" />
                            <span>{exp.period}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 mb-3">
                          <span className="font-medium text-secondary">{exp.company}</span>
                          <div className="flex items-center space-x-1 text-sm text-muted">
                            <MapPin className="w-4 h-4" />
                            <span>{exp.location}</span>
                          </div>
                        </div>
                        <p className="text-muted mb-4">{exp.description}</p>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, achIndex) => (
                            <li key={achIndex} className="flex items-start space-x-2">
                              <div className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="card-neural">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="w-6 h-6 text-accent" />
                  <span>Education</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {education.map((edu, index) => (
                  <div key={index} className="relative">
                    {index !== education.length - 1 && (
                      <div className="absolute left-0 top-8 w-px h-16 bg-border" />
                    )}
                    <div className="flex items-start space-x-4">
                      <div className="w-3 h-3 bg-accent rounded-full mt-2 relative z-10" />
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                          <h3 className="font-semibold text-lg text-neural">{edu.degree}</h3>
                          <div className="flex items-center space-x-2 text-sm text-muted">
                            <Calendar className="w-4 h-4" />
                            <span>{edu.period}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 mb-2">
                          <span className="font-medium text-accent">{edu.school}</span>
                          <div className="flex items-center space-x-1 text-sm text-muted">
                            <MapPin className="w-4 h-4" />
                            <span>{edu.location}</span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          GPA: {edu.gpa}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Certifications */}
            <Card className="card-neural neural-glow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-6 h-6 text-warning" />
                  <span>Certifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{cert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="card-neural neural-glow">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary mb-1">5+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-1">50+</div>
                  <div className="text-sm text-muted-foreground">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-warning mb-1">15+</div>
                  <div className="text-sm text-muted-foreground">Technologies Mastered</div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="card-neural">
              <CardHeader>
                <CardTitle>Let's Connect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    LinkedIn Profile
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="https://github.com/yourprofile" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    GitHub Portfolio
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;