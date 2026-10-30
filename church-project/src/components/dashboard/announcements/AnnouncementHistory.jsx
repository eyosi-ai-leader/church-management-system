"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronDown, Loader2, RotateCcw } from "lucide-react";

import AnnouncementDetails from "./AnnouncementDetails";
import {
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
  const [error, setError] = useState("");
  const [retrying, setRetrying] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await listAnnouncements();
      setItems(data);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const hasSending = items?.some((item) => item.status === "sending");

  // While something is being sent, refresh progress every few seconds.
  useEffect(() => {
    if (!hasSending) return;

    const timer = setInterval(load, 4000);

    return () => clearInterval(timer);
  }, [hasSending, load]);

  async function handleRetry(id) {
    if (retrying) return;

    setRetrying(id);
    setError("");

    try {
      await retryAnnouncement(id);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setRetrying(null);
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

  return (
    <div className="space-y-4">
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
          No announcements have been sent yet.
        </div>
      )}

      {items?.map((item) => {
        const status = STATUS[item.status] || STATUS.sending;
        const done = item.sent + item.failed;
        const percent =
          item.total > 0 ? Math.round((done / item.total) * 100) : 0;
        const expanded = expandedId === item.id;

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
            </div>

            {expanded && (
              <AnnouncementDetails
                announcementId={item.id}
                onChanged={load}
              />
            )}
          </article>
        );
      })}
    </div>
  );
}