"use client";

import { useState } from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";

import PasswordInput from "@/components/shared/Password/PasswordInput";
import PasswordRequirements from "@/components/shared/Password/PasswordRequirements";
import {
  PASSWORD_RULES_MESSAGE,
  isStrongPassword,
} from "@/lib/passwordPolicy";
import { changePassword } from "@/lib/accountApi";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;

    setError("");

    if (!isStrongPassword(newPassword)) {
      setError(PASSWORD_RULES_MESSAGE);
      return;
    }

    if (newPassword === currentPassword) {
      setError("New password must be different from your current password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setDone(true);
    } catch (err) {
      setError(err.message || "Unable to change your password.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center"
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />

        <h3 className="mt-4 text-xl font-semibold text-slate-900">
          Password updated
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Your password has been changed. We also sent a confirmation to
          your email. Use your new password the next time you sign in.
        </p>

        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-6 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
          <ShieldCheck size={20} aria-hidden="true" />
        </span>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Change password
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Choose a strong password you don&apos;t use anywhere else.
          </p>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <PasswordInput
          id="current-password"
          label="Current password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          placeholder="Enter your current password"
          autoComplete="current-password"
        />

        <div>
          <PasswordInput
            id="new-password"
            label="New password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="Create a strong password"
            describedBy="new-password-requirements"
          />

          <PasswordRequirements
            id="new-password-requirements"
            password={newPassword}
          />
        </div>

        <PasswordInput
          id="confirm-new-password"
          label="Confirm new password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Repeat your new password"
        />

        <button
          type="submit"
          disabled={
            loading ||
            !currentPassword ||
            !isStrongPassword(newPassword) ||
            newPassword !== confirmPassword
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8"
        >
          {loading ? "Updating..." : "Update password"}
        </button>
      </form>
    </section>
  );
}