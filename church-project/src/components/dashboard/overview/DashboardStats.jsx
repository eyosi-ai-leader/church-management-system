"use client";

import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
} from "lucide-react";

import StatCard from "./StatCard";

export default function DashboardStats({
  dashboardData,
  loading,
  error,
}) {
  const overview = dashboardData;

  const stats = [
    {
      title: "Total Members",
      value: overview?.members?.total ?? 0,
      change: "—",
      description: "Total registered members",
      icon: Users,
    },
    {
      title: "Active Members",
      value: overview?.members?.active ?? 0,
      change: "—",
      description: "Currently active members",
      icon: UserCheck,
    },
    {
      title: "Inactive Members",
      value: overview?.members?.inactive ?? 0,
      change: "—",
      description: "Currently inactive members",
      icon: UserX,
    },
    {
      title: "New Members Today",
      value: overview?.members?.newToday ?? 0,
      change: "Today",
      description: "Members registered today",
      icon: UserPlus,
    },
  ];

  if (loading) {
    return (
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            {...stat}
            value="..."
          />
        ))}
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <p className="text-sm font-medium text-red-600">
          Failed to load dashboard statistics.
        </p>

        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          {...stat}
        />
      ))}
    </section>
  );
}