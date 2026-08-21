"use client";

import { useEffect, useState } from "react";

export default function DashboardWelcome({ currentDate }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch (error) {
      console.error("Failed to read logged-in user:", error);
      localStorage.removeItem("user");
    }
  }, []);

  const firstName =
    user?.firstName ||
    user?.first_name ||
    "User";

  return (
    <section>
      <p className="text-sm font-medium text-indigo-600">
        {currentDate}
      </p>

      <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
        Welcome back, {firstName}
      </h1>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        Here&apos;s what&apos;s happening with your church community today.
      </p>
    </section>
  );
}