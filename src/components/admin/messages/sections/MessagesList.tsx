/**
 * Messages List Component
 *
 * Modern, optimized messages list with advanced filtering and bulk actions
 *
 * @module messages/sections/MessagesList
 */

import React, { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Mail,
  Eye,
  Reply,
  Trash2,
  Archive,
  Search,
  MoreHorizontal,
  AlertCircle,
  Clock,
  Star,
  MessageSquare,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMessages } from "../hooks/useMessages";
import type {
  ContactMessage,
  MessageStatus,
  MessagesListProps,
} from "../types";

// ============================================================================
// CONSTANTS
// ============================================================================

const STATUS_COLORS: Record<MessageStatus, string> = {
  unread: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  read: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  replied: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  spam: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const PRIORITY_CONFIG = {
  high: { icon: AlertCircle, color: "text-red-500", label: "High" },
  medium: { icon: Clock, color: "text-yellow-500", label: "Medium" },
  low: { icon: Star, color: "text-green-500", label: "Low" },
};

// ============================================================================
// COMPONENT
// ============================================================================

export function MessagesList({
  onReplyToMessage,
  onViewMessage,
}: MessagesListProps) {
  const {
    filteredMessages,
    loading,
    filters,
    updateFilter,
    clearFilters,
    selectedMessages,
    toggleMessageSelection,
    selectAllMessages,
    clearSelection,
    markAsRead,
    markAsUnread,
    updatePriority,
    updateMessage,
    archiveMessage,
    unarchiveMessage,
    deleteMessage,
    bulkMarkAsRead,
    bulkMarkAsUnread,
    bulkArchive,
    bulkDelete,
  } = useMessages();

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleSelectAll = () => {
    if (selectedMessages.length === filteredMessages.length) {
      clearSelection();
    } else {
      selectAllMessages();
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedMessages.length === 0) return;

    try {
      switch (action) {
        case "mark_read":
          await bulkMarkAsRead(selectedMessages);
          break;
        case "mark_unread":
          await bulkMarkAsUnread(selectedMessages);
          break;
        case "archive":
          await bulkArchive(selectedMessages);
          break;
        case "delete":
          await bulkDelete(selectedMessages);
          break;
      }
    } catch (error) {
      console.error(`Bulk ${action} failed:`, error);
    }
  };

  const handleUpdateStatus = async (
    messageId: string,
    updates: Partial<ContactMessage>
  ) => {
    try {
      await updateMessage({ id: messageId, ...updates });
    } catch (error) {
      console.error("Update status failed:", error);
    }
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderPriorityIcon = (priority: ContactMessage["priority"]) => {
    const config = PRIORITY_CONFIG[priority];
    const Icon = config.icon;
    return <Icon className={`w-4 h-4 ${config.color}`} />;
  };

  const renderStatusBadge = (status: MessageStatus) => {
    return (
      <Badge className={STATUS_COLORS[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const renderMessageActions = (message: ContactMessage) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onViewMessage && (
          <DropdownMenuItem onClick={() => onViewMessage(message.id)}>
            <Eye className="w-4 h-4 mr-2" />
            View
          </DropdownMenuItem>
        )}
        {message.status === "unread" && (
          <DropdownMenuItem onClick={() => markAsRead(message.id)}>
            <Eye className="w-4 h-4 mr-2" />
            Mark as Read
          </DropdownMenuItem>
        )}
        {message.status !== "unread" && (
          <DropdownMenuItem onClick={() => markAsUnread(message.id)}>
            <Mail className="w-4 h-4 mr-2" />
            Mark as Unread
          </DropdownMenuItem>
        )}
        {onReplyToMessage && (
          <DropdownMenuItem onClick={() => onReplyToMessage(message.id)}>
            <Reply className="w-4 h-4 mr-2" />
            Reply
          </DropdownMenuItem>
        )}
        {message.archived ? (
          <DropdownMenuItem onClick={() => unarchiveMessage(message.id)}>
            <Archive className="w-4 h-4 mr-2" />
            Unarchive
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => archiveMessage(message.id)}>
            <Archive className="w-4 h-4 mr-2" />
            Archive
          </DropdownMenuItem>
        )}
        {message.status === "spam" ? (
          <DropdownMenuItem
            onClick={() =>
              handleUpdateStatus(message.id, {
                status: message.is_replied ? "replied" : "unread",
                archived: false,
              })
            }
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Mark as Not Spam
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() =>
              handleUpdateStatus(message.id, { status: "spam", archived: true })
            }
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Mark as Spam
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => deleteMessage(message.id)}
          className="text-red-600"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Contact Messages
          </h2>
          <p className="text-muted-foreground">
            Manage and respond to contact form submissions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{filteredMessages.length} messages</Badge>
          {selectedMessages.length > 0 && (
            <Badge variant="default">{selectedMessages.length} selected</Badge>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={filters.search || ""}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="pl-10 pr-10"
              />
              {filters.search && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                  onClick={() => updateFilter("search", "")}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Status Filter */}
            <Select
              value={filters.status || "all"}
              onValueChange={(value) =>
                updateFilter(
                  "status",
                  value as MessageStatus | "all" | "archived"
                )
              }
            >
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

            {/* Priority Filter */}
            <Select
              value={filters.priority || "all"}
              onValueChange={(value) =>
                updateFilter(
                  "priority",
                  value as ContactMessage["priority"] | "all"
                )
              }
            >
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

            {/* Bulk Actions */}
            {selectedMessages.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Bulk Actions</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => handleBulkAction("mark_read")}
                  >
                    Mark as Read
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleBulkAction("mark_unread")}
                  >
                    Mark as Unread
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction("archive")}>
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleBulkAction("delete")}
                    className="text-destructive"
                  >
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
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={
                      selectedMessages.length === filteredMessages.length &&
                      filteredMessages.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm text-muted-foreground">
                    Select all {filteredMessages.length} messages
                  </span>
                </div>
                {(filters.search ||
                  filters.status !== "all" ||
                  filters.priority !== "all") && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Message Cards */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {filters.search ||
              filters.status !== "all" ||
              filters.priority !== "all"
                ? "No messages match your filters"
                : "No contact messages yet"}
            </p>
          </div>
        ) : (
          filteredMessages.map((message) => (
            <Card
              key={message.id}
              className={`transition-all duration-200 ${
                selectedMessages.includes(message.id)
                  ? "ring-2 ring-primary"
                  : ""
              } ${
                message.status === "unread" ? "border-l-4 border-l-primary" : ""
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Checkbox
                      checked={selectedMessages.includes(message.id)}
                      onCheckedChange={() => toggleMessageSelection(message.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        {renderPriorityIcon(message.priority)}
                        <CardTitle className="text-lg truncate">
                          {message.subject}
                        </CardTitle>
                        {message.is_replied && (
                          <Badge variant="default" className="text-xs">
                            <Reply className="w-3 h-3 mr-1" />
                            Replied
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        From:{" "}
                        <span className="font-medium">{message.name}</span> (
                        {message.email})
                      </p>
                      <div className="flex items-center space-x-2 mt-1 flex-wrap gap-1">
                        {message.status !== "spam" &&
                          !message.archived &&
                          renderStatusBadge(message.status)}
                        {message.status === "spam" && (
                          <Badge variant="destructive">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Spam
                          </Badge>
                        )}
                        {message.archived && (
                          <Badge variant="outline">
                            <Archive className="w-3 h-3 mr-1" />
                            Archived
                          </Badge>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Badge
                              variant="outline"
                              className="text-xs cursor-pointer"
                            >
                              {message.priority}
                            </Badge>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem
                              onClick={() => updatePriority(message.id, "high")}
                            >
                              <AlertCircle className="w-4 h-4 mr-2 text-red-500" />{" "}
                              High
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updatePriority(message.id, "medium")
                              }
                            >
                              <Clock className="w-4 h-4 mr-2 text-yellow-500" />{" "}
                              Medium
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updatePriority(message.id, "low")}
                            >
                              <Star className="w-4 h-4 mr-2 text-green-500" />{" "}
                              Low
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                      {formatDistanceToNow(new Date(message.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                    {renderMessageActions(message)}
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
                    {onReplyToMessage && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onReplyToMessage(message.id)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Reply
                      </Button>
                    )}
                    {message.status === "unread" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markAsRead(message.id)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Mark as Read
                      </Button>
                    )}
                  </div>

                  {message.reply_sent_at && (
                    <div className="text-xs text-muted-foreground">
                      Replied{" "}
                      {formatDistanceToNow(new Date(message.reply_sent_at), {
                        addSuffix: true,
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
