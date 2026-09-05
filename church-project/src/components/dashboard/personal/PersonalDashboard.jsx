"use client";

import { useEffect, useState } from "react";

import PersonalProfileHeader from "./PersonalProfileHeader";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getAuthToken() {
  if (typeof document === "undefined") {
    return null;
  }

  const cookies = document.cookie.split("; ");

  const tokenCookie = cookies.find((cookie) =>
    cookie.startsWith("token=")
  );

  return tokenCookie
    ? decodeURIComponent(tokenCookie.split("=")[1])
    : null;
}

export default function PersonalDashboard() {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPersonalDashboard() {
      try {
        setLoading(true);
        setError("");

        const token = getAuthToken();

        if (!token) {
          throw new Error("Authentication token not found.");
        }

        const response = await fetch(
          `${API_URL}/dashboard/overview`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        const result = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Failed to load your personal dashboard."
          );
        }

        setMember(result?.data?.member || null);
      } catch (error) {
        console.error(
          "Personal dashboard error:",
          error
        );

        setError(
          error.message ||
            "Failed to load your personal dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPersonalDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="h-24 w-24 animate-pulse rounded-full bg-slate-200" />

            <div className="mt-4 h-6 w-40 animate-pulse rounded bg-slate-200" />

            <div className="mt-2 h-4 w-24 animate-pulse rounded bg-slate-200" />

            <div className="mt-3 h-6 w-28 animate-pulse rounded-full bg-slate-200" />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <LoadingCard />
          <LoadingCard />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            Unable to load your dashboard
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            Member profile not found
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your account is authenticated, but we could not
            find a member profile connected to your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Personal profile header */}
      <PersonalProfileHeader member={member} />

      {/* Personal information */}
      <section className="grid gap-6 lg:grid-cols-2">
        <PersonalInfoCard member={member} />

        <MembershipCard member={member} />
      </section>

      {/* Future church features */}
      <section className="grid gap-6 lg:grid-cols-2">
        <ComingSoonCard
          title="My Ministry"
          description="Your ministry involvement and responsibilities will appear here."
        />

        <ComingSoonCard
          title="Attendance"
          description="Your church attendance history will appear here."
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <ComingSoonCard
          title="Events"
          description="Upcoming church events and activities will appear here."
        />

        <ComingSoonCard
          title="Announcements"
          description="Important church announcements will appear here."
        />
      </section>
    </div>
  );
}

function PersonalInfoCard({ member }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          My Profile
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Your personal information
        </p>
      </div>

      <div className="mt-6 divide-y divide-slate-100">
        <InfoRow
          label="Email"
          value={member.email}
        />

        <InfoRow
          label="Phone"
          value={member.phone}
        />

        <InfoRow
          label="Gender"
          value={member.gender}
        />

        <InfoRow
          label="Date of Birth"
          value={formatDate(member.dateOfBirth)}
        />

        <InfoRow
          label="Baptism Date"
          value={formatDate(member.baptismDate)}
        />

        <InfoRow
          label="Address"
          value={member.address}
        />
      </div>
    </section>
  );
}

function MembershipCard({ member }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Membership
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Your church membership information
        </p>
      </div>

      <div className="mt-6 divide-y divide-slate-100">
        <InfoRow
          label="Member Number"
          value={member.memberNumber}
          strong
        />

        <InfoRow
          label="Role"
          value={member.roleName}
        />

        <InfoRow
          label="Status"
          value={member.status}
          status
        />

        <InfoRow
          label="Member Since"
          value={formatDate(member.memberSince)}
        />
      </div>
    </section>
  );
}

function InfoRow({
  label,
  value,
  strong = false,
  status = false,
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      {status ? (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            String(value).toLowerCase() === "active"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {value || "Unknown"}
        </span>
      ) : (
        <span
          className={`text-right text-sm ${
            strong
              ? "font-semibold text-slate-900"
              : "font-medium text-slate-700"
          }`}
        >
          {value || "Not provided"}
        </span>
      )}
    </div>
  );
}

function ComingSoonCard({
  title,
  description,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          {title}
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
        <p className="text-sm font-medium text-slate-600">
          Coming soon
        </p>

        <p className="mt-1 text-xs text-slate-400">
          This feature will be connected when its module is ready.
        </p>
      </div>
    </section>
  );
}

function LoadingCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />

      <div className="mt-2 h-4 w-48 animate-pulse rounded bg-slate-100" />

      <div className="mt-6 space-y-4">
        <div className="h-5 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-5 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-5 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-5 w-full animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}

function formatDate(value) {
  if (!value) {
    return "Not provided";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not provided";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}