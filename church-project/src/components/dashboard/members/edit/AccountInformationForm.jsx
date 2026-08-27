"use client";

import { LockKeyhole } from "lucide-react";

export default function AccountInformationForm({
  member,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <h2 className="text-sm font-bold text-slate-900">
          Account Information
        </h2>

        <p className="mt-0.5 text-xs text-slate-400">
          System account information and metadata.
        </p>
      </div>

      <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <ReadOnlyField
          label="User ID"
          value={member?.user_id || "—"}
        />

        <ReadOnlyField
          label="Created"
          value={formatDate(member?.created_at)}
        />

        <ReadOnlyField
          label="Last Updated"
          value={formatDate(member?.updated_at)}
        />

        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-700">
            Password
          </label>

          <button
            type="button"
            disabled
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-semibold text-slate-400"
          >
            <LockKeyhole size={15} />
            Change Password
          </button>

          <p className="mt-1.5 text-[11px] text-slate-400">
            Password management will be handled separately.
          </p>
        </div>
      </div>
    </section>
  );
}

function ReadOnlyField({
  label,
  value,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-700">
        {label}
      </label>

      <div className="flex h-10 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-500">
        {value}
      </div>
    </div>
  );
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}