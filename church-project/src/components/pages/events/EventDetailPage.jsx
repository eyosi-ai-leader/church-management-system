import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CalendarPlus,
  Clock,
  MapPin,
  Repeat,
} from "lucide-react";

import { SectionContainer } from "@/components/shared/SectionContainer";
import EventCover from "@/components/shared/events/EventCover";
import EventCTA from "./EventCTA";

import { getEventBySlug } from "@/lib/publicEventsApi";
import {
  formatEventDate,
  formatEventTimeRange,
  googleCalendarUrl,
  repeatLabel,
} from "@/lib/eventFormat";

function Fact({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium text-slate-800">{children}</p>
      </div>
    </div>
  );
}

export default async function EventDetailPage({ slug }) {
  const { data: event, notFound: missing, error } = await getEventBySlug(slug);

  if (missing) notFound();

  if (error || !event) {
    return (
      <SectionContainer className="py-24">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center">
          <h1 className="text-lg font-semibold text-slate-900">
            This event is temporarily unavailable
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Please try again in a little while.
          </p>
          <Link
            href="/events"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            All events
          </Link>
        </div>
      </SectionContainer>
    );
  }

  const repeat = repeatLabel(event);
  const calendarUrl = !event.cancelled && !event.ended ? googleCalendarUrl(event) : "";

  return (
    <>
      <SectionContainer className="py-12 lg:py-16">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          All events
        </Link>

        <article className="mt-6">
          {event.cancelled && (
            <p
              role="status"
              className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700"
            >
              This event has been cancelled.
            </p>
          )}

          {!event.cancelled && event.ended && (
            <p
              role="status"
              className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-600"
            >
              This event has ended. Check the events page for what&apos;s next.
            </p>
          )}

          <div className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-100">
            <div className="aspect-[16/8]">
              <EventCover src={event.imageUrl} alt={event.title} />
            </div>
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_20rem]">
            <div>
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

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                {event.title}
              </h1>

              <p className="mt-6 whitespace-pre-line text-base leading-8 text-slate-600">
                {event.description}
              </p>
            </div>

            <aside className="h-fit space-y-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <Fact icon={CalendarDays} label="Date">
                {formatEventDate(event.startAt)}
              </Fact>

              <Fact icon={Clock} label="Time">
                {formatEventTimeRange(event.startAt, event.endAt)}
              </Fact>

              <Fact icon={MapPin} label="Location">
                {event.location}
              </Fact>

              {repeat && (
                <Fact icon={Repeat} label="Repeats">
                  {repeat.replace("Repeats ", "")}
                </Fact>
              )}

              {calendarUrl && (
                <a
                  href={calendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                >
                  <CalendarPlus size={17} aria-hidden="true" />
                  Add to Google Calendar
                </a>
              )}
            </aside>
          </div>
        </article>
      </SectionContainer>

      <EventCTA />
    </>
  );
}