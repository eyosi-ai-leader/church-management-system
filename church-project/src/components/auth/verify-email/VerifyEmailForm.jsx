"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Mail } from "lucide-react";

import {
  verifyEmailCode,
  resendVerificationCode,
} from "@/lib/verifyApi";

const RESEND_SECONDS = 60;

export default function VerifyEmailForm() {
  const router = useRouter();
  const params = useSearchParams();
  const emailFromUrl = params.get("email") || "";

  const [email, setEmail] = useState(emailFromUrl);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
    const [cooldown, setCooldown] = useState(
    params.get("sent") === "1" ? RESEND_SECONDS : 0
  );
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

    if (verified) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center"
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />

        <h2 className="mt-4 text-2xl font-semibold text-slate-900">
          Your email is verified
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Welcome to our church family! Your account is ready.
        </p>

        <ul className="mx-auto mt-5 max-w-xs space-y-2 text-left text-sm text-slate-600">
          <li>✓ A welcome email is on its way to your inbox.</li>
          <li>✓ Sign in with your email and password.</li>
          <li>✓ If you forget your password, use &quot;Forgot password&quot; on the sign-in page.</li>
        </ul>

        <button
          type="button"
          onClick={() => router.push("/login")}
          className="mt-6 w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          Continue to sign in
        </button>
      </div>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;

    setError("");
    setMessage("");
    setLoading(true);

    try {
      await verifyEmailCode(email.trim(), code.trim());
      setVerified(true);
    } catch (err) {
      setError(err.message || "Unable to verify your email.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resending || cooldown > 0) return;

    if (!email.trim()) {
      setError("Enter your email address first.");
      return;
    }

    setError("");
    setMessage("");
    setResending(true);

    try {
      const result = await resendVerificationCode(email.trim());
      setMessage(result.message || "A new code has been sent.");
      setCooldown(RESEND_SECONDS);
    } catch (err) {
      setError(err.message || "Unable to send a new code.");
    } finally {
      setResending(false);
    }
  }

  if (verified) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center"
      >
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
        <h2 className="mt-3 text-xl font-semibold text-slate-900">
          Email verified
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Welcome! Taking you to sign in...
        </p>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="mt-5 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
        >
          Sign in now
        </button>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {error}
        </div>
      )}

      {message && (
        <div
          role="status"
          className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Email address
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@church.com"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="code"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Verification code
          </label>

          <input
            id="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(event) =>
              setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="000000"
            required
            className="w-full rounded-xl border border-slate-200 bg-white py-3.5 text-center text-2xl font-semibold tracking-[0.5em] text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />
        </div>

        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify email"}
          {!loading && (
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-0.5"
            />
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500">
        Didn&apos;t get a code?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={resending || cooldown > 0}
          className="font-semibold text-indigo-600 hover:text-indigo-700 disabled:cursor-not-allowed disabled:text-slate-400"
        >
          {cooldown > 0
            ? `Resend in ${cooldown}s`
            : resending
            ? "Sending..."
            : "Resend code"}
        </button>
      </div>

      <button
        type="button"
        onClick={() => router.push("/login")}
        className="mx-auto mt-6 flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
      >
        <ArrowLeft size={16} />
        Back to sign in
      </button>
    </div>
  );
}