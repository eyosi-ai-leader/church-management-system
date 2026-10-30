"use client";

import { useEffect, useState } from "react";
import { Bell, Loader2 } from "lucide-react";

import { getPreferences, updatePreferences } from "@/lib/preferencesApi";

export default function NotificationPreferences() {
  const [enabled, setEnabled] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getPreferences()
      .then((data) => {
        if (!cancelled) setEnabled(data.announcementEmails);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleToggle() {
    if (saving || enabled === null) return;

    const next = !enabled;

    setSaving(true);
    setError("");
    setSaved(false);
    setEnabled(next);

    try {
      await updatePreferences({ announcementEmails: next });
      setSaved(true);
    } catch (err) {
      // Put the switch back if saving failed.
      setEnabled(!next);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <Bell size={20} aria-hidden="true" />
        </span>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Email notifications
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Choose which emails you receive from the church.
          </p>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-slate-200 px-4 py-4">
        <div>
          <p id="announcement-label" className="text-sm font-semibold text-slate-900">
            Announcement emails
          </p>
          <p className="mt-0.5 text-sm text-slate-500">
            News and updates sent by church leaders. You will still receive
            account emails such as password resets.
          </p>
        </div>

        {enabled === null && !error ? (
          <Loader2 size={18} className="animate-spin text-slate-400" />
        ) : (
          <button
            type="button"
            role="switch"
            aria-checked={Boolean(enabled)}
            aria-labelledby="announcement-label"
            onClick={handleToggle}
            disabled={saving || enabled === null}
            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-60 ${
              enabled ? "bg-slate-950" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                enabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        )}
      </div>

      {saved && (
        <p role="status" className="mt-3 text-sm text-emerald-600">
          Preference saved.
        </p>
      )}
    </section>
  );
}