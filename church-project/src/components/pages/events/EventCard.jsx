import Link from "next/link";
import { CalendarDays, Clock, MapPin, Repeat } from "lucide-react";

import { Card } from "@/components/shared/Card";
import EventCover from "@/components/shared/events/EventCover";
import {
  formatEventDate,
  formatEventTimeRange,
  repeatLabel,
} from "@/lib/eventFormat";

export default function EventCard({ event }) {
  const href = `/events/${event.slug}`;
  const repeat = repeatLabel(event);

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block h-60 overflow-hidden"
      >
        <EventCover
          src={event.imageUrl}
          alt=""
          className="transition duration-500 group-hover:scale-105"
        />

        {event.cancelled && (
          <span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
            Cancelled
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col space-y-5 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full bg-blue-50 px-4 py-1 text-sm font-medium text-blue-600">
            {event.category}
          </span>

          {event.ongoing && !event.cancelled && (
            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Happening now
            </span>
          )}
        </div>

        <h3 className="text-2xl font-bold text-slate-900">
          <Link
            href={href}
            className="transition hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            {event.title}
          </Link>
        </h3>

        <p className="line-clamp-3 leading-7 text-slate-600">
          {event.description}
        </p>

        <div className="mt-auto space-y-3 border-t border-slate-100 pt-5 text-sm text-slate-600">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
            <span>{formatEventDate(event.startAt)}</span>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
            <span>{formatEventTimeRange(event.startAt, event.endAt)}</span>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
            <span>{event.location}</span>
          </div>

          {repeat && (
            <div className="flex items-center gap-3 text-slate-500">
              <Repeat className="h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
              <span>{repeat}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}