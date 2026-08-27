"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Eye,
  Pencil,
  Trash2,
  UserRound,
} from "lucide-react";

import MemberActionsMenu from "./MemberActionsMenu";

function getInitials(firstName, lastName) {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
}

function getRoleName(member) {
  switch (Number(member.role_id)) {
    case 1:
      return "Admin";
    case 2:
      return "Pastor";
    case 3:
      return "Church Elder";
    case 4:
      return "Ministry Leader";
    case 5:
      return "Member";
    default:
      break;
  }

  if (member.role_name) {
    return member.role_name;
  }

  if (member.roleName) {
    return member.roleName;
  }

  return "Member";
}

function SortButton({
  field,
  label,
  sortBy,
  sortOrder,
  onSort,
}) {
  const active = sortBy === field;

  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className="group inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 transition hover:text-slate-700"
    >
      {label}

      {!active && (
        <ArrowUpDown
          size={12}
          className="opacity-0 transition group-hover:opacity-100"
        />
      )}

      {active && sortOrder === "asc" && (
        <ArrowUp
          size={12}
          className="text-slate-700"
        />
      )}

      {active && sortOrder === "desc" && (
        <ArrowDown
          size={12}
          className="text-slate-700"
        />
      )}
    </button>
  );
}

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <tr key={index}>
          <td className="px-5 py-4">
            <div className="flex animate-pulse items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-100" />

              <div className="space-y-2">
                <div className="h-3.5 w-32 rounded bg-slate-100" />
                <div className="h-3 w-24 rounded bg-slate-100" />
              </div>
            </div>
          </td>

          <td className="px-5 py-4">
            <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
          </td>

          <td className="px-5 py-4">
            <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
          </td>

          <td className="px-5 py-4">
            <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
          </td>

          <td className="px-5 py-4">
            <div className="h-6 w-16 animate-pulse rounded-full bg-slate-100" />
          </td>

          <td className="px-5 py-4">
            <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
          </td>

          <td className="px-5 py-4">
            <div className="ml-auto h-8 w-8 animate-pulse rounded-lg bg-slate-100" />
          </td>
        </tr>
      ))}
    </>
  );
}

export default function MembersTable({
  members,
  loading,
  sortBy,
  sortOrder,
  onSort,
  onDelete,
  onChangeStatus,
  onChangeRole,
}) {
  if (!loading && members.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <UserRound size={24} />
        </div>

        <h3 className="mt-4 text-sm font-bold text-slate-900">
          No members found
        </h3>

        <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400">
          Try adjusting your search or filters, or add a
          new member to your church directory.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="px-5 py-3.5 text-left">
                <SortButton
                  field="first_name"
                  label="Member"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={onSort}
                />
              </th>

              <th className="px-5 py-3.5 text-left">
                <SortButton
                  field="member_number"
                  label="Member No."
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={onSort}
                />
              </th>

              <th className="px-5 py-3.5 text-left">
                <SortButton
                  field="email"
                  label="Email"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={onSort}
                />
              </th>

              <th className="px-5 py-3.5 text-left">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Role
                </span>
              </th>

              <th className="px-5 py-3.5 text-left">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Status
                </span>
              </th>

              <th className="px-5 py-3.5 text-left">
                <SortButton
                  field="created_at"
                  label="Joined"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={onSort}
                />
              </th>

              <th className="px-5 py-3.5 text-right">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Actions
                </span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <LoadingRows />
            ) : (
              members.map((member) => {
                const firstName =
                  member.first_name ||
                  member.firstName ||
                  "";

                const lastName =
                  member.last_name ||
                  member.lastName ||
                  "";

                const fullName =
                  `${firstName} ${lastName}`.trim() ||
                  "Unnamed member";

                const initials = getInitials(
                  firstName,
                  lastName
                );

                const role = getRoleName(member);

                const status =
                  member.status || "Inactive";

                return (
                  <tr
                    key={member.id}
                    className="group transition hover:bg-slate-50/80"
                  >
                    {/* Member */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white shadow-sm">
                          {initials || (
                            <UserRound size={16} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <Link
                            href={`/dashboard/members/${member.id}`}
                            className="block truncate text-sm font-semibold text-slate-900 transition hover:text-slate-600"
                          >
                            {fullName}
                          </Link>

                          {member.phone && (
                            <p className="mt-0.5 truncate text-xs text-slate-400">
                              {member.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Member Number */}
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-medium text-slate-500">
                        {member.member_number ||
                          member.memberNumber ||
                          "—"}
                      </span>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-500">
                        {member.email || "—"}
                      </span>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                        {role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            status === "Active"
                              ? "bg-emerald-500"
                              : "bg-slate-400"
                          }`}
                        />

                        {status}
                      </span>
                    </td>

                    {/* Created */}
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium text-slate-500">
                        {member.created_at
                          ? new Date(
                              member.created_at
                            ).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "—"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/dashboard/members/${member.id}`}
                          title="View member"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Eye size={16} />
                        </Link>

                        <Link
                          href={`/dashboard/members/${member.id}/edit`}
                          title="Edit member"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Pencil size={15} />
                        </Link>

                        <button
                          type="button"
                          title="Delete member"
                          onClick={() =>
                            onDelete(member)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={15} />
                        </button>

                        <MemberActionsMenu
                          member={member}
                          onDelete={onDelete}
                          onChangeStatus={
                            onChangeStatus
                          }
                          onChangeRole={
                            onChangeRole
                          }
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}