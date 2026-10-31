"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Loader2, RotateCcw, Search } from "lucide-react";

import {
  getAnnouncementDetails,
  retryAnnouncement,
  retryRecipient,
} from "@/lib/announcementApi";

const BADGE = {
  sent: { label: "Emailed", className: "bg-emerald-50 text-emerald-700" },
  failed: { label: "Failed", className: "bg-red-50 text-red-700" },
  pending: { label: "Waiting", className: "bg-slate-100 text-slate-600" },
  skipped: { label: "Not emailed", className: "bg-slate-100 text-slate-500" },
};

const FILTERS = [
  { id: "all", label: "All", kind: "all", test: () => true },
  { id: "failed", label: "Failed", kind: "email", test: (r) => r.status === "failed" },
  { id: "pending", label: "Waiting", kind: "email", test: (r) => r.status === "pending" },
  { id: "sent", label: "Emailed", kind: "email", test: (r) => r.status === "sent" },
  { id: "skipped", label: "Not emailed", kind: "email", test: (r) => r.status === "skipped" },
  { id: "unread", label: "Not read", kind: "read", test: (r) => !r.read },
  { id: "read", label: "Read", kind: "read", test: (r) => r.read },
];

// Stops spreadsheet programs from running a cell as a formula.
const csvCell = (value) => {
  let text = String(value ?? "");

  if (/^[=+\-@]/.test(text)) text = `'${text}`;

  return `"${text.replace(/"/g, '""')}"`;
};

