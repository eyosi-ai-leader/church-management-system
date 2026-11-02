"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Loader2,
  Lock,
  Mail,
  Search,
  X,
} from "lucide-react";

import AccessRow from "./AccessRow";
import { FILTERS, csvCell, ACCESS_STATES } from "./accessStates";
import {
  deleteMemberAccount,
  exportMemberAccess,
  inviteMember,
  inviteMembers,
  listMemberAccess,
  setMemberStatus,
} from "@/lib/memberAccessApi";
import { getStoredUser } from "@/lib/userStorage";

// Admin and Pastor
const STAFF_ROLES = [1, 2];
const BULK_LIMIT = 25;

const plural = (count, one, many) => (count === 1 ? one : many);

export default function MemberAccessPage() {
  const [user, setUser] = useState(undefined);

  const [filter, setFilter] = useState("never");
  const [search, setSearch] = useState("");

  const [items, setItems] = useState(null);
  const [summary, setSummary] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState(null);

  const [selected, setSelected] = useState(() => new Set());
  const [busy, setBusy] = useState(null); // { id, action }
  const [bulkState, setBulkState] = useState("idle"); // idle | confirm | sending
  const [exporting, setExporting] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const isStaff = Boolean(user) && STAFF_ROLES.includes(Number(user.roleId));

  // First page, and again when the filter, search or data changes.
  useEffect(() => {
    if (!isStaff) return;

    let cancelled = false;

    const timer = setTimeout(
      async () => {
        try {
          const data = await listMemberAccess({
            filter,
            search: search.trim(),
            page: 1,
          });

          if (cancelled) return;

          setItems(data.items);
          setTotal(data.total);
          setSummary(data.summary);
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
  }, [isStaff, filter, search, reloadKey]);

  function reload() {
    setSelected(new Set());
    setReloadKey((current) => current + 1);
  }

  function changeFilter(id) {
    setFilter(id);
    setSelected(new Set());
    setNotice(null);
  }

  async function loadMore() {
    if (loadingMore) return;

    setLoadingMore(true);
    setError("");

    try {
      const data = await listMemberAccess({
        filter,
        search: search.trim(),
        page: page + 1,
      });

      setItems((current) => {
        const known = new Set(current.map((item) => item.memberId));

        return [
          ...current,
          ...data.items.filter((item) => !known.has(item.memberId)),
        ];
      });

      setHasMore(data.hasMore);
      setPage(page + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }

  async function runRow(item, action, call, successText) {
    if (busy || bulkState === "sending") return;

    setBusy({ id: item.memberId, action });
    setError("");
    setNotice(null);

    try {
      await call();
      setNotice({ type: "success", text: successText });
      reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  }

  const handleInvite = (item) =>
    runRow(
      item,
      "invite",
      () => inviteMember(item.memberId),
      `An invitation email was sent to ${item.name}.`
    );

  const handleStatus = (item) => {
    const next = item.memberStatus === "Inactive" ? "Active" : "Inactive";

    return runRow(
      item,
      "status",
      () => setMemberStatus(item.memberId, next),
      `${item.name} is now ${next.toLowerCase()}.`
    );
  };

  const handleDelete = (item) =>
    runRow(
      item,
      "delete",
      () => deleteMemberAccount(item.memberId),
      `${item.name} was deleted.`
    );

  function toggleOne(memberId) {
    setSelected((current) => {
      const next = new Set(current);

      if (next.has(memberId)) {
        next.delete(memberId);
      } else if (next.size < BULK_LIMIT) {
        next.add(memberId);
      }

      return next;
    });
  }

  const selectable = items ? items.filter((item) => item.canInvite) : [];

  const allShownSelected =
    selectable.length > 0 &&
    selectable.slice(0, BULK_LIMIT).every((item) => selected.has(item.memberId));

  function toggleAllShown() {
    if (allShownSelected) {
      setSelected(new Set());
      return;
    }

    setSelected(
      new Set(selectable.slice(0, BULK_LIMIT).map((item) => item.memberId))
    );
  }

  async function handleBulk() {
    setBulkState("sending");
    setError("");
    setNotice(null);

    try {
      const result = await inviteMembers([...selected]);

      const problems = [...result.skipped, ...result.failed].map(
        (entry) => `${entry.name}: ${entry.reason}`
      );

      setNotice({
        type: problems.length > 0 ? "warning" : "success",
        text: `${result.sent} ${plural(result.sent, "invitation", "invitations")} sent${
          problems.length > 0
            ? `, ${problems.length} could not be sent.`
            : "."
        }`,
        details: problems,
      });

      reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBulkState("idle");
    }
  }

  async function handleExport() {
    if (exporting) return;

    setExporting(true);
    setError("");

    try {
      const rows = await exportMemberAccess({ filter, search: search.trim() });

      const header = [
        "Name",
        "Email",
        "Role",
        "Member number",
        "Access status",
        "Member status",
        "Joined",
        "Last signed in",
        "Invitation last sent",
        "Invitations sent",
      ];

      const lines = rows.map((row) => [
        row.name,
        row.email,
        row.role,
        row.memberNumber,
        ACCESS_STATES[row.state]?.label || row.state,
        row.memberStatus,
        row.joinedAt ? new Date(row.joinedAt).toLocaleDateString() : "",
        row.lastLoginAt ? new Date(row.lastLoginAt).toLocaleString() : "",
        row.invitedAt ? new Date(row.invitedAt).toLocaleString() : "",
        row.inviteCount,
      ]);

      const csv = [header, ...lines]
        .map((line) => line.map(csvCell).join(","))
        .join("\r\n");

      const blob = new Blob([`\uFEFF${csv}`], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "member-access.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setExporting(false);
    }
  }

  if (user === undefined) return null;

  if (!isStaff) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <Lock className="mx-auto h-10 w-10 text-slate-300" aria-hidden="true" />
        <h1 className="mt-4 text-xl font-semibold text-slate-900">
          You don&apos;t have access to this page
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Member access can be managed by pastors and administrators.
        </p>
      </div>
    );
  }

  const bulkSending = bulkState === "sending";
  const searching = search.trim().length > 0;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Member Access
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          See who hasn&apos;t signed in yet, and send them an invitation to
          set their password.
        </p>
      </div>

      {/* Summary tiles (they also work as filters) */}
      <div
        role="group"
        aria-label="Filter members"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
      >
        {FILTERS.map((entry) => {
          const active = filter === entry.id;
          const value = summary ? summary[entry.count] : "-";

          return (
            <button
              key={entry.id}
              type="button"
              aria-pressed={active}
              onClick={() => changeFilter(entry.id)}
              className={`rounded-xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                active
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span
                className={`block text-2xl font-bold ${
                  active ? "text-white" : "text-slate-900"
                }`}
              >
                {value}
              </span>
              <span
                className={`block text-xs font-medium ${
                  active ? "text-white/75" : "text-slate-500"
                }`}
              >
                {entry.label}
              </span>
            </button>
          );
        })}
      </div>

      <p className="rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
        Sign-in tracking is new. Members who signed in before it was added
        appear as &quot;Never signed in&quot; until their next sign-in.
      </p>

      {/* Toolbar */}
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
            placeholder="Search by name, email or number"
            aria-label="Search members"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />
        </div>

        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-60"
        >
          {exporting ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Download size={15} aria-hidden="true" />
          )}
          Download CSV
        </button>
      </div>

      {notice && (
        <div
          role="status"
          className={`rounded-xl border px-4 py-3 text-sm ${
            notice.type === "warning"
              ? "border-amber-200 bg-amber-50 text-amber-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          <div className="flex items-start gap-3">
            {notice.type === "warning" ? (
              <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            ) : (
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            )}

            <div className="min-w-0 flex-1">
              <p>{notice.text}</p>

              {notice.details?.length > 0 && (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
                  {notice.details.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="button"
              onClick={() => setNotice(null)}
              aria-label="Dismiss message"
              className="rounded-md p-1 transition hover:bg-black/5"
            >
              <X size={16} />
            </button>
          </div>
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

      {/* Bulk bar */}
      {selected.size > 0 && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
          {bulkState === "idle" ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-indigo-900">
                {selected.size} selected
                {selected.size >= BULK_LIMIT && ` (the limit is ${BULK_LIMIT} at a time)`}
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelected(new Set())}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                >
                  Clear
                </button>

                <button
                  type="button"
                  onClick={() => setBulkState("confirm")}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
                >
                  <Mail size={15} aria-hidden="true" />
                  Send invitations
                </button>
              </div>
            </div>
          ) : (
            <div role="alertdialog" aria-label="Confirm sending invitations">
              <p className="text-sm font-semibold text-indigo-900">
                Email an invitation to {selected.size}{" "}
                {plural(selected.size, "member", "members")}?
              </p>
              <p className="mt-1 text-sm text-indigo-800">
                Each one gets a personal link to set their password. It takes
                about a second per email, so please keep this page open.
              </p>

              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setBulkState("idle")}
                  disabled={bulkSending}
                  className="rounded-xl border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-900 transition hover:bg-indigo-100 disabled:opacity-60"
                >
                  Go back
                </button>

                <button
                  type="button"
                  onClick={handleBulk}
                  disabled={bulkSending}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-60"
                >
                  {bulkSending && <Loader2 size={15} className="animate-spin" />}
                  {bulkSending ? "Sending..." : "Yes, send them"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* List */}
      {!items && !error && (
        <div
          role="status"
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-16 text-sm text-slate-500"
        >
          <Loader2 size={18} className="animate-spin" />
          Loading members...
        </div>
      )}

      {items && items.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          {searching
            ? "No members match your search."
            : filter === "never"
            ? "Everyone has signed in. Nothing to follow up."
            : "No members in this group."}
        </div>
      )}

      {items && items.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
            <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={allShownSelected}
                onChange={toggleAllShown}
                disabled={selectable.length === 0 || bulkSending}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-30"
              />
              Select shown (up to {BULK_LIMIT})
            </label>

            <p className="text-xs text-slate-500">
              {total} {plural(total, "member", "members")}
            </p>
          </div>

          <ul className="divide-y divide-slate-100">
            {items.map((item) => (
              <AccessRow
                key={item.memberId}
                item={item}
                selected={selected.has(item.memberId)}
                onToggle={() => toggleOne(item.memberId)}
                busy={busy?.id === item.memberId ? busy.action : null}
                anyBusy={Boolean(busy) || bulkSending}
                onInvite={() => handleInvite(item)}
                onToggleStatus={() => handleStatus(item)}
                onDelete={() => handleDelete(item)}
              />
            ))}
          </ul>
        </div>
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