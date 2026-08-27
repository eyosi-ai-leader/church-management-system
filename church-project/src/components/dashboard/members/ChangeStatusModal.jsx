"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Loader2,
  X,
} from "lucide-react";

const statuses = [
  {
    value: "Active",
    label: "Active",
    description:
      "Member is currently active in the church.",
  },
  {
    value: "Inactive",
    label: "Inactive",
    description:
      "Member is currently inactive in the church.",
  },
];

export default function ChangeStatusModal({
  member,
  open,
  onClose,
  onConfirm,
  saving = false,
}) {
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    if (member) {
      setStatus(
        member.status || "Active"
      );
    }
  }, [member]);

  if (!open || !member) {
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

  const fullName =
    `${firstName} ${lastName}`.trim() ||
    "Unnamed member";

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!onConfirm) {
      return;
    }

    await onConfirm(
      member,
      status
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !saving
        ) {
          onClose?.();
        }
      }}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-status-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h2
              id="change-status-title"
              className="text-sm font-bold text-slate-900"
            >
              Change Member Status
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Update the membership status for{" "}
              <span className="font-semibold text-slate-500">
                {fullName}
              </span>
              .
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            title="Close"
          >
            <X size={17} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-3 p-5 sm:p-6">
            <label className="block text-xs font-semibold text-slate-700">
              Membership Status
            </label>

            <div className="space-y-2">
              {statuses.map((item) => {
                const selected =
                  status === item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    disabled={saving}
                    onClick={() =>
                      setStatus(item.value)
                    }
                    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                      selected
                        ? "border-slate-400 bg-slate-50"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                        selected
                          ? "border-slate-900 bg-slate-900"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {selected && (
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </span>

                    <span className="min-w-0">
                      <span className="block text-xs font-semibold text-slate-800">
                        {item.label}
                      </span>

                      <span className="mt-0.5 block text-[11px] leading-4 text-slate-400">
                        {item.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                saving ||
                status ===
                  (member.status ||
                    "Active")
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                  Updating...
                </>
              ) : (
                <>
                  <Check size={15} />
                  Update Status
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}