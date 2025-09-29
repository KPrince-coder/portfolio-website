import React from 'react';
import { Mail, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ContactMessagesProps } from './types';

const ContactMessages: React.FC<ContactMessagesProps> = ({
  contactMessages,
  onMarkAsRead,
}) => {
  return (
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
                    onClick={() => onMarkAsRead(message.id)}
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
  );
};

export default ContactMessages;
