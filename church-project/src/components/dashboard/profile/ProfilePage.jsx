"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Loader2, X } from "lucide-react";

import ProfileView from "./ProfileView";
import ProfileForm from "./ProfileForm";
import { getMyProfile } from "@/lib/profileApi";
import { updateStoredUser } from "@/lib/userStorage";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [mode, setMode] = useState("view"); // view | edit
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

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

  // The success message disappears by itself after a few seconds.
  useEffect(() => {
    if (!notice) return;

    const timer = setTimeout(() => setNotice(""), 6000);

    return () => clearTimeout(timer);
  }, [notice]);

  function handleSaved(updated) {
    setProfile(updated);
    setMode("view");
    setNotice("Your profile has been updated successfully.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleEdit() {
    setNotice("");
    setMode("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancel() {
    setMode("view");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const editing = mode === "edit";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {editing ? "Edit profile" : "My Profile"}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {editing
            ? "Update your personal information, then save your changes."
            : "View your personal information."}
        </p>
      </div>

      {notice && (
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
            className="rounded-md p-1 text-emerald-700 transition hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          >
            <X size={16} />
          </button>
        </div>
      )}

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

      {!loading && !error && profile && !editing && (
        <ProfileView profile={profile} onEdit={handleEdit} />
      )}

      {!loading && !error && profile && editing && (
        <ProfileForm
          profile={profile}
          onSaved={handleSaved}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}