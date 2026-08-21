"use client";

import { useState } from "react";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      /*
       * Backend password-reset endpoint will be connected here later.
       */

      await new Promise((resolve) => setTimeout(resolve, 800));

      setMessage(
        "If an account exists with this email, password reset instructions will be sent."
      );
    } catch (error) {
      setError(
        error.message || "Unable to process your request."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-5 text-emerald-600">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Email */}
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
              required
              className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send reset instructions"}

          {!loading && (
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-0.5"
            />
          )}
        </button>

      </form>

      {/* Back to Login */}
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