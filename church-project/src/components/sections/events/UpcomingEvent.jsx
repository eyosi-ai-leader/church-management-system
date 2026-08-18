import { events } from "@/data/events";

import EventCard from "./EventCard";

const UpcomingEvent = () => {
  const featuredEvent = events.find(
    (event) => event.featured
  );

  if (!featuredEvent) return null;

  return (
    <section className="bg-gray-50 py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mb-12 max-w-3xl">
          <span className="inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold uppercase tracking-[0.15em] text-primary ">
            Upcoming Event
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Join us for our next gathering
          </h2>

          <p className="mt-4 text-lg leading-8 text-gray-600">
            Discover upcoming opportunities to worship, connect, and grow together as a church family.
          </p>
        </div>

        <EventCard
          title={featuredEvent.title}
          category={featuredEvent.category}
          date={featuredEvent.date}
          time={featuredEvent.time}
          location={featuredEvent.location}
          description={featuredEvent.description}
          image={featuredEvent.image}
          slug={featuredEvent.slug}
        />
      </div>
    </section>
  );
};

export default UpcomingEvent;