import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Shield, 
  Users, 
  FileText, 
  Briefcase, 
  Settings, 
  Mail,
  LogOut,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email?: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

interface Project {
  id: string;
  title: string;
  category: string;
  status: string;
  featured: boolean;
  published: boolean;
  created_at: string;
}

const Admin: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        loadData();
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      // Load contact messages
      const { data: messages } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (messages) {
        setContactMessages(messages);
      }

      // Load projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsData) {
        setProjects(projectsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  const signIn = async () => {
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Missing credentials",
        description: "Please enter both email and password",
      });
      return;
    }

    setIsSigningIn(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: error.message,
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: 'read' })
        .eq('id', messageId);

      if (error) throw error;

      setContactMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, status: 'read' } : msg
        )
      );

      toast({
        title: "Message marked as read",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating message",
        description: error.message,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="card-neural w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Shield className="w-6 h-6 text-secondary" />
              <span>Admin Access</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-center mb-6">
              Please authenticate to access the admin panel
            </p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <Button
              onClick={signIn}
              disabled={isSigningIn}
              className="w-full neural-glow"
            >
              <Shield className="w-4 h-4 mr-2" />
              {isSigningIn ? 'Signing in...' : 'Sign In'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'posts', label: 'Blog Posts', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const unreadMessages = contactMessages.filter(msg => msg.status === 'unread').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-neural rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">Portfolio CMS</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="card-neural">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab(tab.id)}
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

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
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
            )}

            {activeTab === 'messages' && (
              <div className="space-y-6">
                <h2 className="heading-lg">Contact Messages</h2>
                
                <div className="space-y-4">
                  {contactMessages.map((message) => (
                    <Card key={message.id} className="card-neural">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{message.subject}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              From: {message.name} ({message.email})
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={message.status === 'unread' ? 'accent' : 'secondary'}
                            >
                              {message.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(message.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{message.message}</p>
                        <div className="flex space-x-2">
                          {message.status === 'unread' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markMessageAsRead(message.id)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Mark as Read
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {contactMessages.length === 0 && (
                    <div className="text-center py-12">
                      <Mail className="w-12 h-12 text-muted mx-auto mb-4" />
                      <p className="text-muted-foreground">No contact messages yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="heading-lg">Projects Management</h2>
                  <Button variant="neural">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Add New Project
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {projects.map((project) => (
                    <Card key={project.id} className="card-neural">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{project.title}</h3>
                            <p className="text-sm text-muted-foreground">{project.category}</p>
                            <div className="flex space-x-2 mt-2">
                              <Badge variant={project.published ? 'secondary' : 'outline'}>
                                {project.published ? 'Published' : 'Draft'}
                              </Badge>
                              {project.featured && (
                                <Badge variant="accent">Featured</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {(activeTab === 'posts' || activeTab === 'settings') && (
              <div className="space-y-6">
                <h2 className="heading-lg">
                  {activeTab === 'posts' ? 'Blog Posts' : 'Site Settings'}
                </h2>
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {activeTab === 'posts' ? 'Blog management' : 'Site settings'} coming soon...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;