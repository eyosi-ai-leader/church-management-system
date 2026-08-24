"use client";

import {
  Search,
  SlidersHorizontal,
  X,
  ArrowUpAZ,
  ArrowDownAZ,
} from "lucide-react";

export default function MemberFilters({
  filters,
  onSearch,
  onStatusChange,
  onRoleChange,
  onSortChange,
  onClear,
  hasFilters,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
        {/* Search */}
        <div className="relative min-w-0 flex-1">
          <Search
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={filters.search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search members by name, email, phone..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status */}
          <div className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3">
            <SlidersHorizontal
              size={15}
              className="text-slate-400"
            />

            <select
              value={filters.status}
              onChange={(event) =>
                onStatusChange(event.target.value)
              }
              className="bg-transparent text-sm font-medium text-slate-600 outline-none"
            >
              <option value="">All statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Role */}
          <select
            value={filters.roleId}
            onChange={(event) =>
              onRoleChange(event.target.value)
            }
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          >
            <option value="">All roles</option>

            <option value="1">Admin</option>

            <option value="2">Pastor</option>

            <option value="3">Church Elder</option>

            <option value="4">Ministry Leader</option>

            <option value="5">Member</option>
          </select>

          {/* Sorting */}
          <button
            type="button"
            onClick={() => onSort("created_at")}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            {filters.sortOrder === "asc" ? (
              <ArrowUpAZ size={15} />
            ) : (
              <ArrowDownAZ size={15} />
            )}

            <span className="hidden sm:inline">
              {filters.sortOrder === "asc"
                ? "Oldest"
                : "Newest"}
            </span>
          </button>

          {/* Clear */}
          {hasFilters && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <X size={15} />

              <span>Clear</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}