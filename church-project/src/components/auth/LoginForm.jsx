"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Mail } from "lucide-react";

import PasswordInput from "@/components/shared/password/PasswordInput";
import GoogleSignInButton from "./GoogleSignInButton";
import { loginUser } from "@/lib/authApi";
import { loginWithGoogle } from "@/lib/googleAuthApi";
import { saveSession } from "@/lib/authSession";

const GOOGLE_ENABLED = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

function readSession(result) {
  const token = result?.data?.token || result?.token;
  const user = result?.data?.user || result?.user;

  if (!token) throw new Error("No authentication token received.");
  if (!user) throw new Error("User information not received.");

  return { token, user };
}

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const busy = loading || googleLoading;

  async function handleSubmit(event) {
    event.preventDefault();
    if (busy) return;

    setError("");
    setLoading(true);

    try {
      const result = await loginUser(email.trim(), password);
      const { token, user } = readSession(result);

      saveSession({ token, user, rememberMe });
      router.push("/dashboard");
    } catch (err) {
      const message = err.message || "Unable to sign in.";

      // Unverified account: send the person to the code page.
      if (message.toLowerCase().includes("verify your email")) {
        router.push(
          `/verify-email?email=${encodeURIComponent(email.trim())}`
        );
        return;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle(credential) {
    if (busy) return;

    setError("");
    setGoogleLoading(true);

    try {
      const result = await loginWithGoogle(credential);
      const { token, user } = readSession(result);

      saveSession({ token, user, rememberMe });
      router.push("/dashboard");
      // Stay in the loading state while the dashboard opens.
    } catch (err) {
      setError(err.message || "We couldn't sign you in with Google.");
      setGoogleLoading(false);
    }
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

      {GOOGLE_ENABLED && (
        <>
          <GoogleSignInButton
            onCredential={handleGoogle}
            onError={setError}
            disabled={busy}
          />

          {googleLoading && (
            <p
              role="status"
              className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-500"
            >
              <Loader2 size={15} className="animate-spin" />
              Signing you in with Google...
            </p>
          )}

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />

            <span className="whitespace-nowrap text-xs font-medium text-slate-400">
              or sign in with email
            </span>

            <div className="h-px flex-1 bg-slate-200" />
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label
            htmlFor="login-email"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Email address
          </label>

          <div className="relative">
            <Mail
              size={18}
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="login-email"
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

        {/* Password */}
        <PasswordInput
          id="login-password"
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
        />

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />

            <span className="text-sm text-slate-500">Remember me</span>
          </label>

          <Link
            href="/forgot-password"
            className="rounded text-sm font-semibold text-indigo-600 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Forgot password?
          </Link>
        </div>

        {/* Sign in */}
        <button
          type="submit"
          disabled={busy}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight
                size={17}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="rounded font-semibold text-indigo-600 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          Register
        </Link>
      </p>
    </div>
  );
}