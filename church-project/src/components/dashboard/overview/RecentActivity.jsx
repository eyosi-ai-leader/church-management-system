"use client";

import { useEffect, useState } from "react";
import {
  UserPlus,
  Users,
  Church,
  CalendarPlus,
  Clock,
} from "lucide-react";

import { getDashboardOverview } from "@/lib/dashboardApi";

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecentActivity() {
      try {
        const response = await getDashboardOverview();

        console.log("Recent activity response:", response);

        setActivities(response?.data?.recentActivity || []);
      } catch (error) {
        console.error("Recent activity error:", error);
        setError(error.message || "Failed to load recent activity.");
      } finally {
        setLoading(false);
      }
    }

    loadRecentActivity();
  }, []);

  function formatTime(date) {
    if (!date) return "";

    const activityDate = new Date(date);
    const now = new Date();

    const difference = Math.floor(
      (now - activityDate) / 1000
    );

    if (difference < 60) {
      return "Just now";
    }

    const minutes = Math.floor(difference / 60);

    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }

    const days = Math.floor(hours / 24);

    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }

  function getIcon(title) {
    const value = title?.toLowerCase() || "";

    if (value.includes("member")) {
      return UserPlus;
    }

    if (value.includes("ministry")) {
      return Church;
    }

    if (value.includes("event")) {
      return CalendarPlus;
    }

    return Users;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Recent Activity
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900">
            Church Activity
          </h2>
        </div>

        <button
          type="button"
          className="text-xs font-semibold text-slate-500 transition hover:text-slate-900"
        >
          View all
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-6 space-y-5">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex animate-pulse gap-3"
            >
              <div className="h-9 w-9 shrink-0 rounded-xl bg-slate-100" />

              <div className="flex-1">
                <div className="h-4 w-40 rounded bg-slate-100" />
                <div className="mt-2 h-3 w-28 rounded bg-slate-100" />
                <div className="mt-2 h-3 w-16 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-600">
            Failed to load recent activity.
          </p>

          <p className="mt-1 text-xs text-red-500">
            {error}
          </p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && activities.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
            <Clock size={18} />
          </div>

          <p className="mt-3 text-sm font-medium text-slate-600">
            No recent activity
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Recent church activity will appear here.
          </p>
        </div>
      )}

      {/* Activities */}
      {!loading && !error && activities.length > 0 && (
        <div className="mt-6 space-y-5">
          {activities.map((activity) => {
            const Icon = getIcon(activity.title);

            return (
              <div
                key={activity.id}
                className="flex gap-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <Icon
                    size={16}
                    strokeWidth={1.8}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">
                    {activity.title}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {activity.description}
                  </p>

                  <p className="mt-1 text-[11px] text-slate-300">
                    {formatTime(activity.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}