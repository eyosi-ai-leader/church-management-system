import Link from "next/link";
import {
  ArrowUpRight,
  Edit3,
  Power,
  Users,
  UserRound,
  Building2,
} from "lucide-react";
import MinistryStatusBadge from "./MinistryStatusBadge";

export default function MinistryTable({
  ministries = [],
  onEdit,
  onToggleStatus,
  updatingId,
}) {
  if (!ministries.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <Building2 size={23} />
        </span>
        <h3 className="mt-4 text-base font-semibold text-slate-900">
          No ministries found
        </h3>
        <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
          Try changing your search or status filter, or create a new ministry.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Ministry
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Members
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Leaders
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>
              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {ministries.map((ministry) => (
              <tr key={ministry.id} className="transition hover:bg-slate-50/80">
                <td className="px-5 py-4">
                  <div className="font-semibold text-slate-900">
                    {ministry.name}
                  </div>
                  <p className="mt-1 max-w-sm truncate text-sm text-slate-500">
                    {ministry.description || "No description provided"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    ID: {ministry.id}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <Users size={16} className="text-slate-400" />
                    {Number(ministry.member_count || 0)}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <UserRound size={16} className="text-slate-400" />
                    {Number(ministry.leader_count || 0)}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <MinistryStatusBadge status={ministry.status} />
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/dashboard/ministries/${ministry.id}`}
                      title="View ministry"
                      aria-label={`View ${ministry.name}`}
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-700"
                    >
                      <ArrowUpRight size={17} />
                    </Link>

                    <button
                      type="button"
                      title="Edit ministry"
                      aria-label={`Edit ${ministry.name}`}
                      onClick={() => onEdit(ministry)}
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      <Edit3 size={16} />
                    </button>

                    <button
                      type="button"
                      title={ministry.status === "Active" ? "Deactivate ministry" : "Activate ministry"}
                      aria-label={`${ministry.status === "Active" ? "Deactivate" : "Activate"} ${ministry.name}`}
                      disabled={updatingId === ministry.id}
                      onClick={() => onToggleStatus(ministry)}
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-amber-50 hover:text-amber-700 disabled:opacity-50"
                    >
                      <Power size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
        Showing {ministries.length} {ministries.length === 1 ? "ministry" : "ministries"}
      </div>
    </div>
  );
}
