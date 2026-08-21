"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Church,
  UserCog,
  Users,
  UserRound,
} from "lucide-react";

import { getDashboardOverview } from "@/lib/dashboardApi";

const roleIcons = {
  Admin: ShieldCheck,
  Pastor: Church,
  "Church Elder": UserCog,
  "Ministry Leader": Users,
  Member: UserRound,
};

export default function RoleDistribution() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRoles() {
      try {
        const token = document.cookie
          .split("; ")
          .find((cookie) => cookie.startsWith("token="))
          ?.split("=")[1];

        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await getDashboardOverview(token);

        setRoles(response?.data?.roles || []);
      } catch (error) {
        console.error("Role distribution error:", error);
        setError(error.message || "Failed to load role distribution.");
      } finally {
        setLoading(false);
      }
    }

    loadRoles();
  }, []);

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <div className="h-6 w-40 animate-pulse rounded bg-slate-100" />
          <div className="mt-2 h-4 w-56 animate-pulse rounded bg-slate-100" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-xl bg-slate-50"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <p className="text-sm font-medium text-red-600">
          Failed to load role distribution.
        </p>

        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Role Distribution
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Overview of users by church role.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {roles.map((role) => {
          const Icon = roleIcons[role.roleName] || Users;

          return (
            <div
              key={role.roleId}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-slate-200 hover:bg-white hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm">
                  <Icon size={18} />
                </div>

                <span className="text-2xl font-bold text-slate-900">
                  {role.total}
                </span>
              </div>

              <p className="mt-3 text-sm font-medium text-slate-700">
                {role.roleName}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}