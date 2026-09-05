"use client";

import { useEffect, useState } from "react";

import DashboardWelcome from "../overview/DashboardWelcome";
import DashboardStats from "../overview/DashboardStats";
import MemberGrowth from "../overview/MemberGrowth";
import RecentActivity from "../overview/RecentActivity";

import { getDashboardOverview } from "@/lib/dashboardApi";

export default function ChurchElderDashboard({
  currentDate,
  user,
  roleName,
}) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const response = await getDashboardOverview();

        if (!mounted) {
          return;
        }

        setDashboardData(response?.data || null);
      } catch (error) {
        if (!mounted) {
          return;
        }

        console.error(
          "Church Elder dashboard error:",
          error
        );

        setError(
          error?.message ||
            "Failed to load dashboard data."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <DashboardWelcome
        currentDate={currentDate}
      />

      {/* Church Elder Overview */}
      <section>
        

        <DashboardStats
          dashboardData={dashboardData}
          loading={loading}
          error={error}
        />
      </section>

      {/* Growth and Activity */}
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
        <MemberGrowth
          dashboardData={dashboardData}
          loading={loading}
          error={error}
        />

        <RecentActivity
          dashboardData={dashboardData}
          loading={loading}
          error={error}
        />
      </section>

      {/* Read-only access notice */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Church Elder Access
            </p>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              You have read-only access to member
              information for church oversight. Member
              records can be viewed, but administrative
              changes are restricted.
            </p>
          </div>

          <span className="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
            Read Only
          </span>
        </div>
      </section>
    </div>
  );
}