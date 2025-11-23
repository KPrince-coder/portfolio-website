/**
 * useMessages Hook
 *
 * Manages contact messages with CRUD operations, filtering, and bulk actions
 *
 * @module messages/hooks/useMessages
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import type {
  ContactMessage,
  MessageFilters,
  UpdateMessageInput,
  MessageStatus,
  MessagePriority,
  MessageCategory,
  PaginationOptions,
  PaginatedResponse,
} from "../types";

// ============================================================================
// TYPES
// ============================================================================

interface UseMessagesOptions {
  autoLoad?: boolean;
  pageSize?: number;
}

interface UseMessagesReturn {
  // Data
  messages: ContactMessage[];
  filteredMessages: ContactMessage[];
  pagination: PaginatedResponse<ContactMessage>["pagination"] | null;

  // State
  loading: boolean;
  error: string | null;

  // Filters
  filters: MessageFilters;
  updateFilter: <K extends keyof MessageFilters>(
    key: K,
    value: MessageFilters[K]
  ) => void;
  clearFilters: () => void;

  // Selection
  selectedMessages: string[];
  toggleMessageSelection: (messageId: string) => void;
  selectAllMessages: () => void;
  clearSelection: () => void;

  // Actions
  loadMessages: () => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  markAsUnread: (messageId: string) => Promise<void>;
  updateMessage: (input: UpdateMessageInput) => Promise<void>;
  updatePriority: (
    messageId: string,
    priority: MessagePriority
  ) => Promise<void>;
  updateCategory: (
    messageId: string,
    category: MessageCategory
  ) => Promise<void>;
  archiveMessage: (messageId: string) => Promise<void>;
  unarchiveMessage: (messageId: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;

  // Bulk Actions
  bulkMarkAsRead: (messageIds: string[]) => Promise<void>;
  bulkMarkAsUnread: (messageIds: string[]) => Promise<void>;
  bulkArchive: (messageIds: string[]) => Promise<void>;
  bulkDelete: (messageIds: string[]) => Promise<void>;

  // Pagination
  currentPage: number;
  setCurrentPage: (page: number) => void;
  perPage: number;
  setPerPage: (perPage: number) => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_PAGE_SIZE = 20;
const INITIAL_FILTERS: MessageFilters = {
  status: "all",
  priority: "all",
  category: "all",
  search: "",
};

// ============================================================================
// HOOK
// ============================================================================

export function useMessages(
  options: UseMessagesOptions = {}
): UseMessagesReturn {
  const { autoLoad = true, pageSize = DEFAULT_PAGE_SIZE } = options;

  // ============================================================================
  // STATE
  // ============================================================================

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MessageFilters>(INITIAL_FILTERS);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(pageSize);
  const [totalCount, setTotalCount] = useState(0);

  // ============================================================================
  // FILTERED MESSAGES
  // ============================================================================

  const filteredMessages = useMemo(() => {
    return messages.filter((message) => {
      // Status filter
      if (filters.status === "archived") {
        if (!message.archived) return false;
      } else if (filters.status === "spam") {
        if (message.status !== "spam") return false;
      } else {
        // For other filters, hide archived and spam
        if (message.archived || message.status === "spam") return false;
        if (
          filters.status &&
          filters.status !== "all" &&
          message.status !== filters.status
        ) {
          return false;
        }
      }

      // Priority filter
      if (
        filters.priority &&
        filters.priority !== "all" &&
        message.priority !== filters.priority
      ) {
        return false;
      }

      // Category filter
      if (
        filters.category &&
        filters.category !== "all" &&
        message.category !== filters.category
      ) {
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
  }, [messages, filters]);

  // ============================================================================
  // PAGINATION
  // ============================================================================

  const pagination = useMemo(() => {
    const total = filteredMessages.length;
    const total_pages = Math.ceil(total / perPage);

    return {
      page: currentPage,
      per_page: perPage,
      total,
      total_pages,
      has_next: currentPage < total_pages,
      has_prev: currentPage > 1,
    };
  }, [filteredMessages.length, currentPage, perPage]);

  // ============================================================================
  // LOAD MESSAGES
  // ============================================================================

  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const {
        data,
        error: fetchError,
        count,
      } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setMessages(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load messages";
      setError(errorMessage);
      console.error("Load messages error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================================================
  // AUTO LOAD
  // ============================================================================

  useEffect(() => {
    if (autoLoad) {
      loadMessages();
    }
  }, [autoLoad, loadMessages]);

  // ============================================================================
  // FILTER ACTIONS
  // ============================================================================

  const updateFilter = useCallback(
    <K extends keyof MessageFilters>(key: K, value: MessageFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setCurrentPage(1); // Reset to first page when filtering
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setCurrentPage(1);
  }, []);

  // ============================================================================
  // SELECTION ACTIONS
  // ============================================================================

  const toggleMessageSelection = useCallback((messageId: string) => {
    setSelectedMessages((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId]
    );
  }, []);

  const selectAllMessages = useCallback(() => {
    setSelectedMessages(filteredMessages.map((m) => m.id));
  }, [filteredMessages]);

  const clearSelection = useCallback(() => {
    setSelectedMessages([]);
  }, []);

  // ============================================================================
  // MESSAGE ACTIONS
  // ============================================================================

  const markAsRead = useCallback(async (messageId: string) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ status: "read" })
        .eq("id", messageId);

      if (error) throw error;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, status: "read" as MessageStatus }
            : msg
        )
      );
    } catch (err) {
      console.error("Mark as read error:", err);
      throw err;
    }
  }, []);

  const markAsUnread = useCallback(async (messageId: string) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ status: "unread" })
        .eq("id", messageId);

      if (error) throw error;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, status: "unread" as MessageStatus }
            : msg
        )
      );
    } catch (err) {
      console.error("Mark as unread error:", err);
      throw err;
    }
  }, []);

  const updateMessage = useCallback(async (input: UpdateMessageInput) => {
    try {
      const { id, ...updates } = input;

      const { error } = await supabase
        .from("contact_messages")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg))
      );
    } catch (err) {
      console.error("Update message error:", err);
      throw err;
    }
  }, []);

  const updatePriority = useCallback(
    async (messageId: string, priority: MessagePriority) => {
      await updateMessage({ id: messageId, priority });
    },
    [updateMessage]
  );

  const updateCategory = useCallback(
    async (messageId: string, category: MessageCategory) => {
      await updateMessage({ id: messageId, category });
    },
    [updateMessage]
  );

  const archiveMessage = useCallback(
    async (messageId: string) => {
      await updateMessage({ id: messageId, archived: true });
    },
    [updateMessage]
  );

  const unarchiveMessage = useCallback(
    async (messageId: string) => {
      await updateMessage({ id: messageId, archived: false });
    },
    [updateMessage]
  );

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", messageId);

      if (error) throw error;

      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      setSelectedMessages((prev) => prev.filter((id) => id !== messageId));
    } catch (err) {
      console.error("Delete message error:", err);
      throw err;
    }
  }, []);

  // ============================================================================
  // BULK ACTIONS
  // ============================================================================

  const bulkMarkAsRead = useCallback(
    async (messageIds: string[]) => {
      try {
        const { error } = await supabase
          .from("contact_messages")
          .update({ status: "read" })
          .in("id", messageIds);

        if (error) throw error;

        setMessages((prev) =>
          prev.map((msg) =>
            messageIds.includes(msg.id)
              ? { ...msg, status: "read" as MessageStatus }
              : msg
          )
        );
        clearSelection();
      } catch (err) {
        console.error("Bulk mark as read error:", err);
        throw err;
      }
    },
    [clearSelection]
  );

  const bulkMarkAsUnread = useCallback(
    async (messageIds: string[]) => {
      try {
        const { error } = await supabase
          .from("contact_messages")
          .update({ status: "unread" })
          .in("id", messageIds);

        if (error) throw error;

        setMessages((prev) =>
          prev.map((msg) =>
            messageIds.includes(msg.id)
              ? { ...msg, status: "unread" as MessageStatus }
              : msg
          )
        );
        clearSelection();
      } catch (err) {
        console.error("Bulk mark as unread error:", err);
        throw err;
      }
    },
    [clearSelection]
  );

  const bulkArchive = useCallback(
    async (messageIds: string[]) => {
      try {
        const { error } = await supabase
          .from("contact_messages")
          .update({ archived: true })
          .in("id", messageIds);

        if (error) throw error;

        setMessages((prev) =>
          prev.map((msg) =>
            messageIds.includes(msg.id) ? { ...msg, archived: true } : msg
          )
        );
        clearSelection();
      } catch (err) {
        console.error("Bulk archive error:", err);
        throw err;
      }
    },
    [clearSelection]
  );

  const bulkDelete = useCallback(
    async (messageIds: string[]) => {
      try {
        const { error } = await supabase
          .from("contact_messages")
          .delete()
          .in("id", messageIds);

        if (error) throw error;

        setMessages((prev) =>
          prev.filter((msg) => !messageIds.includes(msg.id))
        );
        clearSelection();
      } catch (err) {
        console.error("Bulk delete error:", err);
        throw err;
      }
    },
    [clearSelection]
  );

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Data
    messages,
    filteredMessages,
    pagination,

    // State
    loading,
    error,

    // Filters
    filters,
    updateFilter,
    clearFilters,

    // Selection
    selectedMessages,
    toggleMessageSelection,
    selectAllMessages,
    clearSelection,

    // Actions
    loadMessages,
    markAsRead,
    markAsUnread,
    updateMessage,
    updatePriority,
    updateCategory,
    archiveMessage,
    unarchiveMessage,
    deleteMessage,

    // Bulk Actions
    bulkMarkAsRead,
    bulkMarkAsUnread,
    bulkArchive,
    bulkDelete,

    // Pagination
    currentPage,
    setCurrentPage,
    perPage,
    setPerPage,
  };
}
