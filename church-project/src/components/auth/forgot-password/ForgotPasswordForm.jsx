"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";

import { requestPasswordReset, resetPassword } from "@/lib/passwordApi";
   import PasswordRequirements from "@/components/shared/Password/PasswordRequirements";
   import {
     PASSWORD_RULES_MESSAGE,
     isStrongPassword,
   } from "@/lib/passwordPolicy";

const RESEND_SECONDS = 60;

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

function Heading({ title, text }) {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        {title}
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}

function PasswordField({ id, label, value, onChange, placeholder, show, onToggle }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <div className="relative">
        <Lock
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="new-password"
          required
          className={`${inputClass} pl-11 pr-11`}
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export default function ForgotPasswordForm() {
  const router = useRouter();

  const [step, setStep] = useState("request"); // request | reset | done

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function handleRequest(event) {
    event.preventDefault();
    if (loading) return;

    setError("");
    setMessage("");
    setLoading(true);

    try {
      await requestPasswordReset(email.trim());
      setStep("reset");
      setCooldown(RESEND_SECONDS);
    } catch (err) {
      setError(err.message || "Unable to process your request.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resending || cooldown > 0) return;

    setError("");
    setMessage("");
    setResending(true);

    try {
      await requestPasswordReset(email.trim());
      setMessage("If this email has an account, a new code has been sent.");
      setCooldown(RESEND_SECONDS);
    } catch (err) {
      setError(err.message || "Unable to send a new code.");
    } finally {
      setResending(false);
    }
  }

  async function handleReset(event) {
    event.preventDefault();
    if (loading) return;

    setError("");
    setMessage("");

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
      await resetPassword({
        email: email.trim(),
        code: code.trim(),
        password,
        confirmPassword,
      });
      setStep("done");
    } catch (err) {
      setError(err.message || "Unable to reset your password.");
    } finally {
      setLoading(false);
    }
  }

  const errorBox = error && (
    <div
      role="alert"
      className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
    >
      {error}
    </div>
  );

  const messageBox = message && (
    <div
      role="status"
      className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
    >
      {message}
    </div>
  );

  if (step === "done") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center"
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />

        <h2 className="mt-4 text-2xl font-semibold text-slate-900">
          Password updated
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Your password has been changed. Sign in with your email and your
          new password.
        </p>

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

  if (step === "reset") {
    return (
      <div>
        <Heading
          title="Enter your code"
          text={`If ${email.trim()} has an account, we sent a 6-digit code. It expires in 15 minutes.`}
        />

        {errorBox}
        {messageBox}

        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label
              htmlFor="code"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              6-digit code
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
              className={`${inputClass} text-center text-2xl font-semibold tracking-[0.5em] placeholder:text-slate-300`}
            />
          </div>

          <PasswordField
            id="new-password"
            label="New password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minimum 8 characters"
            show={showPassword}
            onToggle={() => setShowPassword((value) => !value)}
          />
          
          <PasswordRequirements password={password} id="reset-password-requirements" />
          <PasswordField
            id="confirm-password"
            label="Confirm new password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repeat your new password"
            show={showConfirm}
            onToggle={() => setShowConfirm((value) => !value)}
          />

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Updating..." : "Reset password"}
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
          onClick={() => {
            setStep("request");
            setCode("");
            setError("");
            setMessage("");
          }}
          className="mx-auto mt-6 flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeft size={16} />
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <div>
      <Heading
        title="Forgot your password?"
        text="Enter your email address and we'll send you a 6-digit code to reset it."
      />

      {errorBox}

      <form onSubmit={handleRequest} className="space-y-5">
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
              className={`${inputClass} pl-11 pr-4`}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send reset code"}
          {!loading && (
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-0.5"
            />
          )}
        </button>
      </form>

      <button
        type="button"
        onClick={() => router.push("/login")}
        className="mx-auto mt-7 flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
      >
        <ArrowLeft size={16} />
        Back to sign in
      </button>
    </div>
  );
}