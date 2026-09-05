// PersonalMembershipCard.jsx

"use client";

import {
  BadgeCheck,
  CalendarDays,
  Hash,
  ShieldCheck,
  UserRound,
} from "lucide-react";

export default function PersonalMembershipCard({ member }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Membership
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Your church membership information
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <MembershipItem
          icon={Hash}
          label="Member Number"
          value={member?.memberNumber}
        />

        <MembershipItem
          icon={UserRound}
          label="Role"
          value={member?.roleName}
        />

        <MembershipItem
          icon={ShieldCheck}
          label="Status"
          value={member?.status}
          status
        />

        <MembershipItem
          icon={CalendarDays}
          label="Member Since"
          value={formatDate(member?.memberSince)}
        />
      </div>
    </section>
  );
}

function MembershipItem({
  icon: Icon,
  label,
  value,
  status = false,
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
          <Icon className="h-4 w-4" strokeWidth={1.8} />
        </div>

        <span className="text-sm text-slate-500">
          {label}
        </span>
      </div>

      {status ? (
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
            String(value).toLowerCase() === "active"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          <BadgeCheck className="h-3.5 w-3.5" />

          {value || "Unknown"}
        </span>
      ) : (
        <span className="shrink-0 text-right text-sm font-semibold text-slate-800">
          {value || "Not provided"}
        </span>
      )}
    </div>
  );
}

function formatDate(value) {
  if (!value) {
    return "Not provided";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not provided";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}