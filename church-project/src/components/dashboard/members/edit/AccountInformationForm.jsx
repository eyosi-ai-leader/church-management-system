"use client";

import { AlertTriangle, Loader2, Mail } from "lucide-react";

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getAccess(member) {
  if (member?.last_login_at) {
    return {
      label: "Signed in",
      detail: `Last signed in ${formatDateTime(member.last_login_at)}`,
      className: "bg-emerald-50 text-emerald-700",
    };
  }

  if (member?.invited_at) {
    const count = Number(member.invite_count || 0);

    return {
      label: "Invitation sent",
      detail: `Sent ${formatDateTime(member.invited_at)}${
        count > 1 ? ` (${count} times)` : ""
      }. Waiting for them to set a password.`,
      className: "bg-blue-50 text-blue-700",
    };
  }

  if (!member?.email_verified_at) {
    return {
      label: "Email not verified",
      detail: "They have not confirmed their email address yet.",
      className: "bg-amber-50 text-amber-700",
    };
  }

  return {
    label: "Not signed in",
    detail: "They have not signed in yet.",
    className: "bg-slate-100 text-slate-600",
  };
}

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <p className="mb-2 block text-sm font-medium text-slate-700">{label}</p>

      <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-medium text-slate-500">
        {value}
      </div>
    </div>
  );
}

export default function AccountInformationForm({
  member,
  canInvite = false,
  emailChanged = false,
  inviting = false,
  onInvite,
}) {
  const access = getAccess(member);
  const signedIn = Boolean(member?.last_login_at);
  const inactive = member?.status === "Inactive";

  const showInvite = canInvite && !signedIn;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">
          Account Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Sign-in status and system details. Members choose their own
          password.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <ReadOnlyField label="User ID" value={member?.user_id || "—"} />
        <ReadOnlyField label="Created" value={formatDate(member?.created_at)} />
        <ReadOnlyField
          label="Last updated"
          value={formatDate(member?.updated_at)}
        />
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">
              Sign-in status
            </p>

            <span
              className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${access.className}`}
            >
              {access.label}
            </span>

            <p className="mt-2 text-sm text-slate-500">{access.detail}</p>

            {signedIn && (
              <p className="mt-1 text-xs text-slate-400">
                If they forgot their password, they can use &quot;Forgot
                password&quot; on the sign-in page.
              </p>
            )}
          </div>

          {showInvite && (
            <button
              type="button"
              onClick={onInvite}
              disabled={inviting || inactive || emailChanged}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {inviting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Mail size={16} aria-hidden="true" />
              )}

              {member?.invited_at ? "Resend invitation" : "Send invitation"}
            </button>
          )}
        </div>

        {showInvite && inactive && (
          <p className="mt-3 text-xs text-slate-500">
            Set the status to Active and save before sending an invitation.
          </p>
        )}

        {showInvite && emailChanged && (
          <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-amber-700">
            <AlertTriangle
              size={14}
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            />
            You changed the email address. Save your changes first, then send
            the invitation. It goes to the saved address.
          </p>
        )}
      </div>
    </div>
  );
}