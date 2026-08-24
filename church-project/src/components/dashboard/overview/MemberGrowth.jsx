"use client";

import { useEffect, useState } from "react";

import { getDashboardOverview } from "@/lib/dashboardApi";

export default function MemberGrowth() {
  const [growthData, setGrowthData] = useState([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMemberGrowth() {
      try {
        const response = await getDashboardOverview();

        const data = response?.data;

        setGrowthData(data?.memberGrowth || []);
        setTotalMembers(data?.members?.total || 0);
      } catch (error) {
        console.error("Member growth error:", error);

        setError(
          error.message || "Failed to load member growth."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMemberGrowth();
  }, []);

  const maxValue =
    growthData.length > 0
      ? Math.max(...growthData.map((item) => item.value), 1)
      : 1;

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Member Growth
          </p>

          <div className="mt-1">
            <div className="h-8 w-24 animate-pulse rounded-lg bg-slate-100" />
          </div>
        </div>

        <div className="mt-8 flex h-56 items-end gap-3 sm:gap-5">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="flex h-full flex-1 items-end"
            >
              <div
                className="w-full animate-pulse rounded-t-lg bg-slate-100"
                style={{
                  height: `${30 + index * 5}%`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-semibold text-red-600">
          Failed to load member growth.
        </p>

        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Member Growth
          </p>

          <div className="mt-1 flex items-baseline gap-3">
            <h2 className="text-2xl font-bold text-slate-900">
              {totalMembers.toLocaleString()}
            </h2>

            <span className="text-xs font-semibold text-emerald-600">
              Total
            </span>
          </div>
        </div>

        <button
          type="button"
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-50"
        >
          Last 8 months
        </button>
      </div>

      <div className="mt-8">
        {growthData.length === 0 ? (
          <div className="flex h-56 items-center justify-center">
            <p className="text-sm text-slate-400">
              No member growth data available.
            </p>
          </div>
        ) : (
          <div className="flex h-56 items-end gap-3 sm:gap-5">
            {growthData.map((item) => {
              const height =
                item.value === 0
                  ? 2
                  : Math.max(
                      (item.value / maxValue) * 100,
                      8
                    );

              return (
                <div
                  key={`${item.month}-${item.value}`}
                  className="flex h-full flex-1 flex-col justify-end"
                >
                  <div className="relative flex h-full items-end">
                    <div
                      className="w-full rounded-t-lg bg-slate-900 transition hover:bg-slate-700"
                      style={{
                        height: `${height}%`,
                      }}
                      title={`${item.value} members`}
                    />
                  </div>

                  <p className="mt-3 text-center text-[11px] font-medium text-slate-400">
                    {item.month}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}