function downloadCsv(details) {
  const showsRead = details.delivery !== "email";

  const header = ["Name", "Email", "Email status", "Reason", "Emailed at"];

  if (showsRead) header.push("Read", "Read at");

  const rows = details.recipients.map((recipient) => {
    const row = [
      recipient.name,
      recipient.email,
      BADGE[recipient.status]?.label || recipient.status,
      recipient.reason,
      recipient.sentAt ? new Date(recipient.sentAt).toLocaleString() : "",
    ];

    if (showsRead) {
      row.push(
        recipient.read ? "Yes" : "No",
        recipient.readAt ? new Date(recipient.readAt).toLocaleString() : ""
      );
    }

    return row;
  });

  const csv = [header, ...rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\r\n");

  const blob = new Blob([`\uFEFF${csv}`], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `announcement-${details.id}-recipients.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function Tile({ label, value, tone = "text-slate-900" }) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className={`mt-1 text-xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}

export default function AnnouncementDetails({ announcementId, onChanged }) {
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(null); // "all" or a recipient id

  const load = useCallback(async () => {
    try {
      const data = await getAnnouncementDetails(announcementId);
      setDetails(data);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }, [announcementId]);

  useEffect(() => {
    load();
  }, [load]);

  const sending = details?.status === "sending";

  // Refresh while emails are still going out.
  useEffect(() => {
    if (!sending) return;

    const timer = setInterval(() => {
      load();
      onChanged?.();
    }, 4000);

    return () => clearInterval(timer);
  }, [sending, load, onChanged]);

  const filters = useMemo(() => {
    if (!details) return [];

    const showsEmail = details.delivery !== "dashboard";
    const showsRead = details.delivery !== "email";

    return FILTERS.map((item) => ({
      ...item,
      count: details.recipients.filter(item.test).length,
    })).filter((item) => {
      if (item.kind === "all") return true;
      if (item.kind === "email") return showsEmail && item.count > 0;
      return showsRead;
    });
  }, [details]);

  const visible = useMemo(() => {
    if (!details) return [];

    const active = FILTERS.find((item) => item.id === filter) || FILTERS[0];
    const term = search.trim().toLowerCase();

    return details.recipients.filter((recipient) => {
      if (!active.test(recipient)) return false;

      if (!term) return true;

      return (
        recipient.name.toLowerCase().includes(term) ||
        recipient.email.toLowerCase().includes(term)
      );
    });
  }, [details, filter, search]);

  async function run(key, action) {
    if (busy) return;

    setBusy(key);
    setError("");

    try {
      await action();
      await load();
      onChanged?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  }

  if (!details && !error) {
    return (
      <div
        role="status"
        className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm text-slate-500"
      >
        <Loader2 size={16} className="animate-spin" />
        Loading details...
      </div>
    );
  }

  const showsEmail = details?.delivery !== "dashboard";
  const showsRead = details?.delivery !== "email";

  return (
    <div className="mt-4 space-y-5 border-t border-slate-100 pt-5">
      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {details && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            <Tile label="Recipients" value={details.recipients.length} />

            {showsRead && (
              <Tile
                label="Read"
                value={`${details.readCount} / ${details.total}`}
                tone="text-indigo-600"
              />
            )}

            {showsEmail && (
              <>
                <Tile label="Emailed" value={details.sent} tone="text-emerald-600" />
                <Tile
                  label="Failed"
                  value={details.failed}
                  tone={details.failed > 0 ? "text-red-600" : "text-slate-900"}
                />
                <Tile label="Waiting" value={details.pending} />
              </>
            )}

            {details.optedOut > 0 && (
              <Tile label="Opted out of email" value={details.optedOut} />
            )}
          </div>

          {showsEmail && (
            <p className="rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
              &quot;Emailed&quot; means the mail server accepted the email. If
              an address doesn&apos;t exist, a bounce notice (&quot;Mail
              Delivery Subsystem&quot;) arrives in the sending Gmail inbox.
            </p>
          )}

          <details className="text-sm">
            <summary className="cursor-pointer select-none font-semibold text-indigo-600 hover:text-indigo-700">
              View message
            </summary>

            <p className="mt-2 whitespace-pre-wrap break-words rounded-xl bg-slate-50 p-4 text-slate-700">
              {details.message}
            </p>
          </details>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              role="group"
              aria-label="Filter recipients"
              className="inline-flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1"
            >
              {filters.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={filter === item.id}
                  onClick={() => setFilter(item.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    filter === item.id
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {item.label} ({item.count})
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {details.canRetry && (
                <button
                  type="button"
                  onClick={() =>
                    run("all", () => retryAnnouncement(details.id))
                  }
                  disabled={Boolean(busy)}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-60"
                >
                  {busy === "all" ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <RotateCcw size={14} aria-hidden="true" />
                  )}
                  Retry all unsent ({details.failed + details.pending})
                </button>
              )}

              <button
                type="button"
                onClick={() => downloadCsv(details)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <Download size={14} aria-hidden="true" />
                Download CSV
              </button>
            </div>
          </div>

          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search recipients by name or email"
              aria-label="Search recipients"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          {visible.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">
              No recipients match.
            </p>
          ) : (
            <ul className="max-h-96 divide-y divide-slate-100 overflow-y-auto rounded-xl border border-slate-200">
              {visible.map((recipient) => {
                const badge = BADGE[recipient.status] || BADGE.pending;

                return (
                  <li
                    key={recipient.id}
                    className="flex flex-wrap items-start justify-between gap-3 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {recipient.name}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {recipient.email}
                      </p>

                      {recipient.reason && (
                        <p
                          className={`mt-1 text-xs ${
                            recipient.status === "failed"
                              ? "text-red-600"
                              : "text-slate-500"
                          }`}
                        >
                          {recipient.reason}
                        </p>
                      )}

                      {recipient.status === "sent" && recipient.sentAt && (
                        <p className="mt-1 text-xs text-slate-400">
                          Emailed {new Date(recipient.sentAt).toLocaleString()}
                        </p>
                      )}

                      {showsRead && (
                        <p
                          className={`mt-1 text-xs ${
                            recipient.read
                              ? "text-emerald-600"
                              : "text-slate-400"
                          }`}
                        >
                          {recipient.read
                            ? `Read ${
                                recipient.readAt
                                  ? new Date(recipient.readAt).toLocaleString()
                                  : ""
                              }`
                            : "Not read yet"}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {showsEmail && (
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      )}

                      {recipient.status === "failed" && !details.isRunning && (
                        <button
                          type="button"
                          onClick={() =>
                            run(recipient.id, () =>
                              retryRecipient(details.id, recipient.id)
                            )
                          }
                          disabled={Boolean(busy)}
                          aria-label={`Retry sending to ${recipient.name}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                        >
                          {busy === recipient.id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <RotateCcw size={13} aria-hidden="true" />
                          )}
                          Retry
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}