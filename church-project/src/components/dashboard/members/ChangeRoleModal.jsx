"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Loader2,
  ShieldCheck,
  X,
} from "lucide-react";

const roles = [
  {
    id: 1,
    name: "Admin",
    description:
      "Full administrative access to the system.",
  },
  {
    id: 2,
    name: "Pastor",
    description:
      "Pastoral access and church management responsibilities.",
  },
  {
    id: 3,
    name: "Church Elder",
    description:
      "Church elder responsibilities and member oversight.",
  },
  {
    id: 4,
    name: "Ministry Leader",
    description:
      "Ministry leadership and member management responsibilities.",
  },
  {
    id: 5,
    name: "Member",
    description:
      "Standard church member access.",
  },
];

export default function ChangeRoleModal({
  member,
  open,
  onClose,
  onConfirm,
  saving = false,
}) {
  const [roleId, setRoleId] = useState("");

  useEffect(() => {
    if (member) {
      const currentRole =
        member.role_id !== undefined &&
        member.role_id !== null
          ? String(member.role_id)
          : "";

      setRoleId(currentRole);
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

    if (!roleId || !onConfirm) {
      return;
    }

    await onConfirm(
      member,
      Number(roleId)
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
        aria-labelledby="change-role-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h2
              id="change-role-title"
              className="text-sm font-bold text-slate-900"
            >
              Change Member Role
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Update the system role for{" "}
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
          <div className="max-h-[55vh] space-y-3 overflow-y-auto p-5 sm:p-6">
            <label className="block text-xs font-semibold text-slate-700">
              Member Role
            </label>

            <div className="space-y-2">
              {roles.map((role) => {
                const selected =
                  roleId === String(role.id);

                return (
                  <button
                    key={role.id}
                    type="button"
                    disabled={saving}
                    onClick={() =>
                      setRoleId(
                        String(role.id)
                      )
                    }
                    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                      selected
                        ? "border-slate-400 bg-slate-50"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        selected
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <ShieldCheck size={15} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-800">
                          {role.name}
                        </span>

                        {selected && (
                          <Check
                            size={15}
                            className="shrink-0 text-slate-900"
                          />
                        )}
                      </span>

                      <span className="mt-0.5 block text-[11px] leading-4 text-slate-400">
                        {role.description}
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
                !roleId ||
                roleId ===
                  String(
                    member.role_id
                  )
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
                  Update Role
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}