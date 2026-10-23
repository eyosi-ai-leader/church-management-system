"use client";

import Link from "next/link";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Building2,
  Download,
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
      return member.role_name || member.roleName || "Member";
  }
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
        <ArrowUp size={12} className="text-slate-700" />
      )}

      {active && sortOrder === "desc" && (
        <ArrowDown size={12} className="text-slate-700" />
      )}
    </button>
  );
}

function LoadingRows({ isMinistryLeader }) {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <tr key={index}>
          <td className="px-4 py-4">
            <div className="flex animate-pulse items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100" />

              <div className="min-w-0 space-y-2">
                <div className="h-3.5 w-32 rounded bg-slate-100" />
                <div className="h-3 w-24 rounded bg-slate-100" />
              </div>
            </div>
          </td>

          <td className="px-3 py-4">
            <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
          </td>

          {isMinistryLeader && (
            <td className="px-3 py-4">
              <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
            </td>
          )}

          <td className="px-3 py-4">
            <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />
          </td>

          <td className="px-3 py-4">
            <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
          </td>

          <td className="px-3 py-4">
            <div className="h-6 w-16 animate-pulse rounded-full bg-slate-100" />
          </td>

          <td className="px-3 py-4">
            <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
          </td>

          <td className="px-3 py-4">
            <div className="ml-auto h-8 w-20 animate-pulse rounded-lg bg-slate-100" />
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
  canManage,
  isMinistryLeader = false,
  onExport,
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
          {isMinistryLeader
            ? "No assignments match this ministry and your current filters. Try selecting another ministry or clearing your filters."
            : "Try adjusting your search or filters, or add a new member to your church directory."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {onExport && (
        <div className="flex justify-end border-b border-slate-100 px-4 py-3">
          <button
            type="button"
            onClick={onExport}
            disabled={!members?.length}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={16} />
            Export Excel
          </button>
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <table
          className={`w-full border-collapse ${
            isMinistryLeader ? "min-w-[1050px]" : "min-w-[950px]"
          }`}
        >
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="min-w-[220px] px-4 py-3.5 text-left">
                <SortButton
                  field="first_name"
                  label="Member"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={onSort}
                />
              </th>

              <th className="min-w-[130px] px-3 py-3.5 text-left">
                <SortButton
                  field="member_number"
                  label="Member No."
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={onSort}
                />
              </th>

              {isMinistryLeader && (
                <th className="min-w-[165px] px-3 py-3.5 text-left">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Ministry
                  </span>
                </th>
              )}

              <th className="min-w-[210px] px-3 py-3.5 text-left">
                <SortButton
                  field="email"
                  label="Email"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={onSort}
                />
              </th>

              <th className="min-w-[135px] px-3 py-3.5 text-left">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {isMinistryLeader ? "Assignment" : "Role"}
                </span>
              </th>

              <th className="min-w-[110px] px-3 py-3.5 text-left">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Status
                </span>
              </th>

              <th className="min-w-[125px] px-3 py-3.5 text-left">
                <SortButton
                  field="created_at"
                  label="Joined"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={onSort}
                />
              </th>

              <th className="min-w-[100px] px-3 py-3.5 text-right">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Actions
                </span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <LoadingRows isMinistryLeader={isMinistryLeader} />
            ) : (
              members.map((member) => {
                const firstName =
                  member.first_name ?? member.firstName ?? "";

                const middleName =
                  member.middle_name ?? member.middleName ?? "";

                const lastName =
                  member.last_name ?? member.lastName ?? "";

                const fullName =
                  [firstName, middleName, lastName]
                    .filter(Boolean)
                    .join(" ") || "Unnamed member";

                const initials = getInitials(firstName, lastName);

                const profileImage =
                  member.profile_image ?? member.profileImage ?? null;

                const accountRole = getRoleName(member);

                const assignmentRole =
                  member.assignment_role ||
                  member.assignmentRole ||
                  "Member";

                const displayedRole = isMinistryLeader
                  ? assignmentRole
                  : accountRole;

                const status = member.status || "Inactive";

                const memberNumber =
                  member.member_number ?? member.memberNumber ?? "—";

                const ministryName = member.ministry_name || "—";

                const phone = member.phone || member.user_phone || "";

                return (
                  <tr
                    key={`${member.id}-${member.ministry_id ?? "all"}`}
                    className="group transition hover:bg-slate-50/80"
                  >
                    {/* Member identity */}
                    <td className="max-w-0 px-4 py-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-xs font-bold text-white shadow-sm">
                          {profileImage ? (
                            <img
                              src={profileImage}
                              alt={fullName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            initials || <UserRound size={16} />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/dashboard/members/${member.id}`}
                            title={fullName}
                            className="block truncate text-sm font-semibold text-slate-900 transition hover:text-slate-600"
                          >
                            {fullName}
                          </Link>

                          {phone && (
                            <p
                              title={phone}
                              className="mt-0.5 truncate text-xs text-slate-400"
                            >
                              {phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Member number */}
                    <td className="max-w-0 px-3 py-4">
                      <span
                        title={memberNumber}
                        className="block max-w-full truncate font-mono text-[11px] font-medium text-slate-500"
                      >
                        {memberNumber}
                      </span>
                    </td>

                    {/* Ministry — displayed for Ministry Leaders */}
                    {isMinistryLeader && (
                      <td className="max-w-0 px-3 py-4">
                        <span
                          title={ministryName}
                          className="inline-flex max-w-full items-center gap-2 text-sm font-medium text-slate-700"
                        >
                          <Building2
                            size={14}
                            className="shrink-0 text-slate-400"
                          />

                          <span className="truncate">{ministryName}</span>
                        </span>
                      </td>
                    )}

                    {/* Email */}
                    <td className="max-w-0 px-3 py-4">
                      <span
                        title={member.email || ""}
                        className="block truncate text-sm text-slate-500"
                      >
                        {member.email || "—"}
                      </span>
                    </td>

                    {/* Account role or ministry assignment role */}
                    <td className="max-w-0 px-3 py-4">
                      <span
                        title={displayedRole}
                        className="inline-flex max-w-full items-center truncate rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600"
                      >
                        {displayedRole}
                      </span>
                    </td>

                    {/* Member status */}
                    <td className="max-w-0 px-3 py-4">
                      <span
                        className={`inline-flex max-w-full items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-semibold ${
                          status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                            status === "Active"
                              ? "bg-emerald-500"
                              : "bg-slate-400"
                          }`}
                        />

                        <span className="truncate">{status}</span>
                      </span>
                    </td>

                    {/* Joined date */}
                    <td className="whitespace-nowrap px-3 py-4">
                      <span className="text-xs font-medium text-slate-500">
                        {member.created_at
                          ? new Date(member.created_at).toLocaleDateString(
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
                    <td className="whitespace-nowrap px-3 py-4">
                      <div className="flex items-center justify-end gap-0.5">
                        <Link
                          href={`/dashboard/members/${member.id}`}
                          title="View member"
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Eye size={16} />
                        </Link>

                        {canManage && (
                          <>
                            <Link
                              href={`/dashboard/members/${member.id}/edit`}
                              title="Edit member"
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
                            >
                              <Pencil size={15} />
                            </Link>

                            <button
                              type="button"
                              title="Delete member"
                              onClick={() => onDelete(member)}
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={15} />
                            </button>

                            <MemberActionsMenu
                              member={member}
                              onDelete={onDelete}
                              onChangeStatus={onChangeStatus}
                              onChangeRole={onChangeRole}
                              canManage={canManage}
                            />
                          </>
                        )}
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