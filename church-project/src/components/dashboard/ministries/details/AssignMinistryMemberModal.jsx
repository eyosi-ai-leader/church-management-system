"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { getMembers } from "@/lib/memberApi";
import {
  getMemberName,
  getMemberEmail,
  getMemberNumber,
  getAssignmentMemberId,
  normalizeList,
} from "./ministryMemberUtils";

export default function AssignMinistryMemberModal({
  open,
  initialRole = "Member",
  assignedIds,
  saving,
  onClose,
  onAssign,
}) {
  const [role, setRole] = useState(initialRole);
  const [people, setPeople] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setRole(initialRole);
    setSelectedId("");
    setSearch("");
    setError("");
  }, [open, initialRole]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function loadMembers() {
      setLoading(true);
      setError("");

      try {
        const response = await getMembers({
          page: 1,
          limit: 100,
          status: "Active",
          sortBy: "first_name",
          sortOrder: "asc",
        });

        if (!cancelled) {
          setPeople(normalizeList(response));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load church members.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMembers();

    return () => {
      cancelled = true;
    };
  }, [open]);

  const filteredPeople = useMemo(() => {
    const query = search.trim().toLowerCase();

    return people.filter((person) => {
      const id = getAssignmentMemberId(person);

      if (id == null || assignedIds.has(String(id))) {
        return false;
      }

      const searchableText = [
        getMemberName(person),
        getMemberEmail(person),
        getMemberNumber(person),
      ]
        .join(" ")
        .toLowerCase();

      return !query || searchableText.includes(query);
    });
  }, [people, search, assignedIds]);

  if (!open) return null;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedId) {
      setError("Please select a church member.");
      return;
    }

    setError("");

    try {
      await onAssign(Number(selectedId), role);
    } catch (err) {
      setError(err.message || "Unable to assign this person.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="assignment-title"
        className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-slate-100 p-5">
          <div>
            <h2
              id="assignment-title"
              className="text-lg font-bold text-slate-900"
            >
              {role === "Ministry Leader"
                ? "Assign ministry leader"
                : "Add ministry member"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Select an existing active church member.
            </p>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div>
            <label
              htmlFor="assignment-role"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Assignment type
            </label>

            <select
              id="assignment-role"
              value={role}
              onChange={(event) => {
                setRole(event.target.value);
                setSelectedId("");
              }}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            >
              <option value="Member">Member</option>
              <option value="Ministry Leader">Ministry Leader</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="member-search"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Search church members
            </label>

            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="member-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name, email, or member number..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200">
            {loading ? (
              <p className="p-8 text-center text-sm text-slate-500">
                Loading church members...
              </p>
            ) : filteredPeople.length === 0 ? (
              <p className="p-8 text-center text-sm text-slate-500">
                No available members match your search.
              </p>
            ) : (
              filteredPeople.map((person, index) => {
                const id = String(getAssignmentMemberId(person));

                return (
                  <label
                    key={id || index}
                    className={`flex cursor-pointer items-center gap-3 border-b border-slate-100 p-3 last:border-b-0 hover:bg-slate-50 ${
                      selectedId === id ? "bg-blue-50" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="selectedMember"
                      value={id}
                      checked={selectedId === id}
                      onChange={() => setSelectedId(id)}
                      className="h-4 w-4 accent-blue-600"
                    />

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                      {getMemberName(person).charAt(0).toUpperCase()}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-slate-800">
                        {getMemberName(person)}
                      </span>
                      <span className="block truncate text-xs text-slate-500">
                        {getMemberEmail(person)}
                      </span>
                      <span className="block text-xs text-slate-400">
                        {getMemberNumber(person)}
                      </span>
                    </span>
                  </label>
                );
              })
            )}
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              disabled={saving}
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || loading || !selectedId}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Assigning..." : "Confirm assignment"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}