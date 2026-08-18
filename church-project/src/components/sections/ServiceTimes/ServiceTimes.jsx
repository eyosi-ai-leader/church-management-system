import {SectionHeader} from "@/components/shared/SectionHeader";
import serviceTimes from "@/data/serviceTimes";
import CountdownBanner from "./CountdownBanner";
import NextServiceCard from "./NextServiceCard";
import ServiceTimesGrid from "./ServiceTimesGrid";
import LiveStreamBanner from "./LiveStreamBanner";
import VisitActions from "./VisitActions";

export default function ServiceTimes() {
  return (
    <section
      id="service-times"
      className="bg-slate-50 py-24"
    >
      <div className="mx-auto max-w-7xl space-y-20 px-6 lg:px-8">

        <CountdownBanner />

        <SectionHeader
          eyebrow="Join Us"
          title="Weekly Service Schedule"
          description="Whether you are visiting for the first time or have been part of our church family for years, there is a place for you."
          alignment="center"
        />

        <NextServiceCard />

        <ServiceTimesGrid services={serviceTimes} />

        <LiveStreamBanner />

        <VisitActions />

      </div>
    </section>
  );
}