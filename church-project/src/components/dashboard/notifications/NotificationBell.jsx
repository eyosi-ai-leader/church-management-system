"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Loader2, Megaphone } from "lucide-react";

import useInboxSummary from "./useInboxSummary";
import {
  markAllInboxRead,
  markInboxRead,
  notifyInboxChanged,
} from "@/lib/inboxApi";
import { timeAgo } from "@/lib/timeAgo";

export default function NotificationBell() {
  const router = useRouter();
  const { unread, latest, loading } = useInboxSummary();

  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;

    const handleClick = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function openItem(item) {
    setOpen(false);

    if (!item.read) {
      markInboxRead(item.id)
        .then(notifyInboxChanged)
        .catch(() => {});
    }

    router.push(`/dashboard/announcements?tab=inbox&open=${item.id}`);
  }

  async function handleMarkAll() {
    if (busy) return;

    setBusy(true);

    try {
      await markAllInboxRead();
      notifyInboxChanged();
    } catch {
      /* the count refreshes by itself */
    } finally {
      setBusy(false);
    }
  }

  const badge = unread > 99 ? "99+" : String(unread);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={
          unread > 0 ? `Notifications, ${unread} unread` : "Notifications"
        }
        aria-haspopup="true"
        aria-expanded={open}
        className={`relative flex h-9 w-9 items-center justify-center rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
          open
            ? "bg-slate-100 text-slate-900"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        <Bell size={18} aria-hidden="true" />

        {unread > 0 && (
          <span
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white"
          >
            {badge}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-slate-900">Notifications</p>

              {unread > 0 && (
                <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-600">
                  {unread} new
                </span>
              )}
            </div>

            {unread > 0 && (
              <button
                type="button"
                onClick={handleMarkAll}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-60"
              >
                {busy ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <CheckCheck size={14} aria-hidden="true" />
                )}
                Mark all as read
              </button>
            )}
          </div>

          {loading ? (
            <p
              role="status"
              className="flex items-center justify-center gap-2 px-4 py-10 text-sm text-slate-500"
            >
              <Loader2 size={16} className="animate-spin" />
              Loading...
            </p>
          ) : latest.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <Bell
                size={24}
                className="mx-auto text-slate-300"
                aria-hidden="true"
              />
              <p className="mt-2 text-sm font-medium text-slate-600">
                You&apos;re all caught up
              </p>
              <p className="mt-1 text-xs text-slate-400">
                New announcements will appear here.
              </p>
            </div>
          ) : (
            <ul className="max-h-96 divide-y divide-slate-100 overflow-y-auto">
              {latest.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => openItem(item)}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-400 ${
                      item.read ? "" : "bg-indigo-50/50"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        item.read
                          ? "bg-slate-100 text-slate-400"
                          : "bg-indigo-100 text-indigo-600"
                      }`}
                    >
                      <Megaphone size={15} aria-hidden="true" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate text-sm ${
                          item.read
                            ? "font-medium text-slate-700"
                            : "font-bold text-slate-900"
                        }`}
                      >
                        {item.subject}
                      </span>

                      <span className="mt-0.5 block line-clamp-2 text-xs text-slate-500">
                        {item.message}
                      </span>

                      <span className="mt-1 block text-[11px] text-slate-400">
                        {item.sender} · {timeAgo(item.createdAt)}
                      </span>
                    </span>

                    {!item.read && (
                      <span
                        aria-label="Unread"
                        className="mt-2 h-2 w-2 shrink-0 rounded-full bg-indigo-500"
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="border-t border-slate-100 p-2">
            <Link
              href="/dashboard/announcements?tab=inbox"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              View all announcements
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}