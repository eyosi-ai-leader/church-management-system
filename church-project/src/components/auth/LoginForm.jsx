"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { loginUser } from "@/lib/authApi";
import SocialLogin from "./SocialLogin";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      // 1. Login request
      const result = await loginUser(email, password);

      // 2. Get token
      const token = result?.data?.token || result?.token;

      if (!token) {
        throw new Error("No authentication token received.");
      }

      // 3. Get authenticated user
      const user = result?.data?.user || result?.user;

      if (!user) {
        throw new Error("User information not received.");
      }

      // 4. Save JWT in cookie
      document.cookie = `token=${token}; path=/; ${
        rememberMe ? "max-age=2592000;" : ""
      } SameSite=Lax`;

      // 5. Save user information
      localStorage.setItem("user", JSON.stringify(user));

      // 6. Go to dashboard
      router.push("/dashboard");
    } catch (error) {
      setError(error.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Error */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
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

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Password
          </label>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((previous) => !previous)
              }
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Remember Me + Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) =>
                setRememberMe(event.target.checked)
              }
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />

            <span className="text-sm text-slate-500">
              Remember me
            </span>
          </label>

          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Forgot password?
          </button>
        </div>

        {/* Social Divider */}
        <div className="flex items-center gap-4 pt-2">
          <div className="h-px flex-1 bg-slate-200" />

          <span className="whitespace-nowrap text-xs font-medium text-slate-400">
            or continue with Google
          </span>

          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Social Login */}
        <SocialLogin />

        {/* Sign In */}
        <button
          type="submit"
          disabled={loading}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}

          {!loading && (
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-0.5"
            />
          )}
        </button>
      </form>

      {/* Register */}
      <p className="mt-7 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}

        <button
          type="button"
          onClick={() => router.push("/register")}
          className="font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Register
        </button>
      </p>
    </div>
  );
}