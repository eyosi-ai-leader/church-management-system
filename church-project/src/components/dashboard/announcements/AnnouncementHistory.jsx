"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Loader2,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";

import AnnouncementDetails from "./AnnouncementDetails";
import {
  deleteAnnouncement,
  listAnnouncements,
  retryAnnouncement,
} from "@/lib/announcementApi";

const STATUS = {
  sending: { label: "Sending", className: "bg-blue-50 text-blue-700" },
  sent: { label: "Sent", className: "bg-emerald-50 text-emerald-700" },
  partial: {
    label: "Partly sent",
    className: "bg-amber-50 text-amber-700",
  },
  failed: { label: "Failed", className: "bg-red-50 text-red-700" },
};

export default function AnnouncementHistory() {
  const [items, setItems] = useState(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [retrying, setRetrying] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // First page, and again whenever the search text changes.
  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(
      async () => {
        try {
          const data = await listAnnouncements({
            search: search.trim(),
            page: 1,
          });

          if (cancelled) return;

          setItems(data.items);
          setTotal(data.total);
          setHasMore(data.hasMore);
          setPage(1);
          setError("");
        } catch (err) {
          if (!cancelled) setError(err.message);
        }
      },
      search ? 300 : 0
    );

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search]);

  // Updates the progress of items already on screen.
  const refresh = useCallback(async () => {
    try {
      const data = await listAnnouncements({
        search: search.trim(),
        page: 1,
      });

      setItems((current) => {
        if (!current) return data.items;

        const fresh = new Map(data.items.map((item) => [item.id, item]));

        return current.map((item) => fresh.get(item.id) || item);
      });
    } catch {
      /* keep what is on screen */
    }
  }, [search]);

  const hasSending = items?.some((item) => item.status === "sending");

  useEffect(() => {
    if (!hasSending) return;

    const timer = setInterval(refresh, 4000);

    return () => clearInterval(timer);
  }, [hasSending, refresh]);

  // The "deleted" message disappears by itself.
  useEffect(() => {
    if (!notice) return;

    const timer = setTimeout(() => setNotice(""), 5000);

    return () => clearTimeout(timer);
  }, [notice]);

  async function loadMore() {
    if (loadingMore) return;

    setLoadingMore(true);
    setError("");

    try {
      const data = await listAnnouncements({
        search: search.trim(),
        page: page + 1,
      });

      setItems((current) => {
        const known = new Set(current.map((item) => item.id));
        return [...current, ...data.items.filter((item) => !known.has(item.id))];
      });

      setHasMore(data.hasMore);
      setTotal(data.total);
      setPage(page + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleRetry(id) {
    if (retrying) return;

    setRetrying(id);
    setError("");

    try {
      await retryAnnouncement(id);
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setRetrying(null);
    }
  }

  async function handleDelete(id) {
    if (deletingId) return;

    setDeletingId(id);
    setError("");

    try {
      await deleteAnnouncement(id);

      setItems((current) => current.filter((item) => item.id !== id));
      setTotal((current) => Math.max(0, current - 1));

      if (expandedId === id) setExpandedId(null);

      setNotice("The announcement was deleted.");
    } catch (err) {
      setError(err.message);
    } finally {
      setConfirmId(null);
      setDeletingId(null);
    }
  }

  if (!items && !error) {
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

  const searching = search.trim().length > 0;

  return (
    <div className="space-y-4">
      {(total > 0 || searching) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-xs">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by subject"
              aria-label="Search announcements"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          <p className="text-sm text-slate-500">
            {total} {total === 1 ? "announcement" : "announcements"}
          </p>
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          <CheckCircle2 size={18} aria-hidden="true" />
          {notice}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {items && items.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          {searching
            ? "No announcements match your search."
            : "No announcements have been sent yet."}
        </div>
      )}

      {items?.map((item) => {
        const status = STATUS[item.status] || STATUS.sending;
        const done = item.sent + item.failed;
        const percent =
          item.total > 0 ? Math.round((done / item.total) * 100) : 0;
        const expanded = expandedId === item.id;
        const confirming = confirmId === item.id;
        const isSending = item.status === "sending";

        return (
          <article
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-slate-900">
                  {item.subject}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {item.audience} · by {item.sender} ·{" "}
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
              >
                {status.label}
              </span>
            </div>

            <div className="mt-4">
              <div
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Sending progress"
                className="h-2 overflow-hidden rounded-full bg-slate-100"
              >
                <div
                  className="h-full rounded-full bg-slate-900 transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <p className="mt-2 text-xs text-slate-500">
                {item.sent} of {item.total} sent
                {item.failed > 0 && ` · ${item.failed} failed`}
                {item.optedOut > 0 && ` · ${item.optedOut} opted out`}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setExpandedId(expanded ? null : item.id)}
                aria-expanded={expanded}
                className="inline-flex items-center gap-1.5 rounded-lg text-sm font-semibold text-indigo-600 transition hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                {expanded ? "Hide details" : "View details"}
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                  className={`transition-transform ${
                    expanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div className="flex flex-wrap items-center gap-2">
                {item.canRetry && (
                  <button
                    type="button"
                    onClick={() => handleRetry(item.id)}
                    disabled={retrying === item.id}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-60"
                  >
                    {retrying === item.id ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <RotateCcw size={15} aria-hidden="true" />
                    )}
                    Retry unsent
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setConfirmId(confirming ? null : item.id)}
                  disabled={isSending}
                  title={
                    isSending
                      ? "Wait until sending finishes to delete this announcement."
                      : undefined
                  }
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 size={15} aria-hidden="true" />
                  Delete
                </button>
              </div>
            </div>

            {confirming && (
              <div
                role="alertdialog"
                aria-label="Confirm deleting this announcement"
                className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4"
              >
                <p className="text-sm font-semibold text-red-900">
                  Delete &quot;{item.subject}&quot;?
                </p>

                <p className="mt-1 text-sm text-red-800">
                  It will be removed from this list. Emails that were already
                  sent can&apos;t be recalled.
                </p>

                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirmId(null)}
                    disabled={deletingId === item.id}
                    className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-900 transition hover:bg-red-100 disabled:opacity-60"
                  >
                    Keep it
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                  >
                    {deletingId === item.id && (
                      <Loader2 size={15} className="animate-spin" />
                    )}
                    {deletingId === item.id ? "Deleting..." : "Yes, delete"}
                  </button>
                </div>
              </div>
            )}

            {expanded && (
              <AnnouncementDetails
                announcementId={item.id}
                onChanged={refresh}
              />
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
    </div>
  );
}