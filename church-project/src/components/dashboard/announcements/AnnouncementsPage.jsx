"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Lock, X } from "lucide-react";

import AnnouncementInbox from "./AnnouncementInbox";
import ComposeAnnouncement from "./ComposeAnnouncement";
import AnnouncementHistory from "./AnnouncementHistory";
import { getStoredUser } from "@/lib/userStorage";

// Admin, Pastor, Ministry Leader can send. Everyone can read.
const STAFF_ROLES = [1, 2, 4];
const TABS = ["inbox", "compose", "sent"];

export default function AnnouncementsPage() {
  const router = useRouter();
  const params = useSearchParams();

  const [user, setUser] = useState(undefined);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  if (user === undefined) return null;

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <Lock className="mx-auto h-10 w-10 text-slate-300" aria-hidden="true" />
        <h1 className="mt-4 text-xl font-semibold text-slate-900">
          Please sign in
        </h1>
      </div>
    );
  }

  const isStaff = STAFF_ROLES.includes(Number(user.roleId));

  const requested = params.get("tab");
  const openId = Number(params.get("open")) || null;

  const tab = isStaff && TABS.includes(requested) ? requested : "inbox";

  const goToTab = (id) =>
    router.replace(`/dashboard/announcements?tab=${id}`, { scroll: false });

  function handleSent(result) {
    const people = result.total === 1 ? "person" : "people";

    setNotice(
      result.delivery === "dashboard"
        ? `Your announcement was published to ${result.total} ${people}.`
        : result.emails > 0
        ? `Your announcement is live and ${result.emails} ${
            result.emails === 1 ? "email is" : "emails are"
          } being sent. You can follow the progress below.`
        : `Your announcement was published to ${result.total} ${people}.`
    );

    goToTab("sent");
  }

  const tabs = [
    { id: "inbox", label: "Inbox" },
    { id: "compose", label: "New announcement" },
    { id: "sent", label: "Sent announcements" },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Announcements
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {isStaff
            ? "Read announcements, or send one to church members."
            : "News and updates from your church leaders."}
        </p>
      </div>

      {isStaff && (
        <div
          role="tablist"
          aria-label="Announcements"
          className="inline-flex flex-wrap rounded-xl bg-slate-100 p-1"
        >
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => goToTab(item.id)}
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
      )}

      {notice && tab === "sent" && (
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

      {tab === "inbox" && <AnnouncementInbox openId={openId} />}
      {tab === "compose" && <ComposeAnnouncement onSent={handleSent} />}
      {tab === "sent" && <AnnouncementHistory />}
    </div>
  );
}