"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  Loader2,
  Plus,
  Search,
  X,
} from "lucide-react";

import EventListItem from "./EventListItem";
import { deleteEvent, listEvents, setEventStatus } from "@/lib/eventsApi";
import { getStoredUser } from "@/lib/userStorage";

// Admin, Pastor, Ministry Leader
const CREATOR_ROLES = [1, 2, 4];

const SAVED_MESSAGES = {
  created: "The event was created and is now live.",
  updated: "The event was updated.",
};

const TABS = [
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
];

export default function EventsPage() {
  const router = useRouter();
  const params = useSearchParams();

  const [user, setUser] = useState(undefined);

  const [tab, setTab] = useState("upcoming");
  const [search, setSearch] = useState("");

  const [items, setItems] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(null); // { id, action }
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  // Message shown after saving in the editor.
  useEffect(() => {
    const saved = params.get("saved");

    if (saved && SAVED_MESSAGES[saved]) {
      setNotice(SAVED_MESSAGES[saved]);
      router.replace("/dashboard/events", { scroll: false });
    }
  }, [params, router]);

  useEffect(() => {
    if (!notice) return;

    const timer = setTimeout(() => setNotice(""), 6000);

    return () => clearTimeout(timer);
  }, [notice]);

  // First page, and again when the tab, search or data changes.
  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(
      async () => {
        try {
          const data = await listEvents({
            scope: tab,
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
  }, [tab, search, reloadKey]);

  function changeTab(id) {
    setTab(id);
    setItems(null);
    setNotice("");
  }

  async function loadMore() {
    if (loadingMore) return;

    setLoadingMore(true);
    setError("");

    try {
      const data = await listEvents({
        scope: tab,
        search: search.trim(),
        page: page + 1,
      });

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

  async function run(item, action, call, text) {
    if (busy) return;

    setBusy({ id: item.id, action });
    setError("");
    setNotice("");

    try {
      await call();
      setNotice(text);
      setReloadKey((current) => current + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  }

  const handleToggleCancel = (item) => {
    const next = item.cancelled ? "published" : "cancelled";

    return run(
      item,
      "status",
      () => setEventStatus(item.id, next),
      item.cancelled
        ? `"${item.title}" is open again.`
        : `"${item.title}" was cancelled. People will see it marked as cancelled.`
    );
  };

  const handleDelete = (item) =>
    run(
      item,
      "delete",
      () => deleteEvent(item.id),
      `"${item.title}" was deleted.`
    );

  if (user === undefined) return null;

  const canCreate = Boolean(user) && CREATOR_ROLES.includes(Number(user.roleId));
  const searching = search.trim().length > 0;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Events
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {canCreate
              ? "Add and manage church events. They appear on the website and in member dashboards automatically."
              : "Upcoming gatherings and activities at your church."}
          </p>
        </div>

        {canCreate && (
          <Link
            href="/dashboard/events/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
          >
            <Plus size={17} aria-hidden="true" />
            Add event
          </Link>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Event period"
          className="inline-flex rounded-xl bg-slate-100 p-1"
        >
          {TABS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={tab === entry.id}
              onClick={() => changeTab(entry.id)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                tab === entry.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {entry.label}
            </button>
          ))}
        </div>

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
            placeholder="Search events"
            aria-label="Search events"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />
        </div>
      </div>

      {notice && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          <CheckCircle2 size={18} className="shrink-0" aria-hidden="true" />
          <span className="flex-1">{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss message"
            className="rounded-md p-1 transition hover:bg-emerald-100"
          >
            <X size={16} />
          </button>
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

      {!items && !error && (
        <div
          role="status"
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-16 text-sm text-slate-500"
        >
          <Loader2 size={18} className="animate-spin" />
          Loading events...
        </div>
      )}

      {items && items.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <CalendarDays
            size={30}
            className="mx-auto text-slate-300"
            aria-hidden="true"
          />

          <p className="mt-3 text-sm font-medium text-slate-600">
            {searching
              ? "No events match your search."
              : tab === "upcoming"
              ? "No upcoming events."
              : "No past events yet."}
          </p>

          {canCreate && tab === "upcoming" && !searching && (
            <Link
              href="/dashboard/events/new"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              <Plus size={15} aria-hidden="true" />
              Add the first event
            </Link>
          )}
        </div>
      )}

      {items?.map((item) => (
        <EventListItem
          key={item.id}
          item={item}
          busy={busy?.id === item.id ? busy.action : null}
          anyBusy={Boolean(busy)}
          onToggleCancel={() => handleToggleCancel(item)}
          onDelete={() => handleDelete(item)}
        />
      ))}

      {items && total > 0 && (
        <p className="text-center text-xs text-slate-400">
          Showing {items.length} of {total}
        </p>
      )}

      {hasMore && (
        <div className="flex justify-center">
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