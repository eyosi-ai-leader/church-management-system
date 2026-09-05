"use client";

import { Camera, User } from "lucide-react";

export default function MemberProfileImage({
  preview,
  onChange,
}) {
  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Profile image must be smaller than 5MB.");
      return;
    }

    onChange(file);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-900">
          Profile Photo
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Add a profile photo for this member.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 ring-4 ring-slate-50">
          {preview ? (
            <img
              src={preview}
              alt="Member profile preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <User
              size={42}
              strokeWidth={1.5}
              className="text-slate-400"
            />
          )}
        </div>

        <div>
          <label
            htmlFor="profileImage"
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Camera size={17} />
            Choose photo
          </label>

          <input
            id="profileImage"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <p className="mt-2 text-xs text-slate-400">
            JPG, PNG or WEBP. Maximum 5MB.
          </p>
        </div>
      </div>
    </div>
  );
}