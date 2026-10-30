"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Lock, X } from "lucide-react";

import ComposeAnnouncement from "./ComposeAnnouncement";
import AnnouncementHistory from "./AnnouncementHistory";
import { getStoredUser } from "@/lib/userStorage";

// Admin, Pastor, Ministry Leader
const ALLOWED_ROLES = [1, 2, 4];

export default function AnnouncementsPage() {
  const [user, setUser] = useState(undefined);
  const [tab, setTab] = useState("compose");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  function handleSent(result) {
    setNotice(
      `Your announcement is being sent to ${result.total} ${
        result.total === 1 ? "person" : "people"
      }. You can follow its progress below.`
    );
    setTab("history");
  }

  if (user === undefined) return null;

  if (!user || !ALLOWED_ROLES.includes(Number(user.roleId))) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <Lock className="mx-auto h-10 w-10 text-slate-300" aria-hidden="true" />
        <h1 className="mt-4 text-xl font-semibold text-slate-900">
          You don&apos;t have access to this page
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Announcements can be sent by pastors, administrators and ministry
          leaders.
        </p>
      </div>
    );
  }

  const tabs = [
    { id: "compose", label: "New announcement" },
    { id: "history", label: "Sent announcements" },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Announcements
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Send an email announcement to church members.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Announcements"
        className="inline-flex rounded-xl bg-slate-100 p-1"
      >
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              tab === item.id
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {notice && tab === "history" && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          <CheckCircle2 size={18} className="shrink-0" aria-hidden="true" />
          <span className="flex-1">{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss message"
            className="rounded-md p-1 transition hover:bg-emerald-100"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {tab === "compose" ? (
        <ComposeAnnouncement onSent={handleSent} />
      ) : (
        <AnnouncementHistory />
      )}
    </div>
  );
}