// PersonalAnnouncements.jsx

"use client";

import {
  Bell,
  Megaphone,
} from "lucide-react";

export default function PersonalAnnouncements() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Announcements
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Important church announcements
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Bell
            className="h-5 w-5"
            strokeWidth={1.8}
          />
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
            <Megaphone
              className="h-5 w-5"
              strokeWidth={1.7}
            />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-slate-700">
            No announcements yet
          </h3>

          <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
            Important messages and updates from the church
            will appear here once the announcements module
            is available.
          </p>
        </div>
      </div>
    </section>
  );
}