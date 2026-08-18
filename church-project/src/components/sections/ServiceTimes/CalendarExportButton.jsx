"use client";

import { CalendarPlus } from "lucide-react";

export default function CalendarExportButton({
  title = "Sunday Worship Service",
  description = "Join us for worship and fellowship.",
  location = "Church Main Sanctuary",
  startDate = "2026-08-02T09:00:00",
  endDate = "2026-08-02T11:00:00",
}) {
  const handleGoogleCalendar = () => {
    const url =
      `https://calendar.google.com/calendar/render?action=TEMPLATE` +
      `&text=${encodeURIComponent(title)}` +
      `&details=${encodeURIComponent(description)}` +
      `&location=${encodeURIComponent(location)}` +
      `&dates=${formatDate(startDate)}/${formatDate(endDate)}`;

    window.open(url, "_blank");
  };

  return (
    <button
      onClick={handleGoogleCalendar}
      className="
        group
        flex
        w-full
        items-center
        justify-center
        gap-3
        rounded-2xl
        border
        border-purple-200
        bg-purple-50
        px-6
        py-4
        font-semibold
        text-purple-700
        transition-all
        duration-300
        hover:bg-purple-600
        hover:text-white
      "
    >
      <CalendarPlus
        size={20}
        className="transition-transform duration-300 group-hover:rotate-12"
      />

      Add To Google Calendar
    </button>
  );
}

function formatDate(date) {
  return new Date(date)
    .toISOString()
    .replace(/-|:|\.\d\d\d/g, "");
}