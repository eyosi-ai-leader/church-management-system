"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Loader2, Search, X } from "lucide-react";

import { searchMembers } from "@/lib/announcementApi";

export default function MemberPicker({
  selected,
  onChange,
  ministries = [],
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [ministryId, setMinistryId] = useState("");

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
    const [unavailable, setUnavailable] = useState([]);

  const wrapperRef = useRef(null);

  // Close the list when clicking elsewhere or pressing Escape.
  useEffect(() => {
    if (!open) return;

    const handleClick = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  // Load the first page whenever the list is open and the filters change.
  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const timer = setTimeout(
      async () => {
        setLoading(true);
        setError("");

        try {
          const data = await searchMembers({
            search: query.trim(),
            ministryId,
            page: 1,
          });

          if (cancelled) return;

          setItems(data.items);
          setTotal(data.total);
          setHasMore(data.hasMore);
          setPage(1);
           setUnavailable(data.unavailable || []);
        } catch (err) {
          if (!cancelled) setError(err.message);
        } finally {
          if (!cancelled) setLoading(false);
        }
      },
      query ? 300 : 0
    );

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [open, query, ministryId]);

  async function loadMore() {
    if (loadingMore) return;

    setLoadingMore(true);
    setError("");

    try {
      const data = await searchMembers({
        search: query.trim(),
        ministryId,
        page: page + 1,
      });

      setItems((current) => {
        const known = new Set(current.map((member) => member.id));
        return [...current, ...data.items.filter((m) => !known.has(m.id))];
      });

      setHasMore(data.hasMore);
      setPage(page + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }

  const selectedIds = new Set(selected.map((member) => member.id));
  const allShownSelected =
    items.length > 0 && items.every((member) => selectedIds.has(member.id));

  function toggle(member) {
    if (selectedIds.has(member.id)) {
      onChange(selected.filter((item) => item.id !== member.id));
    } else {
      onChange([...selected, member]);
    }
  }

  function toggleAllShown() {
    if (allShownSelected) {
      const shown = new Set(items.map((member) => member.id));
      onChange(selected.filter((member) => !shown.has(member.id)));
    } else {
      onChange([
        ...selected,
        ...items.filter((member) => !selectedIds.has(member.id)),
      ]);
    }
  }

  function remove(id) {
    onChange(selected.filter((member) => member.id !== id));
  }

  return (
    <div ref={wrapperRef} className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />

          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              if (!open) setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search by name, email or member number"
            aria-label="Search members"
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />
        </div>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls="member-browse-panel"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          Browse list
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {open && (
        <div
          id="member-browse-panel"
          className="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
            <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={allShownSelected}
                onChange={toggleAllShown}
                disabled={items.length === 0}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Select all shown
            </label>

            {ministries.length > 1 && (
              <select
                value={ministryId}
                onChange={(event) => setMinistryId(event.target.value)}
                aria-label="Filter by ministry"
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">All ministries</option>
                {ministries.map((ministry) => (
                  <option key={ministry.id} value={ministry.id}>
                    {ministry.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {error && (
            <p role="alert" className="px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {loading ? (
            <p
              role="status"
              className="flex items-center gap-2 px-4 py-6 text-sm text-slate-500"
            >
              <Loader2 size={15} className="animate-spin" />
              Loading members...
            </p>
          ) : items.length === 0 && !error ? (
            <p className="px-4 py-6 text-sm text-slate-500">
              No members found. Only active members with a verified email can
              be selected.
            </p>
          ) : (
            <ul className="max-h-72 divide-y divide-slate-100 overflow-y-auto">
              {items.map((member) => (
                <li key={member.id}>
                  <label className="flex cursor-pointer items-center gap-3 px-4 py-2.5 transition hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(member.id)}
                      onChange={() => toggle(member)}
                      className="h-4 w-4 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />

                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-slate-900">
                        {member.name}
                      </span>
                      <span className="block truncate text-xs text-slate-500">
                        {member.memberNumber && `${member.memberNumber} · `}
                        {member.email}
                      </span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}
       

                 {unavailable.length > 0 && (
            <div className="border-t border-slate-100 bg-amber-50 px-4 py-3">
              <p className="text-xs font-semibold text-amber-800">
                Found, but can&apos;t receive announcements
              </p>

              <ul className="mt-2 space-y-2">
                {unavailable.map((member) => (
                  <li key={member.id} className="text-xs text-amber-900">
                    <span className="font-medium">{member.name}</span>
                    {" · "}
                    {member.email}
                    <span className="block text-amber-700">
                      {member.reason}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
            <span>
              Showing {items.length} of {total}
            </span>

            {hasMore && (
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                {loadingMore && <Loader2 size={13} className="animate-spin" />}
                Load more
              </button>
            )}
          </div>
        </div>
      )}

      {selected.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Selected ({selected.length})
            </p>

            <button
              type="button"
              onClick={() => onChange([])}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Clear all
            </button>
          </div>

          <ul className="flex max-h-32 flex-wrap gap-2 overflow-y-auto">
            {selected.map((member) => (
              <li
                key={member.id}
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 py-1 pl-3 pr-1.5 text-sm text-slate-700"
              >
                {member.name}
                <button
                  type="button"
                  onClick={() => remove(member.id)}
                  aria-label={`Remove ${member.name}`}
                  className="rounded-full p-1 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <X size={13} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}