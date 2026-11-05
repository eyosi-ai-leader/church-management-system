"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Building2,
  Clock,
  ExternalLink,
  Eye,
  Loader2,
  MapPin,
  Pencil,
  Repeat,
  Trash2,
  Undo2,
  XCircle,
} from "lucide-react";

import EventCover from "@/components/shared/events/EventCover";
import {
  VISIBILITY_LABELS,
  formatEventDate,
  formatEventTimeRange,
  getDayBadge,
  repeatLabel,
} from "@/lib/eventFormat";

export default function EventListItem({
  item,
  busy,
  anyBusy,
  onToggleCancel,
  onDelete,
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const badge = getDayBadge(item.startAt);
  const repeat = repeatLabel(item);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
        <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-40">
          <EventCover src={item.imageUrl} alt="" />
        </div>

        <div className="flex min-w-0 flex-1 gap-4">
          <div
            aria-hidden="true"
            className="hidden h-16 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-900 text-white sm:flex"
          >
            <span className="text-xl font-bold leading-none">{badge.day}</span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-white/75">
              {badge.month}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-bold text-slate-900">
                {item.title}
              </h3>

              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                {item.category}
              </span>

              {item.cancelled && (
                <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                  Cancelled
                </span>
              )}

              {item.ongoing && !item.cancelled && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  Happening now
                </span>
              )}

              {item.featured && (
                <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                  Featured
                </span>
              )}
            </div>

            <p className="mt-1 text-sm font-medium text-slate-700">
              {formatEventDate(item.startAt)}
            </p>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Clock size={13} aria-hidden="true" />
                {formatEventTimeRange(item.startAt, item.endAt)}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <MapPin size={13} aria-hidden="true" />
                {item.location}
              </span>

              {item.ministryName && (
                <span className="inline-flex items-center gap-1.5">
                  <Building2 size={13} aria-hidden="true" />
                  {item.ministryName}
                </span>
              )}

              {repeat && (
                <span className="inline-flex items-center gap-1.5">
                  <Repeat size={13} aria-hidden="true" />
                  {repeat}
                </span>
              )}

              <span className="inline-flex items-center gap-1.5">
                <Eye size={13} aria-hidden="true" />
                {VISIBILITY_LABELS[item.visibility]}
              </span>
            </div>

            <p className="mt-2 line-clamp-2 whitespace-pre-line text-sm text-slate-500">
              {item.description}
            </p>

            {item.createdBy && (
              <p className="mt-2 text-xs text-slate-400">
                Added by {item.createdBy}
              </p>
            )}
          </div>
        </div>
      </div>

      {(item.canManage || item.visibility === "public") && (
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 px-4 py-3 sm:px-5">
          {item.visibility === "public" && (
            <Link
              href={`/events/${item.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <ExternalLink size={13} aria-hidden="true" />
              View on website
            </Link>
          )}

          {item.canManage && (
            <>
              <Link
                href={`/dashboard/events/${item.id}/edit`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <Pencil size={13} aria-hidden="true" />
                Edit
              </Link>

              <button
                type="button"
                onClick={onToggleCancel}
                disabled={anyBusy}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-60"
              >
                {busy === "status" ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : item.cancelled ? (
                  <Undo2 size={13} aria-hidden="true" />
                ) : (
                  <XCircle size={13} aria-hidden="true" />
                )}
                {item.cancelled ? "Reopen" : "Cancel event"}
              </button>

              <button
                type="button"
                onClick={() => setConfirmDelete((current) => !current)}
                disabled={anyBusy}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-60"
              >
                <Trash2 size={13} aria-hidden="true" />
                Delete
              </button>
            </>
          )}
        </div>
      )}

      {confirmDelete && (
        <div
          role="alertdialog"
          aria-label={`Confirm deleting ${item.title}`}
          className="border-t border-red-200 bg-red-50 px-4 py-4 sm:px-5"
        >
          <p className="text-sm font-semibold text-red-900">
            Delete &quot;{item.title}&quot;?
          </p>

          <p className="mt-1 text-sm text-red-800">
            It will disappear from the website and from every dashboard. To
            keep it but tell people it isn&apos;t happening, use Cancel event
            instead.
          </p>

          <div className="mt-3 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              disabled={anyBusy}
              className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-900 transition hover:bg-red-100 disabled:opacity-60"
            >
              Keep it
            </button>

            <button
              type="button"
              onClick={async () => {
                await onDelete();
                setConfirmDelete(false);
              }}
              disabled={anyBusy}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
            >
              {busy === "delete" && (
                <Loader2 size={15} className="animate-spin" />
              )}
              {busy === "delete" ? "Deleting..." : "Yes, delete"}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}