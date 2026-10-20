"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function MinistryFormModal({
  open,
  ministry,
  saving,
  onClose,
  onSubmit,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (open) {
      setName(ministry?.name || "");
      setDescription(ministry?.description || "");
      setFormError("");
    }
  }, [open, ministry]);

  if (!open) return null;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim()) {
      setFormError("Ministry name is required.");
      return;
    }

    setFormError("");

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
      });
    } catch {
      // The parent displays the API error.
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="ministry-form-title"
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 id="ministry-form-title" className="text-lg font-bold text-slate-900">
              {ministry ? "Edit ministry" : "Create ministry"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {ministry
                ? "Update this ministry's information."
                : "Add a ministry to your church."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label htmlFor="ministry-name" className="mb-2 block text-sm font-medium text-slate-700">
              Ministry name <span className="text-red-500">*</span>
            </label>
            <input
              id="ministry-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={150}
              required
              autoFocus
              placeholder="e.g. Youth Ministry"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <div>
            <label htmlFor="ministry-description" className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              id="ministry-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              maxLength={2000}
              placeholder="Describe the ministry's purpose and activities..."
              className="w-full resize-y rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {formError && (
            <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
              {formError}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : ministry ? "Save changes" : "Create ministry"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
