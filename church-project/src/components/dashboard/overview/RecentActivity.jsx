"use client";

import {
  Users,
  UserPlus,
  Church,
  CalendarPlus,
  Clock,
} from "lucide-react";

export default function RecentActivity({ activities = [] }) {
  function formatTime(date) {
    if (!date) return "";

    const activityDate = new Date(date);
    const now = new Date();

    const diffInSeconds = Math.floor(
      (now - activityDate) / 1000
    );

    if (diffInSeconds < 60) {
      return "Just now";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${
        diffInMinutes !== 1 ? "s" : ""
      } ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInHours < 24) {
      return `${diffInHours} hour${
        diffInHours !== 1 ? "s" : ""
      } ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);

    return `${diffInDays} day${
      diffInDays !== 1 ? "s" : ""
    } ago`;
  }

  function getIcon(title) {
    if (title?.toLowerCase().includes("member")) {
      return UserPlus;
    }

    if (title?.toLowerCase().includes("ministry")) {
      return Church;
    }

    if (title?.toLowerCase().includes("event")) {
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

      {/* Activities */}
      <div className="mt-6 space-y-5">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
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
        ) : (
          activities.map((activity) => {
            const Icon = getIcon(activity.title);

            return (
              <div
                key={activity.id}
                className="flex gap-3"
              >
                {/* Icon */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <Icon
                    size={16}
                    strokeWidth={1.8}
                  />
                </div>

                {/* Content */}
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
          })
        )}
      </div>
    </div>
  );
}