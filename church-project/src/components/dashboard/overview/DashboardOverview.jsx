"use client";

import { useEffect, useState } from "react";

import DashboardWelcome from "./DashboardWelcome";
import DashboardStats from "./DashboardStats";
import MemberGrowth from "./MemberGrowth";
import RecentActivity from "./RecentActivity";
import AIInsight from "./AIInsight";

import { getDashboardOverview } from "@/lib/dashboardApi";

export default function DashboardOverview({ currentDate }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await getDashboardOverview();

        setDashboardData(response?.data || null);
      } catch (error) {
        console.error("Dashboard data error:", error);

        setError(
          error.message || "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <DashboardWelcome currentDate={currentDate} />

      {/* Statistics */}
      <DashboardStats
        dashboardData={dashboardData}
        loading={loading}
        error={error}
      />

      {/* Dashboard Main Content */}
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

      {/* AI Insight */}
      <AIInsight />
    </div>
  );
}