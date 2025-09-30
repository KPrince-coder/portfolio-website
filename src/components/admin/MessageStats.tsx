import React from 'react';
import { 
  Mail, 
  MessageSquare, 
  Clock, 
  TrendingUp, 
  Calendar,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageStatsProps } from './types';

const MessageStats: React.FC<MessageStatsProps> = ({
  totalMessages,
  unreadMessages,
  repliedMessages,
  averageResponseTime,
  messagesThisWeek,
  messagesThisMonth,
}) => {
  const responseRate = totalMessages > 0 ? Math.round((repliedMessages / totalMessages) * 100) : 0;
  const unreadRate = totalMessages > 0 ? Math.round((unreadMessages / totalMessages) * 100) : 0;

  const formatResponseTime = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)}m`;
    } else if (hours < 24) {
      return `${Math.round(hours)}h`;
    } else {
      return `${Math.round(hours / 24)}d`;
    }
  };

  const stats = [
    {
      title: 'Total Messages',
      value: totalMessages,
      icon: Mail,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      description: 'All time messages',
    },
    {
      title: 'Unread Messages',
      value: unreadMessages,
      icon: MessageSquare,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      description: `${unreadRate}% of total`,
      badge: unreadMessages > 0 ? 'Needs attention' : 'All caught up',
      badgeVariant: unreadMessages > 0 ? 'accent' : 'secondary',
    },
    {
      title: 'Response Rate',
      value: `${responseRate}%`,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      description: `${repliedMessages} replied`,
    },
    {
      title: 'Avg Response Time',
      value: formatResponseTime(averageResponseTime),
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      description: 'Average time to reply',
    },
    {
      title: 'This Week',
      value: messagesThisWeek,
      icon: Calendar,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      description: 'Messages received',
    },
    {
      title: 'This Month',
      value: messagesThisMonth,
      icon: BarChart3,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      description: 'Monthly total',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

export default MessageStats;
