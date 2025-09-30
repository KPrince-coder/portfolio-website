import React from 'react';
import { Shield, Mail, Briefcase, FileText, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminSidebarProps, AdminTab } from './types';

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  unreadMessages,
  onTabChange,
}) => {
  const tabs: AdminTab[] = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'posts', label: 'Blog Posts', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="lg:col-span-1">
      <Card className="card-neural">
        <CardContent className="p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => onTabChange(tab.id)}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
                {tab.id === 'messages' && unreadMessages > 0 && (
                  <Badge variant="accent" className="ml-auto">
                    {unreadMessages}
                  </Badge>
                )}
              </Button>
            ))}
          </nav>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSidebar;
