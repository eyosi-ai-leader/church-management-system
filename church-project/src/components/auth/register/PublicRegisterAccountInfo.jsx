"use client";

import {
  Eye,
  EyeOff,
} from "lucide-react";

import { useState } from "react";

import PasswordRequirements from "@/components/shared/Password/PasswordRequirements";

export default function PublicRegisterAccountInfo({
  formData,
  errors,
  onChange,
}) {
  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Account Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Create a secure password for
          your account.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Password
            <span className="text-red-500">
              {" "}
              *
            </span>
          </label>

          <div className="relative">
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              value={formData.password}
              onChange={onChange}
              placeholder="Create a strong password"
              autoComplete="new-password"
              className={`w-full rounded-lg border px-3 py-2.5 pr-11 text-sm outline-none transition focus:ring-2 ${
                errors.password
                  ? "border-red-300 focus:ring-red-100"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />
      
            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (value) => !value
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1 text-xs text-red-600">
              {errors.password}
            </p>
          )}

                    <PasswordRequirements password={formData.password} id="register-password-requirements" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Confirm password
            <span className="text-red-500">
              {" "}
              *
            </span>
          </label>

          <div className="relative">
            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              name="confirmPassword"
              value={
                formData.confirmPassword
              }
              onChange={onChange}
              placeholder="Repeat your password"
              autoComplete="new-password"
              className={`w-full rounded-lg border px-3 py-2.5 pr-11 text-sm outline-none transition focus:ring-2 ${
                errors.confirmPassword
                  ? "border-red-300 focus:ring-red-100"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (value) => !value
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}