"use client";

import { useEffect, useState } from "react";

import { getRoleName } from "@/lib/roles";
import { DashboardOverview } from "@/components/dashboard/overview";
import ChurchElderDashboard from "@/components/dashboard/elder/ChurchElderDashboard";
import PersonalDashboard from "@/components/dashboard/personal/PersonalDashboard";

export default function RoleBasedDashboard() {
  const [currentDate, setCurrentDate] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateDate = () => {
      const today = new Date();

      setCurrentDate(
        today.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      );
    };

    updateDate();

    const timer = setInterval(
      updateDate,
      60 * 60 * 1000
    );

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setUser(null);
        return;
      }

      const parsedUser = JSON.parse(storedUser);

      setUser(parsedUser);
    } catch (error) {
      console.error("Failed to load authenticated user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-sm text-slate-500">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            Authentication required
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Please sign in to access your dashboard.
          </p>
        </div>
      </div>
    );
  }

  const roleName = getRoleName(user.roleId);

  return (
    <DashboardContent
      user={user}
      roleName={roleName}
      currentDate={currentDate}
    />
  );
}

function DashboardContent({
  user,
  roleName,
  currentDate,
}) {
  switch (Number(user.roleId)) {
    case 1:
      return (
        <DashboardOverview
          currentDate={currentDate}
          user={user}
          roleName={roleName}
        />
      );

    case 2:
      return (
        <DashboardOverview
          currentDate={currentDate}
          user={user}
          roleName={roleName}
        />
      );

   case 3:
  return (
    <ChurchElderDashboard
      currentDate={currentDate}
      user={user}
      roleName={roleName}
    />
  );

    case 4:
      return (
        <DashboardOverview
          currentDate={currentDate}
          user={user}
          roleName={roleName}
        />
      );

    case 5:
  return <PersonalDashboard />;

    default:
      return (
        <DashboardOverview
          currentDate={currentDate}
          user={user}
          roleName={roleName}
        />
      );
  }
}