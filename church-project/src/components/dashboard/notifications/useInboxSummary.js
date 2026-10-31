"use client";

import { useCallback, useEffect, useState } from "react";

import { getBell } from "@/lib/inboxApi";

const POLL_MS = 60000;

/*
 * Keeps the unread count and the latest announcements fresh:
 * once a minute while the tab is visible, when the tab regains focus,
 * and whenever something is marked as read.
 */
export default function useInboxSummary() {
  const [state, setState] = useState({
    unread: 0,
    latest: [],
    loading: true,
  });

  const refresh = useCallback(async () => {
    try {
      const data = await getBell();

      setState({
        unread: data.unread,
        latest: data.latest,
        loading: false,
      });
    } catch {
      setState((current) => ({ ...current, loading: false }));
    }
  }, []);

  useEffect(() => {
    refresh();

    const timer = setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, POLL_MS);

    const handleRefresh = () => refresh();

    window.addEventListener("focus", handleRefresh);
    window.addEventListener("chms:inbox-updated", handleRefresh);

    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", handleRefresh);
      window.removeEventListener("chms:inbox-updated", handleRefresh);
    };
  }, [refresh]);

  return { ...state, refresh };
}