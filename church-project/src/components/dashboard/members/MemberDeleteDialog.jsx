"use client";

import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";

export default function MemberDeleteDialog({
  member,
  deleting,
  onCancel,
  onConfirm,
}) {
  if (!member) {
    return null;
  }

  const firstName =
    member.first_name ||
    member.firstName ||
    "";

  const lastName =
    member.last_name ||
    member.lastName ||
    "";

  const name =
    `${firstName} ${lastName}`.trim() ||
    "this member";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertTriangle size={19} />
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Delete member
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-sm leading-6 text-slate-600">
            Are you sure you want to permanently delete{" "}
            <span className="font-semibold text-slate-900">
              {name}
            </span>
            ?
          </p>

          {member.member_number && (
            <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Member number
              </p>

              <p className="mt-1 font-mono text-xs font-semibold text-slate-700">
                {member.member_number}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/50 p-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? (
              <>
                <Loader2
                  size={15}
                  className="animate-spin"
                />

                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={15} />

                Delete member
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}