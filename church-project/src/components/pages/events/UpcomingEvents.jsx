import { eventsPage } from "@/data/eventsPage";

import { SectionContainer } from "@/components/shared/SectionContainer";
import { SectionHeader } from "@/components/shared/SectionHeader";

import EventGrid from "./EventGrid";

export default function UpcomingEvents() {
  return (
    <SectionContainer className="py-20">
      <SectionHeader
        align="center"
        subtitle={eventsPage.introduction.subtitle}
        title={eventsPage.introduction.title}
        description={eventsPage.introduction.description}
      />

      <div className="mt-12">
        <EventGrid events={eventsPage.events} />
      </div>
    </SectionContainer>
  );
}