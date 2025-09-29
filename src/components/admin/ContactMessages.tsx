import React, { useState, useMemo } from 'react';
import {
  Mail,
  Eye,
  Reply,
  Trash2,
  Archive,
  Search,
  Filter,
  MoreHorizontal,
  CheckSquare,
  Square,
  AlertCircle,
  Clock,
  Star,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ContactMessagesProps, ContactMessage, MessageFilters } from './types';
import { formatDistanceToNow } from 'date-fns';

const ContactMessages: React.FC<ContactMessagesProps> = ({
  contactMessages,
  onMarkAsRead,
  onBulkAction,
  onDeleteMessage,
  onReplyToMessage,
  onUpdateStatus,
  onUpdatePriority,
  loading = false,
}) => {
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [filters, setFilters] = useState<MessageFilters>({
    status: 'all',
    priority: 'all',
    category: 'all',
    search: '',
  });

  // Filter and search messages
  const filteredMessages = useMemo(() => {
    return contactMessages.filter((message) => {
      // Status filter
      if (filters.status && filters.status !== 'all' && message.status !== filters.status) {
        return false;
      }

      // Priority filter
      if (filters.priority && filters.priority !== 'all' && message.priority !== filters.priority) {
        return false;
      }

      // Category filter
      if (filters.category && filters.category !== 'all' && message.category !== filters.category) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          message.name.toLowerCase().includes(searchTerm) ||
          message.email.toLowerCase().includes(searchTerm) ||
          message.subject.toLowerCase().includes(searchTerm) ||
          message.message.toLowerCase().includes(searchTerm)
        );
      }

      return true;
    });
  }, [contactMessages, filters]);

  const handleSelectAll = () => {
    if (selectedMessages.length === filteredMessages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(filteredMessages.map(m => m.id));
    }
  };

  const handleSelectMessage = (messageId: string) => {
    setSelectedMessages(prev =>
      prev.includes(messageId)
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  const handleBulkAction = (action: string) => {
    if (selectedMessages.length > 0) {
      onBulkAction(selectedMessages, action);
      setSelectedMessages([]);
    }
  };

  const getPriorityIcon = (priority: ContactMessage['priority']) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <Star className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusBadgeVariant = (status: ContactMessage['status']) => {
    switch (status) {
      case 'unread':
        return 'accent';
      case 'read':
        return 'secondary';
      case 'replied':
        return 'default';
      case 'archived':
        return 'outline';
      case 'spam':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="heading-lg">Contact Messages</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="neural-glow">
            {filteredMessages.length} messages
          </Badge>
          {selectedMessages.length > 0 && (
            <Badge variant="accent" className="neural-glow">
              {selectedMessages.length} selected
            </Badge>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="card-neural">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={filters.search || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>

            <Select value={filters.status || 'all'} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value as any }))}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="replied">Replied</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
                <SelectItem value="spam">Spam</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.priority || 'all'} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value as any }))}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            {selectedMessages.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="neural-glow">
                    Bulk Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleBulkAction('mark_read')}>
                    Mark as Read
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction('mark_unread')}>
                    Mark as Unread
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction('archive')}>
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction('delete')} className="text-destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="space-y-4">
        {/* Select All Header */}
        {filteredMessages.length > 0 && (
          <Card className="card-neural">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={selectedMessages.length === filteredMessages.length && filteredMessages.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm text-muted-foreground">
                    Select all {filteredMessages.length} messages
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Showing {filteredMessages.length} of {contactMessages.length} messages
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Message Cards */}
        {filteredMessages.map((message) => (
          <Card key={message.id} className={`card-neural transition-all duration-200 ${
            selectedMessages.includes(message.id) ? 'ring-2 ring-secondary' : ''
          } ${message.status === 'unread' ? 'border-l-4 border-l-secondary' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <Checkbox
                    checked={selectedMessages.includes(message.id)}
                    onCheckedChange={() => handleSelectMessage(message.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      {getPriorityIcon(message.priority)}
                      <CardTitle className="text-lg truncate">{message.subject}</CardTitle>
                      {message.is_replied && (
                        <Badge variant="default" className="text-xs">
                          <Reply className="w-3 h-3 mr-1" />
                          Replied
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      From: <span className="font-medium">{message.name}</span> ({message.email})
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={getStatusBadgeVariant(message.status)}>
                        {message.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {message.priority}
                      </Badge>
                      {message.category && (
                        <Badge variant="outline" className="text-xs">
                          {message.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {message.status === 'unread' && (
                        <DropdownMenuItem onClick={() => onMarkAsRead(message.id)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Mark as Read
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onReplyToMessage(message.id)}>
                        <Reply className="w-4 h-4 mr-2" />
                        Reply
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateStatus(message.id, 'archived')}>
                        <Archive className="w-4 h-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDeleteMessage(message.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 line-clamp-3">
                {message.message}
              </p>

              {message.tags && message.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {message.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onReplyToMessage(message.id)}
                    className="neural-glow"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Reply
                  </Button>
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

                {message.reply_sent_at && (
                  <div className="text-xs text-muted-foreground">
                    Replied {formatDistanceToNow(new Date(message.reply_sent_at), { addSuffix: true })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted-foreground">
              {filters.search || filters.status !== 'all' || filters.priority !== 'all'
                ? 'No messages match your filters'
                : 'No contact messages yet'
              }
            </p>
            {(filters.search || filters.status !== 'all' || filters.priority !== 'all') && (
              <Button
                variant="outline"
                onClick={() => setFilters({ status: 'all', priority: 'all', category: 'all', search: '' })}
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactMessages;
