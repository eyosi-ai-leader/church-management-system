import { Hero } from "@/components/sections/hero";
import { Welcome } from "@/components/sections/Welcome";
import { About } from "@/components/sections/about";
import { ServiceTimes } from '@/components/sections/ServiceTimes';
import Ministries from "@/components/sections/Ministry/Ministries";
import { UpcomingEvent } from "@/components/sections/events";
import { LatestSermon } from "@/components/sections/sermons";


export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Welcome />
        <About />
        <ServiceTimes />
        <Ministries />
        <UpcomingEvent />
        <LatestSermon />
      </main>
    </>
  );
}
