/**
 * useMessageStats Hook
 *
 * Calculates and manages message statistics and analytics
 *
 * @module messages/hooks/useMessageStats
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ContactMessage, MessageStats } from "../types";
import {
  startOfWeek,
  startOfMonth,
  differenceInHours,
  isAfter,
} from "date-fns";

// ============================================================================
// TYPES
// ============================================================================

interface UseMessageStatsOptions {
  autoLoad?: boolean;
  refreshInterval?: number; // in milliseconds
}

interface UseMessageStatsReturn {
  stats: MessageStats;
  loading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
}

// ============================================================================
// HOOK
// ============================================================================

export function useMessageStats(
  options: UseMessageStatsOptions = {}
): UseMessageStatsReturn {
  const { autoLoad = true, refreshInterval } = options;

  // ============================================================================
  // STATE
  // ============================================================================

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // CALCULATE STATS
  // ============================================================================

  const stats = useMemo((): MessageStats => {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const monthStart = startOfMonth(now);

    // Total messages
    const totalMessages = messages.length;

    // Unread messages
    const unreadMessages = messages.filter(
      (msg) => msg.status === "unread" && !msg.archived
    ).length;

    // Replied messages
    const repliedMessages = messages.filter((msg) => msg.is_replied).length;

    // Messages this week
    const messagesThisWeek = messages.filter((msg) =>
      isAfter(new Date(msg.created_at), weekStart)
    ).length;

    // Messages this month
    const messagesThisMonth = messages.filter((msg) =>
      isAfter(new Date(msg.created_at), monthStart)
    ).length;

    // Average response time (in hours)
    const repliedMessagesWithTime = messages.filter(
      (msg) => msg.is_replied && msg.reply_sent_at
    );

    const averageResponseTime =
      repliedMessagesWithTime.length > 0
        ? repliedMessagesWithTime.reduce((acc, msg) => {
            const created = new Date(msg.created_at);
            const replied = new Date(msg.reply_sent_at!);
            return acc + differenceInHours(replied, created);
          }, 0) / repliedMessagesWithTime.length
        : 0;

    return {
      totalMessages,
      unreadMessages,
      repliedMessages,
      averageResponseTime,
      messagesThisWeek,
      messagesThisMonth,
    };
  }, [messages]);

  // ============================================================================
  // LOAD MESSAGES
  // ============================================================================

  const refreshStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setMessages(data || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load statistics";
      setError(errorMessage);
      console.error("Load stats error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================================================
  // AUTO LOAD
  // ============================================================================

  useEffect(() => {
    if (autoLoad) {
      refreshStats();
    }
  }, [autoLoad, refreshStats]);

  // ============================================================================
  // AUTO REFRESH
  // ============================================================================

  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(() => {
        refreshStats();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [refreshInterval, refreshStats]);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    stats,
    loading,
    error,
    refreshStats,
  };
}
