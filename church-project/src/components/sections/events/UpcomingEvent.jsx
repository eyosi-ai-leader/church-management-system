import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getFeaturedEvent } from "@/lib/publicEventsApi";

import EventCard from "./EventCard";

const UpcomingEvent = async () => {
  const { data: event } = await getFeaturedEvent();

  // Nothing to show (or the backend is unavailable): hide the section
  // instead of showing placeholder content.
  if (!event) return null;

  return (
    <section className="bg-gray-50 py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mb-12 max-w-3xl">
          <span className="inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold uppercase tracking-[0.15em] text-primary">
            Upcoming Event
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Join us for our next gathering
          </h2>

          <p className="mt-4 text-lg leading-8 text-gray-600">
            Discover upcoming opportunities to worship, connect, and grow
            together as a church family.
          </p>
        </div>

        <EventCard event={event} />

        <div className="mt-8">
          <Link
            href="/events"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            See all events
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvent;