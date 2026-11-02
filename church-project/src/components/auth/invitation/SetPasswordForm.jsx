"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import PasswordInput from "@/components/shared/password/PasswordInput";
import PasswordRequirements from "@/components/shared/password/PasswordRequirements";
import {
  PASSWORD_RULES_MESSAGE,
  isStrongPassword,
} from "@/lib/passwordPolicy";
import { checkInvitation, acceptInvitation } from "@/lib/invitationApi";
import { saveSession } from "@/lib/authSession";

export default function SetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";

  const [step, setStep] = useState("checking"); // checking | invalid | form | done
  const [invite, setInvite] = useState(null);
  const [invalidMessage, setInvalidMessage] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setInvalidMessage("This invitation link is incomplete.");
      setStep("invalid");
      return;
    }

    let cancelled = false;

    checkInvitation(token)
      .then((data) => {
        if (cancelled) return;
        setInvite(data);
        setStep("form");
      })
      .catch((err) => {
        if (cancelled) return;
        setInvalidMessage(err.message);
        setStep("invalid");
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;

    setError("");

    if (!isStrongPassword(password)) {
      setError(PASSWORD_RULES_MESSAGE);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const data = await acceptInvitation({
        token,
        password,
        confirmPassword,
      });

      // They are signed in right away.
      saveSession({ token: data.token, user: data.user, rememberMe: false });
      setStep("done");
    } catch (err) {
      setError(err.message || "We couldn't set your password.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "checking") {
    return (
      <div
        role="status"
        className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-16 text-sm text-slate-500"
      >
        <Loader2 size={18} className="animate-spin" />
        Checking your invitation...
      </div>
    );
  }

  if (step === "invalid") {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center"
      >
        <AlertTriangle className="mx-auto h-10 w-10 text-amber-600" />

        <h1 className="mt-4 text-xl font-semibold text-slate-900">
          This link can&apos;t be used
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {invalidMessage} Invitation links work once and expire after 48
          hours. Ask the church office to send you a new one. If you already
          set your password, you can sign in instead.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            Go to sign in
          </Link>

          <Link
            href="/forgot-password"
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Forgot password
          </Link>
        </div>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center"
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />

        <h1 className="mt-4 text-2xl font-semibold text-slate-900">
          Your account is ready
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Your password is set and your email is verified. A welcome email is
          on its way. You are signed in.
        </p>

        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mt-6 w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          Go to my dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Welcome, {invite?.firstName}
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Choose a password for <strong>{invite?.email}</strong> to finish
          setting up your account.
        </p>
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
        <div>
          <PasswordInput
            id="invite-password"
            label="New password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a strong password"
            describedBy="invite-password-requirements"
          />

          <PasswordRequirements
            id="invite-password-requirements"
            password={password}
          />
        </div>

        <PasswordInput
          id="invite-confirm"
          label="Confirm password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Repeat your password"
        />

        <button
          type="submit"
          disabled={
            loading ||
            !isStrongPassword(password) ||
            password !== confirmPassword
          }
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Set password and continue
              <ArrowRight
                size={17}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </>
          )}
        </button>
      </form>
    </div>
  );
}