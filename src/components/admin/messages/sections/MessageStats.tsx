/**
 * Message Stats Component
 *
 * Modern statistics dashboard for message analytics
 *
 * @module messages/sections/MessageStats
 */

import React from "react";
import {
  Mail,
  MessageSquare,
  Clock,
  TrendingUp,
  Calendar,
  BarChart3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMessageStats } from "../hooks/useMessageStats";
import type { MessageStatsProps } from "../types";

// ============================================================================
// HELPERS
// ============================================================================

function formatResponseTime(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)}m`;
  } else if (hours < 24) {
    return `${Math.round(hours)}h`;
  } else {
    return `${Math.round(hours / 24)}d`;
  }
}

// ============================================================================
// COMPONENT
// ============================================================================

export function MessageStats({ stats: providedStats }: MessageStatsProps) {
  const { stats: hookStats, loading } = useMessageStats({
    autoLoad: !providedStats,
  });

  // Use provided stats or hook stats
  const stats = providedStats || hookStats;

  const responseRate =
    stats.totalMessages > 0
      ? Math.round((stats.repliedMessages / stats.totalMessages) * 100)
      : 0;

  const unreadRate =
    stats.totalMessages > 0
      ? Math.round((stats.unreadMessages / stats.totalMessages) * 100)
      : 0;

  const statsConfig = [
    {
      title: "Total Messages",
      value: stats.totalMessages,
      icon: Mail,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      description: "All time messages",
    },
    {
      title: "Unread Messages",
      value: stats.unreadMessages,
      icon: MessageSquare,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      description: `${unreadRate}% of total`,
      badge: stats.unreadMessages > 0 ? "Needs attention" : "All caught up",
      badgeVariant: stats.unreadMessages > 0 ? "destructive" : "secondary",
    },
    {
      title: "Response Rate",
      value: `${responseRate}%`,
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      description: `${stats.repliedMessages} replied`,
    },
    {
      title: "Avg Response Time",
      value: formatResponseTime(stats.averageResponseTime),
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      description: "Average time to reply",
    },
    {
      title: "This Week",
      value: stats.messagesThisWeek,
      icon: Calendar,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      description: "Messages received",
    },
    {
      title: "This Month",
      value: stats.messagesThisMonth,
      icon: BarChart3,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
      description: "Monthly total",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statsConfig.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  {stat.badge && (
                    <Badge
                      variant={stat.badgeVariant as any}
                      className="text-xs"
                    >
                      {stat.badge}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center flex-shrink-0 ml-4`}
              >
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
