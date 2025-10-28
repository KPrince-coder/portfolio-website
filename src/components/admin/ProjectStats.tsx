import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Eye, TrendingUp, Clock, CalendarDays, BarChart2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ProjectStatsProps } from './types';

const ProjectStats: React.FC<ProjectStatsProps> = ({
  totalProjects,
  publishedProjects,
  draftProjects,
  totalViews,
  averageViewsPerProject,
  mostViewedProjectTitle,
  projectsThisWeek,
  projectsThisMonth,
}) => {
  const publishedRate = totalProjects > 0 ? Math.round((publishedProjects / totalProjects) * 100) : 0;
  const draftRate = totalProjects > 0 ? Math.round((draftProjects / totalProjects) * 100) : 0;

  const stats = [
    {
      title: 'Total Projects',
      value: totalProjects,
      icon: Briefcase,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      description: 'All time projects',
    },
    {
      title: 'Published Projects',
      value: publishedProjects,
      icon: Eye,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      description: `${publishedRate}% of total`,
      badge: publishedProjects > 0 ? 'Live' : 'No live projects',
      badgeVariant: publishedProjects > 0 ? 'default' : 'secondary',
    },
    {
      title: 'Draft Projects',
      value: draftProjects,
      icon: CalendarDays,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      description: `${draftRate}% of total`,
      badge: draftProjects > 0 ? 'In progress' : 'All published',
      badgeVariant: draftProjects > 0 ? 'accent' : 'secondary',
    },
    {
      title: 'Total Project Views',
      value: totalViews,
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      description: 'Across all projects',
    },
    {
      title: 'Avg. Views per Project',
      value: averageViewsPerProject.toFixed(1),
      icon: BarChart2,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      description: 'Average engagement',
    },
    {
      title: 'Most Viewed Project',
      value: mostViewedProjectTitle || 'N/A',
      icon: Clock,
      color: 'text-teal-500',
      bgColor: 'bg-teal-500/10',
      description: 'Highest engagement',
    },
    {
      title: 'Projects This Week',
      value: projectsThisWeek,
      icon: CalendarDays,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      description: 'New projects created',
    },
    {
      title: 'Projects This Month',
      value: projectsThisMonth,
      icon: BarChart2,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
      description: 'Monthly project creation',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="card-neural neural-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  {stat.badge && (
                    <Badge variant={stat.badgeVariant as any} className="text-xs">
                      {stat.badge}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-3xl font-bold text-neural">
                    {stat.value}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectStats;
