"use client";

import { Info, Mail } from "lucide-react";

const ROLES = [
  { value: "1", label: "Admin" },
  { value: "2", label: "Pastor" },
  { value: "3", label: "Church Elder" },
  { value: "4", label: "Ministry Leader" },
  { value: "5", label: "Member" },
];

const fieldClass = (error) =>
  `h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:ring-2 ${
    error
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
  }`;

export default function MemberChurchInfo({
  form,
  errors = {},
  onChange,
  isAdmin = false,
  memberNumber = "",
  showInvitation = true,
}) {
  const active = form.status === "Active";

  // Only an administrator can create or assign the Admin role.
  const roleOptions = ROLES.filter(
    (role) => isAdmin || role.value !== "1"
  );

  function handleInvitation(event) {
    onChange({
      target: {
        name: "sendInvitation",
        value: event.target.checked,
      },
    });
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">
          Church Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {showInvitation
            ? "Membership, role and sign-in invitation."
            : "Membership details and church role."}
        </p>
      </div>

      <div
        className={`grid gap-5 md:grid-cols-2 ${
          memberNumber ? "lg:grid-cols-4" : "lg:grid-cols-3"
        }`}
      >
        {memberNumber && (
          <div>
            <p className="mb-2 block text-sm font-medium text-slate-700">
              Member number
            </p>

            <div
              title="Assigned automatically and can't be changed"
              className="flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 font-mono text-sm font-medium text-slate-500"
            >
              {memberNumber}
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="roleId"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Role <span className="text-red-500">*</span>
          </label>

          <select
            id="roleId"
            name="roleId"
            value={form.roleId}
            onChange={onChange}
            aria-invalid={Boolean(errors.roleId)}
            className={fieldClass(errors.roleId)}
          >
            <option value="">Select role</option>

            {roleOptions.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>

          {errors.roleId && (
            <p role="alert" className="mt-1.5 text-xs text-red-500">
              {errors.roleId}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Status
          </label>

          <select
            id="status"
            name="status"
            value={form.status}
            onChange={onChange}
            className={fieldClass(false)}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="baptismDate"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Baptism date
          </label>

          <input
            id="baptismDate"
            type="date"
            name="baptismDate"
            value={form.baptismDate}
            onChange={onChange}
            className={fieldClass(false)}
          />
        </div>
      </div>

      {showInvitation && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <label
            className={`flex items-start gap-3 ${
              active ? "cursor-pointer" : "cursor-not-allowed opacity-70"
            }`}
          >
            <input
              type="checkbox"
              checked={active && Boolean(form.sendInvitation)}
              onChange={handleInvitation}
              disabled={!active}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
            />

            <span>
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Mail size={15} aria-hidden="true" />
                Send an invitation email now
              </span>

              <span className="mt-1 block text-sm leading-6 text-slate-500">
                {active
                  ? "The member gets a personal link to choose their own password and sign in. The link works once and expires after 48 hours."
                  : "Invitations are only sent to active members."}
              </span>
            </span>
          </label>

          {active && !form.sendInvitation && (
            <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-amber-700">
              <Info size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
              Without an invitation this person can&apos;t sign in yet. You
              can send one later from Member Access, or from the Access column
              in the members list.
            </p>
          )}
        </div>
      )}
    </div>
  );
}