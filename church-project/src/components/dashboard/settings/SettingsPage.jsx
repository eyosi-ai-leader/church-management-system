"use client";

import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";

import ChangePasswordForm from "@/components/dashboard/security/ChangePasswordForm";
import { getStoredUser } from "@/lib/userStorage";
import { getRoleName } from "@/lib/roles";

export default function SettingsPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const name = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your account and security.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <UserRound size={20} aria-hidden="true" />
          </span>

          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-900">Account</h2>
            <p className="truncate text-sm text-slate-500">
              {name || "Signed in"}
              {user?.email && ` · ${user.email}`}
              {user?.roleId && ` · ${getRoleName(Number(user.roleId))}`}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-500">
          To update your name, phone, address or photo, open{" "}
          <a
            href="/dashboard/profile"
            className="font-semibold text-indigo-600 hover:text-indigo-700"
          >
            My Profile
          </a>
          .
        </p>
      </section>

      <ChangePasswordForm />
    </div>
  );
}