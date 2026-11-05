import { eventsPage } from "@/data/eventsPage";
import { getPublicEvents } from "@/lib/publicEventsApi";

import { SectionContainer } from "@/components/shared/SectionContainer";
import { SectionHeader } from "@/components/shared/SectionHeader";

import EventGrid from "./EventGrid";

export default async function UpcomingEvents() {
  const { data: events, error } = await getPublicEvents({ limit: 24 });

  return (
    <SectionContainer className="py-20">
      <SectionHeader
        align="center"
        subtitle={eventsPage.introduction.subtitle}
        title={eventsPage.introduction.title}
        description={eventsPage.introduction.description}
      />

      <div className="mt-12">
        {error && (
          <div
            role="status"
            className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              Events are temporarily unavailable
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Please check back in a little while.
            </p>
          </div>
        )}

        {!error && events?.length === 0 && (
          <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center">
            <h3 className="text-lg font-semibold text-slate-900">
              No upcoming events right now
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              New events are announced here as soon as they are scheduled.
              Please check back soon.
            </p>
          </div>
        )}

        {!error && events?.length > 0 && <EventGrid events={events} />}
      </div>
    </SectionContainer>
  );
}