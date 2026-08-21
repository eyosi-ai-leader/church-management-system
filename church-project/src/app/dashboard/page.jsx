"use client";

import { useEffect, useState } from "react";

import { DashboardOverview } from "@/components/dashboard/overview";

export default function DashboardPage() {

    const [currentDate, setCurrentDate] = useState("");

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

  // Keep the date correct if the dashboard stays open overnight
  const timer = setInterval(updateDate, 60 * 60 * 1000);

  return () => clearInterval(timer);
}, []);
  return <DashboardOverview currentDate={currentDate} />;
}