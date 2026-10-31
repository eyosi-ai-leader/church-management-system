"use client";

import { useEffect, useState } from "react";
import {
  CheckCheck,
  ChevronDown,
  Loader2,
  Megaphone,
} from "lucide-react";

import {
  getInboxItem,
  listInbox,
  markAllInboxRead,
  markInboxRead,
  notifyInboxChanged,
} from "@/lib/inboxApi";
import { timeAgo } from "@/lib/timeAgo";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
];

export default function AnnouncementInbox({ openId }) {
  const [filter, setFilter] = useState("all");
  const [items, setItems] = useState(null);
  const [total, setTotal] = useState(0);
  const [unread, setUnread] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const loaded = items !== null;

  // First page, and again when the filter changes.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await listInbox({ filter, page: 1 });

        if (cancelled) return;

        setItems(data.items);
        setTotal(data.total);
        setUnread(data.unread);
        setHasMore(data.hasMore);
        setPage(1);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [filter]);

  function markReadLocal(id) {
    setItems((current) =>
      current
        ? current.map((item) =>
            item.id === id ? { ...item, read: true } : item
          )
        : current
    );

    setUnread((current) => Math.max(0, current - 1));

    markInboxRead(id)
      .then(notifyInboxChanged)
      .catch(() => {});
  }

  // Opened from the bell: show that announcement and mark it as read.
  useEffect(() => {
    if (!openId || !loaded) return;

    const existing = items.find((item) => item.id === openId);

    if (existing) {
      setExpandedId(openId);
      if (!existing.read) markReadLocal(openId);
      return;
    }

    let cancelled = false;

    getInboxItem(openId)
      .then((item) => {
        if (cancelled) return;

        setItems((current) =>
          current.some((entry) => entry.id === item.id)
            ? current
            : [item, ...current]
        );

        setExpandedId(item.id);

        if (!item.read) markReadLocal(item.id);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
    // Runs when a different announcement is opened or the first page arrives.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openId, loaded]);

  function toggle(item) {
    if (expandedId === item.id) {
      setExpandedId(null);
      return;
    }

    setExpandedId(item.id);

    if (!item.read) markReadLocal(item.id);
  }

  async function loadMore() {
    if (loadingMore) return;

    setLoadingMore(true);
    setError("");

    try {
      const data = await listInbox({ filter, page: page + 1 });

      setItems((current) => {
        const known = new Set(current.map((item) => item.id));
        return [...current, ...data.items.filter((item) => !known.has(item.id))];
      });

      setHasMore(data.hasMore);
      setPage(page + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleMarkAll() {
    if (markingAll) return;

    setMarkingAll(true);
    setError("");

    try {
      await markAllInboxRead();

      setItems((current) =>
        current ? current.map((item) => ({ ...item, read: true })) : current
      );

      setUnread(0);
      notifyInboxChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setMarkingAll(false);
    }
  }

  if (!loaded && !error) {
    return (
      <div
        role="status"
        className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-16 text-sm text-slate-500"
      >
        <Loader2 size={18} className="animate-spin" />
        Loading announcements...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Filter announcements"
          className="inline-flex rounded-xl bg-slate-100 p-1"
        >
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                filter === item.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {item.label}
              {item.id === "unread" && unread > 0 && ` (${unread})`}
            </button>
          ))}
        </div>

        {unread > 0 && (
          <button
            type="button"
            onClick={handleMarkAll}
            disabled={markingAll}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-60"
          >
            {markingAll ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <CheckCheck size={15} aria-hidden="true" />
            )}
            Mark all as read
          </button>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {loading && loaded && (
        <p
          role="status"
          className="flex items-center gap-2 text-sm text-slate-500"
        >
          <Loader2 size={15} className="animate-spin" />
          Updating...
        </p>
      )}

      {items && items.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <Megaphone
            size={28}
            className="mx-auto text-slate-300"
            aria-hidden="true"
          />
          <p className="mt-3 text-sm font-medium text-slate-600">
            {filter === "unread"
              ? "No unread announcements."
              : "No announcements yet."}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Announcements from church leaders will appear here.
          </p>
        </div>
      )}

      {items?.map((item) => {
        const expanded = expandedId === item.id;

        return (
          <article
            key={item.id}
            className={`rounded-2xl border bg-white shadow-sm transition ${
              item.read
                ? "border-slate-200"
                : "border-indigo-200 ring-1 ring-indigo-100"
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(item)}
              aria-expanded={expanded}
              className="flex w-full items-start gap-3 rounded-2xl p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <span
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  item.read
                    ? "bg-slate-100 text-slate-400"
                    : "bg-indigo-100 text-indigo-600"
                }`}
              >
                <Megaphone size={17} aria-hidden="true" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span
                    className={`truncate text-base ${
                      item.read
                        ? "font-semibold text-slate-800"
                        : "font-bold text-slate-900"
                    }`}
                  >
                    {item.subject}
                  </span>

                  {!item.read && (
                    <span className="shrink-0 rounded-full bg-indigo-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      New
                    </span>
                  )}
                </span>

                <span className="mt-0.5 block text-xs text-slate-500">
                  {item.sender}
                  {item.senderRole && ` (${item.senderRole})`} ·{" "}
                  {timeAgo(item.createdAt)}
                </span>

                {!expanded && (
                  <span className="mt-2 block line-clamp-2 text-sm text-slate-600">
                    {item.message}
                  </span>
                )}
              </span>

              <ChevronDown
                size={18}
                aria-hidden="true"
                className={`mt-1 shrink-0 text-slate-400 transition-transform ${
                  expanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {expanded && (
              <div className="border-t border-slate-100 px-5 pb-5 pt-4">
                <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
                  {item.message}
                </p>

                <p className="mt-4 text-xs text-slate-400">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            )}
          </article>
        );
      })}

      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-60"
          >
            {loadingMore && <Loader2 size={15} className="animate-spin" />}
            Load more
          </button>
        </div>
      )}

      {total > 0 && (
        <p className="text-center text-xs text-slate-400">
          Showing {items?.length || 0} of {total}
        </p>
      )}
    </div>
  );
}