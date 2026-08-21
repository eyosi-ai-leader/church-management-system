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

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await getDashboardOverview();

        setDashboardData(response.data);
      } catch (error) {
        console.error("Dashboard data error:", error);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="space-y-6">
      <DashboardWelcome currentDate={currentDate} />

      <DashboardStats />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
        <MemberGrowth />

        <RecentActivity
          activities={dashboardData?.recentActivity || []}
        />
      </section>

      <AIInsight />
    </div>
  );
}