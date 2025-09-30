import React from 'react';
import { Mail, Briefcase, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AdminDashboardProps } from './types';

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  contactMessages,
  projects,
  unreadMessages,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="heading-lg">Dashboard Overview</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="card-neural neural-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Messages</p>
                <p className="text-3xl font-bold text-neural">{contactMessages.length}</p>
              </div>
              <Mail className="w-8 h-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-neural neural-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Projects</p>
                <p className="text-3xl font-bold text-neural">{projects.length}</p>
              </div>
              <Briefcase className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-neural neural-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unread Messages</p>
                <p className="text-3xl font-bold text-neural">{unreadMessages}</p>
              </div>
              <Eye className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
