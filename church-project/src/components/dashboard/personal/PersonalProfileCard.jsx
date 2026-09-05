// PersonalProfileCard.jsx

"use client";

import {
  Mail,
  Phone,
  MapPin,
  UserRound,
  CalendarDays,
  Droplets,
} from "lucide-react";

export default function PersonalProfileCard({ member }) {
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

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <ProfileItem
          icon={Mail}
          label="Email"
          value={member?.email}
        />

        <ProfileItem
          icon={Phone}
          label="Phone"
          value={member?.phone}
        />

        <ProfileItem
          icon={UserRound}
          label="Gender"
          value={member?.gender}
        />

        <ProfileItem
          icon={MapPin}
          label="Address"
          value={member?.address}
        />

        <ProfileItem
          icon={CalendarDays}
          label="Date of Birth"
          value={formatDate(member?.dateOfBirth)}
        />

        <ProfileItem
          icon={Droplets}
          label="Baptism Date"
          value={formatDate(member?.baptismDate)}
        />
      </div>
    </section>
  );
}

function ProfileItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
        <Icon className="h-4 w-4" strokeWidth={1.8} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-slate-800">
          {value || "Not provided"}
        </p>
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