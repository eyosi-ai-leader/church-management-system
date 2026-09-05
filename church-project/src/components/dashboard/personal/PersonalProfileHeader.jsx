
"use client";

import { Mail, UserRound } from "lucide-react";

export default function PersonalProfileCard({ member }) {
  const fullName = [
    member?.firstName,
    member?.middleName,
    member?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const profileImage = member?.profileImage;

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

      <div className="mt-6 flex items-center gap-5">
        {/* Profile Photo */}
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
          {profileImage ? (
            <img
              src={profileImage}
              alt={fullName || "Member profile"}
              className="h-full w-full object-cover"
            />
          ) : (
            <UserRound
              className="h-10 w-10 text-slate-400"
              strokeWidth={1.5}
            />
          )}
        </div>

        {/* Profile Information */}
        <div className="min-w-0">
          <h3 className="truncate text-xl font-bold tracking-tight text-slate-900">
            {fullName || "Member"}
          </h3>

          <p className="mt-1 text-sm font-semibold text-indigo-600">
            {member?.roleName || "Member"}
          </p>

          <div className="mt-3 flex min-w-0 items-center gap-2 text-sm text-slate-500">
            <Mail
              className="h-4 w-4 shrink-0"
              strokeWidth={1.8}
            />

            <span className="truncate">
              {member?.email || "Email not provided"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

