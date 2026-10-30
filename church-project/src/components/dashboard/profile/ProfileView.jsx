import { Lock, Pencil } from "lucide-react";

import UserAvatar from "@/components/shared/Avatar/UserAvatar";

function formatDate(value) {
  if (!value) return "";

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) return value;

  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Item({ label, value, className = "" }) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 whitespace-pre-line break-words text-sm font-medium text-slate-800">
        {value || <span className="font-normal text-slate-400">Not set</span>}
      </dd>
    </div>
  );
}

export default function ProfileView({ profile, onEdit }) {
  const fullName = [profile.firstName, profile.middleName, profile.lastName]
    .filter(Boolean)
    .join(" ");

  const memberSince = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
      })
    : "";

  const active = profile.status === "Active";

  return (
    <div className="space-y-6">
      {/* Summary */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <UserAvatar
            user={profile}
            className="h-24 w-24 text-2xl"
          />

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h2 className="truncate text-xl font-bold text-slate-900">
              {fullName}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {profile.roleName}
              {memberSince && ` · Joined ${memberSince}`}
            </p>

            {profile.status && (
              <span
                className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  active
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full ${
                    active ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />
                {profile.status}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <Pencil size={16} aria-hidden="true" />
            Edit profile
          </button>
        </div>
      </section>

      {/* Personal */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Personal information
        </h2>

        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Item label="Full name" value={fullName} />
          <Item label="Gender" value={profile.gender} />
          <Item
            label="Date of birth"
            value={formatDate(profile.dateOfBirth)}
          />
        </dl>
      </section>

      {/* Contact */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Contact information
        </h2>

        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Item label="Email" value={profile.email} />
          <Item label="Phone number" value={profile.phone} />
          <Item
            label="Address"
            value={profile.address}
            className="sm:col-span-2"
          />
        </dl>
      </section>

      {/* Church record */}
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <div className="flex items-start gap-3">
          <Lock
            size={18}
            className="mt-0.5 text-slate-400"
            aria-hidden="true"
          />

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Church record
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              These details are managed by the church office. Contact them if
              something needs to change.
            </p>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Item label="Member number" value={profile.memberNumber} />
          <Item label="Role" value={profile.roleName} />
          <Item label="Status" value={profile.status} />
          <Item
            label="Baptism date"
            value={formatDate(profile.baptismDate)}
          />
        </dl>
      </section>
    </div>
  );
}