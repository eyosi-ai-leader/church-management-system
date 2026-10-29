"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import ProfileForm from "./ProfileForm";
import { getMyProfile } from "@/lib/profileApi";
import { updateStoredUser } from "@/lib/userStorage";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getMyProfile();
      setProfile(data);
      // Lets the header and sidebar show the photo.
      updateStoredUser({ profileImage: data.profileImage });
    } catch (err) {
      setError(err.message || "We couldn't load your profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          View and update your personal information.
        </p>
      </div>

      {loading && (
        <div
          role="status"
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-16 text-sm text-slate-500"
        >
          <Loader2 size={18} className="animate-spin" />
          Loading your profile...
        </div>
      )}

      {!loading && error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center"
        >
          <p className="text-sm text-red-700">{error}</p>
          <button
            type="button"
            onClick={load}
            className="mt-4 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && profile && (
        <ProfileForm profile={profile} onSaved={setProfile} />
      )}
    </div>
  );
}