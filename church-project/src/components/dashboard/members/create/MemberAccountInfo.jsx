"use client";

import { Lock, ShieldCheck } from "lucide-react";

export default function MemberAccountInfo({
  form,
  errors,
  onChange,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
          <ShieldCheck
            size={19}
            className="text-slate-700"
          />
        </div>

        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Account Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Login credentials for the member's
            CHMS account.
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Password */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Password{" "}
            <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="Enter password"
              className={`h-11 w-full rounded-xl border bg-white pl-10 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                errors.password
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                  : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
              }`}
            />
          </div>

          {errors.password && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.password}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-slate-50 p-4">
        <p className="text-xs leading-5 text-slate-500">
          The member's email address will be
          used as their account identifier.
          Passwords are securely hashed before
          being stored in the database.
        </p>
      </div>
    </div>
  );
}